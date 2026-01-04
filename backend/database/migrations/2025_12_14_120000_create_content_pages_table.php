<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('content_pages', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('content_pages');
    }
};
