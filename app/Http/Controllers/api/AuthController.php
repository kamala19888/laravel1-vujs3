<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\GeneralSetting;
use App\Models\User;
use App\Models\UserPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        return response()->json([
            'status' => 403,
            'message' => 'Self registration is disabled',
        ], 403);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $throttleKey = Str::lower($credentials['username']).'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response()->json([
                'status' => 429,
                'message' => 'Too many login attempts. Please try again later.',
            ], 429);
        }

        $user = User::where('username', $credentials['username'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized',
            ], 401);
        }

        RateLimiter::clear($throttleKey);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Tokens Revoked'
        ]);
    }
    public function user(Request $request)
    {
        $id = $request->user()->id;
        $user = User::with(['photos',
        'role'=>function($q){
            $q->with(['permissions'=>function($q){
                $q->with('page');
            }]);
        }
        ])->find($id);

        $setting = GeneralSetting::with('font')->first();
        return response()->json([
            'status' => 200,
            'setting' =>$setting,
            'user' => $user
        ]);
    }
    public function ResetPassword(Request $request)
    {
        return response()->json([
            'status' => 403,
            'message' => 'Public password reset is disabled',
        ], 403);
    }

    public function ResetPass(Request $request)
    {
        $id = $request->user()->id;

        $user = User::find($id)->update([
            'password' => bcrypt($request->password)
        ]);
        return response()->json([
            'status' => 200,
            'message' => 'password change success'
        ]);
    }
    public function UserUpdate(Request $request)
    {
        $id = $request->user()->id;
        validator($request->all(), [
            'name' => 'required',
            'username' => ['required', 'string', 'max:100', Rule::unique('users')->ignore($id, 'id')],
            'email' => ['required',
            Rule::unique('users')->ignore($id, 'id'),
        ],
        ]);


        $user = User::find($id)->update([
            'name' => $request->name,
            'father_name' => $request->father_name,
            'date_of_birth' => $request->date_of_birth,
            'mobile' => $request->mobile,
            'username' => $request->username,
            'email' => $request->email,
        ]);
        return response()->json([
            'status' => 200,
            'message' => 'user change success'
        ]);
    }

    public function profileUpload(Request $request){
        $user = User::find($request->id);
        $file = $request->file('file');
        $filename =  time() . '.' . $file->getClientOriginalExtension();
        $file->move('images/user/', $filename);

        $user->update([
            'photo' => $filename,
        ]);

        UserPhoto::create([
            'user_id' => $request->id,
            'name' => $filename,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'success image upload',
            'path' => $filename
        ]);
    }

    public function  DeletePhoto(Request $request){
        $photo = UserPhoto::find($request->id);
        $photo->delete();
        return response()->json([
            'status' => 200,
            'message' => 'success image delete',
        ]);
    }
    public function  SelectPhoto(Request $request){
        $photo = UserPhoto::find($request->id);

        $user = User::find($request->user()->id);
        $user->update([
            'photo' => $photo->name,
        ]);
        return response()->json([
            'status' => 200,
            'message' => 'success image select',
        ]);
    }
}
