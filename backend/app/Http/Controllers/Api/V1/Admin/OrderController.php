<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\UpdateOrderRequest;
use App\Http\Resources\Admin\AdminOrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);

        $orders = Order::query()
            ->with('customer')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('date_from'), fn ($q) => $q->whereDate('created_at', '>=', $request->date('date_from')))
            ->when($request->filled('date_to'), fn ($q) => $q->whereDate('created_at', '<=', $request->date('date_to')))
            ->when($request->filled('search'), function ($q) use ($request): void {
                $raw = trim($request->string('search'));
                $term = '%'.addcslashes($raw, '%_\\').'%';

                $q->where(function ($sub) use ($term): void {
                    $sub->where('order_code', 'like', $term)
                        ->orWhere('notes', 'like', $term)
                        ->orWhereHas('customer', function ($customer) use ($term): void {
                            $customer->where('name', 'like', $term)
                                ->orWhere('phone', 'like', $term)
                                ->orWhere('email', 'like', $term)
                                ->orWhere('address', 'like', $term);
                        });
                });
            })
            ->latest()
            ->paginate($perPage);

        return AdminOrderResource::collection($orders)->response();
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $order->update($request->validated());
        $order->load('customer');

        return response()->json([
            'message' => 'Đã cập nhật trạng thái đơn hàng.',
            'data' => new AdminOrderResource($order),
        ]);
    }
}
