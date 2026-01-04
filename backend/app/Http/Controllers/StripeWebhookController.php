<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Handle Stripe webhook events
     */
    public function handleWebhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('Stripe-Signature');

            // Verify webhook signature
            $event = $this->stripeService->verifyWebhookSignature($payload, $signature);

            // Handle different event types
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $this->handlePaymentIntentSucceeded($event->data->object);
                    break;

                case 'payment_intent.payment_failed':
                    $this->handlePaymentIntentFailed($event->data->object);
                    break;

                case 'charge.refunded':
                    $this->handleChargeRefunded($event->data->object);
                    break;

                case 'charge.dispute.created':
                    $this->handleChargeDispute($event->data->object);
                    break;

                default:
                    Log::info('Unhandled Stripe webhook event: ' . $event->type);
            }

            return response()->json(['status' => 'success'], 200);

        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Handle successful payment intent
     */
    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$payment) {
            Log::warning("Payment intent {$paymentIntent->id} not found in database");
            return;
        }

        // Update payment status if not already paid
        if ($payment->status !== 'paid') {
            $payment->update([
                'status' => 'paid',
                'stripe_charge_id' => $paymentIntent->charges->data[0]->id ?? null,
            ]);

            Log::info("Payment {$payment->id} marked as paid");
        }
    }

    /**
     * Handle failed payment intent
     */
    protected function handlePaymentIntentFailed($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$payment) {
            Log::warning("Payment intent {$paymentIntent->id} not found in database");
            return;
        }

        $payment->update([
            'status' => 'failed',
        ]);

        Log::warning("Payment {$payment->id} failed: " . ($paymentIntent->last_payment_error->message ?? 'Unknown error'));
    }

    /**
     * Handle charge refund
     */
    protected function handleChargeRefunded($charge)
    {
        $payment = Payment::where('stripe_charge_id', $charge->id)->first();

        if (!$payment) {
            Log::warning("Charge {$charge->id} not found in database");
            return;
        }

        $payment->update([
            'status' => 'refunded',
        ]);

        Log::info("Payment {$payment->id} was refunded");
    }

    /**
     * Handle charge dispute
     */
    protected function handleChargeDispute($dispute)
    {
        $payment = Payment::where('stripe_charge_id', $dispute->charge)->first();

        if (!$payment) {
            Log::warning("Charge {$dispute->charge} not found in database");
            return;
        }

        $payment->update([
            'status' => 'disputed',
        ]);

        Log::warning("Payment {$payment->id} has a dispute: {$dispute->reason}");
    }
}
