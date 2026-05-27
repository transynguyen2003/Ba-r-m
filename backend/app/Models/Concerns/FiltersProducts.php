<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait FiltersProducts
{
    public function scopeApplyProductFilters(Builder $query, Request $request, bool $activeOnly = false): Builder
    {
        if ($activeOnly) {
            $query->where('is_active', true);
        }

        if ($request->filled('search')) {
            $terms = preg_split('/\s+/u', trim($request->string('search')->toString()), -1, PREG_SPLIT_NO_EMPTY);

            foreach ($terms as $term) {
                $like = '%'.$term.'%';
                $query->where(function (Builder $q) use ($like): void {
                    $q->where('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('slug', 'like', $like);
                });
            }
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn (Builder $q) => $q
                ->where('slug', $request->string('category')->toString())
                ->when($activeOnly, fn (Builder $cq) => $cq->where('is_active', true)));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('is_featured') && $request->input('is_featured') !== '') {
            $query->where('is_featured', filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $sort = $request->string('sort')->toString();

        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };

        return $query;
    }
}
