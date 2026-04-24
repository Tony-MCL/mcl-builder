export type SiteSectionType = "hero" | "text" | "cards" | "cta";

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

export type SiteSection = {
  id: string;
  type: SiteSectionType;
  title: string;
  subtitle?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sections: SiteSection[];
};

export type SiteData = {
  siteName: string;
  header: SiteHeader;
  footer: SiteFooter;
  pages: SitePage[];
};
