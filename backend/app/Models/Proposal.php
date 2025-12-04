<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $fillable = [
        'job_id',
        'provider_id',
        'description',
        'price',
        'status'
    ];
    public function job(){
        return $this->belongsTo(Job::class,'job_id');
    }
    public function provider(){
        return $this->belongsTo(User::class,'provider_id');
    }
}
