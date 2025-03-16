<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Office;

class Offices extends Controller
{
    // Get all offices, or filter by branch if 'branch' query parameter is provided
    public function index(Request $request)
    {
        $branch = $request->query('branch');
        if ($branch) {
            $offices = Office::where('offbranch', $branch)->get();
        } else {
            $offices = Office::all();
        }
        return response()->json($offices, 200);
    }

    public function filterByBranch($offbranch)
    {
        $off = Office::where('offbranch', $offbranch)->get();
        return response()->json($off, 200);
    }

    public function filterByBranchRole($offbranch, $offabbr)
    {
        $off = Office::where('offbranch', $offbranch)
            ->where('offabbr', $offabbr)
            ->get();
        return response()->json($off, 200);
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
        if ($off) {
            $off->delete();
            return response()->json([
                'status' => 200,
                'messages' => 'Successfully deleted the office',
            ]);
        }
        return response()->json([
            'status' => 404,
            'error' => 'Office not found',
        ], 404);
    }

    // Add a new office linked to a specific branch
    public function addoff(Request $request)
    {
        $validatedData = $request->validate([
            'offname' => 'required|string|max:255',
            'offlimit' => 'required|integer',
            'offabbr' => 'required|string|max:50|unique:offices',
            'offbranch' => 'required|string|max:255',
        ]);

        try {
            $off = new Office();
            $off->offname = $validatedData['offname'];
            $off->offlimit = $validatedData['offlimit'];
            $off->offabbr = $validatedData['offabbr'];
            $off->offbranch = $validatedData['offbranch'];
            $off->save();

            return response()->json([
                'status' => 200,
                'messages' => 'Successfully added an office',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to add an office. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }

    public function getoff(int $offid)
    {
        $off = Office::find($offid);

        if (!$off) {
            return response()->json([
                'status' => 404,
                'message' => 'Office not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $off,
        ]);
    }

    public function edoff(Request $request, $offid)
    {
        $validatedData = $request->validate([
            'offname' => 'required|string|max:255',
            'offabbr' => 'required|string|max:50|unique:offices,offabbr,' . $offid,
            'offlimit' => 'required|integer',
        ]);

        $off = Office::find($offid);

        if (!$off) {
            return response()->json([
                'status' => 404,
                'error' => 'Office not found',
            ], 404);
        }

        try {
            $off->offname = $validatedData['offname'];
            $off->offabbr = $validatedData['offabbr'];
            $off->offlimit = $validatedData['offlimit'];
            $off->save();

            return response()->json([
                'status' => 200,
                'messages' => 'Successfully edited an office',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to edit the office. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }

    public function getPurposes($officeAbbr)
    {
        $office = Office::where('offabbr', $officeAbbr)->first();

        if ($office) {
            $purposes = $office->purposes()->pluck('purpose');
            return response()->json($purposes, 200);
        }

        return response()->json(['message' => 'Office not found'], 404);
    }

    public function addPurpose(Request $request)
    {
        $validatedData = $request->validate([
            'officeId' => 'required|exists:offices,id',
            'purpose' => 'required|string',
        ]);

        $office = Office::find($validatedData['officeId']);
        if ($office) {
            $office->purposes()->create(['purpose' => $validatedData['purpose']]);
            return response()->json(['status' => 200, 'message' => 'Purpose inserted successfully']);
        }

        return response()->json(['status' => 404, 'message' => 'Office not found'], 404);
    }
}
