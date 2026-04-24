import type { SitePage, SiteSection } from "../types/site";

type PublicSiteProps = {
  page: SitePage;
};

function SectionRenderer({ section }: { section: SiteSection }) {
  if (section.type === "hero") {
    return (
      <section className="section hero-section">
        <div className="eyebrow">Morning Coffee Labs</div>
        <h1>{section.title}</h1>
        {section.subtitle && <h2>{section.subtitle}</h2>}
        {section.body && <p>{section.body}</p>}
        {section.buttonLabel && <button>{section.buttonLabel}</button>}
      </section>
    );
  }

  if (section.type === "cta") {
    return (
      <section className="section cta-section">
        <h2>{section.title}</h2>
        {section.body && <p>{section.body}</p>}
        {section.buttonLabel && <button>{section.buttonLabel}</button>}
      </section>
    );
  }

  return (
    <section className="section">
      <h2>{section.title}</h2>
      {section.body && <p>{section.body}</p>}
    </section>
  );
}

export function PublicSite({ page }: PublicSiteProps) {
  return (
    <main className="public-site">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
