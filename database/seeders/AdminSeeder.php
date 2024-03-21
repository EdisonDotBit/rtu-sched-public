<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            'admuser' => 'admin',
            'admpass' => 'bakalako', // You may hash the password here
            'admname' => 'Administrator',
            'admempnum' => 'superadmin',
        ]);
    }
}
