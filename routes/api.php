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
Route::put('updone/{aptid}', 'App\Http\Controllers\Appointments@uptodone');
Route::put('resched/{aptid}', 'App\Http\Controllers\Appointments@reschedule');

Route::get('office/all', 'App\Http\Controllers\Offices@index');
Route::delete('office/delete/{offid}', 'App\Http\Controllers\Offices@deloff');
Route::post('office/add', 'App\Http\Controllers\Offices@addoff');
Route::get('office/info/{offid}', 'App\Http\Controllers\Offices@getoff');
Route::put('office/edit/{offid}', 'App\Http\Controllers\Offices@edoff');
Route::get('office/find/{offabbr}', 'App\Http\Controllers\Offices@findAbbr');

Route::post('admin/add', 'App\Http\Controllers\Admins@create');
Route::get('admin/all', 'App\Http\Controllers\Admins@index');
Route::get('admin/info/{admid}', 'App\Http\Controllers\Admins@get');
Route::delete('admin/delete/{admid}', 'App\Http\Controllers\Admins@delete');
Route::put('admin/edit/{admid}', 'App\Http\Controllers\Admins@edit');

Route::post('admin/login', 'App\Http\Controllers\Admins@login');
