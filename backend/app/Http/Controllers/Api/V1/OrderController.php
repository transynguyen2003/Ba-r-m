<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderRequest;
use App\Services\OrderSubmissionService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        protected OrderSubmissionService $orderSubmissionService,
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderSubmissionService->submit($request->validated());

        return response()->json([
            'message' => 'Đơn hàng đã được gửi thành công.',
            'data' => [
                'order_code' => $order->order_code,
                'status' => $order->status->value,
                'total_amount' => $order->total_amount,
            ],
        ], 201);
    }
}
