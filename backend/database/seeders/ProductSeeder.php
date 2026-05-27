<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::query()->where('slug', 'rem-vai')->first();

        if (! $category) {
            return;
        }

        $product = Product::query()->updateOrCreate(
            ['slug' => 'rem-vai-trang'],
            [
                'category_id' => $category->id,
                'name' => 'Rèm vải trắng',
                'description' => 'Rèm vải trắng cao cấp, phù hợp phòng khách và phòng ngủ.',
                'price' => 1500000,
                'stock_quantity' => 50,
                'is_featured' => true,
                'is_active' => true,
            ],
        );

        ProductImage::query()->updateOrCreate(
            [
                'product_id' => $product->id,
                'path' => 'products/placeholder.jpg',
            ],
            [
                'is_primary' => true,
                'sort_order' => 0,
            ],
        );
    }
}
