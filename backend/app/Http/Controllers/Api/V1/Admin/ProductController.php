<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreProductRequest;
use App\Http\Requests\Api\Admin\UpdateProductRequest;
use App\Http\Resources\Admin\AdminProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);

        $products = Product::query()
            ->with(['category', 'images'])
            ->applyProductFilters($request)
            ->paginate($perPage);

        return AdminProductResource::collection($products)->response();
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = filled($data['slug'] ?? null)
            ? $data['slug']
            : $this->uniqueSlug(Str::slug($data['name']));

        $product = Product::query()->create([
            ...$data,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        $product->load(['category', 'images']);

        return response()->json([
            'message' => 'Đã tạo sản phẩm.',
            'data' => new AdminProductResource($product),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'images' => fn ($q) => $q->orderBy('sort_order')]);

        return response()->json([
            'data' => new AdminProductResource($product),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        $product->load(['category', 'images' => fn ($q) => $q->orderBy('sort_order')]);

        return response()->json([
            'message' => 'Đã cập nhật sản phẩm.',
            'data' => new AdminProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        foreach ($product->images as $image) {
            $image->delete();
        }

        $product->delete();

        return response()->json([
            'message' => 'Đã xóa sản phẩm.',
        ]);
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base;
        $counter = 1;

        while (Product::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
