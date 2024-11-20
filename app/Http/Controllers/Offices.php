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

    public function findAbbr($abbr)
    {
        $off = Office::where('offabbr', $abbr)->first();

        if (!$off) {
            return response()->json([
                'status' => 404,
                'message' => 'Office not found with abbreviation ' . $abbr,
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $off,
        ]);
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

    public function getoff(int $offid)
    {
        $off = Office::find($offid);

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
    public function edoff(Request $request, $offid)
    {
        $off = Office::find($offid);
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


    public function getPurposes($officeAbbr)
    {
        $office = Office::where('offabbr', $officeAbbr)->first();

        if ($office) {
            $purposes = $office->purposes()->pluck('purpose');
            return response()->json($purposes);
        } else {
            return response()->json(['message' => 'Office not found'], 404);
        }
    }


    public function addPurpose(Request $request)
    {
        $officeId = $request->input('officeId');
        $purpose = $request->input('purpose');

        // Debug log to check if the data is received correctly 
        error_log("Office ID: $officeId, Purpose: $purpose");

        $office = Office::find($officeId);
        if ($office) {
            $office->purposes()->create(['purpose' => $purpose]);
            return response()->json(['status' => 200, 'message' => 'Purpose inserted successfully']);
        } else {
            return response()->json(['status' => 404, 'message' => 'Office not found'], 404);
        }
    }
}
