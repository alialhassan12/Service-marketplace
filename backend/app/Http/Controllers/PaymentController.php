<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Resources\PaymentResource;
use Illuminate\Container\Attributes\Auth;

class PaymentController extends Controller
{
    public function payProvider(Request $request) {

        if(auth()->id() === $request->provider_id) {
            return response()->json([
                'message' => 'You cannot pay yourself.'
            ], 400);
        }

        $payment = Payment::create([
            'client_id' => Auth::id(),
            'provider_id' => $request->provider_id,
            'amount' => $request->amount,
            'status' => 'paid',
            'payment_method' => $request->payment_method,
            'transaction_id' => uniqid('txn_') . strtoupper(Str::random(10)),
        ]);

        return new PaymentResource($payment);
    }

    public function paymentHistory(Request $request) {

        $payments = Payment::with('provider')
                ->where('client_id', auth()->id())
                ->get();

        return PaymentResource::collection($payments);
    }

    public function getProviderBalance(Request $request) {
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

    public function downloadInvoice($id) {

        $payment = Payment::with(['client', 'provider'])->findOrFail($id);

        if(auth()->id() !== $payment->client->id && auth()->id() !== $payment->provider->id) {
            return response()->json([
                'message' => 'You are not authorized to download this invoice.'
            ], 403);
        }

        $pdf = Pdf::loadView('emails.invoice', compact('payment'));

        return $pdf->download('invoice_' . $payment->transaction_id . '.pdf');

    }


}
