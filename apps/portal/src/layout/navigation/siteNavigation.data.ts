export type SiteNavigationLink = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type SiteNavigationGroup = {
  title: string;
  links: SiteNavigationLink[];
};

export const primaryNavigationLinks: SiteNavigationLink[] = [
  {
    label: 'Why Tapestry',
    href: '/#why-tapestry',
  },
  {
    label: 'Portals',
    href: '/#portals',
  },
];

export const platformLinks: SiteNavigationLink[] = [
  {
    label: 'Player Portal',
    href: 'https://player.tapestry-ttrpg.com',
    description: 'Step into campaigns, character play, and session-ready tools.',
    external: true,
  },
  {
    label: 'Storyweaver Tools',
    href: 'https://admin.tapestry-ttrpg.com',
    description: 'Manage content, rules, and publishing workflows behind the scenes.',
    external: true,
  },
];

export const primaryCallToAction: SiteNavigationLink = {
  label: 'Enter the Portal',
  href: 'https://player.tapestry-ttrpg.com',
  external: true,
};

export const secondaryCallToAction: SiteNavigationLink = {
  label: 'Contact',
  href: 'mailto:hello@tapestry-ttrpg.com',
  external: true,
};

export const footerNavigationGroups: SiteNavigationGroup[] = [
  {
    title: 'Explore',
    links: primaryNavigationLinks,
  },
  {
    title: 'Portals',
    links: platformLinks,
  },
];

export const legalLinks: SiteNavigationLink[] = [secondaryCallToAction];
