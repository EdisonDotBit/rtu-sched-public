<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendVerificationPin extends Mailable
{
    use Queueable, SerializesModels;

    public $pin; // Store the PIN

    /**
     * Create a new message instance.
     */
    public function __construct($pin)
    {
        $this->pin = $pin;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Your Verification PIN')
            ->view('emails.verification_pin') // Blade email template
            ->with([
                'pin' => $this->pin, // Pass the PIN variable to the template
            ]);
    }
}
