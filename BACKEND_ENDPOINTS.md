# Backend API Analysis

## Base configuration
- API base path: `/api/v1`
- CORS: enabled via `cors()` (all origins allowed)
- JSON body parser: enabled
- Static assets served from `public` directory
- Required env vars:
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`

## Authentication
- Endpoint: `POST /api/v1/auth/login`
- Request body:
  - `email`: string
  - `password`: string
- Response body:
  - `admin`: admin object
- Authentication method: HttpOnly cookie named `access_token`
- Token expires in 15 minutes
- Auth middleware: verifies JWT from `req.cookies.access_token`, loads admin with permissions
- Role bypass: `SUPER_ADMIN` bypasses permission checks

- Logout endpoint: `POST /api/v1/auth/logout`
  - Clears the `access_token` cookie
  - Returns `{ message: 'Déconnecté' }`

- Current admin endpoint: `GET /api/v1/auth/me`
  - Protected route using cookie auth
  - Returns `{ admin }`

- CORS is configured with:
  - `origin: process.env.FRONTEND_URL`
  - `credentials: true`

- Required env vars now include:
  - `FRONTEND_URL`

## Public endpoints
### Categories
- `GET /api/v1/public/categories`
  - Returns all categories ordered by name asc
  - No auth required

### Articles
- `GET /api/v1/public/articles`
  - Supports query params:
    - `page` (default 1)
    - `limit` (default 10)
    - `search` (full-text-like filter on title and content)
    - `category` (filter by category slug)
  - Returns:
    - `data`: array of published articles
    - `meta`: { total, page, limit, totalPages }
  - No auth required

- `GET /api/v1/public/articles/:slug`
  - Returns a single published article by slug
  - Includes category and author fullname
  - Increments `views` on each fetch
  - No auth required

- `GET /api/v1/public/latest`
  - Returns latest 10 published articles ordered by `publishedAt desc`
  - No auth required

- `GET /api/v1/public/trending`
  - Returns top 10 published articles ordered by `views desc`
  - No auth required

- `GET /api/v1/public/related/:slug`
  - Finds the article by slug, then returns up to 4 other published articles in the same category
  - No auth required

## Admin / Protected endpoints
Note: all protected requests use HttpOnly cookie auth and do not require `Authorization` headers.

### Articles
- `POST /api/v1/articles/`
  - Permissions: `article:create`
  - Validation schema expects:
    - `title`: string, min 5
    - `excerpt`: string | optional
    - `content`: string, min 50
    - `featuredImage`: string | optional
    - `seoTitle`: string | optional
    - `seoDescription`: string | optional
    - `categoryId`: string
    - `tags`: string[] | optional
  - Response: created article with category and author fullname
  - Behavior notes:
    - `status` is created as `DRAFT`
    - `slug` is generated from title
    - `tags` are accepted by validation but currently not attached in service implementation

- `PATCH /api/v1/articles/:id/publish`
  - Permissions: `article:publish`
  - Publishes the article by setting `status = PUBLISHED` and `publishedAt = now()`
  - Response: updated article

### Categories
- `POST /api/v1/categories/`
  - Permissions: `category:create`
  - Request body:
    - `name`: string, min 2
    - `description`: string | optional
  - Response: created category with slug

- `GET /api/v1/categories/`
  - Authenticated only
  - Returns categories ordered by `createdAt desc`

- `PATCH /api/v1/categories/:id`
  - Permissions: `category:update`
  - Request body:
    - `name`: string
    - `description`: string | optional
  - Response: updated category

- `DELETE /api/v1/categories/:id`
  - Permissions: `category:delete`
  - Response: `{ message: 'Category deleted' }`

### Admins
- `POST /api/v1/admins/`
  - Permissions: `admin:create`
  - Request body:
    - `fullname`: string
    - `email`: string
    - `password`: string
  - Response: created admin

- `PATCH /api/v1/admins/:id/permissions`
  - Permissions: `admin:update`
  - Request body:
    - `permissions`: array of permission names or single string
  - Response: updated admin including permissions

### Media
- `GET /api/v1/media`
  - Permissions: `media:read`
  - Returns a list of media records with attached article relation
- `GET /api/v1/media/:id`
  - Permissions: `media:read`
  - Returns one media item by id
- `POST /api/v1/media/upload`
  - Permissions: `media:upload`
  - Multipart form-data: field name `image`
  - Returns: `{ url: '/uploads/articles/<filename>' }`
  - Allowed MIME types: jpeg, png, webp
  - Max file size: 5 MB
- `DELETE /api/v1/media/:id`
  - Permissions: `media:delete`
  - Deletes a media record

## Permission names
- `admin:create`
- `admin:update`
- `admin:delete`
- `article:create`
- `article:read`
- `article:update`
- `article:delete`
- `article:publish`
- `category:create`
- `category:update`
- `category:delete`
- `tag:create`
- `tag:read`
- `tag:update`
- `tag:delete`
- `media:upload`
- `media:read`
- `media:delete`

## Prisma data models
### Admin
- `id`, `fullname`, `email`, `password`, `avatar?`, `isActive`, `role`, `permissions[]`, `articles[]`, `createdAt`, `updatedAt`
- Role values: `SUPER_ADMIN`, `ADMIN`

### Permission
- `id`, `name`, `admins[]`, `createdAt`

### Category
- `id`, `name`, `slug`, `description?`, `articles[]`, `createdAt`

### Tag
- `id`, `name`, `slug`, `articles[]`, `createdAt`

### Article
- `id`, `title`, `slug`, `excerpt?`, `content`, `featuredImage?`, `seoTitle?`, `seoDescription?`, `status`, `views`, `scheduledFor?`, `publishedAt?`, `authorId`, `categoryId`, `tags[]`, `media[]`, `createdAt`, `updatedAt`
- Status values: `DRAFT`, `REVIEW`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`

### Media
- `id`, `url`, `type`, `articleId`, `createdAt`
- MediaType values: `IMAGE`, `VIDEO`

## RSS/Feed and Sitemap endpoints
All RSS, feed, and sitemap endpoints are **public** (no authentication required) and served at the root path:

- `GET /rss.xml`
  - Main RSS feed with latest 20 published articles
  - Content-Type: `application/rss+xml; charset=utf-8`
  - Cache-Control: `public, max-age=900` (15 minutes)
  - Returns RSS 2.0 format

- `GET /atom.xml`
  - Atom format feed with latest 20 published articles (compatible with Google News)
  - Content-Type: `application/atom+xml; charset=utf-8`
  - Cache-Control: `public, max-age=900` (15 minutes)
  - Returns Atom 1.0 format

- `GET /feed.json`
  - JSON Feed format with latest 20 published articles
  - Content-Type: `application/json; charset=utf-8`
  - Cache-Control: `public, max-age=900` (15 minutes)
  - Returns JSON Feed format

- `GET /rss/:categorySlug`
  - Per-category RSS feed with latest 20 published articles from specified category
  - Content-Type: `application/rss+xml; charset=utf-8`
  - Cache-Control: `public, max-age=900` (15 minutes)
  - Returns RSS 2.0 format
  - Returns 404 if category not found

- `GET /sitemap.xml`
  - XML sitemap for search engines
  - Content-Type: `application/xml; charset=utf-8`
  - Cache-Control: `public, max-age=3600` (1 hour)
  - Includes homepage, articles listing, all categories, and all published articles with last modification dates

## Environment variables
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (for Prisma migrations)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend base URL (required for article links in feeds)
- `BACKEND_URL` - Backend base URL (required for media absolute URLs)
- `JWT_ACCESS_SECRET` - Secret key for JWT token signing
3. There is no protected endpoint to list admins; only create admin and assign permissions.
4. Media now supports read/list, upload, and delete.
5. The upload URL is returned as `/uploads/articles/<filename>` and the backend now serves `/uploads` statically in `src/app.ts`.
6. The `POST /api/v1/public/articles` route is defined twice; the second definition with search/category filtering is the effective one.

## Recommended frontend design assumptions
- Backend host should be configurable; default to `http://localhost:4000` or the configured backend port.
- Use HttpOnly cookie auth for all protected admin requests.
- The backend sets the `access_token` cookie on login and sends it automatically with browser requests.
- Use `/api/v1/public/articles` for listing, searching, and filtering.
- Use `/api/v1/public/articles/:slug` for article detail pages and view count tracking.
- Use `/api/v1/media/upload` for image upload, then store `featuredImage` as the returned `url` on article create.
- Admin UI should include category CRUD and article creation/publishing flows first.

## Suggestions for the frontend builder AI
- Start by modeling the API with the routes above and the Prisma object shapes.
- Build public pages for:
  - Home article list with pagination and category filters
  - Article detail page by slug
  - Latest / Trending sections
  - Related articles by slug
- Build admin pages for:
  - Login
  - Category list/create/update/delete
  - Article creation form with image upload and publish button
  - Admin creation form only if admin user should manage team members
- Use API error handling for 401/403 and show appropriate flows.
- Make sure to fetch categories from both `public/categories` and protected `categories` if needed for admin forms.

---

_Last updated from source analysis of `src/` backend files._
