import type { SiteData } from "../types/site";

export const demoSite: SiteData = {
  siteName: "Morning Coffee Labs",
  pages: [
    {
      id: "home",
      slug: "/",
      title: "Morning Coffee Labs",
      description: "Small tools for real work.",
      sections: [
        {
          id: "hero-1",
          type: "hero",
          title: "Low friction. High precision.",
          subtitle: "Challenges → Ideas → Solutions",
          body: "Morning Coffee Labs builds practical digital tools for people who need structure without unnecessary complexity.",
          buttonLabel: "Explore products",
        },
        {
          id: "text-1",
          type: "text",
          title: "Built for real workflows",
          body: "This new platform will become the public website, admin panel and content control system for Morning Coffee Labs.",
        },
        {
          id: "cta-1",
          type: "cta",
          title: "Builder foundation",
          body: "The first goal is a stable foundation: public rendering, admin shell and clean data structure.",
          buttonLabel: "Open admin",
        },
      ],
    },
  ],
};
