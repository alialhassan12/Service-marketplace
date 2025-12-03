<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Provider;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProviderResource;
use App\Http\Requests\StoreProviderProfileRequest;

class ProviderProfileController extends Controller
{
    public function store(StoreProviderProfileRequest $request): JsonResponse
    {
        // Validate and store the provider profile
        $validatedData = $request->validated();

        if($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('providers/avatars', 'public');
            $validatedData['profile_picture'] = $path;
        }

        $provider = Provider::create($validatedData);

        return response()->json([
            'message' => 'Provider profile created successfully',
            'provider' => new ProviderResource($provider),
            'profile_picture_url' => $this->profile_picture
                        ? Storage::url($this->profile_picture)
                        : null
        ], 201);
    }

    public function update(Request $request, Provider $provider) {
        $this->authorize('update', $provider);

        $validatedData = $request->validate([
            'name' => 'sometimes/string/max:100',
            'email' => 'sometimes|email|max:255',
            'phone_number' => 'sometimes|string|max:20',
            'location' => 'sometimes|string|max:255',
            'service_type' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
        ]);

        $provider->update($validatedData);

        return response()->json([
            'message' => 'Provider profile updated successfully',
            'provider' => new ProviderResource($provider),
        ]);
    }
}
