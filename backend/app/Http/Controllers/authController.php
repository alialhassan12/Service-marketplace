<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class authController extends Controller
{
    public function login(Request $request){
        //validate input
        $request->validate([
            'email'=>'required|email',
            'password'=>'required|min:6'
        ]);

        //check credentials
        if(!Auth::attempt(['email'=>$request->email,'password'=>$request->password])){
            return response()->json([
                'message'=>'Invalid credentials'
            ],401);
        }

        $user=User::where('email',$request->email)->first();
        
        //genereate token
        $token=$user->createToken('auth-token')->plainTextToken;
        
        //return response
        return response()->json([
            'message'=>'Login successful',
            'user'=>$user,
            'token'=>$token
        ],200);
    }

    public function register(Request $request){
        //validate input
        $request->validate([
            'name'=>'required',
            'email'=>'required|email|unique:users,email',
            'password'=>'required|min:6',
            'role'=>'required|in:client,provider',
            'phone_number'=>'required',
            'location'=>'required',
        ]);

        //create user
        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>bcrypt($request->password),
            'role'=>$request->role,
            'phone_number'=>$request->phone_number,
            'location'=>$request->location,
        ]);

        //genereate token
        $token=$user->createToken('auth-token')->plainTextToken;

        //return response
        return response()->json([
            'message'=>'User registered successfully',
            'user'=>$user,
            'token'=>$token
        ],200);
    }
}
