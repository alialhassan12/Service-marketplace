<?php

use App\Http\Controllers\authController;
use App\Http\Controllers\jobsController;
use App\Http\Controllers\ProviderProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    
    //provider routes
    Route::put('/provider/profile', [ProviderProfileController::class, 'update']);
    Route::get('/provider/profile', [ProviderProfileController::class, 'show']);
    Route::get('/provider/browseJobs',[ProviderProfileController::class,'browseJobs'])->name('browseJobs');

});

Route::middleware(['auth:sanctum', 'checkRole:provider'])->prefix('provider')->group(function () {
    
});