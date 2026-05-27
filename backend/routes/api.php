<?php

use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\LeadController as AdminLeadController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController;
use App\Http\Controllers\Api\V1\Admin\SiteAssetController as AdminSiteAssetController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\SiteAssetController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class);

    Route::get('/site-assets', [SiteAssetController::class, 'index']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/price-range', [ProductController::class, 'priceRange']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);

    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,1');

    Route::get('/auth/providers', [AuthController::class, 'providers']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware('admin')->prefix('admin')->group(function (): void {
            Route::get('/dashboard', [DashboardController::class, 'index']);

            Route::get('/products', [AdminProductController::class, 'index']);
            Route::post('/products', [AdminProductController::class, 'store']);
            Route::get('/products/{product}', [AdminProductController::class, 'show']);
            Route::put('/products/{product}', [AdminProductController::class, 'update']);
            Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
            Route::post('/products/{product}/images', [ProductImageController::class, 'store']);

            Route::put('/product-images/{productImage}', [ProductImageController::class, 'update']);
            Route::delete('/product-images/{productImage}', [ProductImageController::class, 'destroy']);

            Route::get('/site-assets', [AdminSiteAssetController::class, 'index']);
            Route::put('/site-assets/{siteAsset}', [AdminSiteAssetController::class, 'update']);
            Route::post('/site-assets/{siteAsset}', [AdminSiteAssetController::class, 'update']);

            Route::get('/categories', [AdminCategoryController::class, 'index']);
            Route::post('/categories', [AdminCategoryController::class, 'store']);
            Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
            Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::patch('/orders/{order}', [AdminOrderController::class, 'update']);
            Route::get('/leads', [AdminLeadController::class, 'index']);
        });
    });
});
