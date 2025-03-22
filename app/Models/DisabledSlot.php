<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisabledSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'aptoffice',
        'aptbranch',
        'date',
        'time',
    ];
}
