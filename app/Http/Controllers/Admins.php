<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;

class Admins extends Controller
{
    public function index()
    {
        $adm = Admin::all();
        return $adm;
    }

    public function create(Request $request)
    {
        $existingAdmin = Admin::where('admuser', $request->input('admuser'))->first();

        if ($existingAdmin) {
            return response()->json([
                'status' => 400,
                'error' => 'Admin with the same username already exists.',
            ], 400);
        }

        $adm = new Admin();
        $adm->admuser = $request->input('admuser');
        $adm->admpass = $request->input('admpass');
        $adm->admname = $request->input('admname');
        // $adm->admempnum = $request->input('admempnum');
        $adm->admrole = $request->input('admrole');
        // $adm->admbranch = $request->user()->admbranch;
        $adm->admbranch = $request->input('admbranch');

        try {
            $adm->save();
            return response()->json([
                'status' => 200,
                'messages' => 'Successfully created admin.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to add an admin. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }

    public function get(int $admid)
    {
        $adm = Admin::find($admid);

        if (!$adm) {
            return response()->json([
                'status' => 404,
                'message' => 'Admin not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $adm,
        ]);
    }
    public function delete($admid)
    {
        $adm = Admin::find($admid);
        $adm->delete();
        return response()->json([
            'status' => 200,
            'messages' => 'successfully deleted admin',
        ]);
    }

    public function edit(Request $request, $offid)
    {
        $adm = Admin::find($offid);
        $adm->admuser = $request->input('admuser');
        $adm->admpass = $request->input('admpass');
        $adm->admname = $request->input('admname');
        $adm->admrole = $request->input('admrole');
        // $adm->admempnum = $request->input('admempnum');
        try {
            $adm->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully edited an Admin',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to edit an Admin. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }

    public function login(Request $request)
    {
        $username = $request->input('admuser');
        $password = $request->input('admpass');

        $user = DB::table('admins')->where('admuser', $username)->where('admpass', $password)->first();

        if ($user) {
            // Username and password match found
            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'admuser' => $user->admuser,
                'admrole' => $user->admrole,
                'admbranch' => $user->admbranch,
            ]);
        }

        // No match found
        return response()->json([
            'status' => 401,
            'error' => 'Unauthorized',
        ], 401);
    }

    public function find($admuser)
    {
        $adm = Admin::where('admuser', $admuser)->first();

        if (!$adm) {
            return response()->json([
                'status' => 404,
                'message' => 'Admin not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $adm,
        ]);
    }

    public function filterByBranch($admbranch)
    {
        $adm = Admin::where('admbranch', $admbranch)->get();
        return response()->json($adm);
    }
}
