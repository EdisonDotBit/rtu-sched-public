<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentNumberVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pin;

    /**
     * Create a new message instance.
     */
    public function __construct($pin)
    {
        $this->pin = $pin;
    }

    public function build()
    {
        return $this->subject('Verify Your Student Number')
            ->view('emails.verify_student_pin')
            ->with('pin', $this->pin);
    }
}
