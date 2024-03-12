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
        $adm = new Admin();
        $adm->admuser = $request->input('admuser');
        $adm->admpass = $request->input('admpass');
        $adm->admname = $request->input('admname');
        $adm->admempnum = $request->input('admempnum');

        try {
            $adm->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully created admin',
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
        $off = Admin::find($admid);

        if (!$off) {
            return response()->json([
                'status' => 404,
                'message' => 'Appointment not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $off,
        ]);
    }
    public function delete($admid)
    {
        $off = Admin::find($admid);
        $off->delete();
        return response()->json([
            'status' => 200,
            'messages' => 'successfully deleted appointment',
        ]);
    }

    public function edit(Request $request, $offid)
    {
        $off = Admin::find($offid);
        $off->offname = $request->input('offname');
        $off->offabbr = $request->input('offabbr');
        $off->offlimit = $request->input('offlimit');
        try {
            $off->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully edited an office',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to edit an Office. Please ensure all fields are filled correctly.',
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
            ]);
        }

        // No match found
        return response()->json([
            'status' => 401,
            'error' => 'Unauthorized',
        ], 401);
    }
}
