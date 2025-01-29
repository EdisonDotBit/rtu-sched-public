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
            'admuser' => 'boniadmin',
            'admpass' => 'BONI$#@!1234',
            'admname' => 'Boni Super Admin',
            'admrole' => 'superadmin',
            'admbranch' => 'boni',
        ]);

        DB::table('admins')->insert([
            'admuser' => 'pasigadmin',
            'admpass' => 'PASIG$#@!1234',
            'admname' => 'Pasig Super Admin',
            'admrole' => 'superadmin',
            'admbranch' => 'pasig',
        ]);
    }
}
