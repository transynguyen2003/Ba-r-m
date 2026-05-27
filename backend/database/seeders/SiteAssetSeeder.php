<?php

namespace Database\Seeders;

use App\Models\SiteAsset;
use Illuminate\Database\Seeder;

class SiteAssetSeeder extends Seeder
{
    public function run(): void
    {
        $assets = [
            [
                'key' => SiteAsset::KEY_HOME_HERO,
                'group' => SiteAsset::GROUP_HOME,
                'title' => 'Rèm cửa đẹp cho không gian sống hiện đại',
                'description' => 'Tư vấn, thi công và cung cấp rèm vải, rèm cuốn, rèm gỗ chất lượng cao.',
                'sort_order' => 0,
            ],
            [
                'key' => SiteAsset::KEY_LIST_HERO,
                'group' => SiteAsset::GROUP_PRODUCT,
                'title' => 'Banner đầu trang danh sách sản phẩm',
                'description' => 'Ảnh hero trên /products',
                'sort_order' => 1,
            ],
            [
                'key' => SiteAsset::KEY_LIST_EMPTY,
                'title' => 'Ảnh khi không có sản phẩm',
                'description' => 'Hiển thị khi danh sách trống',
                'sort_order' => 2,
            ],
            [
                'key' => SiteAsset::KEY_DETAIL_FALLBACK,
                'title' => 'Ảnh mặc định chi tiết sản phẩm',
                'description' => 'Dùng khi sản phẩm chưa có ảnh',
                'sort_order' => 3,
            ],
            [
                'key' => SiteAsset::KEY_DETAIL_CTA,
                'title' => 'Ảnh khu vực tư vấn / đặt rèm',
                'description' => 'CTA trên trang chi tiết sản phẩm',
                'sort_order' => 4,
            ],
        ];

        foreach ($assets as $asset) {
            SiteAsset::query()->updateOrCreate(
                ['key' => $asset['key']],
                [
                    'group' => $asset['group'] ?? SiteAsset::GROUP_PRODUCT,
                    'title' => $asset['title'],
                    'description' => $asset['description'],
                    'image_path' => null,
                    'is_active' => true,
                    'sort_order' => $asset['sort_order'],
                ],
            );
        }
    }
}
