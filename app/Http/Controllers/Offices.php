<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Office;
use App\Models\Purpose;
use App\Models\DisabledDate;
use App\Models\DisabledSlot;

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
            'offabbr' => 'required|string|max:50|unique:offices,offabbr,NULL,id,offbranch,' . $request->input('offbranch'),
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
                'error' => 'Failed to add an office. Please double check the details.',
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
        try {
            $validatedData = $request->validate([
                'offname' => 'required|string|max:255',
                'offabbr' => 'required|string|max:50|unique:offices,offabbr,' . $offid . ',offid,offbranch,' . $request->input('offbranch'),
                'offlimit' => 'required|integer',
                'offbranch' => 'required|string|max:255',
            ]);

            $off = Office::find($offid);

            if (!$off) {
                return response()->json([
                    'status' => 404,
                    'error' => 'Office not found',
                ], 404);
            }

            // Update the office details
            $off->offname = $validatedData['offname'];
            $off->offabbr = $validatedData['offabbr'];
            $off->offlimit = $validatedData['offlimit'];
            $off->offbranch = $validatedData['offbranch'];
            $off->save();

            return response()->json([
                'status' => 200,
                'message' => 'Office updated successfully.',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'status' => 422,
                'error' => 'Validation failed.',
                'messages' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'status' => 500,
                'error' => 'Failed to update the office. Please double check the details.',
            ], 500);
        }
    }

    public function getPurposes($officeAbbr, $offBranch)
    {
        $office = Office::where('offabbr', $officeAbbr)
            ->where('offbranch', $offBranch)
            ->first();

        if ($office) {
            $purposes = $office->purposes()->get(['id', 'purpose', 'instruction']);
            return response()->json($purposes, 200);
        }

        return response()->json(['message' => 'Office not found in this branch'], 404);
    }

    public function updateInstruction(Request $request)
    {
        $validatedData = $request->validate([
            'purposeId' => 'required|exists:purposes,id',
            'instruction' => 'required|string',
        ]);

        $purpose = Purpose::find($validatedData['purposeId']);

        if (!$purpose) {
            return response()->json(['message' => 'Purpose not found'], 404);
        }

        $purpose->instruction = $validatedData['instruction'];
        $purpose->save();

        return response()->json(['status' => 200, 'message' => 'Instruction updated successfully']);
    }

    public function deletePurpose($purposeId)
    {
        $purpose = Purpose::find($purposeId);

        if (!$purpose) {
            return response()->json(['message' => 'Purpose not found'], 404);
        }

        $purpose->delete();

        return response()->json(['status' => 200, 'message' => 'Purpose deleted successfully']);
    }


    public function addPurpose(Request $request)
    {
        $validatedData = $request->validate([
            'officeId' => 'required|exists:offices,offid',
            'purpose' => 'required|string',
        ]);

        $office = Office::find($validatedData['officeId']);
        if ($office) {
            if (method_exists($office, 'purposes')) {
                $office->purposes()->create(['purpose' => $validatedData['purpose']]);


                return response()->json(['status' => 200, 'message' => 'Purpose inserted successfully']);
            } else {

                return response()->json(['status' => 500, 'message' => 'Internal Server Error. Relationship missing.'], 500);
            }
        }
        return response()->json(['status' => 404, 'message' => 'Office not found'], 404);
    }

    public function getDisabledDates($offabbr, $branch)
    {
        $disabledDates = DisabledDate::where('aptoffice', $offabbr)
            ->where('aptbranch', $branch)
            ->get();
        return response()->json($disabledDates, 200);
    }

    public function toggleDisabledDate(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'time' => 'nullable|string', // if null, disable the whole day
            'aptoffice' => 'required|string',
            'aptbranch' => 'required|string',
        ]);

        // Look for an existing record
        $disabledDate = DisabledDate::where('aptoffice', $validatedData['aptoffice'])
            ->where('aptbranch', $validatedData['aptbranch'])
            ->where('date', $validatedData['date'])
            ->where('time', $validatedData['time'])
            ->first();

        if ($disabledDate) {
            // Found record means it's currently disabled – so enable it by deleting the record.
            $disabledDate->delete();
            return response()->json(['message' => 'Date/Time enabled'], 200);
        } else {
            // Not found: create a new record to disable the date/time.
            DisabledDate::create($validatedData);
            return response()->json(['message' => 'Date/Time disabled'], 201);
        }
    }

    public function getDisabledSlots($offabbr, $branch)
    {
        $disabledSlots = DisabledSlot::where('aptoffice', $offabbr)
            ->where('aptbranch', $branch)
            ->get();
        return response()->json($disabledSlots, 200);
    }

    public function toggleDisabledSlot(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'time' => 'nullable|string', // If null, whole day is disabled; otherwise, specific time slot
            'aptoffice' => 'required|string',
            'aptbranch' => 'required|string',
        ]);

        $disabledSlot = DisabledSlot::where('aptoffice', $validatedData['aptoffice'])
            ->where('aptbranch', $validatedData['aptbranch'])
            ->where('date', $validatedData['date'])
            ->where('time', $validatedData['time'])
            ->first();

        if ($disabledSlot) {
            // If the record exists, it means the slot is disabled. Re-enable it by deleting.
            $disabledSlot->delete();
            return response()->json(['message' => 'Slot enabled'], 200);
        } else {
            // If the record does not exist, disable the slot by creating a new entry.
            DisabledSlot::create($validatedData);
            return response()->json(['message' => 'Slot disabled'], 201);
        }
    }
}
