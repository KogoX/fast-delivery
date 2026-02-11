// M-Pesa Daraja API Integration
const MPESA_ENV = process.env.MPESA_ENVIRONMENT || 'sandbox'
const MPESA_MOCK = process.env.MPESA_MOCK === 'true'
const MPESA_MOCK_RESPONSE_CODE = process.env.MPESA_MOCK_RESPONSE_CODE || '0'
const MPESA_MOCK_RESULT_CODE = process.env.MPESA_MOCK_RESULT_CODE || '0'
const BASE_URL = MPESA_ENV === 'live' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke'

export interface STKPushRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
}

export interface STKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface STKCallbackResult {
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

// Get OAuth token
export async function getAccessToken(): Promise<string> {
  if (MPESA_MOCK) {
    return 'mock-access-token'
  }
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured')
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get M-Pesa access token')
  }

  const data = await response.json()
  return data.access_token
}

// Format phone number to 254XXXXXXXXX
export function formatPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or plus signs
  let cleaned = phone.replace(/[\s\-\+]/g, '')
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1)
  }
  
  // If starts with +254, remove the +
  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(1)
  }
  
  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  
  return cleaned
}

// Generate password for STK Push
function generatePassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  
  if (!shortcode || !passkey) {
    throw new Error('M-Pesa shortcode or passkey not configured')
  }
  
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

// Generate timestamp in format YYYYMMDDHHmmss
function generateTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// Initiate STK Push
export async function initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
  if (MPESA_MOCK) {
    return {
      MerchantRequestID: `mock-${Date.now()}`,
      CheckoutRequestID: `mock-${Date.now()}`,
      ResponseCode: MPESA_MOCK_RESPONSE_CODE,
      ResponseDescription: 'Mocked M-Pesa response',
      CustomerMessage: 'Mocked M-Pesa STK push',
    }
  }
  const accessToken = await getAccessToken()
  const timestamp = generateTimestamp()
  const password = generatePassword(timestamp)
  const shortcode = process.env.MPESA_SHORTCODE
  const callbackUrl = process.env.MPESA_CALLBACK_URL

  if (!shortcode || !callbackUrl) {
    throw new Error('M-Pesa configuration incomplete')
  }

  const formattedPhone = formatPhoneNumber(request.phoneNumber)

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(request.amount), // M-Pesa requires whole numbers
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: request.accountReference.substring(0, 12), // Max 12 chars
    TransactionDesc: request.transactionDesc.substring(0, 13), // Max 13 chars
  }

  const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('M-Pesa STK Push error:', error)
    throw new Error('Failed to initiate M-Pesa payment')
  }

  return response.json()
}

// Query STK Push status
export async function querySTKPushStatus(checkoutRequestId: string): Promise<{
  ResultCode: string
  ResultDesc: string
}> {
  if (MPESA_MOCK) {
    return {
      ResultCode: MPESA_MOCK_RESULT_CODE,
      ResultDesc: 'Mocked M-Pesa status query',
    }
  }
  const accessToken = await getAccessToken()
  const timestamp = generateTimestamp()
  const password = generatePassword(timestamp)
  const shortcode = process.env.MPESA_SHORTCODE

  if (!shortcode) {
    throw new Error('M-Pesa shortcode not configured')
  }

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  }

  const response = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to query M-Pesa transaction status')
  }

  return response.json()
}
