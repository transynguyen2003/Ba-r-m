<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Order */
class AdminOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'status' => $this->status->value,
            'total_amount' => $this->total_amount,
            'notes' => $this->notes,
            'customer' => $this->whenLoaded('customer', fn () => [
                'name' => $this->customer->name,
                'phone' => $this->customer->phone,
                'email' => $this->customer->email,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
