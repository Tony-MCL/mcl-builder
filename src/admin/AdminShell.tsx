import { PublicSite } from "../public-site/PublicSite";
import type {
  SiteData,
  SiteFooter,
  SiteHeader,
  SiteLink,
  SitePage,
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

const sectionTypes: SiteSectionType[] = ["hero", "text", "cta"];

function getSaveStatusLabel(status: SaveStatus) {
  if (status === "saving") return "Saving locally...";
  if (status === "saved") return "Saved locally";
  if (status === "error") return "Local save failed";
  return "Loaded from local storage";
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

            <div className="editor-group">
              <div className="admin-panel-header">
                <div>
                  <h2>Pages</h2>
                  <p className="muted">Choose or create a page.</p>
                </div>

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
            </div>

            <div className="editor-group">
              <h2>Page settings</h2>

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
            </div>

            <div className="editor-group">
              <h2>Page structure</h2>

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
            </div>
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
    <div className="editor-group no-border">
      <h2>Global layout</h2>
      <p className="muted">
        Header and footer are global. They are optional, so legal pages or landing
        pages can later use different display rules.
      </p>

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
          onChange={(event) =>
            onUpdate({
              ...link,
              label: event.target.value,
            })
          }
        />
      </label>

      <label>
        Link / slug
        <input
          value={link.href}
          onChange={(event) =>
            onUpdate({
              ...link,
              href: event.target.value,
            })
          }
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

      <label>
        Title
        <input
          value={section.title}
          onChange={(event) =>
            onUpdateSection({
              ...section,
              title: event.target.value,
            })
          }
        />
      </label>

      {(section.type === "hero" || section.subtitle !== undefined) && (
        <label>
          Subtitle
          <input
            value={section.subtitle ?? ""}
            onChange={(event) =>
              onUpdateSection({
                ...section,
                subtitle: event.target.value,
              })
            }
          />
        </label>
      )}

      <label>
        Body
        <textarea
          value={section.body ?? ""}
          onChange={(event) =>
            onUpdateSection({
              ...section,
              body: event.target.value,
            })
          }
        />
      </label>

      <label>
        Image URL
        <input
          value={section.imageUrl ?? ""}
          placeholder="https://..."
          onChange={(event) =>
            onUpdateSection({
              ...section,
              imageUrl: event.target.value,
            })
          }
        />
      </label>

      <label>
        Image alt text
        <input
          value={section.imageAlt ?? ""}
          onChange={(event) =>
            onUpdateSection({
              ...section,
              imageAlt: event.target.value,
            })
          }
        />
      </label>

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
    </div>
  );
}
