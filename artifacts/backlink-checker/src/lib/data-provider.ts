export type LinkType = 'Editorial' | 'Directory' | 'Mention' | 'Resource';

export type Backlink = {
  id: string;
  source: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  linkType: LinkType;
  authority: number;
  traffic: string;
  follow: boolean;
  lastSeen: string;
};

export type ScanSummary = {
  domain: string;
  backlinks: number;
  referringDomains: number;
  followCount: number;
  nofollowCount: number;
  authority: number;
  estimatedTraffic: string;
  change: string;
  links: Backlink[];
};

export interface BacklinkDataProvider {
  getScan(domain: string): ScanSummary;
}

const samples: Array<Omit<Backlink, 'id'> & { source: string }> = [
  { source: 'The Practical Web', sourceUrl: 'https://thepracticalweb.com/guides/seo-basics', targetUrl: '/guides/technical-seo', anchorText: 'technical SEO field guide', linkType: 'Editorial', authority: 74, traffic: '2.4k', follow: true, lastSeen: 'May 14, 2024' },
  { source: 'Indie Hackers', sourceUrl: 'https://indiehackers.com/post/site-owner-stack', targetUrl: '/', anchorText: 'LinkLedger', linkType: 'Mention', authority: 81, traffic: '1.8k', follow: true, lastSeen: 'Apr 28, 2024' },
  { source: 'Tools Directory', sourceUrl: 'https://toolsdirectory.co/marketing/backlink-tools', targetUrl: '/tools', anchorText: 'backlink tools', linkType: 'Directory', authority: 61, traffic: '640', follow: true, lastSeen: 'Apr 09, 2024' },
  { source: 'Northstar Journal', sourceUrl: 'https://northstarjournal.org/digital-gardens', targetUrl: '/journal', anchorText: 'the site owner journal', linkType: 'Editorial', authority: 69, traffic: '390', follow: true, lastSeen: 'Mar 22, 2024' },
  { source: 'A11y Weekly', sourceUrl: 'https://a11yweekly.news/resources/site-audits', targetUrl: '/audit', anchorText: 'site audit checklist', linkType: 'Resource', authority: 57, traffic: '275', follow: false, lastSeen: 'Mar 03, 2024' },
  { source: 'Page Craft Notes', sourceUrl: 'https://pagecraft.notes/archive/field-guide', targetUrl: '/field-guide', anchorText: 'field guide', linkType: 'Mention', authority: 46, traffic: '118', follow: true, lastSeen: 'Feb 17, 2024' },
  { source: 'Open Source Index', sourceUrl: 'https://opensourceindex.dev/projects/web', targetUrl: '/', anchorText: 'web projects', linkType: 'Directory', authority: 52, traffic: '89', follow: false, lastSeen: 'Jan 31, 2024' },
];

function stableNumber(domain: string, min: number, spread: number) {
  const seed = Array.from(domain).reduce((total, character) => total + character.charCodeAt(0), 0);
  return min + (seed % spread);
}

export const sampleDataProvider: BacklinkDataProvider = {
  getScan(domain) {
    const links = samples.map((link, index) => ({
      ...link,
      id: `${domain}-${index}`,
      targetUrl: `https://${domain}${link.targetUrl}`,
    }));
    const backlinks = stableNumber(domain, 37, 38);
    const followCount = links.filter((link) => link.follow).length;
    return {
      domain,
      backlinks,
      referringDomains: stableNumber(domain, 19, 17),
      followCount,
      nofollowCount: links.length - followCount,
      authority: stableNumber(domain, 31, 22),
      estimatedTraffic: `${(stableNumber(domain, 2, 34) / 10).toFixed(1)}k`,
      change: `+${stableNumber(domain, 6, 13)}.4%`,
      links,
    };
  },
};

export function normalizeDomain(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}