import type { SiteData } from "../types/site";

export const demoSite: SiteData = {
  siteName: "Morning Coffee Labs",
  header: {
    enabled: true,
    logoText: "Morning Coffee Labs",
    links: [
      {
        id: "nav-home",
        label: "Home",
        href: "/",
      },
      {
        id: "nav-products",
        label: "Products",
        href: "/products",
      },
      {
        id: "nav-contact",
        label: "Contact",
        href: "/contact",
      },
    ],
  },
  footer: {
    enabled: true,
    text: "© Morning Coffee Labs. Challenges → Ideas → Solutions.",
    links: [
      {
        id: "footer-privacy",
        label: "Privacy",
        href: "/privacy",
      },
      {
        id: "footer-terms",
        label: "Terms",
        href: "/terms",
      },
    ],
  },
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
          buttonHref: "/products",
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
          buttonHref: "/",
        },
      ],
    },
    {
      id: "products",
      slug: "/products",
      title: "Products",
      description: "Products from Morning Coffee Labs.",
      sections: [
        {
          id: "products-hero",
          type: "hero",
          title: "Small tools. Real use.",
          subtitle: "Built one useful product at a time.",
          body: "This page is test data for future product pages in the builder.",
          buttonLabel: "Contact us",
          buttonHref: "/contact",
        },
      ],
    },
    {
      id: "contact",
      slug: "/contact",
      title: "Contact",
      description: "Contact Morning Coffee Labs.",
      sections: [
        {
          id: "contact-text",
          type: "text",
          title: "Contact Morning Coffee Labs",
          body: "Later this page can include a contact form, message inbox integration and diagnostics.",
        },
      ],
    },
  ],
};
