<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EmployeeWebController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Redirect root: if authenticated go to employees, otherwise to login
Route::get('/', function () {
    return auth()->check() ? redirect('/employees') : redirect('/login');
});

// Guest Routes (Accessible only when logged out)
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

// Authenticated Routes (Protected by 'auth' middleware)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Resource CRUD routes
    Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
    Route::resource('employees', EmployeeWebController::class)->except(['create', 'edit', 'show']);
});
