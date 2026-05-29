# 📋 Guide d'Intégration Frontend - Presse Républicaine Backend

**Date**: May 21, 2026  
**Backend Version**: 1.0  
**API Base URL**: `http://localhost:5000/api/v1` (development)

---

## 1️⃣ LISTE COMPLÈTE DES ENDPOINTS API

### 🔐 AUTHENTIFICATION (Sans protection requise pour login/logout)

#### `POST /auth/login`
**Description**: Authentifier un administrateur  
**Authentification**: Non requise  
**HTTP Method**: `POST`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "admin": {
    "id": "uuid",
    "fullname": "John Doe",
    "email": "admin@example.com",
    "avatar": "/uploads/avatar.jpg",
    "isActive": true,
    "role": "ADMIN" | "SUPER_ADMIN",
    "permissions": [
      {
        "id": "uuid",
        "name": "article:create"
      },
      {
        "id": "uuid",
        "name": "article:publish"
      }
    ],
    "createdAt": "2026-05-21T10:00:00Z",
    "updatedAt": "2026-05-21T10:00:00Z"
  }
}
```

**Response Error (401)**:
```json
{
  "message": "Invalid credentials"
}
```

**Détails du Cookie**:
- Nom: `access_token`
- Type: HttpOnly (non accessible via JavaScript)
- Durée: 15 minutes (900 secondes)
- Sécurité: 
  - `Secure: true` (en production)
  - `SameSite: strict`
  - `HttpOnly: true`

---

#### `POST /auth/logout`
**Description**: Déconnecter l'utilisateur  
**Authentification**: Requise (cookie)  
**HTTP Method**: `POST`

**Request Body**: aucun

**Response Success (200)**:
```json
{
  "message": "Déconnecté"
}
```

---

#### `GET /auth/me`
**Description**: Récupérer les informations du compte actuel  
**Authentification**: Requise (cookie)  
**HTTP Method**: `GET`  
**Middleware**: `authenticate`

**Response Success (200)**:
```json
{
  "admin": {
    "id": "uuid",
    "fullname": "John Doe",
    "email": "admin@example.com",
    "avatar": "/uploads/avatar.jpg",
    "isActive": true,
    "role": "ADMIN" | "SUPER_ADMIN",
    "permissions": [
      {
        "id": "uuid",
        "name": "article:create"
      }
    ],
    "createdAt": "2026-05-21T10:00:00Z",
    "updatedAt": "2026-05-21T10:00:00Z"
  }
}
```

**Response Error (401)**:
```json
{
  "message": "Unauthorized"
}
```

**Response Error (404)**:
```json
{
  "message": "Admin introuvable"
}
```

---

### 📰 ARTICLES (Route protégée: `/api/v1/articles/`)

#### `POST /articles/`
**Description**: Créer un nouvel article (brouillon)  
**Authentification**: Requise (cookie)  
**Permission**: `article:create`  
**HTTP Method**: `POST`

**Request Body**:
```json
{
  "title": "Mon Article",
  "excerpt": "Un résumé court",
  "content": "Contenu de l'article...",
  "featuredImage": "/uploads/articles/image.jpg",
  "seoTitle": "Titre SEO",
  "seoDescription": "Description SEO",
  "videoUrl": "https://youtube.com/watch?v=...",
  "categoryId": "uuid-category",
  "tags": ["uuid-tag1", "uuid-tag2"],
  "mediaIds": ["uuid-media1"]
}
```

**Validations**:
- `title`: String, min 5 caractères
- `excerpt`: String (optionnel)
- `content`: String, min 50 caractères
- `categoryId`: String (requis)
- `tags`: Array de strings (optionnel)
- `mediaIds`: Array de strings (optionnel)

**Response Success (201)**:
```json
{
  "id": "uuid",
  "title": "Mon Article",
  "slug": "mon-article",
  "excerpt": "Un résumé court",
  "content": "Contenu de l'article...",
  "featuredImage": "/uploads/articles/image.jpg",
  "seoTitle": "Titre SEO",
  "seoDescription": "Description SEO",
  "videoUrl": "https://youtube.com/watch?v=...",
  "status": "DRAFT",
  "views": 0,
  "scheduledFor": null,
  "publishedAt": null,
  "author": {
    "id": "uuid",
    "fullname": "John Doe"
  },
  "category": {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "description": "Articles sur la politique"
  },
  "tags": [
    {
      "articleId": "uuid",
      "tagId": "uuid",
      "tag": {
        "id": "uuid",
        "name": "Afrique",
        "slug": "afrique"
      }
    }
  ],
  "media": [
    {
      "id": "uuid",
      "url": "/uploads/articles/image.jpg",
      "type": "IMAGE"
    }
  ],
  "createdAt": "2026-05-21T10:00:00Z",
  "updatedAt": "2026-05-21T10:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "message": "Validation error or duplicate slug"
}
```

---

#### `GET /articles/`
**Description**: Lister les articles (tous les statuts)  
**Authentification**: Requise (cookie)  
**Permission**: `article:read`  
**HTTP Method**: `GET`

**Query Parameters**:
- `page`: Integer (default: 1)
- `limit`: Integer (default: 20)
- `status`: String enum (DRAFT | REVIEW | SCHEDULED | PUBLISHED | ARCHIVED) - optionnel

**Example**: `GET /articles?page=2&limit=10&status=PUBLISHED`

**Response Success (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-title",
      "excerpt": "...",
      "content": "...",
      "status": "PUBLISHED",
      "views": 150,
      "publishedAt": "2026-05-21T09:00:00Z",
      "author": {
        "id": "uuid",
        "fullname": "John Doe"
      },
      "category": {
        "id": "uuid",
        "name": "Politique"
      },
      "tags": [
        {
          "tag": {
            "id": "uuid",
            "name": "Afrique"
          }
        }
      ],
      "media": [],
      "createdAt": "2026-05-21T10:00:00Z",
      "updatedAt": "2026-05-21T10:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 2,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### `GET /articles/:id`
**Description**: Récupérer un article par ID  
**Authentification**: Requise (cookie)  
**Permission**: `article:read`  
**HTTP Method**: `GET`

**URL Parameters**:
- `id`: UUID de l'article

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "...",
  "content": "...",
  "status": "PUBLISHED",
  "views": 150,
  "publishedAt": "2026-05-21T09:00:00Z",
  "author": {
    "id": "uuid",
    "fullname": "John Doe"
  },
  "category": {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "description": "..."
  },
  "tags": [
    {
      "articleId": "uuid",
      "tagId": "uuid",
      "tag": {
        "id": "uuid",
        "name": "Afrique",
        "slug": "afrique"
      }
    }
  ],
  "media": [],
  "createdAt": "2026-05-21T10:00:00Z",
  "updatedAt": "2026-05-21T10:00:00Z"
}
```

**Response Error (404)**:
```json
{
  "message": "Article not found"
}
```

---

#### `PATCH /articles/:id`
**Description**: Mettre à jour un article  
**Authentification**: Requise (cookie)  
**Permission**: `article:update`  
**HTTP Method**: `PATCH`

**Request Body** (tous les champs optionnels):
```json
{
  "title": "Nouveau titre",
  "excerpt": "Nouveau résumé",
  "content": "Nouveau contenu...",
  "featuredImage": "/uploads/articles/new-image.jpg",
  "seoTitle": "Nouveau titre SEO",
  "seoDescription": "Nouvelle description SEO",
  "videoUrl": "https://youtube.com/watch?v=...",
  "categoryId": "uuid-category",
  "tags": ["uuid-tag1"],
  "mediaIds": ["uuid-media1"]
}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Nouveau titre",
  "slug": "nouveau-titre",
  "excerpt": "Nouveau résumé",
  "content": "Nouveau contenu...",
  "status": "DRAFT",
  "views": 150,
  "publishedAt": null,
  "author": { ... },
  "category": { ... },
  "tags": [ ... ],
  "media": [ ... ],
  "createdAt": "2026-05-21T10:00:00Z",
  "updatedAt": "2026-05-21T12:00:00Z"
}
```

---

#### `PATCH /articles/:id/publish`
**Description**: Publier un article (passer de DRAFT → PUBLISHED)  
**Authentification**: Requise (cookie)  
**Permission**: `article:publish`  
**HTTP Method**: `PATCH`

**Request Body**: aucun

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Article Title",
  "slug": "article-title",
  "status": "PUBLISHED",
  "publishedAt": "2026-05-21T12:30:45Z",
  "views": 0,
  "author": { ... },
  "category": { ... },
  "tags": [ ... ],
  "media": [ ... ],
  "createdAt": "2026-05-21T10:00:00Z",
  "updatedAt": "2026-05-21T12:30:45Z"
}
```

---

#### `DELETE /articles/:id`
**Description**: Supprimer un article  
**Authentification**: Requise (cookie)  
**Permission**: `article:delete`  
**HTTP Method**: `DELETE`

**Response Success (200)**:
```json
{
  "message": "Article deleted"
}
```

---

### 🏷️ TAGS (Route protégée: `/api/v1/tags/`)

#### `GET /tags/`
**Description**: Lister tous les tags  
**Authentification**: Requise (cookie)  
**Permission**: `tag:read`  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Afrique",
    "slug": "afrique",
    "createdAt": "2026-05-21T10:00:00Z"
  },
  {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "createdAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `POST /tags/`
**Description**: Créer un tag  
**Authentification**: Requise (cookie)  
**Permission**: `tag:create`  
**HTTP Method**: `POST`

**Request Body**:
```json
{
  "name": "Nouveau Tag"
}
```

**Response Success (201)**:
```json
{
  "id": "uuid",
  "name": "Nouveau Tag",
  "slug": "nouveau-tag",
  "createdAt": "2026-05-21T12:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "message": "Tag name already exists"
}
```

---

#### `PATCH /tags/:id`
**Description**: Mettre à jour un tag  
**Authentification**: Requise (cookie)  
**Permission**: `tag:update`  
**HTTP Method**: `PATCH`

**Request Body**:
```json
{
  "name": "Tag Renommé"
}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "name": "Tag Renommé",
  "slug": "tag-renomme",
  "createdAt": "2026-05-21T10:00:00Z"
}
```

---

#### `DELETE /tags/:id`
**Description**: Supprimer un tag  
**Authentification**: Requise (cookie)  
**Permission**: `tag:delete`  
**HTTP Method**: `DELETE`

**Response Success (200)**:
```json
{
  "message": "Tag deleted"
}
```

---

### 📂 CATÉGORIES (Route protégée: `/api/v1/categories/`)

#### `POST /categories/`
**Description**: Créer une catégorie  
**Authentification**: Requise (cookie)  
**Permission**: `category:create`  
**HTTP Method**: `POST`

**Request Body**:
```json
{
  "name": "Nouvelle Catégorie",
  "description": "Description optionnelle"
}
```

**Response Success (201)**:
```json
{
  "id": "uuid",
  "name": "Nouvelle Catégorie",
  "slug": "nouvelle-categorie",
  "description": "Description optionnelle",
  "createdAt": "2026-05-21T12:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "message": "Category name already exists"
}
```

---

#### `GET /categories/`
**Description**: Lister toutes les catégories (avec pagination)  
**Authentification**: Requise (cookie)  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "description": "Actualités politiques",
    "createdAt": "2026-05-21T10:00:00Z"
  },
  {
    "id": "uuid",
    "name": "Économie",
    "slug": "economie",
    "description": "Actualités économiques",
    "createdAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `PATCH /categories/:id`
**Description**: Mettre à jour une catégorie  
**Authentification**: Requise (cookie)  
**Permission**: `category:update`  
**HTTP Method**: `PATCH`

**Request Body**:
```json
{
  "name": "Politique Africaine",
  "description": "Description mise à jour"
}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "name": "Politique Africaine",
  "slug": "politique-africaine",
  "description": "Description mise à jour",
  "createdAt": "2026-05-21T10:00:00Z"
}
```

---

#### `DELETE /categories/:id`
**Description**: Supprimer une catégorie  
**Authentification**: Requise (cookie)  
**Permission**: `category:delete`  
**HTTP Method**: `DELETE`

**Response Success (200)**:
```json
{
  "message": "Category deleted"
}
```

---

### 👥 ADMINISTRATEURS (Route protégée: `/api/v1/admins/`)

#### `POST /admins/`
**Description**: Créer un nouveau administrateur  
**Authentification**: Requise (cookie)  
**Permission**: `admin:create`  
**HTTP Method**: `POST`

**Request Body**:
```json
{
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response Success (201)**:
```json
{
  "id": "uuid",
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "avatar": null,
  "isActive": true,
  "role": "ADMIN",
  "permissions": [],
  "createdAt": "2026-05-21T12:00:00Z",
  "updatedAt": "2026-05-21T12:00:00Z"
}
```

**Response Error (400)**:
```json
{
  "message": "Email already exists"
}
```

---

#### `PATCH /admins/:id/permissions`
**Description**: Attribuer des permissions à un administrateur  
**Authentification**: Requise (cookie)  
**Permission**: `admin:update`  
**HTTP Method**: `PATCH`

**Request Body**:
```json
{
  "permissions": ["article:create", "article:publish", "category:create"]
}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "avatar": null,
  "isActive": true,
  "role": "ADMIN",
  "permissions": [
    {
      "id": "uuid",
      "name": "article:create"
    },
    {
      "id": "uuid",
      "name": "article:publish"
    },
    {
      "id": "uuid",
      "name": "category:create"
    }
  ],
  "createdAt": "2026-05-21T12:00:00Z",
  "updatedAt": "2026-05-21T13:00:00Z"
}
```

---

### 📸 MEDIA (Route protégée: `/api/v1/media/`)

#### `POST /media/upload`
**Description**: Uploader une image  
**Authentification**: Requise (cookie)  
**Permission**: `media:upload`  
**HTTP Method**: `POST`  
**Content-Type**: `multipart/form-data`

**Form Data**:
- `image`: File (required)
  - MIME types acceptés: `image/jpeg`, `image/png`, `image/webp`
  - Taille max: 5 MB

**Response Success (200)**:
```json
{
  "url": "/uploads/articles/filename-hash.jpg"
}
```

**Response Error (400)**:
```json
{
  "message": "No file uploaded" | "File too large" | "Invalid file type"
}
```

---

#### `GET /media`
**Description**: Lister tous les médias  
**Authentification**: Requise (cookie)  
**Permission**: `media:read`  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "url": "/uploads/articles/image.jpg",
    "type": "IMAGE",
    "articleId": "uuid",
    "createdAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `GET /media/:id`
**Description**: Récupérer un média spécifique  
**Authentification**: Requise (cookie)  
**Permission**: `media:read`  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
{
  "id": "uuid",
  "url": "/uploads/articles/image.jpg",
  "type": "IMAGE",
  "articleId": "uuid",
  "createdAt": "2026-05-21T10:00:00Z"
}
```

---

#### `DELETE /media/:id`
**Description**: Supprimer un média  
**Authentification**: Requise (cookie)  
**Permission**: `media:delete`  
**HTTP Method**: `DELETE`

**Response Success (200)**:
```json
{
  "message": "Media deleted"
}
```

---

### 🌍 PUBLIC ENDPOINTS (Sans authentification - `/api/v1/public/`)

#### `GET /public/categories`
**Description**: Lister toutes les catégories (publique)  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "description": "Actualités politiques",
    "createdAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `GET /public/articles`
**Description**: Lister les articles publiés (pagination, recherche, filtrage)  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**Query Parameters**:
- `page`: Integer (default: 1)
- `limit`: Integer (default: 10)
- `search`: String (recherche sur le titre et le contenu)
- `category`: String (slug de la catégorie)

**Example**: `GET /public/articles?page=1&limit=10&search=afrique&category=politique`

**Response Success (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-title",
      "excerpt": "...",
      "content": "...",
      "status": "PUBLISHED",
      "views": 150,
      "publishedAt": "2026-05-21T09:00:00Z",
      "author": {
        "fullname": "John Doe"
      },
      "category": {
        "id": "uuid",
        "name": "Politique",
        "slug": "politique"
      },
      "createdAt": "2026-05-21T10:00:00Z",
      "updatedAt": "2026-05-21T10:00:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### `GET /public/articles/:slug`
**Description**: Récupérer un article publié par son slug (incrémente les vues)  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**URL Parameters**:
- `slug`: String (slug de l'article)

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "...",
  "content": "...",
  "status": "PUBLISHED",
  "views": 151,
  "publishedAt": "2026-05-21T09:00:00Z",
  "author": {
    "fullname": "John Doe"
  },
  "category": {
    "id": "uuid",
    "name": "Politique",
    "slug": "politique",
    "description": "..."
  },
  "createdAt": "2026-05-21T10:00:00Z",
  "updatedAt": "2026-05-21T10:00:00Z"
}
```

**Response Error (404)**:
```json
{
  "message": "Article not found"
}
```

---

#### `GET /public/latest`
**Description**: Récupérer les 10 articles les plus récents publiés  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-title",
    "status": "PUBLISHED",
    "views": 150,
    "publishedAt": "2026-05-21T09:00:00Z",
    "category": {
      "id": "uuid",
      "name": "Politique"
    },
    "createdAt": "2026-05-21T10:00:00Z",
    "updatedAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `GET /public/trending`
**Description**: Récupérer les 10 articles les plus visionnés  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-title",
    "status": "PUBLISHED",
    "views": 5420,
    "publishedAt": "2026-05-21T09:00:00Z",
    "category": {
      "id": "uuid",
      "name": "Politique"
    },
    "createdAt": "2026-05-21T10:00:00Z",
    "updatedAt": "2026-05-21T10:00:00Z"
  }
]
```

---

#### `GET /public/related/:slug`
**Description**: Récupérer 4 articles connexes (même catégorie)  
**Authentification**: Non requise  
**HTTP Method**: `GET`

**URL Parameters**:
- `slug`: String (slug de l'article de référence)

**Response Success (200)**:
```json
[
  {
    "id": "uuid",
    "title": "Related Article",
    "slug": "related-article",
    "status": "PUBLISHED",
    "views": 200,
    "publishedAt": "2026-05-21T08:00:00Z",
    "createdAt": "2026-05-21T10:00:00Z",
    "updatedAt": "2026-05-21T10:00:00Z"
  }
]
```

---

### 📡 RSS/FEED ENDPOINTS (Public - `/`)

#### `GET /rss.xml`
**Description**: Flux RSS principal (20 articles les plus récents)  
**Authentification**: Non requise  
**HTTP Method**: `GET`  
**Content-Type**: `application/rss+xml; charset=utf-8`  
**Cache-Control**: `public, max-age=900` (15 minutes)

**Response Success (200)**: Retourne du XML RSS 2.0

---

#### `GET /atom.xml`
**Description**: Flux Atom (compatible Google News)  
**Authentification**: Non requise  
**HTTP Method**: `GET`  
**Content-Type**: `application/atom+xml; charset=utf-8`  
**Cache-Control**: `public, max-age=900` (15 minutes)

**Response Success (200)**: Retourne du XML Atom 1.0

---

#### `GET /feed.json`
**Description**: Flux JSON Feed  
**Authentification**: Non requise  
**HTTP Method**: `GET`  
**Content-Type**: `application/json; charset=utf-8`  
**Cache-Control**: `public, max-age=900` (15 minutes)

**Response Success (200)**:
```json
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "Presse Républicaine News",
  "description": "Informer · Éduquer · Éveiller — Le média digital panafricain",
  "home_page_url": "http://localhost:3000",
  "feed_url": "http://localhost:3000/feed.json",
  "items": [
    {
      "id": "http://localhost:3000/articles/article-slug",
      "content_html": "Article content...",
      "url": "http://localhost:3000/articles/article-slug",
      "title": "Article Title",
      "published": "2026-05-21T09:00:00Z"
    }
  ]
}
```

---

#### `GET /rss/:categorySlug`
**Description**: Flux RSS par catégorie (20 articles)  
**Authentification**: Non requise  
**HTTP Method**: `GET`  
**Content-Type**: `application/rss+xml; charset=utf-8`  
**Cache-Control**: `public, max-age=900` (15 minutes)

**URL Parameters**:
- `categorySlug`: String (slug de la catégorie)

**Response Success (200)**: Retourne du XML RSS 2.0 filtré par catégorie

**Response Error (404)**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
Category not found
```

---

#### `GET /sitemap.xml`
**Description**: Sitemap XML pour les moteurs de recherche  
**Authentification**: Non requise  
**HTTP Method**: `GET`  
**Content-Type**: `application/xml; charset=utf-8`  
**Cache-Control**: `public, max-age=3600` (1 heure)

**Response Success (200)**: Retourne du XML sitemap avec:
- Homepage (priorité 1.0)
- Page articles (priorité 0.9)
- Pages catégories (priorité 0.7)
- Tous les articles publiés (priorité 0.8)

---

## 2️⃣ MODÈLES DE DONNÉES (TypeScript Interfaces)

### Admin Model
```typescript
interface Admin {
  id: string;
  fullname: string;
  email: string;
  password: string; // Hashé (ne jamais retourner au frontend)
  avatar?: string; // URL de l'avatar
  isActive: boolean;
  role: 'ADMIN' | 'SUPER_ADMIN';
  permissions: Permission[]; // Relation
  articles: Article[]; // Articles créés par cet admin
  createdAt: Date;
  updatedAt: Date;
}

// Pour les réponses API (sans password)
interface AdminResponse {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  role: 'ADMIN' | 'SUPER_ADMIN';
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Permission Model
```typescript
interface Permission {
  id: string;
  name: string; // Unique (ex: 'article:create')
  admins: Admin[]; // Admins qui ont cette permission
  createdAt: Date;
}

// Permissions disponibles:
type PermissionName = 
  | 'admin:create'
  | 'admin:update'
  | 'admin:delete'
  | 'article:create'
  | 'article:read'
  | 'article:update'
  | 'article:delete'
  | 'article:publish'
  | 'category:create'
  | 'category:update'
  | 'category:delete'
  | 'tag:create'
  | 'tag:read'
  | 'tag:update'
  | 'tag:delete'
  | 'media:upload'
  | 'media:read'
  | 'media:delete';
```

---

### Category Model
```typescript
interface Category {
  id: string;
  name: string; // Unique
  slug: string; // Unique (généré à partir de name)
  description?: string;
  articles: Article[]; // Articles dans cette catégorie
  createdAt: Date;
}
```

---

### Tag Model
```typescript
interface Tag {
  id: string;
  name: string; // Unique
  slug: string; // Unique
  articles: ArticleTag[]; // Relation junction
  createdAt: Date;
}
```

---

### Article Model
```typescript
interface Article {
  id: string;
  title: string;
  slug: string; // Unique (généré à partir du title)
  excerpt?: string; // Résumé court
  content: string; // Contenu principal
  featuredImage?: string; // URL de l'image à la une
  seoTitle?: string; // Titre pour les moteurs de recherche
  seoDescription?: string; // Description pour les moteurs de recherche
  videoUrl?: string; // URL optionnelle d'une vidéo
  status: ArticleStatus; // État de l'article
  views: number; // Nombre de vues
  scheduledFor?: Date; // Date de publication programmée
  publishedAt?: Date; // Date de publication réelle
  authorId: string; // ID de l'admin auteur
  author: Admin; // Relation à l'admin
  categoryId: string; // ID de la catégorie
  category: Category; // Relation à la catégorie
  tags: ArticleTag[]; // Relations aux tags
  media: Media[]; // Médias attachés
  createdAt: Date;
  updatedAt: Date;
}

type ArticleStatus = 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

// Pour les réponses API (sans password d'admin)
interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  videoUrl?: string;
  status: ArticleStatus;
  views: number;
  scheduledFor?: Date;
  publishedAt?: Date;
  author: {
    id: string;
    fullname: string;
    email?: string; // Seulement dans les réponses protégées
  };
  category: Category;
  tags: {
    articleId: string;
    tagId: string;
    tag: Tag;
  }[];
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### ArticleTag Model (Junction)
```typescript
interface ArticleTag {
  articleId: string;
  tagId: string;
  article: Article;
  tag: Tag;
}
```

---

### Media Model
```typescript
interface Media {
  id: string;
  url: string; // Chemin du fichier (ex: /uploads/articles/filename.jpg)
  type: MediaType; // Type de média
  articleId: string; // Article auquel le média est attaché
  article: Article;
  createdAt: Date;
}

type MediaType = 'IMAGE' | 'VIDEO';
```

---

## 3️⃣ SYSTÈME D'AUTHENTIFICATION

### Mécanisme d'Authentification
- **Type**: JWT (JSON Web Token)
- **Transport**: HttpOnly Cookie (sécurisé, non accessible via JavaScript)
- **Nom du cookie**: `access_token`
- **Durée de validité**: 15 minutes
- **Algorithme**: HS256 (symetric)
- **Secret**: Déjà défini dans `.env` (`JWT_ACCESS_SECRET`)

### Flux d'Authentification
1. L'utilisateur fait `POST /auth/login` avec email et password
2. Le backend vérifie les credentials dans la base de données
3. Un JWT est généré et retourné **dans un cookie HttpOnly**
4. Le frontend envoie automatiquement ce cookie avec chaque requête
5. Le middleware `authenticate` valide le JWT à chaque requête protégée

### Configuration du Cookie
```typescript
// Côté backend (Express)
res.cookie('access_token', token, {
  httpOnly: true,        // Non accessible via document.cookie
  secure: true,          // HTTPS only (production)
  sameSite: 'strict',    // Protection CSRF
  maxAge: 15 * 60 * 1000 // 15 minutes en millisecondes
})
```

### Important: Credentials Mode
Quand vous appelez l'API depuis le frontend avec `fetch` ou `axios`, vous DEVEZ inclure les credentials:

```typescript
// Fetch API
fetch('http://localhost:5000/api/v1/articles', {
  method: 'GET',
  credentials: 'include', // ⚠️ Crucial pour envoyer le cookie
  headers: {
    'Content-Type': 'application/json'
  }
})

// Axios
axios.create({
  withCredentials: true // ⚠️ Crucial pour envoyer le cookie
})
```

### Système de Rôles et Permissions

#### Rôles
1. **SUPER_ADMIN**: Accès à tout, bypass des permissions
2. **ADMIN**: Accès limité selon les permissions assignées

#### Permissions
La permission est validée par le middleware `requirePermission` qui:
1. Vérifie que l'admin est authentifié
2. Si le rôle est SUPER_ADMIN, laisse passer
3. Sinon, vérifie que la permission est dans la liste de l'admin

**Liste des permissions disponibles**:
```typescript
'admin:create' | 'admin:update' | 'admin:delete'
| 'article:create' | 'article:read' | 'article:update' | 'article:delete' | 'article:publish'
| 'category:create' | 'category:update' | 'category:delete'
| 'tag:create' | 'tag:read' | 'tag:update' | 'tag:delete'
| 'media:upload' | 'media:read' | 'media:delete'
```

### Routes Protégées par Permission

| Endpoint | Méthode | Permission Requise |
|----------|---------|------------------|
| POST /articles | POST | `article:create` |
| GET /articles | GET | `article:read` |
| GET /articles/:id | GET | `article:read` |
| PATCH /articles/:id | PATCH | `article:update` |
| DELETE /articles/:id | DELETE | `article:delete` |
| PATCH /articles/:id/publish | PATCH | `article:publish` |
| POST /categories | POST | `category:create` |
| GET /categories | GET | Aucune (mais auth requise) |
| PATCH /categories/:id | PATCH | `category:update` |
| DELETE /categories/:id | DELETE | `category:delete` |
| POST /tags | POST | `tag:create` |
| GET /tags | GET | `tag:read` |
| PATCH /tags/:id | PATCH | `tag:update` |
| DELETE /tags/:id | DELETE | `tag:delete` |
| POST /media/upload | POST | `media:upload` |
| GET /media | GET | `media:read` |
| GET /media/:id | GET | `media:read` |
| DELETE /media/:id | DELETE | `media:delete` |
| POST /admins | POST | `admin:create` |
| PATCH /admins/:id/permissions | PATCH | `admin:update` |

### Cas d'Erreur d'Authentification

#### 401 - Unauthorized (non authentifié)
```json
{
  "message": "Unauthorized"
}
```
**Causes possibles**:
- Cookie manquant
- Cookie expiré (>15 min)
- Token invalide/corrompu
- Admin désactivé (isActive: false)

**Action du frontend**: Rediriger vers la page de login, effacer le cookie

#### 403 - Forbidden (permission insuffisante)
```json
{
  "message": "Forbidden"
}
```
**Causes possibles**:
- L'admin n'a pas la permission requise
- Note: SUPER_ADMIN bypass automatiquement cette vérification

**Action du frontend**: Afficher un message d'erreur "Accès refusé"

---

## 4️⃣ CE QUI MANQUE CÔTÉ BACKEND

### ❌ Endpoints Manquants

1. **Pas de recherche full-text avancée**
   - La recherche `/public/articles` fait un simple `CONTAINS`
   - Pourrait bénéficier de recherche PostgreSQL full-text ou Algolia

2. **Pas de pagination côté admins**
   - `GET /categories` retourne TOUS les résultats sans pagination
   - `GET /tags` retourne TOUS les résultats sans pagination

3. **Pas d'endpoint pour récupérer un admin par ID**
   - Seul `/auth/me` retourne l'admin connecté

4. **Pas d'endpoint pour lister/gérer les admins**
   - Pas de `GET /admins` ou `GET /admins/:id`

5. **Pas de refresh token**
   - Le JWT expire après 15 min et aucun moyen de le renouveler
   - L'utilisateur doit se reconnecter

6. **Pas de validation complète des emails**
   - Pas de vérification du format email (regex ou library)

7. **Pas de password reset**
   - Aucun endpoint pour réinitialiser le mot de passe

8. **Pas de filtrage avancé sur les articles**
   - Pas de filtrage par date de publication, auteur, nombre de vues min, etc.

9. **Pas de soft delete**
   - Les suppressions sont physiques (DELETE), pas logiques (soft delete)

10. **Pas de versioning des articles**
    - Pas d'historique des modifications

11. **Pas de comments/reactions**
    - Aucun système de commentaires ou likes sur les articles

### ⚠️ Problèmes et Incohérences

1. **Validation incohérente**
   - Certaines routes utilisent un schema de validation, d'autres pas
   - Pas de middleware global de validation

2. **Réponses API non standardisées**
   - Certains endpoints retournent l'objet directement: `{ id, title, ... }`
   - D'autres retournent un wrapper: `{ data: [...], meta: {...} }`
   - Pas de format d'erreur standardisé

3. **Type casting suspects**
   - Beaucoup de `Array.isArray()` checks inutiles sur les params
   ```typescript
   const articleId = Array.isArray(req.params.id)
     ? req.params.id[0]
     : req.params.id
   ```
   - Les params d'URL ne sont JAMAIS des arrays avec Express

4. **Dates publiées manquantes**
   - Pas de `publishedAt` sur les articles publics (utile pour le tri)
   - Pas de `updatedAt` sur les articles publics

5. **Slug uniqueness pas validée partout**
   - Seulement sur les articles
   - Categories et Tags générent des slugs mais pas de validation

6. **Pas de permissions pour GET /categories**
   - L'endpoint demande l'auth mais pas de permission spécifique

7. **Avatar path inconsistent**
   - Avatar stocké dans le champ `avatar` mais pas de endpoint d'upload avatar
   - Seulement upload d'images d'articles

---

## 5️⃣ VARIABLES D'ENVIRONNEMENT REQUISES CÔTÉ FRONTEND

Le frontend doit avoir ces variables dans `.env.local`:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_BACKEND_URL=http://localhost:5000

# Frontend URLs (pour les liens sociaux, partage, etc.)
REACT_APP_FRONTEND_URL=http://localhost:3000

# Si vous utilisez des services externes
# REACT_APP_ALGOLIA_APP_ID=...
# REACT_APP_ALGOLIA_API_KEY=...

# Google Analytics ou autre tracking
# REACT_APP_GA_ID=...
```

### Exemple `.env.local` pour Next.js:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

---

## 6️⃣ RECOMMANDATIONS & POINTS DE VIGILANCE

### 🔴 Problèmes Critiques à Corriger Avant Production

1. **JWT sans refresh token**
   - ❌ Actuellement: Token expire après 15 min, l'utilisateur doit se reconnectés
   - ✅ À faire: Implémenter un refresh token mechanism (avec expiration longue)
   - Impacte: UX (users frustré) + sécurité (tokens stockés partout)

2. **Validation insuffisante**
   - ❌ Pas de vérification de format email
   - ✅ À faire: Utiliser `zod`, `joi`, ou `class-validator`
   - Code à ajouter:
     ```typescript
     import { z } from 'zod';
     
     const loginSchema = z.object({
       email: z.string().email('Email invalide'),
       password: z.string().min(6, 'Password trop court')
     });
     ```

3. **Erreurs serveur non gérées proprement**
   - ❌ Beaucoup de `throw new Error()` sans type d'erreur
   - ✅ À faire: Créer une classe d'erreur personnalisée
   - Impacte: Frontend reçoit des messages peu précis

4. **Pas de rate limiting**
   - ❌ Aucune protection contre les brute-force attacks (login, registration)
   - ✅ À faire: Installer `express-rate-limit`

5. **CORS trop large**
   - Vérifier la configuration CORS dans `app.ts`
   - En production: spécifier l'origin exacte, pas `*`

6. **Slugs non uniques globalement**
   - ❌ Chaque article génère un slug mais pas de vérification avant creation
   - ✅ Déjà implémenté, bon!

7. **Pas de tests**
   - ❌ Aucun test automatisé
   - ✅ À faire: Ajouter des tests Jest/Vitest

### 🟡 Problèmes Moyens à Adresser

1. **Réponses API incohérentes**
   - Standardiser le format:
     ```typescript
     {
       success: boolean;
       data?: T;
       error?: {
         code: string;
         message: string;
       };
       meta?: { pagination: {...} };
     }
     ```

2. **Type casting inutile**
   - Supprimer les `Array.isArray()` checks sur les params
   - Les params d'URL ne sont jamais des arrays

3. **Perte d'informations en réponse publique**
   - Les articles publics ne retournent pas `updatedAt`
   - Ajouter: `updatedAt` et `createdAt` aux réponses publiques

4. **Pas de endpoint pour lister les admins**
   - Ajouter `GET /admins` avec pagination et filtrage

5. **Avatar management**
   - Créer un endpoint `PATCH /admins/:id/avatar` pour uploader un avatar
   - Actuellement: pas de way d'uploader un avatar

### 🟢 Points Positifs

✅ JWT basé sur HttpOnly cookies (sécurisé)  
✅ System de permissions bien structuré  
✅ Rôles SUPER_ADMIN avec bypass  
✅ Slugs auto-générés et uniques  
✅ RSS/Atom/JSON feeds  
✅ Sitemap XML  
✅ Vues d'articles trackées  
✅ Relation many-to-many pour les tags  
✅ Statuts d'articles variés  
✅ Media attaché aux articles  
✅ Public endpoints bien séparés  

---

### 📝 Checklist Frontend Development

Avant de commencer le frontend, assurez-vous que:

- [ ] Variables d'env `.env.local` configurées
- [ ] `credentials: 'include'` ou `withCredentials: true` sur tous les calls API
- [ ] Gestion du cache token (15 min) - show logout après expiration
- [ ] Affichage des erreurs 401 → logout + redirect /login
- [ ] Affichage des erreurs 403 → message "Accès refusé"
- [ ] Gestion des permissions pour chaque action (create, edit, delete)
- [ ] Upload d'images avec feedback utilisateur
- [ ] Slug generation côté frontend (pour preview)
- [ ] Éditeur rich text pour le champ `content`
- [ ] Gestion des tags multi-select
- [ ] Récupération des catégories pour le dropdown
- [ ] Page de listing articles avec pagination
- [ ] Page de détail article (publique + admin view)
- [ ] Dashboard admin avec stats (articles, vues, etc.)
- [ ] Page login
- [ ] Page profil admin
- [ ] RSS feed subscription button
- [ ] Affichage des articles "trending"
- [ ] Affichage des articles "latest"
- [ ] Articles connexes (related)
- [ ] Système de recherche
- [ ] Filtrage par catégorie

---

## 📚 Ressources Complémentaires

### Documentation
- Express: https://expressjs.com/
- Prisma: https://www.prisma.io/docs/
- JWT: https://jwt.io/
- Feed Library: https://www.npmjs.com/package/feed

### Security
- OWASP Top 10: https://owasp.org/Top10/
- JWT Best Practices: https://tools.ietf.org/html/rfc8949

### Frontend Tips
- Use `httpClient` (Axios) with default `withCredentials: true`
- Store nothing in localStorage except non-sensitive data
- Implement auto-logout after token expiry
- Show loading states during API calls
- Implement proper error boundaries

---

**Document généré le**: 21 May 2026  
**Prochaines étapes**: Commencer l'intégration frontend React/Next.js
