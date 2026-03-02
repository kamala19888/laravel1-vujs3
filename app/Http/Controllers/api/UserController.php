<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private function isPrimaryAdmin(Request $request): bool
    {
        return (bool) ($request->user() && $request->user()->username === 'admin');
    }

    public function indexUsers(Request $request)
    {
        if(!get_permission('users','read')){
            return response()->json([
                'status' => 401,
                'message' => 'You are not allowed to read users',
            ]);
        }

        if($request->search){
            $users = User::where('id', '=', $request->search)
            ->orWhere('name', 'like', "%{$request->search}%")
            ->orWhere('username', 'like', "%{$request->search}%")
            ->orWhere('email', 'like', "%{$request->search}%")
            ->with('role')->paginate(10);
        }else{
            $users = User::with('role')->paginate(10);
        }

        return response()->json([
            'message' => 'success get users',
            'users' => $users
        ]);
    }
    public function store(Request $request)
    {
        if (!$this->isPrimaryAdmin($request)) {
            return response()->json([
                'status' => 403,
                'message' => 'Only primary admin can manage users',
            ], 403);
        }

       if($request->id){
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', Rule::unique('users')->ignore($request->id, 'id')],
            'email' => ['required', 'email', Rule::unique('users')->ignore($request->id, 'id')],
            'role_id' => ['required', 'integer'],
        ]);

        $targetUser = User::findOrFail($request->id);
        if ($targetUser->username === 'admin' && $request->username !== 'admin') {
            return response()->json([
                'status' => 422,
                'message' => 'Primary admin username cannot be changed',
            ], 422);
        }

        $targetUser->update([
            'name' => $request->name,
            'father_name' => $request->father_name,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'mobile' => $request->mobile,
            'username' => $request->username,
            'email' => $request->email,
            'role_id' => $request->role_id,
        ]);
        return response()->json([
            'message' => 'success update user',

        ]);
       }
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'role_id' => ['required', 'integer'],
        ]);

        User::create([
         'name' => $request->name,
         'father_name' => $request->father_name,
         'gender' => $request->gender,
         'date_of_birth' => $request->date_of_birth,
         'mobile' => $request->mobile,
         'username' => $request->username,
         'email' => $request->email,
         'role_id' => $request->role_id,
          'password' => bcrypt($request->password),

        ]);

        return response()->json([
            'message' => 'success create user',

        ]);
    }

    public function destroy(Request $request, int $id)
    {
        if (!$this->isPrimaryAdmin($request)) {
            return response()->json([
                'status' => 403,
                'message' => 'Only primary admin can delete users',
            ], 403);
        }

        $targetUser = User::findOrFail($id);
        if ($targetUser->username === 'admin') {
            return response()->json([
                'status' => 422,
                'message' => 'Primary admin cannot be deleted',
            ], 422);
        }

        $targetUser->delete();

        return response()->json([
            'status' => 200,
            'message' => 'success delete user',
        ]);
    }
}
