<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('task')->group(function () {
    Route::get('get', [TaskController::class, 'get']);
    Route::post('create', [TaskController::class, 'store']);
    Route::post('update', [TaskController::class, 'update']);
    Route::post('delete', [TaskController::class, 'delete']);
});
