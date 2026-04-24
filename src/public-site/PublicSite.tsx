import type {
  SiteCard,
  SiteData,
  SiteLink,
  SitePage,
  SiteSection,
} from "../types/site";

type PublicSiteProps = {
  site: SiteData;
  page: SitePage;
  onNavigate?: (href: string) => void;
  editMode?: boolean;
  onUpdateSection?: (section: SiteSection) => void;
};

function EditableText({
  value,
  onChange,
  as = "p",
  className,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}) {
  const Tag = as;

  return (
    <Tag
      className={className}
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.innerText)}
    >
      {value}
    </Tag>
  );
}

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
  page,
  onNavigate,
}: {
  site: SiteData;
  page: SitePage;
  onNavigate?: (href: string) => void;
}) {
  if (!site.header.enabled || page.hideHeader) return null;

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
  page,
  onNavigate,
}: {
  site: SiteData;
  page: SitePage;
  onNavigate?: (href: string) => void;
}) {
  if (!site.footer.enabled || page.hideFooter) return null;

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
  if (!section.imageUrl) return null;

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
  editMode,
  onUpdate,
  onNavigate,
}: {
  section: SiteSection;
  editMode?: boolean;
  onUpdate?: (section: SiteSection) => void;
  onNavigate?: (href: string) => void;
}) {
  if (!section.buttonLabel) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (!editMode && section.buttonHref) onNavigate?.(section.buttonHref);
      }}
    >
      {editMode ? (
        <EditableText
          as="span"
          value={section.buttonLabel}
          onChange={(value) => onUpdate?.({ ...section, buttonLabel: value })}
        />
      ) : (
        section.buttonLabel
      )}
    </button>
  );
}

function updateCardInSection(
  section: SiteSection,
  updatedCard: SiteCard
): SiteSection {
  return {
    ...section,
    cards: (section.cards ?? []).map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    ),
  };
}

function SectionRenderer({
  section,
  editMode,
  onUpdate,
  onNavigate,
}: {
  section: SiteSection;
  editMode?: boolean;
  onUpdate?: (section: SiteSection) => void;
  onNavigate?: (href: string) => void;
}) {
  if (section.type === "cards") {
    const columns = section.cardsColumns ?? 3;

    return (
      <section className="section cards-section">
        <div className="section-heading">
          {editMode ? (
            <EditableText
              as="h2"
              value={section.title}
              onChange={(value) => onUpdate?.({ ...section, title: value })}
            />
          ) : (
            <h2>{section.title}</h2>
          )}

          {section.subtitle &&
            (editMode ? (
              <EditableText
                value={section.subtitle}
                onChange={(value) => onUpdate?.({ ...section, subtitle: value })}
              />
            ) : (
              <p>{section.subtitle}</p>
            ))}

          {section.body &&
            (editMode ? (
              <EditableText
                value={section.body}
                onChange={(value) => onUpdate?.({ ...section, body: value })}
              />
            ) : (
              <p>{section.body}</p>
            ))}
        </div>

        <div className={`cards-grid cards-grid-${columns}`}>
          {(section.cards ?? []).map((card) => (
            <article className="public-card" key={card.id}>
              {card.imageUrl && (
                <img
                  className="public-card-image"
                  src={card.imageUrl}
                  alt={card.imageAlt || ""}
                />
              )}

              {editMode ? (
                <>
                  <EditableText
                    as="h3"
                    value={card.title}
                    onChange={(value) =>
                      onUpdate?.(
                        updateCardInSection(section, { ...card, title: value })
                      )
                    }
                  />

                  <EditableText
                    value={card.body}
                    onChange={(value) =>
                      onUpdate?.(
                        updateCardInSection(section, { ...card, body: value })
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </>
              )}

              {card.linkLabel && (
                <button
                  className="secondary-public-button"
                  type="button"
                  onClick={() => {
                    if (!editMode && card.linkHref) onNavigate?.(card.linkHref);
                  }}
                >
                  {editMode ? (
                    <EditableText
                      as="span"
                      value={card.linkLabel}
                      onChange={(value) =>
                        onUpdate?.(
                          updateCardInSection(section, {
                            ...card,
                            linkLabel: value,
                          })
                        )
                      }
                    />
                  ) : (
                    card.linkLabel
                  )}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "hero") {
    return (
      <section className="section hero-section">
        <div className="section-content">
          <div>
            <div className="eyebrow">Morning Coffee Labs</div>

            {editMode ? (
              <EditableText
                as="h1"
                value={section.title}
                onChange={(value) => onUpdate?.({ ...section, title: value })}
              />
            ) : (
              <h1>{section.title}</h1>
            )}

            {section.subtitle &&
              (editMode ? (
                <EditableText
                  as="h2"
                  value={section.subtitle}
                  onChange={(value) =>
                    onUpdate?.({ ...section, subtitle: value })
                  }
                />
              ) : (
                <h2>{section.subtitle}</h2>
              ))}

            {section.body &&
              (editMode ? (
                <EditableText
                  value={section.body}
                  onChange={(value) => onUpdate?.({ ...section, body: value })}
                />
              ) : (
                <p>{section.body}</p>
              ))}

            <SectionButton
              section={section}
              editMode={editMode}
              onUpdate={onUpdate}
              onNavigate={onNavigate}
            />
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
            {editMode ? (
              <EditableText
                as="h2"
                value={section.title}
                onChange={(value) => onUpdate?.({ ...section, title: value })}
              />
            ) : (
              <h2>{section.title}</h2>
            )}

            {section.body &&
              (editMode ? (
                <EditableText
                  value={section.body}
                  onChange={(value) => onUpdate?.({ ...section, body: value })}
                />
              ) : (
                <p>{section.body}</p>
              ))}

            <SectionButton
              section={section}
              editMode={editMode}
              onUpdate={onUpdate}
              onNavigate={onNavigate}
            />
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
          {editMode ? (
            <EditableText
              as="h2"
              value={section.title}
              onChange={(value) => onUpdate?.({ ...section, title: value })}
            />
          ) : (
            <h2>{section.title}</h2>
          )}

          {section.body &&
            (editMode ? (
              <EditableText
                value={section.body}
                onChange={(value) => onUpdate?.({ ...section, body: value })}
              />
            ) : (
              <p>{section.body}</p>
            ))}

          <SectionButton
            section={section}
            editMode={editMode}
            onUpdate={onUpdate}
            onNavigate={onNavigate}
          />
        </div>

        <SectionImage section={section} />
      </div>
    </section>
  );
}

export function PublicSite({
  site,
  page,
  onNavigate,
  editMode = false,
  onUpdateSection,
}: PublicSiteProps) {
  return (
    <>
      <PublicHeader site={site} page={page} onNavigate={onNavigate} />

      <main
        className={`public-site page-type-${page.pageType ?? "standard"} ${
          editMode ? "public-site-edit-mode" : ""
        }`}
      >
        {page.sections
          .filter((section) => section.enabled !== false)
          .map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              editMode={editMode}
              onUpdate={onUpdateSection}
              onNavigate={onNavigate}
            />
          ))}
      </main>

      <PublicFooter site={site} page={page} onNavigate={onNavigate} />
    </>
  );
}
