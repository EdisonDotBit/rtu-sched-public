<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ConfirmAppointment extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $pdfPath;

    public function __construct($appointment, $pdfPath)
    {
        $this->appointment = $appointment;
        $this->pdfPath = $pdfPath;
    }

    public function build()
    {
        return $this->subject('Appointment Confirmation - ' . $this->appointment->aptid)
            ->view('emails.confirm-appointment')
            ->attach($this->pdfPath, [
                'as' => 'Appointment_Receipt.pdf',
                'mime' => 'application/pdf',
            ]);
    }
}
