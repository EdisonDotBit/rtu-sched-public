<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Log;
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

    // public function delapt($aptId)
    // {
    //     $apt = Appointment::find($aptId);
    //     $apt->delete();
    //     return response()->json([
    //         'status' => 200,
    //         'messages' => 'Successfully deleted appointment',
    //     ]);
    // }

    // public function uptodone($aptId)
    // {
    //     $apt = Appointment::find($aptId);
    //     $apt->aptstatus = 'done';
    //     try {
    //         $apt->save();
    //         return response()->json([
    //             'status' => 200,
    //             'messages' => 'Successfully updated appointment',
    //             'data' => $apt,
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => 400,
    //             'error' => 'Failed to update appointment',
    //         ], 400);
    //     }
    // }

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
        Log::info('Starting appointment confirmation process for ID: ' . $id);
        $appointment = Appointment::find($id);
        if (!$appointment) {
            Log::error('Appointment not found for ID: ' . $id);
            return response()->json(['error' => 'Appointment not found.'], 404);
        }

        // Update appointment status
        $appointment->aptstatus = 'confirmed';
        try {
            $appointment->save();
            Log::info('Appointment status saved as confirmed for ID: ' . $id);
        } catch (\Exception $e) {
            Log::error('Error saving appointment status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save appointment status.'], 500);
        }

        // Generate PDF using DomPDF with unique filename
        $pdfFileName = 'RTU-Appointment-Receipt-' . $id . '-' . time() . '.pdf';
        $pdfFilePath = storage_path('app/public/' . $pdfFileName);

        try {
            // Ensure directory exists
            if (!file_exists(dirname($pdfFilePath))) {
                mkdir(dirname($pdfFilePath), 0755, true);
            }

            $pdf = PDF::loadView('pdf.appointment', compact('appointment'));
            $pdf->save($pdfFilePath);

            // Verify PDF was created
            if (!file_exists($pdfFilePath)) {
                throw new \Exception('PDF file was not created');
            }
            Log::info('PDF generated successfully for appointment ID: ' . $id);
            Log::info('PDF generated at: ' . $pdfFilePath); // Add after successful PDF creation
        } catch (\Exception $e) {
            Log::error('Error generating PDF: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate PDF.'], 500);
        }

        // Send confirmation email with PDF attachment
        try {
            Log::info('Sending confirmation email to: ' . $appointment->aptemail);
            Mail::to($appointment->aptemail)
                ->send(new ConfirmAppointment($appointment, $pdfFilePath));
            Log::info('Confirmation email sent successfully to: ' . $appointment->aptemail);
        } catch (\Exception $e) {
            Log::error('Error sending confirmation email: ' . $e->getMessage());
            // Delete the PDF if email fails
            if (file_exists($pdfFilePath)) {
                unlink($pdfFilePath);
            }
            return response()->json(['error' => 'Failed to send confirmation email.'], 500);
        }

        // Clean up - delete the PDF after sending
        if (file_exists($pdfFilePath)) {
            unlink($pdfFilePath);
        }

        Log::info('Appointment confirmed and email sent for appointment ID: ' . $id);
        return response()->json(['success' => true, 'message' => 'Appointment confirmed and email sent.']);
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
