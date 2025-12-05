<?php

namespace App\Http;

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\Authenticate;
use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // \App\Http\Middleware\TrustProxies::class,
    ];


    /**
     * The application's route middleware aliases.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [

        'checkRole' => CheckRole::class,

        'auth' => Authenticate::class,
    ];
}
