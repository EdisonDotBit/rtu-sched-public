<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment; // Assuming your model is named Appointment
use Illuminate\Http\JsonResponse;

class Appointments extends Controller
{
    public function index()
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
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to save appointment. Please ensure all fields are filled correctly.',
            ], JsonResponse::HTTP_BAD_REQUEST);
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
}
