import type { SiteData } from "../types/site";

export const demoSite: SiteData = {
  siteName: "Morning Coffee Labs",
  header: {
    enabled: true,
    logoText: "Morning Coffee Labs",
    links: [
      { id: "nav-home", label: "Home", href: "/" },
      { id: "nav-products", label: "Products", href: "/products" },
      { id: "nav-contact", label: "Contact", href: "/contact" },
    ],
  },
  footer: {
    enabled: true,
    text: "© Morning Coffee Labs. Challenges → Ideas → Solutions.",
    links: [
      { id: "footer-privacy", label: "Privacy", href: "/privacy" },
      { id: "footer-terms", label: "Terms", href: "/terms" },
    ],
  },
  pages: [
    {
      id: "home",
      slug: "/",
      title: "Morning Coffee Labs",
      description: "Small tools for real work.",
      pageType: "standard",
      hideHeader: false,
      hideFooter: false,
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
          id: "cards-1",
          type: "cards",
          title: "Tools that solve real problems",
          subtitle: "A growing platform for practical products.",
          cards: [
            {
              id: "card-progress",
              title: "Manage Progress",
              body: "Structured progress planning with print-first thinking.",
              linkLabel: "View product",
              linkHref: "/products",
            },
            {
              id: "card-kvittek",
              title: "Kvittek",
              body: "A practical place to keep receipts, warranties and proof of purchase.",
              linkLabel: "View product",
              linkHref: "/products",
            },
            {
              id: "card-husket",
              title: "husk’et",
              body: "Simple reminders and everyday memory support.",
              linkLabel: "View product",
              linkHref: "/products",
            },
          ],
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
      pageType: "standard",
      hideHeader: false,
      hideFooter: false,
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
      pageType: "standard",
      hideHeader: false,
      hideFooter: false,
      sections: [
        {
          id: "contact-text",
          type: "text",
          title: "Contact Morning Coffee Labs",
          body: "Later this page can include a contact form, message inbox integration and diagnostics.",
        },
      ],
    },
    {
      id: "privacy",
      slug: "/privacy",
      title: "Privacy",
      description: "Privacy information.",
      pageType: "legal",
      hideHeader: false,
      hideFooter: false,
      sections: [
        {
          id: "privacy-text",
          type: "text",
          title: "Privacy",
          body: "Legal page placeholder. This page type can later get a simpler layout and footer-focused linking.",
        },
      ],
    },
  ],
};
