<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Lead */
class AdminLeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'source' => $this->source->value,
            'status' => $this->status->value,
            'message' => $this->message,
            'order_id' => $this->order_id,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
