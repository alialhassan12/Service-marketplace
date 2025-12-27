# Stripe Backend Setup - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Get Stripe Keys (2 min)

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable Key** and **Secret Key**

### Step 2: Update .env (1 min)

```env
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_secret_here
```

### Step 3: Run Migration (1 min)

```bash
php artisan migrate
```

### Step 4: Configure Webhook (1 min)

Webhook URL: `https://yourdomain.com/api/webhook/stripe`

Done! Backend is ready.

---

## 📍 File Changes Summary

### Created Files

-   `app/Services/StripeService.php` - Stripe API wrapper
-   `app/Http/Controllers/StripePaymentController.php` - Payment endpoints
-   `app/Http/Controllers/StripeWebhookController.php` - Webhook handler
-   `database/migrations/2025_12_27_000000_update_payments_table_for_stripe.php` - Database updates

### Modified Files

-   `app/Models/Payment.php` - Updated model with Stripe fields
-   `routes/api.php` - New payment routes
-   `config/services.php` - Stripe configuration

---

## 🔌 API Endpoints

All protected with authentication (Bearer token):

```
POST   /api/payments/create-intent      → Get client_secret from Stripe
POST   /api/payments/confirm             → Mark payment as paid
GET    /api/payments/history             → View payment history
GET    /api/payments/{id}                → Get single payment
GET    /api/payments/balance             → Get provider earnings
GET    /api/payments/download-invoice/{id} → Download invoice PDF
POST   /api/webhook/stripe               → Stripe webhook (public)
```

---

## 🧪 Test It

### Create Payment Intent

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": 2,
    "job_id": 1,
    "amount": 100.00
  }'
```

Response includes `client_secret` - use this for payment processing on client side.

### Confirm Payment

```bash
curl -X POST http://localhost:8000/api/payments/confirm \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": 1,
    "stripe_charge_id": "ch_1234567890abcdef"
  }'
```

---

## 📚 Documentation

See detailed docs:

-   **STRIPE_BACKEND_GUIDE.md** - Complete backend guide
-   **STRIPE_API_BACKEND.md** - Full API reference

---

## ✅ What's Included

✅ Payment intent creation  
✅ Payment confirmation  
✅ Webhook event handling  
✅ Database schema  
✅ Error handling  
✅ Authorization checks  
✅ Invoice generation

---

## 🔐 Security

✅ Webhook signature verification  
✅ Authorization checks on all endpoints  
✅ Prevent self-payments  
✅ User authorization for payments

---

## 📊 Database Changes

New fields in `payments` table:

-   `provider_id` - Service provider
-   `job_id` - Associated job
-   `currency` - Payment currency
-   `stripe_payment_intent_id` - Stripe PI ID
-   `stripe_charge_id` - Stripe charge ID
-   `description` - Payment description

---

## 🎯 Status Values

-   `pending` - Awaiting payment
-   `paid` - Successfully paid
-   `failed` - Payment failed
-   `refunded` - Refunded
-   `disputed` - Under dispute

---

## 🧪 Test Cards

```
Success:  4242 4242 4242 4242
Failed:   4000 0000 0000 0002
Auth:     4000 0027 6000 3184
```

Expiry: Any future date  
CVC: Any 3 digits

---

## ⚙️ Configuration in .env

```env
# Stripe API Keys
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Customize these if needed
APP_URL=http://localhost:8000
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

---

## 🚀 Next Steps

1. ✅ Run migration
2. ✅ Setup webhook in Stripe Dashboard
3. ✅ Test with test cards
4. ✅ Integrate with your frontend
5. ✅ Deploy to production with live keys

---

## 📞 Support

-   **Stripe Docs**: https://stripe.com/docs
-   **API Reference**: See STRIPE_API_BACKEND.md
-   **Setup Guide**: See STRIPE_BACKEND_GUIDE.md

---

**Status**: ✅ Backend Ready
**Last Updated**: December 27, 2025
