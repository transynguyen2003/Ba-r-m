<?php

namespace App\Filament\Widgets;

use App\Enums\LeadStatus;
use App\Enums\OrderStatus;
use App\Models\Lead;
use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $pendingOrders = Order::query()->where('status', OrderStatus::Pending)->count();
        $newLeads = Lead::query()->where('status', LeadStatus::New)->count();
        $activeProducts = Product::query()->where('is_active', true)->count();
        $ordersToday = Order::query()->whereDate('created_at', today())->count();

        return [
            Stat::make('Đơn chờ xử lý', (string) $pendingOrders)
                ->description('Trạng thái: chờ xử lý')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning')
                ->icon('heroicon-o-shopping-cart'),
            Stat::make('Lead mới', (string) $newLeads)
                ->description('Chưa liên hệ')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('info')
                ->icon('heroicon-o-user-group'),
            Stat::make('Sản phẩm đang bán', (string) $activeProducts)
                ->description('Đang hiển thị')
                ->color('success')
                ->icon('heroicon-o-shopping-bag'),
            Stat::make('Đơn hôm nay', (string) $ordersToday)
                ->description(today()->format('d/m/Y'))
                ->color('primary')
                ->icon('heroicon-o-calendar-days'),
        ];
    }
}
