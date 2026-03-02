<?php

use App\Http\Controllers\api\AppFontController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\GeneralSettingController;
use App\Http\Controllers\api\LangController;
use App\Http\Controllers\api\PageController;
use App\Http\Controllers\api\PermissionController;
use App\Http\Controllers\api\RoleController;
use App\Http\Controllers\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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


Route::post('/login', [AuthController::class, 'login']);
Route::get('/get-i18n', [LangController::class, 'getI18n'])->name('getI18n');

Route::group(['middleware'=>['auth:sanctum']], function(){
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/reset-pass', [AuthController::class, 'ResetPass']);
    Route::post('/user-update', [AuthController::class, 'UserUpdate']);
    Route::post('/profile-upload', [AuthController::class, 'profileUpload']);
    Route::post('/delete-photo', [AuthController::class, 'DeletePhoto']);
    Route::post('/select-photo', [AuthController::class, 'SelectPhoto']);

    Route::get('/index-users', [UserController::class, 'indexUsers']);
    Route::post('/create-user', [UserController::class, 'store']);
    Route::delete('/delete-user/{id}', [UserController::class, 'destroy']);


    Route::get('/get-pages', [PageController::class, 'getPages']);
    Route::post('/create-page', [PageController::class, 'store']);

    Route::get('/get-roles', [RoleController::class, 'getRoles']);
    Route::post('/create-role', [RoleController::class, 'store']);

    Route::get('/get-app-fonts', [AppFontController::class, 'getFonts']);
    Route::post('/create-app-font', [AppFontController::class, 'store']);

    Route::get('/get-general_settings', [GeneralSettingController::class, 'index']);
    Route::post('/create-general_setting', [GeneralSettingController::class, 'store']);


    Route::get('/get-permissions/{roleId}', [PermissionController::class, 'getPermissionRoleId']);
    Route::post('/update-permission', [PermissionController::class, 'store']);



    Route::post('/add-langs', [LangController::class, 'addLangs'])->name('add.langs');
    Route::get('/langs/{key}', [LangController::class, 'LangsKey'])->name('key.langs');
    Route::get('/langs', [LangController::class, 'Langs'])->name('get.langs');



});
