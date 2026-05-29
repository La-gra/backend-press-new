import { Router, Request, Response } from 'express';
import { Feed } from 'feed';
import prisma from '../config/prisma';
import { apiResponse } from '@/utils/apiResponse';

const router = Router();

// Helper function to build feed
const buildFeed = (articles: any[], categoryName?: string) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

  const feedTitle = categoryName
    ? `PRN — ${categoryName}`
    : 'Presse Républicaine News';
  const feedDescription = categoryName
    ? `Actualités ${categoryName} — Presse Républicaine News`
    : 'Informer · Éduquer · Éveiller — Le média digital panafricain';

  const feed = new Feed({
    title: feedTitle,
    description: feedDescription,
    id: FRONTEND_URL,
    link: FRONTEND_URL,
    language: 'fr',
    image: `${FRONTEND_URL}/logo.png`,
    favicon: `${FRONTEND_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Presse Républicaine News`,
    updated: new Date(),
    feedLinks: {
      rss2: `${FRONTEND_URL}/rss.xml`,
      atom: `${FRONTEND_URL}/atom.xml`,
      json: `${FRONTEND_URL}/feed.json`,
    },
    author: {
      name: 'Presse Républicaine News',
      email: 'contact@prnews.info',
      link: FRONTEND_URL,
    },
  });

  // Add each article as an item
  articles.forEach((article) => {
    const tags = article.tags ? article.tags.map((t: any) => ({ name: t.tag.name, term: t.tag.slug })) : [];

    feed.addItem({
      title: article.title,
      id: `${FRONTEND_URL}/articles/${article.slug}`,
      link: `${FRONTEND_URL}/articles/${article.slug}`,
      description: article.excerpt || article.content.substring(0, 200),
      content: article.content,
      author: article.author
        ? [{ name: article.author.fullname, email: article.author.email }]
        : [],
      date: new Date(article.publishedAt),
      image: article.featuredImage
        ? `${BACKEND_URL}${article.featuredImage}`
        : undefined,
      category: article.category
        ? [
            {
              name: article.category.name,
              term: article.category.slug,
            },
          ]
        : [],
    });
  });

  return feed;
};

/**
 * GET /rss.xml
 * Main RSS feed — all latest published articles
 */
router.get('/rss.xml', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const feed = buildFeed(articles);

    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=900'); // 15 min cache
    return res.send(feed.rss2());
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return apiResponse.error(res, 'Error generating RSS feed', 500);
  }
});

/**
 * GET /atom.xml
 * Atom format feed — for Google News
 */
router.get('/atom.xml', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const feed = buildFeed(articles);

    res.set('Content-Type', 'application/atom+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=900'); // 15 min cache
    return res.send(feed.atom1());
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    return apiResponse.error(res, 'Error generating Atom feed', 500);
  }
});

/**
 * GET /feed.json
 * JSON Feed format
 */
router.get('/feed.json', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const feed = buildFeed(articles);

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=900'); // 15 min cache
    return res.send(feed.json1());
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    return apiResponse.error(res, 'Error generating JSON feed', 500);
  }
});

/**
 * GET /rss/:categorySlug
 * Per-category RSS feed
 */
router.get('/rss/:categorySlug', async (req: Request, res: Response) => {
  try {
    const categorySlug = req.params.categorySlug as string;

    // Find category by slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return apiResponse.error(res, 'Category not found', 404);
    }

    // Fetch published articles for this category
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        categoryId: category.id,
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const feed = buildFeed(articles, category.name);

    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=900'); // 15 min cache
    return res.send(feed.rss2());
  } catch (error) {
    console.error('Error generating category RSS feed:', error);
    return apiResponse.error(res, 'Error generating category RSS feed', 500);
  }
});

/**
 * GET /sitemap.xml
 * XML sitemap for search engines
 */
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Fetch all published articles
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    // Build XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${FRONTEND_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${FRONTEND_URL}/articles</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  ${categories.map((cat) => `
  <url>
    <loc>${FRONTEND_URL}/articles?category=${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${articles.map((article) => `
  <url>
    <loc>${FRONTEND_URL}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // 1h cache
    return res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return apiResponse.error(res, 'Error generating sitemap', 500);
  }
});

export default router;
