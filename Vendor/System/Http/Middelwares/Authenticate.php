<?php

namespace System\Http\Middelwares;

use System\Middleware as Middleware;

class Authenticate extends Middleware
{
    public function index()
    {
        // should be in Model 'Log in'
        
       if (!$this->session->has('login')) {

           $this->app->url->redirectTo('/');
       }
    }
}