export type SiteSectionType = "hero" | "text" | "cards" | "cta";

export type SiteSection = {
  id: string;
  type: SiteSectionType;
  title: string;
  subtitle?: string;
  body?: string;
  buttonLabel?: string;
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
  pages: SitePage[];
};
