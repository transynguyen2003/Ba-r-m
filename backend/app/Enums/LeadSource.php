<?php

namespace App\Enums;

enum LeadSource: string
{
    case OrderForm = 'order_form';
    case ContactPage = 'contact_page';
}
