<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmAppointment extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;  // Store the appointment data
    public $pdfUrl;       // Store the public PDF URL

    /**
     * Create a new message instance.
     */
    public function __construct($appointment, $pdfUrl)
    {
        $this->appointment = $appointment;
        $this->pdfUrl = $pdfUrl;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Appointment Confirmation')
            ->view('emails.confirm-appointment') // Blade email template
            ->with([
                'appointment' => $this->appointment,
                'pdfUrl' => $this->pdfUrl, // Pass public URL instead of file attachment
            ]);
    }
}
