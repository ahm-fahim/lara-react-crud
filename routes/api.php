<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\EmployeeController;

Route::apiResource('users', UserController::class);
Route::apiResource('employees', EmployeeController::class);