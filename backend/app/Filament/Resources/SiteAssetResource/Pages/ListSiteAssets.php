<?php

namespace App\Filament\Resources\SiteAssetResource\Pages;

use App\Filament\Resources\SiteAssetResource;
use Filament\Resources\Pages\ListRecords;

class ListSiteAssets extends ListRecords
{
    protected static string $resource = SiteAssetResource::class;

    protected ?string $heading = 'Ảnh giao diện trang';

    protected ?string $subheading = 'Quản lý banner, ảnh trống, fallback và CTA trên trang Sản phẩm (React).';

    protected function getHeaderActions(): array
    {
        return [];
    }
}
