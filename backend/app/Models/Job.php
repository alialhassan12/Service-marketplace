<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'client_id',
        'title',
        'description',
        'location',
        'is_remote',
        'budget',
        'status'
    ];
    public function client(){
        return $this->belongsTo(User::class, 'client_id');
    }
    public function proposals(){
        return $this->hasMany(Proposal::class);
    }
}
