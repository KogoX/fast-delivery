import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Use service role for callbacks since there's no user session
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null

interface CallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value?: string | number
        }>
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      console.error('Supabase credentials missing for M-Pesa callback')
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: 'Server configuration error',
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      )
    }

    const body: CallbackBody = await request.json()
    const callback = body.Body.stkCallback

    const status = callback.ResultCode === 0 ? 'completed' : 'failed'
    
    // Extract metadata if payment was successful
    let mpesaReceiptNumber: string | null = null
    let transactionDate: string | null = null
    
    if (callback.CallbackMetadata?.Item) {
      for (const item of callback.CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') {
          mpesaReceiptNumber = String(item.Value)
        }
        if (item.Name === 'TransactionDate') {
          transactionDate = String(item.Value)
        }
      }
    }

    // Update the transaction record
    const { data: transaction, error: updateError } = await supabase
      .from('mpesa_transactions')
      .update({
        status,
        result_code: callback.ResultCode,
        result_desc: callback.ResultDesc,
        mpesa_receipt_number: mpesaReceiptNumber,
        transaction_date: transactionDate,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', callback.CheckoutRequestID)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update transaction:', updateError)
    }

    // If payment was successful, update the related record
    if (status === 'completed' && transaction) {
      const tableMap: Record<string, string> = {
        ride: 'rides',
        food_order: 'food_orders',
        package_delivery: 'package_deliveries',
        errand: 'errands',
      }

      const table = tableMap[transaction.payment_type]
      if (table) {
        await supabase
          .from(table)
          .update({ 
            payment_status: 'paid',
            mpesa_receipt: mpesaReceiptNumber,
          })
          .eq('id', transaction.reference_id)
      }
    }

    // M-Pesa expects a specific response format
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully',
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: 'Internal server error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
