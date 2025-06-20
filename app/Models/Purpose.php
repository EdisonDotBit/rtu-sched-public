<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purpose extends Model
{
    use HasFactory;

    protected $fillable = [
        'office_id',
        'purpose',
        'instruction'
    ];

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id', 'offid');
    }
}
