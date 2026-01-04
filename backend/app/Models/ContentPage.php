<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentPage extends Model
{
    protected $table = 'content_pages';

    protected $fillable = ['page_key', 'title', 'content', 'status'];
}
