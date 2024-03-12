<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class Admin extends Authenticatable implements AuthenticatableContract
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
