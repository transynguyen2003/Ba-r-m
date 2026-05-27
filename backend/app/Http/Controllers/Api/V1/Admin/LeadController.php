<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminLeadResource;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;

class LeadController extends Controller
{
    public function index(): JsonResponse
    {
        $leads = Lead::query()
            ->latest()
            ->paginate(20);

        return AdminLeadResource::collection($leads)->response();
    }
}
