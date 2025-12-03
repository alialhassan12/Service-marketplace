<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\Api\ProviderProfileController;

//public routes
Route::post('/login',[authController::class,'login'])->name('login');
Route::post('/register',[authController::class,'register'])->name('register');


//protected routes
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/check', function (Request $request) {
        return $request->user();   // <-- Returns DB user data
    });
    Route::post('/provider-profile', [ProviderProfileController::class, 'store']);
});
