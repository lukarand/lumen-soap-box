<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->group(function () {
    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@authenticate');
    Route::post('forgot', 'ForgotPasswordController@forgot');
    Route::post('reset/{token}', 'ForgotPasswordController@reset');

    Route::group(['middleware' => ['jwt.verify']], function () {
        // Route::get('user', 'UserController@getAuthenticatedUser');
        // Route::get('closed', 'DataController@closed');
        Route::post('request-development', 'RequestForDevelopmentController@submit');
        Route::get('setup/plans', 'SetupPlanController@index');
        Route::post('setup/plans/{plan}', 'SetupPlanController@subscribe');
        Route::post('setup/profile/url', 'SetupProfileController@storeUrl');
        Route::post('setup/profile/message', 'SetupProfileController@storeMessage');
        Route::get('setup/members', 'SetupMembersController@index');
        Route::post('setup/members', 'SetupMembersController@store');

        Route::post('request/quick', 'MessageRequestController@quick');
        Route::post('request/bulk', 'MessageRequestController@bulk');
        Route::get('package', 'PackageController@index');
        Route::post('package', 'PackageController@store');
        Route::get('reviews', 'ReviewController@index');
        Route::get('members', 'MemberController@index');
        Route::post('members', 'MemberController@store');
        Route::post('profile/update', 'ProfileController@pwd_change');
        Route::put('members/{id}', 'MemberController@update');
        Route::post('members/{id}/upload', 'MemberController@upload');
        Route::put('members/{id}/resend', 'MemberController@resend');
        Route::delete('members/{id}', 'MemberController@destroy');
    });
});
