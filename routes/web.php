<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Redirect home route to users page
Route::get('/', function () {
    return redirect('/users');
});
Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
