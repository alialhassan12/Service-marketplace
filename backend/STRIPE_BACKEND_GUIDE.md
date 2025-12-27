# Stripe Payment Integration - Laravel Backend

## Overview

Complete backend Stripe integration for your Laravel service marketplace. This integration handles payment intent creation, confirmation, and webhook event processing.

## Installation

### 1. Stripe SDK Already Installed

```bash
composer require stripe/stripe-php
```

### 2. Environment Variables

Add to your `.env` file:

```env
STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Get these from: https://dashboard.stripe.com/apikeys

### 3. Run Migration

```bash
php artisan migrate
```

This updates the payments table with Stripe fields.

## Database Schema

### New Fields in `payments` Table

| Field                      | Type          | Description                     |
| -------------------------- | ------------- | ------------------------------- |
| `provider_id`              | bigint FK     | Service provider user           |
| `job_id`                   | bigint FK     | Associated job                  |
| `currency`                 | string        | Payment currency (default: USD) |
| `stripe_payment_intent_id` | string unique | Stripe PaymentIntent ID         |
| `stripe_charge_id`         | string unique | Stripe Charge ID                |
| `description`              | text          | Payment description             |

### Payment Status Values

-   `pending` - Payment intent created
-   `paid` - Successfully paid
-   `failed` - Payment failed
-   `refunded` - Refunded
-   `disputed` - Under dispute

## API Endpoints

All endpoints require authentication except the webhook.

### 1. Create Payment Intent

**Endpoint:** `POST /api/payments/create-intent`

**Request:**

```json
{
    "provider_id": 2,
    "job_id": 1,
    "amount": 100.0,
    "description": "Optional payment description"
}
```

**Response (201):**

```json
{
    "status": "success",
    "data": {
        "payment_id": 1,
        "client_secret": "pi_1234567890_secret_abcdef",
        "payment_intent_id": "pi_1234567890",
        "amount": 100.0,
        "currency": "USD"
    }
}
```

### 2. Confirm Payment

**Endpoint:** `POST /api/payments/confirm`

**Request:**

```json
{
    "payment_id": 1,
    "stripe_charge_id": "ch_1234567890abcdef"
}
```

**Response (200):**

```json
{
    "status": "success",
    "message": "Payment confirmed successfully",
    "data": {
        "id": 1,
        "client_id": 1,
        "provider_id": 2,
        "amount": "100.00",
        "status": "paid"
    }
}
```

### 3. Payment History

**Endpoint:** `GET /api/payments/history`

**Response (200):**

```json
{
    "data": [
        {
            "id": 1,
            "amount": "100.00",
            "status": "paid",
            "created_at": "2025-12-27T10:00:00Z",
            "provider": {
                "id": 2,
                "name": "John Developer"
            }
        }
    ],
    "meta": {
        "total": 5,
        "per_page": 15
    }
}
```

### 4. Get Payment by ID

**Endpoint:** `GET /api/payments/{id}`

Returns single payment details (if authorized).

### 5. Provider Balance

**Endpoint:** `GET /api/payments/balance`

**Response (200):**

```json
{
    "status": "success",
    "data": {
        "total_earned": "1500.00",
        "pending_amount": "200.00",
        "currency": "USD"
    }
}
```

### 6. Download Invoice

**Endpoint:** `GET /api/payments/download-invoice/{id}`

Returns PDF invoice file.

### 7. Webhook Handler

**Endpoint:** `POST /api/webhook/stripe`

Public endpoint for Stripe webhooks. No authentication needed.

## File Structure

```
app/
├── Services/
│   └── StripeService.php              // Stripe API wrapper
├── Http/Controllers/
│   ├── StripePaymentController.php    // Payment endpoints
│   └── StripeWebhookController.php    // Webhook handler
└── Models/
    └── Payment.php                     // Updated model

database/migrations/
└── 2025_12_27_000000_update_payments_table_for_stripe.php

config/
└── services.php                        // Stripe config

routes/
└── api.php                             // Payment routes
```

## Key Classes

### StripeService

Handles all Stripe API interactions:

-   `createPaymentIntent()` - Create payment intent
-   `retrievePaymentIntent()` - Get payment intent details
-   `confirmPaymentIntent()` - Confirm payment
-   `verifyWebhookSignature()` - Verify webhook authenticity

### StripePaymentController

API endpoints for:

-   Creating payment intents
-   Confirming payments
-   Getting payment history
-   Checking provider balance
-   Downloading invoices

### StripeWebhookController

Handles Stripe webhook events:

-   `payment_intent.succeeded` - Payment successful
-   `payment_intent.payment_failed` - Payment failed
-   `charge.refunded` - Refund processed
-   `charge.dispute.created` - Dispute created

## Payment Flow

```
1. Client creates payment intent
   POST /api/payments/create-intent
   → Returns client_secret

2. Client processes payment (on their end)
   → Uses client_secret with Stripe

3. Client confirms payment
   POST /api/payments/confirm
   → Status changes to 'paid'

4. Stripe sends webhook (automatic)
   POST /api/webhook/stripe
   → Status verified & updated
```

## Webhook Setup

### Configure in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/webhooks
2. Create new webhook endpoint
3. URL: `https://yourdomain.com/api/webhook/stripe`
4. Select events:
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
    - `charge.refunded`
    - `charge.dispute.created`
5. Copy signing secret → Add to `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Webhook Locally

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/webhook/stripe
```

## Security Features

✅ **Webhook Signature Verification** - All webhooks verified
✅ **Authorization Checks** - Users can only access own payments
✅ **Self-Payment Prevention** - Cannot pay yourself
✅ **Transaction Safety** - Database transactions for payment confirmation

## Error Handling

All endpoints return proper HTTP status codes:

| Code | Meaning                     |
| ---- | --------------------------- |
| 200  | Success                     |
| 201  | Created                     |
| 400  | Bad request or Stripe error |
| 403  | Unauthorized                |
| 404  | Not found                   |

## Testing

### Test Cards

```
Success:  4242 4242 4242 4242
Auth:     4000 0027 6000 3184
Declined: 4000 0000 0000 0002
```

Expiry: Any future date
CVC: Any 3 digits

### Test Payment Flow

```bash
# 1. Create payment intent
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": 2,
    "job_id": 1,
    "amount": 100
  }'

# 2. Get response with client_secret

# 3. Confirm payment (after client processes it)
curl -X POST http://localhost:8000/api/payments/confirm \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": 1,
    "stripe_charge_id": "ch_1234567890abcdef"
  }'

# 4. Check payment history
curl -X GET http://localhost:8000/api/payments/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Queries

```bash
# View recent payments
php artisan tinker
>>> Payment::with('client', 'provider')->latest()->take(10)->get()

# Get provider earnings
>>> Payment::where('provider_id', 2)->where('status', 'paid')->sum('amount')

# Get all pending payments
>>> Payment::where('status', 'pending')->get()
```

## Troubleshooting

### Payment not confirming?

-   Check logs: `tail -f storage/logs/laravel.log`
-   Verify Stripe credentials in `.env`
-   Check database: payment record should exist

### Webhooks not received?

-   Verify webhook URL in Stripe Dashboard
-   Check `STRIPE_WEBHOOK_SECRET` matches
-   Use Stripe CLI: `stripe logs`
-   View event deliveries in Stripe Dashboard

### CORS errors?

-   Ensure client domain is whitelisted
-   Check `config/cors.php`

## Production Checklist

-   [ ] Use live Stripe keys (not test keys)
-   [ ] Set `STRIPE_WEBHOOK_SECRET` to live webhook secret
-   [ ] Enable HTTPS for all endpoints
-   [ ] Configure webhook URL to production domain
-   [ ] Test with live (small) transaction
-   [ ] Monitor logs for errors
-   [ ] Setup email alerts in Stripe Dashboard
-   [ ] Review security settings

## Support Resources

-   Stripe PHP SDK: https://github.com/stripe/stripe-php
-   Stripe API Docs: https://stripe.com/docs/api
-   Webhook Guide: https://stripe.com/docs/webhooks
-   Laravel Integration: https://stripe.com/docs/stripe-php

## Summary

✅ **Backend-only Stripe integration**
✅ **Payment intent creation & confirmation**
✅ **Automatic webhook event handling**
✅ **Complete error handling**
✅ **Authorization & security**

All payment processing is now secured and ready for production.
