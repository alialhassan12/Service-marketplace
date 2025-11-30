<?php

use App\Http\Controllers\authController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//public routes
Route::post('/login',[authController::class,'login'])->name('login');
Route::post('/register',[authController::class,'register'])->name('register');


//protected routes
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/profile', function (Request $request) {
        return $request->user();   // <-- Returns DB user data
    });
});
