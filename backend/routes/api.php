<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\authController;
use App\Http\Controllers\jobsController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\ProviderProfileController;
use App\Http\Controllers\StripeWebhookController;


//public routes
Route::post('/login', [authController::class, 'login'])->name('login');
Route::post('/register', [authController::class, 'register'])->name('register');


//protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/check', function (Request $request) {
        return $request->user();   // <-- Returns DB user data
    })->name('checkForUser');
    Route::post('/logout', [authController::class, 'logout'])->name('logout');

    //client routes
    Route::post('/jobs', [jobsController::class, 'addJob'])->name('addJob');
    Route::get('/jobs', [jobsController::class, 'getJobs'])->name('getJobs');
    Route::get('/jobs/{id}', [jobsController::class, 'getJob'])->name('getJob');
    Route::put('/jobs/{id}', [jobsController::class, 'updateJob'])->name('updateJob');
    Route::delete('/jobs/{id}', [jobsController::class, 'deleteJob'])->name('deleteJob');
    Route::put('/jobs/status/{id}', [jobsController::class, 'updateJobStatus'])->name('updateJobStatus');
    Route::put('/jobs/{id}/proposal/{proposalId}', [jobsController::class, 'updateProposalState'])->name('updateProposalState');
    Route::get('/client/suggested-providers',[ProviderProfileController::class,'getSuggestedProviders'])->name('getSuggestedProviders');
    Route::get('/client/provider-profile/{id}',[ProviderProfileController::class,'show'])->name('showProviderProfile');
    Route::put('/client/update-profile', [ProviderProfileController::class, 'update'])->name('clientUpdateProfile');
    Route::get('/client/accepted-providers', [jobsController::class, 'getClientAcceptedProviders'])->name('getClientAcceptedProviders');

    //provider routes
    Route::put('/provider/profile', [ProviderProfileController::class, 'update']);
    Route::get('/provider/profile', [ProviderProfileController::class, 'show']);
    Route::get('/provider/browseJobs', [ProviderProfileController::class, 'browseJobs'])->name('browseJobs');
    Route::post('/provider/submitProposal', [ProviderProfileController::class, 'submitProposal'])->name('submitProposal');
    Route::get('/provider/recommended-jobs', [jobsController::class, 'getRecomendedJobs'])->name('getRecomendedJobs');
    Route::get('/provider/my-proposals',[ProviderProfileController::class,'getMyProposals'])->name('getMyProposals');

    //payment routes
    Route::post('/payments/create-intent', [StripePaymentController::class, 'createPaymentIntent']);
    Route::post('/payments/confirm', [StripePaymentController::class, 'confirmPayment']);
    Route::get('/payments/history', [StripePaymentController::class, 'paymentHistory']);
    Route::get('/payments/{id}', [StripePaymentController::class, 'getPayment']);
    Route::get('/payments/balance', [StripePaymentController::class, 'getProviderBalance']);


});

Route::middleware(['auth:sanctum', 'checkRole:provider'])->prefix('provider')->group(function () {});
//download invoice
Route::get('/payments/download-invoice/{id}', [StripePaymentController::class, 'downloadInvoice'])
    ->middleware('auth:sanctum');

// Stripe webhook route (must be public and not require authentication)
Route::post('/webhook/stripe', [StripeWebhookController::class, 'handleWebhook'])->name('stripe.webhook');



//admin routes
Route::middleware(['auth:sanctum', 'checkRole:admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);

    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    Route::get('/jobs', [AdminController::class, 'getJobs']);
    Route::put('/jobs/{id}/status', [AdminController::class, 'updateJobStatus']);
    Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);

    Route::get('/proposals', [AdminController::class, 'getProposals']);
    Route::delete('/proposals/{id}', [AdminController::class, 'deleteProposal']);

    // Content management
    Route::get('/content/{key}', [AdminController::class, 'getContent']);
    Route::put('/content/{key}', [AdminController::class, 'updateContent']);
    Route::get('/jobs/{id}', [AdminController::class, 'getJob']);
});