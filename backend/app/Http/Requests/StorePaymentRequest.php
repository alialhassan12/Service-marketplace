<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'provider_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'provider_id.required' => 'Provider ID is required.',
            'provider_id.exists' => 'The selected provider does not exist.',
            'amount.required' => 'Amount is required.',
            'amount.numeric' => 'Amount must be a numeric value.',
            'amount.min' => 'Amount must be at least 1.',
        ];
    }
}
