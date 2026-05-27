<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'staff@banrem.test'],
            [
                'name' => 'Staff',
                'password' => Hash::make('password'),
                'role' => UserRole::Staff,
            ],
        );
    }
}
