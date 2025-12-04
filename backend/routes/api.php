<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\jobsController;
use App\Http\Controllers\ProviderProfileController;

//public routes
Route::post('/login',[authController::class,'login'])->name('login');
Route::post('/register',[authController::class,'register'])->name('register');


//protected routes
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/check', function (Request $request) {
        return $request->user();   // <-- Returns DB user data
    })->name('checkForUser');
    Route::post('/logout',[authController::class,'logout'])->name('logout');

    Route::post('/jobs',[jobsController::class,'addJob'])->name('addJob');
    Route::get('/jobs',[jobsController::class,'getJobs'])->name('getJobs');
});


Route::middleware(['auth:sanctum', 'checkRole:provider'])->prefix('provider')->group(function () {
    Route::get('/profile', [ProviderProfileController::class, 'show']);
    Route::put('/profile', [ProviderProfileController::class, 'update']);
});
