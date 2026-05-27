<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminLeadResource;
use App\Http\Resources\Admin\AdminOrderResource;
use App\Models\Category;
use App\Models\Lead;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'stats' => [
                    'products' => Product::query()->count(),
                    'categories' => Category::query()->count(),
                    'orders' => Order::query()->count(),
                    'leads' => Lead::query()->count(),
                ],
                'recent_orders' => AdminOrderResource::collection(
                    Order::query()
                        ->with('customer')
                        ->latest()
                        ->limit(8)
                        ->get(),
                ),
                'recent_leads' => AdminLeadResource::collection(
                    Lead::query()
                        ->latest()
                        ->limit(8)
                        ->get(),
                ),
            ],
        ]);
    }
}
