export interface RssSource {
  url: string;
  name: string;
  slug: string;
}

export const RSS_SOURCES: RssSource[] = [
  { url: 'https://www.jeuneafrique.com/feed/', name: 'Jeune Afrique', slug: 'jeune-afrique' },
  { url: 'https://www.rfi.fr/fr/rss/afrique.xml', name: 'RFI Afrique', slug: 'rfi-afrique' },
];
