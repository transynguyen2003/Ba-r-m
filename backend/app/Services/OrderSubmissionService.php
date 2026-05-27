<?php

namespace App\Services;

use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSubmissionService
{
    /** @param array<string, mixed> $data */
    public function submit(array $data): Order
    {
        return DB::transaction(function () use ($data): Order {
            $product = Product::query()
                ->where('slug', $data['product_slug'])
                ->where('is_active', true)
                ->firstOrFail();

            $quantity = (int) $data['quantity'];
            $subtotal = $product->price * $quantity;

            $customer = Customer::query()->updateOrCreate(
                ['phone' => $data['phone']],
                [
                    'name' => $data['customer_name'],
                    'email' => $data['email'] ?? null,
                    'address' => $data['address'] ?? null,
                ],
            );

            $order = Order::query()->create([
                'order_code' => $this->generateOrderCode(),
                'customer_id' => $customer->id,
                'status' => OrderStatus::Pending,
                'notes' => $data['notes'] ?? null,
                'total_amount' => $subtotal,
            ]);

            OrderItem::query()->create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $product->price,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ]);

            Lead::query()->create([
                'order_id' => $order->id,
                'name' => $data['customer_name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'source' => LeadSource::OrderForm,
                'status' => LeadStatus::New,
                'message' => $data['notes'] ?? null,
            ]);

            return $order->load(['customer', 'items']);
        });
    }

    protected function generateOrderCode(): string
    {
        $prefix = 'ORD-'.now()->format('Ymd');

        do {
            $code = $prefix.'-'.Str::upper(Str::random(4));
        } while (Order::query()->where('order_code', $code)->exists());

        return $code;
    }
}
