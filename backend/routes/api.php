<?php

use App\Http\Controllers\authController;
use App\Http\Controllers\jobsController;
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

    Route::post('/jobs', [jobsController::class, 'addJob'])->name('addJob');
    Route::get('/jobs', [jobsController::class, 'getJobs'])->name('getJobs');
    Route::get('/jobs/{id}', [jobsController::class, 'getJob'])->name('getJob');
    Route::put('/jobs/{id}', [jobsController::class, 'updateJob'])->name('updateJob');
});
