<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'client_name' => $this->client->name,
            'provider_name' => $this->provider->name,
            'service' => $this->job ? $this->job->title : 'No Services',
            'date' => $this->created_at->format('M d, Y'),
            'amount' => '$' . number_format($this->amount, 2),
            'status' => ucfirst($this->status),
            'transaction_id' => $this->transaction_id,
        ];
    }
}
