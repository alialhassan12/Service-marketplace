<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'client_id',
        'project_id',
        'amount',
        'status',
        'payment_method',
        'transaction_id',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'description');
    }
}
