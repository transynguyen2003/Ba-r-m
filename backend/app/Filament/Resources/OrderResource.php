<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers\ItemsRelationManager;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationGroup = 'Bán hàng';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'đơn hàng';

    protected static ?string $pluralModelLabel = 'Đơn hàng';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Xử lý đơn hàng')->schema([
                    Forms\Components\TextInput::make('order_code')
                        ->label('Mã đơn')
                        ->disabled()
                        ->dehydrated(false),
                    Forms\Components\Select::make('status')
                        ->label('Trạng thái')
                        ->options(static::orderStatusOptions())
                        ->required(),
                    Forms\Components\Textarea::make('notes')
                        ->label('Ghi chú khách hàng')
                        ->rows(3)
                        ->columnSpanFull(),
                ])->columns(2),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Đơn hàng')->schema([
                    Infolists\Components\TextEntry::make('order_code')
                        ->label('Mã đơn'),
                    Infolists\Components\TextEntry::make('status')
                        ->label('Trạng thái')
                        ->badge()
                        ->formatStateUsing(fn (OrderStatus $state): string => static::orderStatusOptions()[$state->value] ?? $state->value)
                        ->color(fn (OrderStatus $state): string => match ($state) {
                            OrderStatus::Pending => 'warning',
                            OrderStatus::Completed => 'success',
                            OrderStatus::Cancelled => 'danger',
                        }),
                    Infolists\Components\TextEntry::make('total_amount')
                        ->label('Tổng tiền')
                        ->money('VND', locale: 'vi'),
                    Infolists\Components\TextEntry::make('created_at')
                        ->label('Ngày đặt')
                        ->dateTime('d/m/Y H:i'),
                    Infolists\Components\TextEntry::make('notes')
                        ->label('Ghi chú')
                        ->columnSpanFull()
                        ->placeholder('—'),
                ])->columns(2),

                Infolists\Components\Section::make('Khách hàng')->schema([
                    Infolists\Components\TextEntry::make('customer.name')
                        ->label('Họ tên'),
                    Infolists\Components\TextEntry::make('customer.phone')
                        ->label('Số điện thoại'),
                    Infolists\Components\TextEntry::make('customer.email')
                        ->label('Email')
                        ->placeholder('—'),
                    Infolists\Components\TextEntry::make('customer.address')
                        ->label('Địa chỉ')
                        ->columnSpanFull()
                        ->placeholder('—'),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_code')
                    ->label('Mã đơn')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Khách hàng')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer.phone')
                    ->label('SĐT')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Tổng tiền')
                    ->money('VND', locale: 'vi')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->formatStateUsing(fn (OrderStatus $state): string => static::orderStatusOptions()[$state->value] ?? $state->value)
                    ->color(fn (OrderStatus $state): string => match ($state) {
                        OrderStatus::Pending => 'warning',
                        OrderStatus::Completed => 'success',
                        OrderStatus::Cancelled => 'danger',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đặt')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options(static::orderStatusOptions()),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            ItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['customer', 'items']);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    /** @return array<string, string> */
    public static function orderStatusOptions(): array
    {
        return OrderStatus::options();
    }
}
