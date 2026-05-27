# Bán Rèm — PR & Sales Web Application

Monorepo with Laravel 12 API + Filament admin + React public frontend.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12, MySQL, REST API |
| Admin | Filament 3 (`/admin`) |
| Auth (future) | Laravel Sanctum |
| Frontend | React, Vite, Tailwind CSS v4, Axios, React Router |

## Prerequisites

- PHP 8.2+
- Composer 2.x
- MySQL 8.x
- Node.js 20+ and npm

## Project structure

```
.
├── backend/     # Laravel API + Filament
├── frontend/    # React SPA
└── README.md
```

## Backend setup

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Create MySQL database:

```sql
CREATE DATABASE ban_rem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ban_rem
DB_USERNAME=root
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:8000
```

Run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### Default users (after seed)

| Role | Email | Password | Filament access |
|------|-------|----------|-----------------|
| admin | admin@banrem.test | password | Yes |
| staff | staff@banrem.test | password | Yes |

Admin panel URL: http://localhost:8000/admin

Only users with `role` of `admin` or `staff` can access Filament (`User::canAccessPanel()`).

Create another admin anytime:

```bash
php artisan make:filament-user
```

## Frontend setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Filament admin (Phase 2)

After `migrate:fresh --seed`, log in at http://localhost:8000/admin

| Menu group | Resources |
|------------|-----------|
| Sản phẩm | Danh mục, Sản phẩm (+ quản lý ảnh trên trang sửa sản phẩm) |
| Bán hàng | Đơn hàng (xem/sửa trạng thái, không tạo mới), Khách hàng tiềm năng |
| Nội dung | Bài viết / Tin tức |

**Dashboard widgets:** đơn chờ xử lý, lead mới, sản phẩm đang bán, đơn hôm nay, bảng đơn hàng gần đây.

**Product images:** tab *Hình ảnh* khi sửa sản phẩm — upload vào `storage/app/public/products`.

## Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/site-assets?group=product` | Ảnh giao diện trang sản phẩm (theo key) |
| GET | `/api/v1/categories` | Active categories |
| GET | `/api/v1/products` | List (`search`, `category`, `page`) |
| GET | `/api/v1/products/featured` | Featured products |
| GET | `/api/v1/products/{slug}` | Product detail |
| GET | `/api/v1/posts` | Published posts |
| GET | `/api/v1/posts/{slug}` | Post detail |
| POST | `/api/v1/orders` | Submit order (throttled) |

Example:

```bash
curl http://localhost:8000/api/v1/health
```

## Development commands

**Backend**

```bash
cd backend
php artisan serve
php artisan migrate:fresh --seed
```

**Frontend**

```bash
cd frontend
npm run dev
npm run build
```

## Phase status

- [x] Phase 0 — Bootstrap (Laravel, Filament, Sanctum config, API base, React scaffold)
- [x] Phase 1 — Database models, migrations, seeders (roles, stock_quantity)
- [x] Phase 2 — Filament resources (categories, products, orders, leads, posts, dashboard widgets)
- [x] Phase 3–5 — Public API, React pages, order form, UI polish

## Notes

- No online payment, customer login, or cart in v1.
- Sanctum is installed for future API authentication; public routes remain open in MVP.
- Product images use `storage/app/public`; run `php artisan storage:link` before uploads.
- `products.stock_quantity` tracks simple inventory for MVP (`0` = out of stock).

## Setup checklist (test after changes)

```powershell
# 1. Backend install
cd backend
composer install
copy .env.example .env
php artisan key:generate

# 2. Migrate fresh + seed (requires MySQL database ban_rem)
php artisan migrate:fresh --seed
php artisan storage:link

# 3. Start API
php artisan serve

# 4. API health check (new terminal)
curl http://localhost:8000/api/v1/health

# 5. Run tests
php artisan test

# 6. Frontend install (new terminal)
cd ..\frontend
npm install
copy .env.example .env
npm run dev

# 7. Filament login — open in browser
# http://localhost:8000/admin
# admin@banrem.test / password
```
