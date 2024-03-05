<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Office;

class Offices extends Controller
{
    public function index()
    {
        $offices = Office::all();
        return $offices;
    }

    public function deloff($offid)
    {
        $off = Office::find($offid);
        $off->delete();
        return response()->json([
            'status' => 200,
            'messages' => 'successfully deleted appointment',
        ]);
    }

    public function addoff(Request $request)
    {
        $off = new Office();
        $off->offname = $request->input('offname');
        $off->offlimit = $request->input('offlimit');
        $off->offabbr = $request->input('offabbr');



        try {
            $off->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully added an office',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to add an Office. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }
}
