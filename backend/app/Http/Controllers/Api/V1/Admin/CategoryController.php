<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\Admin\UpdateCategoryRequest;
use App\Http\Resources\Admin\AdminCategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => AdminCategoryResource::collection($categories),
        ]);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = filled($data['slug'] ?? null)
            ? $data['slug']
            : $this->uniqueSlug(Str::slug($data['name']));

        $category = Category::query()->create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        $category->loadCount('products');

        return response()->json([
            'message' => 'Đã tạo danh mục.',
            'data' => new AdminCategoryResource($category),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());
        $category->loadCount('products');

        return response()->json([
            'message' => 'Đã cập nhật danh mục.',
            'data' => new AdminCategoryResource($category),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa danh mục đang có sản phẩm.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Đã xóa danh mục.',
        ]);
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base;
        $counter = 1;

        while (Category::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
