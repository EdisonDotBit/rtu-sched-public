<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    public $timestamps = false;
    protected $table = 'appointments';
    protected $primaryKey = 'aptid';
    protected $fillable = [
        'apttype',
        'aptbranch',
        'aptoffice',
        'aptname',
        'aptpurpose',
        'aptstudnum',
        'aptdate',
        'aptpnumber',
    ];
}
