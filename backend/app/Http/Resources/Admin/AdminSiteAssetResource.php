<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SiteAsset */
class AdminSiteAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'group' => $this->group,
            'title' => $this->title,
            'description' => $this->description,
            'image_path' => $this->image_path,
            'url' => $this->url,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
