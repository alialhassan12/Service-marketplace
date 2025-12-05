<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProviderResource;

class ProviderProfileController extends Controller
{
    public function show(Request $request) {

       return new ProviderResource($request->user());

    }

    public function update(Request $request) {

        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:6|confirmed',
            'phone_number' => 'sometimes|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'profile_picture' => 'sometimes|nullable|image|max:2048',
        ]);

        $user->fill($request->only([
            'name',
            'email',
            'phone_number',
            'location',
        ]));

        if($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if($request->hasFile('profile_picture')) {
            if($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new ProviderResource($user)
        ], 200);

    }

}
