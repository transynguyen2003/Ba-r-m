<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreProductImageRequest;
use App\Http\Requests\Api\Admin\UpdateProductImageRequest;
use App\Http\Resources\Admin\AdminProductImageResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function store(StoreProductImageRequest $request, Product $product): JsonResponse
    {
        $path = $request->file('image')->store('products', 'public');

        $payload = [
            'path' => $path,
            'is_primary' => $request->boolean('is_primary', ! $product->images()->exists()),
            'sort_order' => $request->input('sort_order', (int) $product->images()->max('sort_order') + 1),
        ];

        if ($this->hasProductImageColumn('alt_text')) {
            $payload['alt_text'] = $request->input('alt_text');
        }

        if ($this->hasProductImageColumn('caption')) {
            $payload['caption'] = $request->input('caption');
        }

        $image = $product->images()->create($payload);

        return response()->json([
            'message' => 'Đã thêm ảnh.',
            'data' => new AdminProductImageResource($image),
        ], 201);
    }

    public function update(UpdateProductImageRequest $request, ProductImage $productImage): JsonResponse
    {
        $data = $request->safe()->except(['image']);

        if (! $this->hasProductImageColumn('alt_text')) {
            unset($data['alt_text']);
        }

        if (! $this->hasProductImageColumn('caption')) {
            unset($data['caption']);
        }

        if ($request->hasFile('image')) {
            if ($productImage->path && Storage::disk('public')->exists($productImage->path)) {
                Storage::disk('public')->delete($productImage->path);
            }
            $data['path'] = $request->file('image')->store('products', 'public');
        }

        $productImage->update($data);

        return response()->json([
            'message' => 'Đã cập nhật ảnh.',
            'data' => new AdminProductImageResource($productImage->fresh()),
        ]);
    }

    public function destroy(ProductImage $productImage): JsonResponse
    {
        $productImage->delete();

        return response()->json([
            'message' => 'Đã xóa ảnh.',
        ]);
    }

    private function hasProductImageColumn(string $column): bool
    {
        static $cache = [];

        if (array_key_exists($column, $cache)) {
            return $cache[$column];
        }

        $cache[$column] = Schema::hasColumn('product_images', $column);

        return $cache[$column];
    }
}
