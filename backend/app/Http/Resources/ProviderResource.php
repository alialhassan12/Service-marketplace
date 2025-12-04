<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profilePictureUrl = $this->profile_picture
            ? asset('storage/' . $this->profile_picture)
            : null;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'location' => $user->location,
            'profile_picture' => $profilePictureUrl,
            'created_at' => $user->created_at->format('Y-m-d H:i:s'),
        ];

    }
}
