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
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'location' => $this->location,
            'profile_picture' => $profilePictureUrl,
            'bio' => $this->bio,
            'role'=>$this->role,
            'skills' => $this->skills,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
