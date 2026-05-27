<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthTokenService
{
    public function issueTokenResponse(User $user, string $message = 'Đăng nhập thành công.', int $status = 200): JsonResponse
    {
        $user->tokens()->where('name', 'api')->delete();

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => $message,
            'token' => $token,
            'user' => new UserResource($user),
        ], $status);
    }

    public function frontendCallbackUrl(User $user): string
    {
        $user->tokens()->where('name', 'api')->delete();
        $token = $user->createToken('api')->plainTextToken;

        $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');

        return $frontend.'/auth/callback?token='.urlencode($token);
    }

    public function frontendErrorUrl(string $message): string
    {
        $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');

        return $frontend.'/auth/callback?error='.urlencode($message);
    }

    public static function isAdminRole(UserRole $role): bool
    {
        return $role === UserRole::Admin;
    }
}
