<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    public $timestamps = false;
    protected $table = 'admins';
    protected $primaryKey = 'admid';
    protected $fillable = [
        'admuser',
        'admpass',
        'admname',
        'admempnum',
    ];
}
