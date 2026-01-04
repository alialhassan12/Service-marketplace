# Stripe Payment API - Backend Reference

## Quick Start

### 1. Add Stripe Keys to `.env`

```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Run Migration

```bash
php artisan migrate
```

### 3. Test Endpoints

Use the examples below with your token.

---

## Endpoints

### POST `/api/payments/create-intent`

Create a Stripe PaymentIntent for a job payment.

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
    "provider_id": 2,
    "job_id": 1,
    "amount": 150.5,
    "description": "Payment for web development services"
}
```

**Validation:**

-   `provider_id` - required, integer, exists in users
-   `job_id` - required, integer, exists in jobs, belongs to authenticated client
-   `amount` - required, numeric, minimum 1
-   `description` - optional, string

**Success Response (201):**

```json
{
    "status": "success",
    "data": {
        "payment_id": 1,
        "client_secret": "pi_1234567890_secret_abcdef1234567890",
        "payment_intent_id": "pi_1234567890",
        "amount": 150.5,
        "currency": "USD"
    }
}
```

**Error Responses:**

```json
{
    "message": "You cannot pay yourself."
}
```

```json
{
    "message": "You are not authorized to pay for this job."
}
```

```json
{
    "status": "error",
    "message": "Error message from Stripe"
}
```

---

### POST `/api/payments/confirm`

Confirm a payment after client processes it successfully.

**Authentication:** Required

**Request Body:**

```json
{
    "payment_id": 1,
    "stripe_charge_id": "ch_1234567890abcdef"
}
```

**Validation:**

-   `payment_id` - required, integer, exists in payments
-   `stripe_charge_id` - required, string

**Success Response (200):**

```json
{
    "status": "success",
    "message": "Payment confirmed successfully",
    "data": {
        "id": 1,
        "client_id": 1,
        "provider_id": 2,
        "job_id": 1,
        "amount": "150.50",
        "currency": "USD",
        "status": "paid",
        "payment_method": "stripe",
        "transaction_id": "txn_pi_1234567890",
        "stripe_payment_intent_id": "pi_1234567890",
        "stripe_charge_id": "ch_1234567890abcdef",
        "description": "Payment for web development services",
        "created_at": "2025-12-27T10:00:00Z",
        "updated_at": "2025-12-27T10:05:00Z"
    }
}
```

**Error Responses:**

```json
{
    "message": "You are not authorized to confirm this payment."
}
```

---

### GET `/api/payments/history`

Get paginated list of payments made by the authenticated client.

**Authentication:** Required

**Query Parameters:**

-   `page` - page number (default: 1)

**Success Response (200):**

```json
{
    "data": [
        {
            "id": 1,
            "client_id": 1,
            "provider_id": 2,
            "job_id": 1,
            "amount": "150.50",
            "currency": "USD",
            "status": "paid",
            "payment_method": "stripe",
            "transaction_id": "txn_pi_1234567890",
            "stripe_payment_intent_id": "pi_1234567890",
            "stripe_charge_id": "ch_1234567890abcdef",
            "description": "Payment for web development services",
            "provider": {
                "id": 2,
                "name": "John Developer",
                "email": "john@example.com"
            },
            "job": {
                "id": 1,
                "title": "Web Development",
                "budget": 500
            },
            "created_at": "2025-12-27T10:00:00Z",
            "updated_at": "2025-12-27T10:05:00Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 2,
        "per_page": 15,
        "to": 15,
        "total": 25
    },
    "links": {
        "first": "http://localhost:8000/api/payments/history?page=1",
        "last": "http://localhost:8000/api/payments/history?page=2",
        "prev": null,
        "next": "http://localhost:8000/api/payments/history?page=2"
    }
}
```

---

### GET `/api/payments/{id}`

Get a single payment by ID.

**Authentication:** Required

**URL Parameters:**

-   `id` - Payment ID (required)

**Success Response (200):**

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "client_id": 1,
        "provider_id": 2,
        "job_id": 1,
        "amount": "150.50",
        "currency": "USD",
        "status": "paid",
        "payment_method": "stripe",
        "transaction_id": "txn_pi_1234567890",
        "stripe_payment_intent_id": "pi_1234567890",
        "stripe_charge_id": "ch_1234567890abcdef",
        "description": "Payment for web development services",
        "client": {
            "id": 1,
            "name": "Jane Client",
            "email": "jane@example.com"
        },
        "provider": {
            "id": 2,
            "name": "John Developer",
            "email": "john@example.com"
        },
        "job": {
            "id": 1,
            "title": "Web Development",
            "budget": 500,
            "description": "Build a website"
        },
        "created_at": "2025-12-27T10:00:00Z",
        "updated_at": "2025-12-27T10:05:00Z"
    }
}
```

**Error Responses:**

```json
{
    "message": "You are not authorized to view this payment."
}
```

```json
{
    "message": "Not Found"
}
```

---

### GET `/api/payments/balance`

Get total earned and pending amounts for the authenticated provider.

**Authentication:** Required

**Success Response (200):**

```json
{
    "status": "success",
    "data": {
        "total_earned": "5250.75",
        "pending_amount": "350.50",
        "currency": "USD"
    }
}
```

---

### GET `/api/payments/download-invoice/{id}`

Download invoice PDF for a payment.

**Authentication:** Required

**URL Parameters:**

-   `id` - Payment ID (required)

**Success Response (200):**

-   Returns PDF file
-   Filename: `invoice_{transaction_id}.pdf`

**Error Responses:**

```json
{
    "message": "You are not authorized to download this invoice."
}
```

---

### POST `/api/webhook/stripe`

Stripe webhook event handler.

**Authentication:** Not required (public endpoint)

**Headers:**

```
Stripe-Signature: t=1234567890,v1=signature_here
Content-Type: application/json
```

**Webhook Events:**

-   `payment_intent.succeeded` - Updates payment to "paid"
-   `payment_intent.payment_failed` - Updates payment to "failed"
-   `charge.refunded` - Updates payment to "refunded"
-   `charge.dispute.created` - Updates payment to "disputed"

**Success Response (200):**

```json
{
    "status": "success"
}
```

**Error Response (400):**

```json
{
    "error": "Invalid webhook signature"
}
```

---

## HTTP Status Codes

| Code | Meaning                                      |
| ---- | -------------------------------------------- |
| 200  | OK - Request successful                      |
| 201  | Created - Resource created                   |
| 400  | Bad Request - Invalid input or Stripe error  |
| 403  | Forbidden - Not authorized for this resource |
| 404  | Not Found - Resource doesn't exist           |
| 500  | Internal Server Error                        |

---

## cURL Examples

### Create Payment Intent

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": 2,
    "job_id": 1,
    "amount": 150.50,
    "description": "Web development services"
  }'
```

### Confirm Payment

```bash
curl -X POST http://localhost:8000/api/payments/confirm \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": 1,
    "stripe_charge_id": "ch_1234567890abcdef"
  }'
```

### Get Payment History

```bash
curl -X GET "http://localhost:8000/api/payments/history?page=1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Get Single Payment

```bash
curl -X GET http://localhost:8000/api/payments/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Get Provider Balance

```bash
curl -X GET http://localhost:8000/api/payments/balance \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Download Invoice

```bash
curl -X GET http://localhost:8000/api/payments/download-invoice/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -o invoice.pdf
```

---

## PHP Examples

### Create Payment Intent

```php
$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'http://localhost:8000/api/payments/create-intent', [
    'headers' => [
        'Authorization' => 'Bearer ' . $token,
        'Content-Type' => 'application/json',
    ],
    'json' => [
        'provider_id' => 2,
        'job_id' => 1,
        'amount' => 150.50,
        'description' => 'Web development services'
    ]
]);

$data = json_decode($response->getBody(), true);
$clientSecret = $data['data']['client_secret'];
```

### Confirm Payment

```php
$response = $client->request('POST', 'http://localhost:8000/api/payments/confirm', [
    'headers' => [
        'Authorization' => 'Bearer ' . $token,
        'Content-Type' => 'application/json',
    ],
    'json' => [
        'payment_id' => 1,
        'stripe_charge_id' => 'ch_1234567890abcdef'
    ]
]);

$data = json_decode($response->getBody(), true);
```

---

## Response Format

### Success Response

```json
{
    "status": "success",
    "data": {
        /* ... */
    },
    "message": "Optional message"
}
```

### Error Response

```json
{
    "status": "error",
    "message": "Error description"
}
```

Or:

```json
{
    "message": "Error description"
}
```

---

## Payment Status Values

| Status     | Meaning                                  |
| ---------- | ---------------------------------------- |
| `pending`  | Payment intent created, awaiting payment |
| `paid`     | Payment successfully completed           |
| `failed`   | Payment attempt failed                   |
| `refunded` | Payment was refunded                     |
| `disputed` | Payment has a dispute/chargeback         |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding if needed for production.

**Recommended:** 100 requests per minute per user

---

## Important Notes

1. **All monetary amounts are in USD** by default
2. **Amount in API** is in dollars (e.g., 100.50)
3. **Amount sent to Stripe** is in cents (automatically converted)
4. **Payment history is paginated** - 15 items per page
5. **Webhooks are asynchronous** - Status may update after confirmation
6. **Authorization is strict** - Users can only access their own payments

---

Last Updated: December 27, 2025
