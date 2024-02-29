<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment; // Assuming your model is named Appointment

class Appointments extends Controller
{

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

        if ($apt->save()) {
            return ['success' => $apt];
        } else {
            return ['error' => 'Failed to save appointment'];
        }
    }

    public function editapt($aptid)
    {
        $apt = Appointment::find($aptid);
        return $apt;
    }
    public function updateapt(Request $request, $aptid)
    {
    }
}
