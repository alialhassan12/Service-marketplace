<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProviderProfileRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:providers,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'service_type' => 'required|string|max:200',
            'description' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
