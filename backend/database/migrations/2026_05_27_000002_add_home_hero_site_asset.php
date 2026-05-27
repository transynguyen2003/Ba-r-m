<?php

use App\Models\SiteAsset;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        SiteAsset::query()->updateOrCreate(
            ['key' => SiteAsset::KEY_HOME_HERO],
            [
                'group' => SiteAsset::GROUP_HOME,
                'title' => 'Rèm cửa đẹp cho không gian sống hiện đại',
                'description' => 'Tư vấn, thi công và cung cấp rèm vải, rèm cuốn, rèm gỗ chất lượng cao.',
                'image_path' => null,
                'is_active' => true,
                'sort_order' => 0,
            ],
        );
    }

    public function down(): void
    {
        SiteAsset::query()->where('key', SiteAsset::KEY_HOME_HERO)->delete();
    }
};
