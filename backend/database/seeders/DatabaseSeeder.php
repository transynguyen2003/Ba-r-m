<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            StaffUserSeeder::class,
            CategorySeeder::class,
            SiteAssetSeeder::class,
            ProductSeeder::class,
            PostSeeder::class,
            SampleOrderSeeder::class,
        ]);
    }
}
