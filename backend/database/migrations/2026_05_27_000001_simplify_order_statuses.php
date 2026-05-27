<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('orders')
            ->whereIn('status', ['confirmed', 'processing'])
            ->update(['status' => 'pending']);
    }

    public function down(): void
    {
        // Không khôi phục trạng thái cũ.
    }
};
