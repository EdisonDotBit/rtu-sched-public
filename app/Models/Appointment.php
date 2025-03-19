<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    public $timestamps = true;
    protected $table = 'appointments';
    protected $primaryKey = 'aptid';
    protected $fillable = [
        'aptid',
        'apttype',
        'aptname',
        'aptbranch',
        'aptpurpose',
        'aptstudnum',
        'aptdate',
        'aptoffice',
        'aptpnumber',
        'aptemail',
        'apttime',
        'aptattach',
        'aptother'
    ];

    protected $casts = [
        'aptattach' => 'array', // Ensure file paths are stored as JSON
    ];
}
