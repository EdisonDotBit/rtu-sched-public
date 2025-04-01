<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Appointments;
use App\Http\Controllers\Offices;
use App\Http\Controllers\Admins;
use App\Http\Controllers\UserController;

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

//  Sanctum authentication for getting user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//  Appointments Routes
Route::controller(Appointments::class)->group(function () {
    Route::post('setappt', 'newapt');
    Route::get('searchappt/{aptid}', 'getapt');
    Route::get('allongoing', 'allOngoingAppointments');
    Route::get('allongoingandconfirmed', 'allOngoingAndConfirmedAppointments');
    Route::get('filteredapt/{aptrole}/{aptbranch}', 'allRolesAndBranch');
    Route::get('branchapt/{aptbranch}', 'allBranch');
    Route::get('all', 'allAppointments');
    Route::delete('/delappt/{aptid}', 'delapt');
    Route::put('updone/{aptid}', 'uptodone');
    Route::put('resched/{aptid}', 'reschedule');
    Route::post('appointments/confirm/{id}', 'confirmAppointment');
    Route::post('appointments/done/{id}', 'doneAppointment');
    Route::post('appointments/cancel/{id}', 'cancelAppointment');
    Route::delete('appointments/{id}', 'deleteAppointment');
});

//  Office Routes
Route::controller(Offices::class)->group(function () {
    Route::get('office/all', 'index');
    Route::get('office/bybranch/{offbranch}', 'filterByBranch');
    Route::get('office/bybranchrole/{offbranch}/{offabbr}', 'filterByBranchRole');
    Route::delete('office/delete/{offid}', 'deloff');
    Route::post('office/add', 'addoff');
    Route::get('office/info/{offid}', 'getoff');
    Route::put('office/edit/{offid}', 'edoff');
    Route::get('office/find/{offabbr}', 'findAbbr');
    Route::put('office/update-limit/{offid}',  'updateLimit');
    Route::post('office/addPurpose', 'addPurpose');
    Route::get('office/purposes/{offabbr}/{offBranch}', 'getPurposes');
    Route::post('office/updateInstruction', 'updateInstruction');
    Route::delete('office/deletePurpose/{purposeId}', 'deletePurpose');
    Route::post('office/toggle-date', 'toggleDisabledDate');
    Route::get('office/disabled-dates/{offabbr}/{branch}', 'getDisabledDates');
    Route::post('office/toggle-slot', 'toggleDisabledSlot');
    Route::get('office/disabled-slots/{offabbr}/{branch}', 'getDisabledSlots');
});

//  Admin Routes
Route::controller(Admins::class)->group(function () {
    Route::post('admin/add', 'create');
    Route::get('admin/all', 'index');
    Route::get('admin/info/{admid}', 'get');
    Route::get('admin/informa/{admuser}', 'find');
    Route::delete('admin/delete/{admid}', 'delete');
    Route::put('admin/edit/{admid}', 'edit');
    Route::get('admin/bybranch/{admbranch}', 'filterByBranch');
    Route::post('admin/login', 'login');
});

// Feedback Routes
Route::post('feedback', 'App\Http\Controllers\Feedback@add');
Route::get('feedbacks', 'App\Http\Controllers\Feedback@all');

// User Authentication Routes
Route::controller(UserController::class)->group(function () {
    Route::post('users/register', 'register');
    Route::post('users/login', 'login');
    Route::middleware('auth:sanctum')->post('users/logout', 'logout');
    Route::post('users/verify-pin', 'verifyPin');
    Route::post('users/resend-pin', 'resendPin');
    Route::middleware('auth:sanctum')->get('users/info', 'userInfo');

    // Send Student Number Verification PIN
    Route::middleware('auth:sanctum')->post('users/send-verification-email', 'sendVerificationPin');

    // Verify Student Number with PIN
    Route::middleware('auth:sanctum')->post('users/verify-student-number', 'verifyStudentNumberPin');

    Route::middleware('auth:sanctum')->put('users/update', 'updateAccount');


    // Forgot Password
    Route::post('users/request-password-reset', 'requestPasswordReset');
    Route::post('users/verify-password-reset-pin', 'verifyPasswordResetPin');
    Route::post('users/reset-password', 'resetPassword');
});
