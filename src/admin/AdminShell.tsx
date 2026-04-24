import { PublicSite } from "../public-site/PublicSite";
import type {
  SiteData,
  SitePage,
  SiteSection,
  SiteSectionType,
} from "../types/site";

type AdminShellProps = {
  site: SiteData;
  selectedPage: SitePage;
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
  onCreatePage: () => void;
  onUpdatePage: (page: SitePage) => void;
  onAddSection: (type: SiteSectionType) => void;
  onUpdateSection: (section: SiteSection) => void;
  onOpenPublicPage: (slug: string) => void;
};

const sectionTypes: SiteSectionType[] = ["hero", "text", "cta"];

export function AdminShell({
  site,
  selectedPage,
  selectedPageId,
  onSelectPage,
  onCreatePage,
  onUpdatePage,
  onAddSection,
  onUpdateSection,
  onOpenPublicPage,
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
          </div>

          <div className="admin-header-actions">
            <button onClick={() => onOpenPublicPage(selectedPage.slug)}>
              Open public page
            </button>
            <button disabled>Save to Firestore later</button>
          </div>
        </header>

        <div className="admin-grid">
          <section className="admin-panel">
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
                {selectedPage.sections.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdateSection={onUpdateSection}
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
              <PublicSite page={selectedPage} />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function SectionEditor({
  section,
  onUpdateSection,
}: {
  section: SiteSection;
  onUpdateSection: (section: SiteSection) => void;
}) {
  return (
    <div className="section-editor">
      <div className="section-editor-header">
        <strong>{section.title || "Untitled section"}</strong>
        <span>{section.type}</span>
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

      {(section.type === "hero" || section.type === "cta") && (
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
      )}
    </div>
  );
}
