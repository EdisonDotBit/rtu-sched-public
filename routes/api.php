<?php

use Illuminate\Http\Request;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('setappt', 'App\Http\Controllers\Appointments@newapt');
Route::get('searchappt/{aptid}', 'App\Http\Controllers\Appointments@getapt');

Route::get('allongoing', 'App\Http\Controllers\Appointments@allOngoingAppointments');
Route::get('all', 'App\Http\Controllers\Appointments@allAppointments');
Route::delete('/delappt/{aptid}', 'App\Http\Controllers\Appointments@delapt');
Route::put('/updone/{aptid}', 'App\Http\Controllers\Appointments@uptodone');


Route::get('office/all', 'App\Http\Controllers\Offices@index');
Route::delete('office/delete/{offid}', 'App\Http\Controllers\Offices@deloff');
Route::post('office/add', 'App\Http\Controllers\Offices@addoff');
