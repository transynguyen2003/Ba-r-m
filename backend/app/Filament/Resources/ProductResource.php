<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers\ImagesRelationManager;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Sản phẩm';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'sản phẩm';

    protected static ?string $pluralModelLabel = 'Sản phẩm';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Thông tin cơ bản')->schema([
                    Forms\Components\Select::make('category_id')
                        ->label('Danh mục')
                        ->relationship('category', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),
                    Forms\Components\TextInput::make('name')
                        ->label('Tên sản phẩm')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(function (?string $state, Forms\Set $set, Forms\Get $get): void {
                            if (blank($get('slug'))) {
                                $set('slug', Str::slug($state ?? ''));
                            }
                        })
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true)
                        ->columnSpanFull(),
                    Forms\Components\Textarea::make('description')
                        ->label('Mô tả')
                        ->rows(5)
                        ->columnSpanFull(),
                ])->columns(2),

                Forms\Components\Section::make('Giá & tồn kho')->schema([
                    Forms\Components\TextInput::make('price')
                        ->label('Giá (VNĐ)')
                        ->required()
                        ->numeric()
                        ->minValue(0)
                        ->prefix('₫'),
                    Forms\Components\TextInput::make('stock_quantity')
                        ->label('Tồn kho')
                        ->required()
                        ->numeric()
                        ->minValue(0)
                        ->default(0),
                    Forms\Components\Toggle::make('is_featured')
                        ->label('Nổi bật'),
                    Forms\Components\Toggle::make('is_active')
                        ->label('Hiển thị')
                        ->default(true),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('primary_image.path')
                    ->label('Ảnh')
                    ->disk('public')
                    ->getStateUsing(fn (Product $record): ?string => $record->primaryImage()?->path),
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Danh mục')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND', locale: 'vi')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stock_quantity')
                    ->label('Tồn kho')
                    ->sortable()
                    ->color(fn (Product $record): string => $record->isInStock() ? 'success' : 'danger'),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Nổi bật')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Hiển thị')
                    ->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Cập nhật')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('updated_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Danh mục')
                    ->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Nổi bật'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Hiển thị'),
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

    public static function getRelations(): array
    {
        return [
            ImagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
