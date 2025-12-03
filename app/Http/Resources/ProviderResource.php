<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'location' => $this->location,
            'service' => $this->service_type,
            'description' => $this->description,
            'profile_picture_url' => $this->profile_picture ? Storage::url($this->profile_picture) : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
