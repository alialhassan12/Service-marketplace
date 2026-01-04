<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a payment intent
     */
    public function createPaymentIntent(
        int $amount,
        string $currency = 'usd',
        string $description = '',
        array $metadata = []
    ): PaymentIntent {
        try {
            return PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'description' => $description,
                'metadata' => $metadata,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);
        } catch (ApiErrorException $e) {
            throw new \Exception('Error creating payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Retrieve a payment intent
     */
    public function retrievePaymentIntent(string $paymentIntentId): PaymentIntent
    {
        try {
            return PaymentIntent::retrieve($paymentIntentId);
        } catch (ApiErrorException $e) {
            throw new \Exception('Error retrieving payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Confirm a payment intent
     */
    public function confirmPaymentIntent(string $paymentIntentId, string $paymentMethodId): PaymentIntent
    {
        try {
            return PaymentIntent::retrieve($paymentIntentId)->confirm([
                'payment_method' => $paymentMethodId,
                'return_url' => config('app.url') . '/payments/success',
            ]);
        } catch (ApiErrorException $e) {
            throw new \Exception('Error confirming payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Create a customer
     */
    public function createCustomer(string $email, string $name = ''): \Stripe\Customer
    {
        try {
            return \Stripe\Customer::create([
                'email' => $email,
                'name' => $name,
            ]);
        } catch (ApiErrorException $e) {
            throw new \Exception('Error creating customer: ' . $e->getMessage());
        }
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhookSignature(string $payload, string $signature): \Stripe\Event
    {
        try {
            return \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );
        } catch (\UnexpectedValueException $e) {
            throw new \Exception('Invalid webhook payload: ' . $e->getMessage());
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            throw new \Exception('Invalid webhook signature: ' . $e->getMessage());
        }
    }
}
