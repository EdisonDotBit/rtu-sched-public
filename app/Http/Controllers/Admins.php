<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;

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
}
