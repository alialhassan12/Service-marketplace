<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\jobsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProviderProfileController;
use Laravel\Cashier\Http\Controllers\WebhookController;

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
    Route::put('/jobs/{id}/proposal/{proposalId}', [jobsController::class, 'updateProposalState'])->name('updateProposalState');
    Route::get('/client/suggested-providers',[ProviderProfileController::class,'getSuggestedProviders'])->name('getSuggestedProviders');

    //provider routes
    Route::put('/provider/profile', [ProviderProfileController::class, 'update']);
    Route::get('/provider/profile', [ProviderProfileController::class, 'show']);
    Route::get('/provider/browseJobs', [ProviderProfileController::class, 'browseJobs'])->name('browseJobs');
    Route::post('/provider/submitProposal', [ProviderProfileController::class, 'submitProposal'])->name('submitProposal');
    Route::get('/provider/recommended-jobs', [jobsController::class, 'getRecomendedJobs'])->name('getRecomendedJobs');
    Route::get('/provider/my-proposals',[ProviderProfileController::class,'getMyProposals'])->name('getMyProposals');

    //payment routes
    Route::post('/payments/pay', [PaymentController::class, 'payProvider']);
    Route::get('/payments/history', [PaymentController::class, 'paymentHistory']);
    Route::get('/payments/balance', [PaymentController::class, 'getProviderBalance']);
});

Route::middleware(['auth:sanctum', 'checkRole:provider'])->prefix('provider')->group(function () {});
Route::get('/payments/download-invoice/{id}', [PaymentController::class, 'downloadInvoice'])
     ->middleware('auth:sanctum');
