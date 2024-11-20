<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purpose extends Model
{
    use HasFactory;
    protected $fillable = ['purpose'];
    public function office()
    {
        // Trying out debugged GitHub warning
        return $this->belongsTo(Office::class, 'office_id', 'offid');
    }
}
