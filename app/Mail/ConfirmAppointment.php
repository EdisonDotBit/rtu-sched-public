<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmAppointment extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment; // Store the appointment data
    public $pdfFilePath; // Store the PDF file path

    /**
     * Create a new message instance.
     */
    public function __construct($appointment, $pdfFilePath)
    {
        $this->appointment = $appointment;
        $this->pdfFilePath = $pdfFilePath;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Appointment Confirmation')
            ->view('emails.confirm-appointment') // Blade email template
            // Attach the PDF file
            ->attach($this->pdfFilePath, [
                'as' => 'RTU-Appointment-Receipt.pdf',
                'mime' => 'application/pdf',
            ])
            ->with([
                'appointment' => $this->appointment, // Pass the appointment data to the template
            ]);
    }
}
