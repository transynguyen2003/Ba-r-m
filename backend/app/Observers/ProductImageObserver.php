<?php

namespace App\Observers;

use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class ProductImageObserver
{
    public function saved(ProductImage $image): void
    {
        if ($image->is_primary) {
            $image->product
                ->images()
                ->whereKeyNot($image->id)
                ->update(['is_primary' => false]);
        }
    }

    public function deleted(ProductImage $image): void
    {
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        if ($image->is_primary) {
            $image->product
                ->images()
                ->orderBy('sort_order')
                ->first()
                ?->update(['is_primary' => true]);
        }
    }
}
