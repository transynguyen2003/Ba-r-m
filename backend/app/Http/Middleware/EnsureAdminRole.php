<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== UserRole::Admin) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập khu vực quản trị.',
            ], 403);
        }

        return $next($request);
    }
}
