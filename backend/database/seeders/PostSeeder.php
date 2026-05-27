<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        Post::query()->updateOrCreate(
            ['slug' => 'gioi-thieu-thuong-hieu-ban-rem'],
            [
                'title' => 'Giới thiệu thương hiệu Bán Rèm',
                'excerpt' => 'Tìm hiểu về thương hiệu và dịch vụ rèm cửa chất lượng.',
                'content' => '<p>Chúng tôi chuyên cung cấp rèm cửa cho gia đình và văn phòng.</p>',
                'meta_title' => 'Giới thiệu thương hiệu Bán Rèm',
                'meta_description' => 'Thương hiệu rèm cửa uy tín tại Việt Nam.',
                'is_published' => true,
                'published_at' => now(),
            ],
        );
    }
}
