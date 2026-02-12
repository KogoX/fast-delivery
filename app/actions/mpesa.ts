'use server'

import { createClient } from '@/lib/supabase/server'
import { initiateSTKPush, querySTKPushStatus, formatPhoneNumber } from '@/lib/mpesa'

export type PaymentType = 'ride' | 'food_order' | 'package_delivery' | 'errand'

interface InitiatePaymentParams {
  phoneNumber: string
  amount: number
  type: PaymentType
  referenceId: string
  description: string
}

export async function initiatePayment(params: InitiatePaymentParams) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    if (!Number.isFinite(params.amount) || params.amount <= 0) {
      return { error: 'Invalid payment amount' }
    }

    if (!params.referenceId?.trim()) {
      return { error: 'Invalid payment reference' }
    }

    if (!params.phoneNumber?.trim()) {
      return { error: 'Phone number is required' }
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(params.phoneNumber)
    
    // Initiate STK Push
    const stkResponse = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: params.amount,
      accountReference: params.referenceId.substring(0, 12),
      transactionDesc: params.description.substring(0, 13),
    })

    if (stkResponse.ResponseCode !== '0') {
      return { error: stkResponse.ResponseDescription || 'Payment initiation failed' }
    }

    // Store payment record
    const { data: payment, error: paymentError } = await supabase
      .from('mpesa_transactions')
      .insert({
        user_id: user.id,
        checkout_request_id: stkResponse.CheckoutRequestID,
        merchant_request_id: stkResponse.MerchantRequestID,
        phone_number: formattedPhone,
        amount: params.amount,
        payment_type: params.type,
        reference_id: params.referenceId,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to save payment record:', paymentError)
      // Still return success since STK was sent
    }

    return { 
      success: true, 
      checkoutRequestId: stkResponse.CheckoutRequestID,
      customerMessage: stkResponse.CustomerMessage,
    }
  } catch (error) {
    console.error('Payment initiation error:', error)
    return { error: error instanceof Error ? error.message : 'Payment failed' }
  }
}

export async function checkPaymentStatus(checkoutRequestId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    if (!checkoutRequestId?.trim()) {
      return { error: 'Invalid checkout request ID' }
    }

    // First check our database
    const { data: payment } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .eq('user_id', user.id)
      .single()

    if (payment?.status === 'completed') {
      return { status: 'completed', payment }
    }

    if (payment?.status === 'failed') {
      return { status: 'failed', payment }
    }

    // Query M-Pesa for latest status
    const statusResponse = await querySTKPushStatus(checkoutRequestId)
    
    // ResultCode 0 means success
    if (statusResponse.ResultCode === '0') {
      // Update payment status
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'completed' })
        .eq('checkout_request_id', checkoutRequestId)

      // Update the related record based on payment type
      if (payment) {
        await updateRelatedRecord(supabase, payment.payment_type, payment.reference_id, 'paid')
      }

      return { status: 'completed' }
    } else if (statusResponse.ResultCode === '1032') {
      // Transaction cancelled by user
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'cancelled' })
        .eq('checkout_request_id', checkoutRequestId)
      
      return { status: 'cancelled', message: 'Payment was cancelled' }
    } else if (statusResponse.ResultCode === '1') {
      // Still pending - user hasn't responded
      return { status: 'pending' }
    } else {
      // Other failure
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'failed', result_desc: statusResponse.ResultDesc })
        .eq('checkout_request_id', checkoutRequestId)
      
      return { status: 'failed', message: statusResponse.ResultDesc }
    }
  } catch (error) {
    console.error('Payment status check error:', error)
    return { status: 'pending' } // Assume pending if we can't check
  }
}

async function updateRelatedRecord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paymentType: PaymentType,
  referenceId: string,
  paymentStatus: string
) {
  const tableMap = {
    ride: 'rides',
    food_order: 'food_orders',
    package_delivery: 'package_deliveries',
    errand: 'errands',
  }

  const table = tableMap[paymentType]
  if (table) {
    await supabase
      .from(table)
      .update({ payment_status: paymentStatus })
      .eq('id', referenceId)
  }
}

export async function getUserPhoneNumber() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('phone')
    .eq('id', user.id)
    .single()

  return { phone: profile?.phone || '' }
}
