<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment; // Assuming your model is named Appointment
use Illuminate\Http\JsonResponse;

class Appointments extends Controller
{
    public function allOngoingAppointments()
    {
        $apt = Appointment::where('aptstatus', 'ongoing')->get();
        return $apt;
    }
    public function allAppointments()
    {
        $apt = Appointment::all();
        return $apt;
    }

    public function newapt(Request $request)
    {
        $apt = new Appointment();
        $apt->apttype = $request->input('apttype');
        $apt->aptname = $request->input('aptname');
        $apt->aptbranch = $request->input('aptbranch');
        $apt->aptpurpose = $request->input('aptpurpose');
        $apt->aptstudnum = $request->input('aptstudnum');
        $apt->aptdate = $request->input('aptdate');
        $apt->aptoffice = $request->input('aptoffice');
        $apt->aptpnumber = $request->input('aptpnumber');
        $apt->aptemail = $request->input('aptemail');


        try {
            $apt->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully created appointment',
                'data' => $apt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to save appointment. Please ensure all fields are filled correctly.',
            ], 400);
        }
    }
    public function getapt(int $aptid)
    {
        $apt = Appointment::find($aptid);

        if (!$apt) {
            return response()->json([
                'status' => 404,
                'message' => 'Appointment not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $apt,
        ]);
    }

    public function delapt($aptId)
    {
        $apt = Appointment::find($aptId);
        $apt->delete();
        return response()->json([
            'status' => 200,
            'messages' => 'successfully deleted appointment',
        ]);
    }
    public function uptodone($aptId)
    {
        $apt = Appointment::find($aptId);
        $apt->aptstatus = 'done';
        try {
            $apt->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully updated appointment',
                'data' => $apt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed Madafaka',
            ], 400);
        }
    }

    public function reschedule(Request $request, int $aptId)
    {
        $apt = Appointment::find($aptId);

        if (!$apt) {
            return response()->json([
                'status' => 404,
                'message' => 'Appointment not found',
            ], 404);
        }

        $apt->aptdate = $request->input('aptdate');

        try {
            $apt->save();
            return response()->json([
                'status' => 200,
                'message' => 'Appointment successfully rescheduled',
                'data' => $apt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to reschedule appointment. Please ensure the new date is valid.',
            ], 400);
        }
    }
}
