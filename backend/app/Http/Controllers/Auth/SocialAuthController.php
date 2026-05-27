<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthTokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirect;

class SocialAuthController extends Controller
{
    public function __construct(private AuthTokenService $authTokens) {}

    public function redirect(string $provider): SymfonyRedirect
    {
        $this->assertProvider($provider);
        $this->assertProviderConfigured($provider);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $this->assertProvider($provider);

        try {
            $this->assertProviderConfigured($provider);
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Throwable $e) {
            return redirect($this->authTokens->frontendErrorUrl('Đăng nhập mạng xã hội thất bại.'));
        }

        $user = $this->findOrCreateSocialUser($provider, $socialUser);

        return redirect($this->authTokens->frontendCallbackUrl($user));
    }

    private function findOrCreateSocialUser(string $provider, $socialUser): User
    {
        $idColumn = $provider === 'google' ? 'google_id' : 'facebook_id';
        $providerId = $socialUser->getId();

        $user = User::query()->where($idColumn, $providerId)->first();

        if (! $user && $socialUser->getEmail()) {
            $user = User::query()->where('email', $socialUser->getEmail())->first();
        }

        if ($user) {
            $user->update([
                $idColumn => $providerId,
                'avatar' => $socialUser->getAvatar() ?? $user->avatar,
                'name' => $user->name ?: ($socialUser->getName() ?? 'User'),
            ]);

            return $user;
        }

        return User::query()->create([
            'name' => $socialUser->getName() ?? 'User',
            'email' => $socialUser->getEmail() ?? "{$providerId}@{$provider}.local",
            'password' => Hash::make(Str::random(32)),
            'role' => UserRole::Customer,
            $idColumn => $providerId,
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(),
        ]);
    }

    private function assertProvider(string $provider): void
    {
        if (! in_array($provider, ['google', 'facebook'], true)) {
            abort(404);
        }
    }

    private function assertProviderConfigured(string $provider): void
    {
        $config = config("services.{$provider}");

        if (empty($config['client_id']) || empty($config['client_secret'])) {
            abort(503, "OAuth {$provider} chưa được cấu hình.");
        }
    }
}
