<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Mail\ConfirmAppointment;
use App\Mail\DoneAppointment;
use App\Mail\CancelAppointment;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class Appointments extends Controller
{
    public function allOngoingAppointments()
    {
        $apt = Appointment::where('aptstatus', 'ongoing')->get();
        return $apt;
    }

    public function allOngoingAndConfirmedAppointments()
    {
        $apt = Appointment::whereIn('aptstatus', ['ongoing', 'confirmed'])->get();
        return $apt;
    }


    public function allRolesAndBranch(string $aptrole, string $aptbranch)
    {
        $apt = Appointment::where('aptoffice', $aptrole)
            ->where('aptbranch', $aptbranch)->get();
        return $apt;
    }

    public function allBranch(string $aptbranch)
    {
        $apt = Appointment::where('aptbranch', $aptbranch)->get();
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
        $apt->aptid = date('dYm') . date('Hi') . str_pad(Appointment::count() + 1, 4, '0', STR_PAD_LEFT);
        $apt->apttype = $request->input('apttype');
        $apt->aptname = $request->input('aptname');
        $apt->aptbranch = $request->input('aptbranch');
        $apt->aptpurpose = $request->input('aptpurpose');
        $apt->aptstudnum = $request->input('aptstudnum');
        $apt->aptdate = $request->input('aptdate');
        $apt->aptoffice = $request->input('aptoffice');
        $apt->aptpnumber = $request->input('aptpnumber');
        $apt->aptemail = $request->input('aptemail');
        $apt->apttime = $request->input('apttime');
        $apt->aptother = $request->input('aptother');

        // Handle file uploads (attachments)
        if ($request->hasFile('aptattach')) {
            $uploadedFiles = [];
            foreach ($request->file('aptattach') as $file) {
                $filePath = $file->store('appointments', 'public'); // Store in storage/app/public/appointments
                $uploadedFiles[] = $filePath;
            }
            $apt->aptattach = json_encode($uploadedFiles); // Store file paths as JSON in DB
        }

        try {
            $apt->save();

            return response()->json([
                'status' => 200,
                'message' => 'Successfully created appointment',
                'data' => $apt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => 'Failed to save appointment. Please ensure all fields are filled correctly.',
                'exception' => $e->getMessage(),
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

        // Decode JSON attachments for frontend
        $apt->aptattach = json_decode($apt->aptattach, true);

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
            'messages' => 'Successfully deleted appointment',
        ]);
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

        // Check if the appointment has already been rescheduled
        if ($apt->rescheduled) {
            return response()->json([
                'status' => 403,
                'message' => 'This appointment has already been rescheduled.',
            ], 403);
        }

        $apt->aptdate = $request->input('aptdate');
        $apt->apttime = $request->input('apttime');
        $apt->rescheduled = true; // Mark as rescheduled

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

    public function confirmAppointment($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        // Update status
        try {
            $appointment->aptstatus = 'confirmed';
            $appointment->save();
        } catch (\Exception $e) {

            return response()->json(['error' => 'Status update failed'], 500);
        }

        // Generate PDF with unique filename
        $pdfFileName = 'appointments/RTU-Appointment-' . $id . '-' . time() . '.pdf';

        try {
            // Ensure directory exists
            Storage::disk('public')->makeDirectory('appointments');

            $pdf = PDF::loadView('pdf.appointment', compact('appointment'));
            Storage::disk('public')->put($pdfFileName, $pdf->output());

            // Get absolute path for email attachment
            $pdfPath = storage_path('app/public/' . $pdfFileName);
        } catch (\Exception $e) {

            return response()->json(['error' => 'PDF generation failed'], 500);
        }

        // Send email
        try {
            Mail::to($appointment->aptemail)
                ->send(new ConfirmAppointment($appointment, $pdfPath));
        } catch (\Exception $e) {
            Storage::disk('public')->delete($pdfFileName);

            return response()->json([
                'error' => 'Email sending failed',
                'debug' => $e->getMessage() // Remove in production
            ], 500);
        }

        // Cleanup
        Storage::disk('public')->delete($pdfFileName);

        return response()->json(['success' => true]);
    }

    public function doneAppointment($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found.'], 404);
        }

        $appointment->aptstatus = 'done';
        $appointment->save();

        // Send done email
        Mail::to($appointment->aptemail)->send(new DoneAppointment($appointment));

        return response()->json(['success' => true, 'message' => 'Appointment marked as done and email sent.']);
    }

    public function cancelAppointment($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found.'], 404);
        }

        $appointment->aptstatus = 'cancelled';
        $appointment->save();

        // Send cancel email
        Mail::to($appointment->aptemail)->send(new CancelAppointment($appointment));

        return response()->json(['success' => true, 'message' => 'Appointment cancelled and email sent.']);
    }

    public function deleteAppointment($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found.'], 404);
        }

        // Delete stored files
        if ($appointment->aptattach) {
            $attachments = json_decode($appointment->aptattach, true);
            foreach ($attachments as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        $appointment->delete();

        return response()->json(['success' => true, 'message' => 'Appointment deleted.']);
    }
}
