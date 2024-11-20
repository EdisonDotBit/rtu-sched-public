<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    public $timestamps = false;
    protected $table = 'offices';
    protected $primaryKey = 'offid';

    public function purposes()
    {
        return $this->hasMany(Purpose::class, 'office_id', 'offid');
    }
}
