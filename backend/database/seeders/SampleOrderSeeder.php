<?php

namespace Database\Seeders;

use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;

class SampleOrderSeeder extends Seeder
{
    public function run(): void
    {
        $product = Product::query()->where('slug', 'rem-vai-trang')->first();

        if (! $product) {
            return;
        }

        $customer = Customer::query()->updateOrCreate(
            ['phone' => '0901234567'],
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'khachhang@example.com',
                'address' => '123 Đường ABC, Quận 1, TP.HCM',
            ],
        );

        $quantity = 2;
        $subtotal = $product->price * $quantity;

        $order = Order::query()->updateOrCreate(
            ['order_code' => 'ORD-20260526-0001'],
            [
                'customer_id' => $customer->id,
                'status' => OrderStatus::Pending,
                'notes' => 'Giao cuối tuần',
                'total_amount' => $subtotal,
            ],
        );

        OrderItem::query()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $product->price,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ],
        );

        Lead::query()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'source' => LeadSource::OrderForm,
                'status' => LeadStatus::New,
                'message' => $order->notes,
            ],
        );
    }
}
