<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use App\Models\ProductImage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $title = 'Hình ảnh sản phẩm';

    protected static ?string $modelLabel = 'hình ảnh';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('File ảnh')
                    ->description('Upload ảnh vào thư mục products (disk public).')
                    ->schema([
                        Forms\Components\FileUpload::make('path')
                            ->label('Ảnh')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Ảnh đại diện / ảnh chính')
                    ->description('Mỗi sản phẩm chỉ có một ảnh chính. Ảnh chính dùng làm thumbnail trên danh sách.')
                    ->schema([
                        Forms\Components\Toggle::make('is_primary')
                            ->label('Đặt làm ảnh chính (ảnh đại diện)')
                            ->helperText('Khi bật, các ảnh chính khác của sản phẩm sẽ tự tắt.'),
                    ]),

                Forms\Components\Section::make('Ảnh gallery / chi tiết')
                    ->description('Thông tin bổ sung cho gallery trên trang chi tiết sản phẩm.')
                    ->schema([
                        Forms\Components\TextInput::make('alt_text')
                            ->label('Mô tả ảnh (alt)')
                            ->maxLength(255)
                            ->placeholder('Ví dụ: Rèm vải trắng phòng khách'),
                        Forms\Components\TextInput::make('caption')
                            ->label('Chú thích')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Thứ tự hiển thị')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Số nhỏ hiển thị trước trong gallery.'),
                    ])->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('path')
            ->columns([
                Tables\Columns\ImageColumn::make('path')
                    ->label('Ảnh')
                    ->disk('public'),
                Tables\Columns\IconColumn::make('is_primary')
                    ->label('Ảnh chính')
                    ->boolean(),
                Tables\Columns\TextColumn::make('alt_text')
                    ->label('Alt')
                    ->limit(30)
                    ->toggleable(),
                Tables\Columns\TextColumn::make('caption')
                    ->label('Chú thích')
                    ->limit(30)
                    ->toggleable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Thứ tự')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Thêm ảnh')
                    ->after(function (ProductImage $record): void {
                        if (! $record->product->images()->where('is_primary', true)->whereKeyNot($record->id)->exists()) {
                            $record->update(['is_primary' => true]);
                        }
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('Chưa có hình ảnh')
            ->emptyStateDescription('Thêm ảnh chính và ảnh gallery cho sản phẩm này.');
    }
}
