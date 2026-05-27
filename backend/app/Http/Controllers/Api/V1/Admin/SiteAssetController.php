<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\UpdateSiteAssetRequest;
use App\Http\Resources\Admin\AdminSiteAssetResource;
use App\Models\SiteAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SiteAssetController extends Controller
{
    public function index(): JsonResponse
    {
        $assets = SiteAsset::query()
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => AdminSiteAssetResource::collection($assets),
        ]);
    }

    public function update(UpdateSiteAssetRequest $request, SiteAsset $siteAsset): JsonResponse
    {
        $data = $request->safe()->except(['image']);

        if ($request->hasFile('image')) {
            if ($siteAsset->image_path && Storage::disk('public')->exists($siteAsset->image_path)) {
                Storage::disk('public')->delete($siteAsset->image_path);
            }
            $data['image_path'] = $request->file('image')->store('site-assets', 'public');
        }

        $siteAsset->update($data);

        return response()->json([
            'message' => 'Đã cập nhật ảnh giao diện.',
            'data' => new AdminSiteAssetResource($siteAsset->fresh()),
        ]);
    }
}
