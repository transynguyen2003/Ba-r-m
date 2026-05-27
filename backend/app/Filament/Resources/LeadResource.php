<?php

namespace App\Filament\Resources;

use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use App\Filament\Resources\LeadResource\Pages;
use App\Models\Lead;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Bán hàng';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'lead';

    protected static ?string $pluralModelLabel = 'Khách hàng tiềm năng';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Họ tên')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('phone')
                        ->label('Số điện thoại')
                        ->tel()
                        ->required()
                        ->maxLength(20),
                    Forms\Components\TextInput::make('email')
                        ->label('Email')
                        ->email()
                        ->maxLength(255),
                    Forms\Components\Select::make('source')
                        ->label('Nguồn')
                        ->options(static::leadSourceOptions())
                        ->default(LeadSource::ContactPage->value)
                        ->required(),
                    Forms\Components\Select::make('status')
                        ->label('Trạng thái')
                        ->options(static::leadStatusOptions())
                        ->default(LeadStatus::New->value)
                        ->required(),
                    Forms\Components\Select::make('order_id')
                        ->label('Đơn hàng liên kết')
                        ->relationship('order', 'order_code')
                        ->searchable()
                        ->preload(),
                    Forms\Components\Textarea::make('message')
                        ->label('Tin nhắn / ghi chú')
                        ->rows(4)
                        ->columnSpanFull(),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Họ tên')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('SĐT')
                    ->searchable(),
                Tables\Columns\TextColumn::make('source')
                    ->label('Nguồn')
                    ->badge()
                    ->formatStateUsing(fn (LeadSource $state): string => static::leadSourceOptions()[$state->value] ?? $state->value),
                Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->formatStateUsing(fn (LeadStatus $state): string => static::leadStatusOptions()[$state->value] ?? $state->value)
                    ->color(fn (LeadStatus $state): string => match ($state) {
                        LeadStatus::New => 'warning',
                        LeadStatus::Contacted => 'info',
                        LeadStatus::Converted => 'success',
                        LeadStatus::Closed => 'gray',
                    }),
                Tables\Columns\TextColumn::make('order.order_code')
                    ->label('Mã đơn')
                    ->placeholder('—')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày tạo')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options(static::leadStatusOptions()),
                Tables\Filters\SelectFilter::make('source')
                    ->label('Nguồn')
                    ->options(static::leadSourceOptions()),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLeads::route('/'),
            'create' => Pages\CreateLead::route('/create'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }

    /** @return array<string, string> */
    public static function leadStatusOptions(): array
    {
        return [
            LeadStatus::New->value => 'Mới',
            LeadStatus::Contacted->value => 'Đã liên hệ',
            LeadStatus::Converted->value => 'Đã chuyển đổi',
            LeadStatus::Closed->value => 'Đã đóng',
        ];
    }

    /** @return array<string, string> */
    public static function leadSourceOptions(): array
    {
        return [
            LeadSource::OrderForm->value => 'Form đặt hàng',
            LeadSource::ContactPage->value => 'Trang liên hệ',
        ];
    }
}
