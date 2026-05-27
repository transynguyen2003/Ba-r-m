<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int) $request->input('per_page', 12), 1), 48);

        $products = Product::query()
            ->with(['category', 'images'])
            ->applyProductFilters($request, activeOnly: true)
            ->paginate($perPage);

        return ProductResource::collection($products);
    }

    public function priceRange(): JsonResponse
    {
        $query = Product::query()->where('is_active', true);

        return response()->json([
            'data' => [
                'min' => (float) ($query->min('price') ?? 0),
                'max' => (float) ($query->max('price') ?? 0),
            ],
        ]);
    }

    public function featured(): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    public function show(string $slug): ProductDetailResource
    {
        $product = Product::query()
            ->with(['category', 'images'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return new ProductDetailResource($product);
    }
}
