<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteAsset extends Model
{
    public const GROUP_PRODUCT = 'product';

    public const GROUP_HOME = 'home';

    public const KEY_HOME_HERO = 'home_hero_image';

    public const KEY_LIST_HERO = 'product_list_hero_image';

    public const KEY_LIST_EMPTY = 'product_list_empty_image';

    public const KEY_DETAIL_FALLBACK = 'product_detail_fallback_image';

    public const KEY_DETAIL_CTA = 'product_detail_cta_image';

    protected $fillable = [
        'key',
        'group',
        'title',
        'image_path',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getUrlAttribute(): ?string
    {
        if (blank($this->image_path)) {
            return null;
        }

        return url(Storage::disk('public')->url($this->image_path));
    }
}
