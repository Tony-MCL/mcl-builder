import type { SiteData, SiteLink, SitePage, SiteSection } from "../types/site";

type PublicSiteProps = {
  site: SiteData;
  page: SitePage;
  onNavigate?: (href: string) => void;
};

function PublicLink({
  link,
  onNavigate,
}: {
  link: SiteLink;
  onNavigate?: (href: string) => void;
}) {
  return (
    <button
      className="public-link"
      type="button"
      onClick={() => onNavigate?.(link.href)}
    >
      {link.label}
    </button>
  );
}

function PublicHeader({
  site,
  onNavigate,
}: {
  site: SiteData;
  onNavigate?: (href: string) => void;
}) {
  if (!site.header.enabled) {
    return null;
  }

  return (
    <header className="site-header">
      <button className="site-logo" type="button" onClick={() => onNavigate?.("/")}>
        {site.header.logoText || site.siteName}
      </button>

      {site.header.links.length > 0 && (
        <nav className="site-nav">
          {site.header.links.map((link) => (
            <PublicLink key={link.id} link={link} onNavigate={onNavigate} />
          ))}
        </nav>
      )}
    </header>
  );
}

function PublicFooter({
  site,
  onNavigate,
}: {
  site: SiteData;
  onNavigate?: (href: string) => void;
}) {
  if (!site.footer.enabled) {
    return null;
  }

  return (
    <footer className="site-footer">
      <p>{site.footer.text}</p>

      {site.footer.links.length > 0 && (
        <nav className="site-footer-links">
          {site.footer.links.map((link) => (
            <PublicLink key={link.id} link={link} onNavigate={onNavigate} />
          ))}
        </nav>
      )}
    </footer>
  );
}

function SectionImage({ section }: { section: SiteSection }) {
  if (!section.imageUrl) {
    return null;
  }

  return (
    <div className="section-image-wrap">
      <img
        className="section-image"
        src={section.imageUrl}
        alt={section.imageAlt || ""}
      />
    </div>
  );
}

function SectionButton({
  section,
  onNavigate,
}: {
  section: SiteSection;
  onNavigate?: (href: string) => void;
}) {
  if (!section.buttonLabel) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (section.buttonHref) {
          onNavigate?.(section.buttonHref);
        }
      }}
    >
      {section.buttonLabel}
    </button>
  );
}

function SectionRenderer({
  section,
  onNavigate,
}: {
  section: SiteSection;
  onNavigate?: (href: string) => void;
}) {
  if (section.type === "hero") {
    return (
      <section className="section hero-section">
        <div className="section-content">
          <div>
            <div className="eyebrow">Morning Coffee Labs</div>
            <h1>{section.title}</h1>
            {section.subtitle && <h2>{section.subtitle}</h2>}
            {section.body && <p>{section.body}</p>}
            <SectionButton section={section} onNavigate={onNavigate} />
          </div>

          <SectionImage section={section} />
        </div>
      </section>
    );
  }

  if (section.type === "cta") {
    return (
      <section className="section cta-section">
        <div className="section-content">
          <div>
            <h2>{section.title}</h2>
            {section.body && <p>{section.body}</p>}
            <SectionButton section={section} onNavigate={onNavigate} />
          </div>

          <SectionImage section={section} />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-content">
        <div>
          <h2>{section.title}</h2>
          {section.body && <p>{section.body}</p>}
          <SectionButton section={section} onNavigate={onNavigate} />
        </div>

        <SectionImage section={section} />
      </div>
    </section>
  );
}

export function PublicSite({ site, page, onNavigate }: PublicSiteProps) {
  return (
    <>
      <PublicHeader site={site} onNavigate={onNavigate} />

      <main className="public-site">
        {page.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            onNavigate={onNavigate}
          />
        ))}
      </main>

      <PublicFooter site={site} onNavigate={onNavigate} />
    </>
  );
}
