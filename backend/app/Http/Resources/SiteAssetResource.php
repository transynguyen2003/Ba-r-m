<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SiteAsset */
class SiteAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'url' => $this->url,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}
