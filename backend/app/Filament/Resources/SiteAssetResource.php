<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiteAssetResource\Pages;
use App\Models\SiteAsset;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SiteAssetResource extends Resource
{
    protected static ?string $model = SiteAsset::class;

    protected static ?string $slug = 'site-assets';

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationGroup = 'Giao diện website';

    protected static ?string $navigationLabel = 'Ảnh giao diện trang';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'ảnh giao diện';

    protected static ?string $pluralModelLabel = 'Ảnh giao diện trang';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Thông tin ảnh')
                    ->schema([
                        Forms\Components\TextInput::make('key')
                            ->label('Key')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->disabled()
                            ->dehydrated(),
                        Forms\Components\TextInput::make('title')
                            ->label('Tiêu đề (admin)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('group')
                            ->label('Nhóm trang')
                            ->options([
                                SiteAsset::GROUP_PRODUCT => 'Trang sản phẩm (product)',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('description')
                            ->label('Ghi chú / mô tả')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('File ảnh')
                    ->description('Lưu tại storage/app/public/site-assets')
                    ->schema([
                        Forms\Components\FileUpload::make('image_path')
                            ->label('Upload ảnh')
                            ->image()
                            ->disk('public')
                            ->directory('site-assets')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Trạng thái')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Hiển thị trên website')
                            ->default(true),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Thứ tự')
                            ->numeric()
                            ->default(0)
                            ->minValue(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Ảnh')
                    ->disk('public')
                    ->height(56)
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->wrap(),
                Tables\Columns\TextColumn::make('key')
                    ->label('Key')
                    ->copyable()
                    ->searchable()
                    ->fontFamily('mono')
                    ->size('sm'),
                Tables\Columns\TextColumn::make('group')
                    ->label('Group')
                    ->badge(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Thứ tự')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('group')
                    ->options([SiteAsset::GROUP_PRODUCT => 'product']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->emptyStateHeading('Chưa có ảnh giao diện')
            ->emptyStateDescription('Chạy: php artisan db:seed --class=SiteAssetSeeder')
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSiteAssets::route('/'),
            'edit' => Pages\EditSiteAsset::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canViewAny(): bool
    {
        return auth()->check();
    }

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }
}
