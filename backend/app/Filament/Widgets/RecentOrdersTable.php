<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\OrderResource;
use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrdersTable extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Đơn hàng gần đây';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()
                    ->with('customer')
                    ->latest()
                    ->limit(5),
            )
            ->columns([
                Tables\Columns\TextColumn::make('order_code')
                    ->label('Mã đơn'),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Khách hàng'),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Tổng tiền')
                    ->money('VND', locale: 'vi'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->formatStateUsing(fn (OrderStatus $state): string => OrderResource::orderStatusOptions()[$state->value] ?? $state->value)
                    ->color(fn (OrderStatus $state): string => match ($state) {
                        OrderStatus::Pending => 'warning',
                        OrderStatus::Completed => 'success',
                        OrderStatus::Cancelled => 'danger',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đặt')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->paginated(false)
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('Xem')
                    ->url(fn (Order $record): string => OrderResource::getUrl('view', ['record' => $record])),
            ]);
    }
}
