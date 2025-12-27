<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'client_id',
        'provider_id',
        'job_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'transaction_id',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
