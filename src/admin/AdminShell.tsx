import { useState } from "react";
import { PublicSite } from "../public-site/PublicSite";
import type {
  SiteCard,
  SiteData,
  SiteFooter,
  SiteHeader,
  SiteLink,
  SitePage,
  SitePageType,
  SiteSection,
  SiteSectionType,
} from "../types/site";

type SaveStatus = "loaded" | "saving" | "saved" | "error";

type AdminShellProps = {
  site: SiteData;
  selectedPage: SitePage;
  selectedPageId: string;
  saveStatus: SaveStatus;
  onSelectPage: (pageId: string) => void;
  onCreatePage: () => void;
  onUpdatePage: (page: SitePage) => void;
  onAddSection: (type: SiteSectionType) => void;
  onUpdateSection: (section: SiteSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
  onOpenPublicPage: (slug: string) => void;
  onResetLocalSite: () => void;
  onUpdateHeader: (header: SiteHeader) => void;
  onUpdateFooter: (footer: SiteFooter) => void;
  onAddHeaderLink: () => void;
  onAddFooterLink: () => void;
  onUpdateHeaderLink: (link: SiteLink) => void;
  onUpdateFooterLink: (link: SiteLink) => void;
  onDeleteHeaderLink: (linkId: string) => void;
  onDeleteFooterLink: (linkId: string) => void;
};

const sectionTypes: SiteSectionType[] = ["hero", "text", "cards", "cta"];
const pageTypes: SitePageType[] = ["standard", "landing", "legal"];

function getSaveStatusLabel(status: SaveStatus) {
  if (status === "saving") return "Saving locally...";
  if (status === "saved") return "Saved locally";
  if (status === "error") return "Local save failed";
  return "Loaded from local storage";
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptyCard(): SiteCard {
  return {
    id: createLocalId("card"),
    title: "New card",
    body: "Write card content here.",
    linkLabel: "Read more",
    linkHref: "/",
  };
}

export function AdminShell({
  site,
  selectedPage,
  selectedPageId,
  saveStatus,
  onSelectPage,
  onCreatePage,
  onUpdatePage,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
  onOpenPublicPage,
  onResetLocalSite,
  onUpdateHeader,
  onUpdateFooter,
  onAddHeaderLink,
  onAddFooterLink,
  onUpdateHeaderLink,
  onUpdateFooterLink,
  onDeleteHeaderLink,
  onDeleteFooterLink,
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-label">Admin</p>
          <h2>{site.siteName}</h2>
        </div>

        <nav className="admin-nav">
          <button className="active">Pages</button>
          <button disabled>Builder</button>
          <button disabled>Messages</button>
          <button disabled>Analytics</button>
          <button disabled>Settings</button>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-label">Selected page</p>
            <h1>{selectedPage.title}</h1>
            <p className={`save-status save-status-${saveStatus}`}>
              {getSaveStatusLabel(saveStatus)}
            </p>
          </div>

          <div className="admin-header-actions">
            <button onClick={() => onOpenPublicPage(selectedPage.slug)}>
              Open public page
            </button>
            <button className="secondary-button" onClick={onResetLocalSite}>
              Reset local data
            </button>
            <button disabled>Firestore later</button>
          </div>
        </header>

        <div className="admin-grid">
          <section className="admin-panel">
            <CollapsiblePanel title="Global layout" defaultOpen>
              <GlobalLayoutEditor
                site={site}
                onUpdateHeader={onUpdateHeader}
                onUpdateFooter={onUpdateFooter}
                onAddHeaderLink={onAddHeaderLink}
                onAddFooterLink={onAddFooterLink}
                onUpdateHeaderLink={onUpdateHeaderLink}
                onUpdateFooterLink={onUpdateFooterLink}
                onDeleteHeaderLink={onDeleteHeaderLink}
                onDeleteFooterLink={onDeleteFooterLink}
              />
            </CollapsiblePanel>

            <CollapsiblePanel title="Pages" defaultOpen>
              <div className="admin-panel-header compact">
                <p className="muted">Choose or create a page.</p>
                <button onClick={onCreatePage}>New page</button>
              </div>

              <div className="page-list">
                {site.pages.map((page) => (
                  <button
                    key={page.id}
                    className={
                      page.id === selectedPageId ? "page-item active" : "page-item"
                    }
                    onClick={() => onSelectPage(page.id)}
                  >
                    <strong>{page.title}</strong>
                    <span>{page.slug}</span>
                  </button>
                ))}
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel title="Page settings" defaultOpen>
              <PageSettingsEditor
                selectedPage={selectedPage}
                onUpdatePage={onUpdatePage}
              />
            </CollapsiblePanel>

            <CollapsiblePanel title="Page structure" defaultOpen>
              <div className="add-section-row">
                {sectionTypes.map((type) => (
                  <button key={type} onClick={() => onAddSection(type)}>
                    Add {type}
                  </button>
                ))}
              </div>

              <div className="section-list">
                {selectedPage.sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    isFirst={index === 0}
                    isLast={index === selectedPage.sections.length - 1}
                    onUpdateSection={onUpdateSection}
                    onDeleteSection={onDeleteSection}
                    onMoveSection={onMoveSection}
                  />
                ))}
              </div>
            </CollapsiblePanel>
          </section>

          <section className="preview-panel">
            <div className="preview-toolbar">
              <div>
                <p className="admin-label">Live preview</p>
                <h2>{selectedPage.title}</h2>
              </div>
            </div>

            <div className="preview-frame">
              <PublicSite
                site={site}
                page={selectedPage}
                onNavigate={onOpenPublicPage}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function CollapsiblePanel({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="control-panel">
      <button
        className="control-panel-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && <div className="control-panel-body">{children}</div>}
    </section>
  );
}

function PageSettingsEditor({
  selectedPage,
  onUpdatePage,
}: {
  selectedPage: SitePage;
  onUpdatePage: (page: SitePage) => void;
}) {
  return (
    <div className="field-stack">
      <label>
        Page title
        <input
          value={selectedPage.title}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              title: event.target.value,
            })
          }
        />
      </label>

      <label>
        Slug
        <input
          value={selectedPage.slug}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              slug: event.target.value,
            })
          }
        />
      </label>

      <label>
        Description
        <textarea
          value={selectedPage.description}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              description: event.target.value,
            })
          }
        />
      </label>

      <label>
        Page type
        <select
          value={selectedPage.pageType ?? "standard"}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              pageType: event.target.value as SitePageType,
            })
          }
        >
          {pageTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={selectedPage.hideHeader ?? false}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              hideHeader: event.target.checked,
            })
          }
        />
        Hide header on this page
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={selectedPage.hideFooter ?? false}
          onChange={(event) =>
            onUpdatePage({
              ...selectedPage,
              hideFooter: event.target.checked,
            })
          }
        />
        Hide footer on this page
      </label>
    </div>
  );
}

function GlobalLayoutEditor({
  site,
  onUpdateHeader,
  onUpdateFooter,
  onAddHeaderLink,
  onAddFooterLink,
  onUpdateHeaderLink,
  onUpdateFooterLink,
  onDeleteHeaderLink,
  onDeleteFooterLink,
}: {
  site: SiteData;
  onUpdateHeader: (header: SiteHeader) => void;
  onUpdateFooter: (footer: SiteFooter) => void;
  onAddHeaderLink: () => void;
  onAddFooterLink: () => void;
  onUpdateHeaderLink: (link: SiteLink) => void;
  onUpdateFooterLink: (link: SiteLink) => void;
  onDeleteHeaderLink: (linkId: string) => void;
  onDeleteFooterLink: (linkId: string) => void;
}) {
  return (
    <div className="field-stack">
      <div className="layout-box">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={site.header.enabled}
            onChange={(event) =>
              onUpdateHeader({
                ...site.header,
                enabled: event.target.checked,
              })
            }
          />
          Show header
        </label>

        <label>
          Header logo/text
          <input
            value={site.header.logoText}
            onChange={(event) =>
              onUpdateHeader({
                ...site.header,
                logoText: event.target.value,
              })
            }
          />
        </label>

        <div className="link-editor-header">
          <strong>Header links</strong>
          <button type="button" onClick={onAddHeaderLink}>
            Add link
          </button>
        </div>

        <div className="link-list">
          {site.header.links.map((link) => (
            <LinkEditor
              key={link.id}
              link={link}
              onUpdate={onUpdateHeaderLink}
              onDelete={onDeleteHeaderLink}
            />
          ))}
        </div>
      </div>

      <div className="layout-box">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={site.footer.enabled}
            onChange={(event) =>
              onUpdateFooter({
                ...site.footer,
                enabled: event.target.checked,
              })
            }
          />
          Show footer
        </label>

        <label>
          Footer text
          <textarea
            value={site.footer.text}
            onChange={(event) =>
              onUpdateFooter({
                ...site.footer,
                text: event.target.value,
              })
            }
          />
        </label>

        <div className="link-editor-header">
          <strong>Footer links</strong>
          <button type="button" onClick={onAddFooterLink}>
            Add link
          </button>
        </div>

        <div className="link-list">
          {site.footer.links.map((link) => (
            <LinkEditor
              key={link.id}
              link={link}
              onUpdate={onUpdateFooterLink}
              onDelete={onDeleteFooterLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkEditor({
  link,
  onUpdate,
  onDelete,
}: {
  link: SiteLink;
  onUpdate: (link: SiteLink) => void;
  onDelete: (linkId: string) => void;
}) {
  return (
    <div className="link-editor">
      <label>
        Label
        <input
          value={link.label}
          onChange={(event) => onUpdate({ ...link, label: event.target.value })}
        />
      </label>

      <label>
        Link / slug
        <input
          value={link.href}
          onChange={(event) => onUpdate({ ...link, href: event.target.value })}
        />
      </label>

      <button
        className="danger-button"
        type="button"
        onClick={() => onDelete(link.id)}
      >
        Delete
      </button>
    </div>
  );
}

function SectionEditor({
  section,
  isFirst,
  isLast,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
}: {
  section: SiteSection;
  isFirst: boolean;
  isLast: boolean;
  onUpdateSection: (section: SiteSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
}) {
  function addCard() {
    onUpdateSection({
      ...section,
      cards: [...(section.cards ?? []), createEmptyCard()],
    });
  }

  function updateCard(updatedCard: SiteCard) {
    onUpdateSection({
      ...section,
      cards: (section.cards ?? []).map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    });
  }

  function deleteCard(cardId: string) {
    onUpdateSection({
      ...section,
      cards: (section.cards ?? []).filter((card) => card.id !== cardId),
    });
  }

  return (
    <div className="section-editor">
      <div className="section-editor-header">
        <div>
          <strong>{section.title || "Untitled section"}</strong>
          <span>{section.type}</span>
        </div>

        <div className="section-actions">
          <button
            className="secondary-button tiny-button"
            type="button"
            disabled={isFirst}
            onClick={() => onMoveSection(section.id, "up")}
          >
            Up
          </button>
          <button
            className="secondary-button tiny-button"
            type="button"
            disabled={isLast}
            onClick={() => onMoveSection(section.id, "down")}
          >
            Down
          </button>
          <button
            className="danger-button tiny-button"
            type="button"
            onClick={() => onDeleteSection(section.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="field-stack">
        <label>
          Title
          <input
            value={section.title}
            onChange={(event) =>
              onUpdateSection({ ...section, title: event.target.value })
            }
          />
        </label>

        {(section.type === "hero" ||
          section.type === "cards" ||
          section.subtitle !== undefined) && (
          <label>
            Subtitle
            <input
              value={section.subtitle ?? ""}
              onChange={(event) =>
                onUpdateSection({ ...section, subtitle: event.target.value })
              }
            />
          </label>
        )}

        {section.type !== "cards" && (
          <label>
            Body
            <textarea
              value={section.body ?? ""}
              onChange={(event) =>
                onUpdateSection({ ...section, body: event.target.value })
              }
            />
          </label>
        )}

        {section.type !== "cards" && (
          <>
            <label>
              Image URL
              <input
                value={section.imageUrl ?? ""}
                placeholder="https://..."
                onChange={(event) =>
                  onUpdateSection({ ...section, imageUrl: event.target.value })
                }
              />
            </label>

            <label>
              Image alt text
              <input
                value={section.imageAlt ?? ""}
                onChange={(event) =>
                  onUpdateSection({ ...section, imageAlt: event.target.value })
                }
              />
            </label>
          </>
        )}

        {(section.type === "hero" || section.type === "cta") && (
          <>
            <label>
              Button label
              <input
                value={section.buttonLabel ?? ""}
                onChange={(event) =>
                  onUpdateSection({
                    ...section,
                    buttonLabel: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Button link / slug
              <input
                value={section.buttonHref ?? ""}
                placeholder="/products"
                onChange={(event) =>
                  onUpdateSection({
                    ...section,
                    buttonHref: event.target.value,
                  })
                }
              />
            </label>
          </>
        )}

        {section.type === "cards" && (
          <div className="cards-editor">
            <div className="link-editor-header">
              <strong>Cards</strong>
              <button type="button" onClick={addCard}>
                Add card
              </button>
            </div>

            <div className="card-editor-list">
              {(section.cards ?? []).map((card) => (
                <CardEditor
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CardEditor({
  card,
  onUpdate,
  onDelete,
}: {
  card: SiteCard;
  onUpdate: (card: SiteCard) => void;
  onDelete: (cardId: string) => void;
}) {
  return (
    <div className="card-editor">
      <label>
        Card title
        <input
          value={card.title}
          onChange={(event) => onUpdate({ ...card, title: event.target.value })}
        />
      </label>

      <label>
        Card text
        <textarea
          value={card.body}
          onChange={(event) => onUpdate({ ...card, body: event.target.value })}
        />
      </label>

      <label>
        Image URL
        <input
          value={card.imageUrl ?? ""}
          placeholder="https://..."
          onChange={(event) =>
            onUpdate({ ...card, imageUrl: event.target.value })
          }
        />
      </label>

      <label>
        Image alt text
        <input
          value={card.imageAlt ?? ""}
          onChange={(event) =>
            onUpdate({ ...card, imageAlt: event.target.value })
          }
        />
      </label>

      <label>
        Link label
        <input
          value={card.linkLabel ?? ""}
          onChange={(event) =>
            onUpdate({ ...card, linkLabel: event.target.value })
          }
        />
      </label>

      <label>
        Link / slug
        <input
          value={card.linkHref ?? ""}
          onChange={(event) =>
            onUpdate({ ...card, linkHref: event.target.value })
          }
        />
      </label>

      <button
        className="danger-button"
        type="button"
        onClick={() => onDelete(card.id)}
      >
        Delete card
      </button>
    </div>
  );
}
