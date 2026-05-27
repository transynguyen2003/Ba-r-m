<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteAssetResource;
use App\Models\SiteAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteAssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SiteAsset::query()->where('is_active', true);

        if ($request->filled('group')) {
            $query->where('group', $request->string('group')->toString());
        }

        $assets = $query->orderBy('sort_order')->get();

        $data = $assets->mapWithKeys(
            fn (SiteAsset $asset) => [$asset->key => (new SiteAssetResource($asset))->resolve()],
        );

        return response()->json(['data' => $data]);
    }
}
