<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Product */
class AdminProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $primary = $this->primaryImage();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'thumbnail_url' => $primary ? url(Storage::disk('public')->url($primary->path)) : null,
            'images' => AdminProductImageResource::collection($this->whenLoaded('images')),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
