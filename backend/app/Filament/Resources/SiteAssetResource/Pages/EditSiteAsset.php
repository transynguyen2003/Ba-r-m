<?php

namespace App\Filament\Resources\SiteAssetResource\Pages;

use App\Filament\Resources\SiteAssetResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditSiteAsset extends EditRecord
{
    protected static string $resource = SiteAssetResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $oldPath = $this->record->image_path;

        if (
            $oldPath
            && isset($data['image_path'])
            && $data['image_path'] !== $oldPath
            && Storage::disk('public')->exists($oldPath)
        ) {
            Storage::disk('public')->delete($oldPath);
        }

        return $data;
    }
}
