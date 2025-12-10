# Paystack Integration Setup

## Environment Variables

Add the following to your `.env.local` file:

```bash
# Paystack Payment Gateway
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx  # Get from Paystack dashboard
```

## Setup Instructions

1. **Create a Paystack Account**

   - Go to https://paystack.com
   - Sign up for an account
   - Complete your business verification

2. **Get Your API Keys**

   - Navigate to Settings → API Keys & Webhooks
   - Copy your Public Key (starts with `pk_`)
   - Add it to `.env.local` as `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

3. **Test Mode**

   - Use test keys to test the integration
   - Paystack provides test card numbers in their documentation

4. **Currency**
   - All amounts are in GHS (Ghana Cedis)
   - The system automatically converts GHS to pesewas (multiply by 100) for Paystack API

## Payment Flow

1. User fills shipping address
2. User reviews payment method (Paystack is the only option)
3. User clicks "Pay with Paystack"
4. Paystack popup opens with order total
5. User completes payment
6. Paystack validates payment
7. User is redirected to order confirmation

## Testing

Use these test card numbers:

- **4111 1111 1111 1111** - Visa (Success)
- **5399 8383 8383 8381** - Mastercard (Success)
- **5060 9666 0000 0000 00** - Verve (Success)

Expiry: Any future date
CVV: Any 3 digits
OTP: 123456
PIN: 1234

## Backend Integration (Optional)

To verify payments on your backend, create an endpoint that calls Paystack's verification API:

```typescript
// Example Node.js/Express endpoint
app.get("/api/verify-payment", async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Support

- Paystack Documentation: https://paystack.com/docs/
- Ghana Cedis Information: All transactions are in GHS
