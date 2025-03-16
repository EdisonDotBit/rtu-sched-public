<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class DoneAppointment extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;

    public function __construct($appointment)
    {
        $this->appointment = $appointment;
    }

    public function build()
    {
        return $this->view('emails.done-appointment')
            ->subject('Appointment Completed');
    }
}
