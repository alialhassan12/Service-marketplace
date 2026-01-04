<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimpleTest extends TestCase
{
    use RefreshDatabase;

    public function test_basic_test()
    {
        $this->assertTrue(true);
    }
}
