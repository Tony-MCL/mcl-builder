export type SiteSectionType = "hero" | "text" | "cards" | "cta";
export type CardsColumns = 1 | 2 | 3;

export type SiteLink = {
  id: string;
  label: string;
  href: string;
};

export type SiteHeader = {
  enabled: boolean;
  logoText: string;
  links: SiteLink[];
};

export type SiteFooter = {
  enabled: boolean;
  text: string;
  links: SiteLink[];
};

export type SiteCard = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  linkLabel?: string;
  linkHref?: string;
};

export type SiteSection = {
  id: string;
  internalName?: string;
  enabled?: boolean;
  type: SiteSectionType;
  title: string;
  subtitle?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  cards?: SiteCard[];
  cardsColumns?: CardsColumns;
};

export type SitePageType = "standard" | "landing" | "legal";

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  pageType?: SitePageType;
  hideHeader?: boolean;
  hideFooter?: boolean;
  sections: SiteSection[];
};

export type SiteData = {
  siteName: string;
  header: SiteHeader;
  footer: SiteFooter;
  pages: SitePage[];
};
