<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Rèm vải', 'slug' => 'rem-vai', 'sort_order' => 1],
            ['name' => 'Rèm cuốn', 'slug' => 'rem-cuon', 'sort_order' => 2],
            ['name' => 'Rèm gỗ', 'slug' => 'rem-go', 'sort_order' => 3],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'is_active' => true,
                    'sort_order' => $category['sort_order'],
                ],
            );
        }
    }
}
