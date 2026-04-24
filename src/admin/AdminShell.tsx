import type { SiteData, SitePage } from "../types/site";
import { PublicSite } from "../public-site/PublicSite";

type AdminShellProps = {
  site: SiteData;
  selectedPage: SitePage;
};

export function AdminShell({ site, selectedPage }: AdminShellProps) {
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
          <button disabled>Save to Firestore later</button>
        </header>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Page structure</h2>
            <p className="muted">
              This is the first stable admin shell. Editing, adding sections and
              Firestore saving comes next.
            </p>

            <div className="section-list">
              {selectedPage.sections.map((section) => (
                <div className="section-list-item" key={section.id}>
                  <strong>{section.title}</strong>
                  <span>{section.type}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="preview-panel">
            <div className="preview-frame">
              <PublicSite page={selectedPage} />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
