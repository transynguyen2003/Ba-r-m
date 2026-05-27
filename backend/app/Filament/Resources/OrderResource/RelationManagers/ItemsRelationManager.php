<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    protected static ?string $title = 'Chi tiết sản phẩm';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product_name')
                    ->label('Sản phẩm'),
                Tables\Columns\TextColumn::make('unit_price')
                    ->label('Đơn giá')
                    ->money('VND', locale: 'vi'),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Số lượng'),
                Tables\Columns\TextColumn::make('subtotal')
                    ->label('Thành tiền')
                    ->money('VND', locale: 'vi'),
            ])
            ->paginated(false)
            ->headerActions([])
            ->actions([])
            ->bulkActions([]);
    }

    public function isReadOnly(): bool
    {
        return true;
    }
}
