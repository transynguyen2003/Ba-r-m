<?php

namespace Tests\Feature\Filament;

use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PanelAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_filament_panel(): void
    {
        $user = User::factory()->admin()->create();

        $this->assertTrue($user->canAccessPanel(Filament::getPanel('admin')));
    }

    public function test_staff_can_access_filament_panel(): void
    {
        $user = User::factory()->staff()->create();

        $this->assertTrue($user->canAccessPanel(Filament::getPanel('admin')));
    }
}
