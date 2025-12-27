<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Job;
use App\Services\StripeService;
use App\Mail\PaymentInvoiceMail;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class StripePaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Create a payment intent for the client to pay the provider
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer|exists:users,id',
            'job_id' => 'required|integer|exists:jobs,id',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        // Verify the job belongs to the client
        $job = Job::findOrFail($request->job_id);

        if ($job->client_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not authorized to pay for this job.'
            ], 403);
        }

        // Prevent self-payment
        if (auth()->id() === $request->provider_id) {
            return response()->json([
                'message' => 'You cannot pay yourself.'
            ], 400);
        }

        try {
            // Amount in cents
            $amountInCents = (int)($request->amount * 100);

            // Create payment intent
            $paymentIntent = $this->stripeService->createPaymentIntent(
                $amountInCents,
                'usd',
                $request->description ?? "Payment for job: {$job->title}",
                [
                    'client_id' => auth()->id(),
                    'provider_id' => $request->provider_id,
                    'job_id' => $request->job_id,
                ]
            );

            // Create a pending payment record
            $payment = Payment::create([
                'client_id' => auth()->id(),
                'provider_id' => $request->provider_id,
                'job_id' => $request->job_id,
                'amount' => $request->amount,
                'currency' => 'USD',
                'status' => 'pending',
                'payment_method' => 'stripe',
                'stripe_payment_intent_id' => $paymentIntent->id,
                'description' => $request->description,
                'transaction_id' => 'txn_' . $paymentIntent->id,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'payment_id' => $payment->id,
                    'client_secret' => $paymentIntent->client_secret,
                    'payment_intent_id' => $paymentIntent->id,
                    'amount' => $request->amount,
                    'currency' => 'USD',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Confirm payment after successful Stripe confirmation on client
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|integer|exists:payments,id',
            'stripe_charge_id' => 'required|string',
        ]);

        try {
            $payment = Payment::with(['client', 'provider'])->findOrFail($request->payment_id);

            // Verify the user is the client
            if ($payment->client_id !== auth()->id()) {
                return response()->json([
                    'message' => 'You are not authorized to confirm this payment.'
                ], 403);
            }

            // Update payment with stripe charge id and mark as paid
            $payment->update([
                'stripe_charge_id' => $request->stripe_charge_id,
                'status' => 'paid',
                'payment_method' => 'stripe',
            ]);

            // Send invoice email
            try {
                Mail::to($payment->client->email)->send(new PaymentInvoiceMail($payment));
            } catch (\Exception $e) {
                \Log::error('Failed to send payment invoice email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Payment confirmed successfully',
                'data' => new PaymentResource($payment)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get payment history for the authenticated user (as client)
     */
    public function paymentHistory(Request $request)
    {
        $payments = Payment::with(['provider', 'job'])
            ->where('client_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return PaymentResource::collection($payments);
    }

    /**
     * Get provider balance (total earned and pending)
     */
    public function getProviderBalance(Request $request)
    {
        $totalEarned = Payment::where('provider_id', auth()->id())
            ->where('status', 'paid')
            ->sum('amount');

        $pendingAmount = Payment::where('provider_id', auth()->id())
            ->where('status', 'pending')
            ->sum('amount');

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_earned' => number_format($totalEarned, 2),
                'pending_amount' => number_format($pendingAmount, 2),
                'currency' => 'USD'
            ]
        ]);
    }

    /**
     * Download invoice as PDF
     */
    public function downloadInvoice($id)
    {
        $payment = Payment::with(['client', 'provider', 'job'])->findOrFail($id);

        if (auth()->id() !== $payment->client->id && auth()->id() !== $payment->provider->id) {
            return response()->json([
                'message' => 'You are not authorized to download this invoice.'
            ], 403);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('emails.invoice', compact('payment'));

        return $pdf->download('invoice_' . $payment->transaction_id . '.pdf');
    }

    /**
     * Get a single payment by ID
     */
    public function getPayment($id)
    {
        $payment = Payment::with(['client', 'provider', 'job'])->findOrFail($id);

        if (auth()->id() !== $payment->client->id && auth()->id() !== $payment->provider->id) {
            return response()->json([
                'message' => 'You are not authorized to view this payment.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => new PaymentResource($payment)
        ]);
    }
}
