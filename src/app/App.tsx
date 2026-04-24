import { useMemo, useState } from "react";
import { AdminShell } from "../admin/AdminShell";
import { demoSite } from "../data/demoSite";
import { PublicSite } from "../public-site/PublicSite";
import type {
  SiteData,
  SitePage,
  SiteSection,
  SiteSectionType,
} from "../types/site";

type AppMode = "public" | "admin";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeSlug(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "/";
  }

  if (trimmed === "/") {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getCurrentSlug() {
  const pathname = window.location.pathname;
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  if (basePath && pathname.startsWith(basePath)) {
    const withoutBase = pathname.slice(basePath.length);
    return withoutBase || "/";
  }

  return pathname || "/";
}

function createEmptyPage(existingCount: number): SitePage {
  const pageNumber = existingCount + 1;

  return {
    id: createId("page"),
    slug: `/page-${pageNumber}`,
    title: `New page ${pageNumber}`,
    description: "Describe this page.",
    sections: [
      {
        id: createId("section"),
        type: "hero",
        title: `New page ${pageNumber}`,
        subtitle: "New page subtitle",
        body: "Start building this page by editing this section.",
        buttonLabel: "Edit me",
      },
    ],
  };
}

function createSection(type: SiteSectionType): SiteSection {
  if (type === "hero") {
    return {
      id: createId("section"),
      type,
      title: "New hero section",
      subtitle: "Hero subtitle",
      body: "Write the main message for this hero section.",
      buttonLabel: "Call to action",
    };
  }

  if (type === "cta") {
    return {
      id: createId("section"),
      type,
      title: "New CTA section",
      body: "Write a clear action message here.",
      buttonLabel: "Get started",
    };
  }

  return {
    id: createId("section"),
    type,
    title: "New text section",
    body: "Write section content here.",
  };
}

export default function App() {
  const [mode, setMode] = useState<AppMode>("public");
  const [site, setSite] = useState<SiteData>(demoSite);
  const [selectedPageId, setSelectedPageId] = useState(
    demoSite.pages[0]?.id ?? ""
  );
  const [currentSlug, setCurrentSlug] = useState(getCurrentSlug);

  const selectedPage = useMemo(() => {
    return site.pages.find((page) => page.id === selectedPageId) ?? site.pages[0];
  }, [selectedPageId, site.pages]);

  const publicPage = useMemo(() => {
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    return (
      site.pages.find((page) => normalizeSlug(page.slug) === normalizedCurrentSlug) ??
      site.pages[0]
    );
  }, [currentSlug, site.pages]);

  function setPublicPath(slug: string) {
    const normalizedSlug = normalizeSlug(slug);
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
    const nextPath = `${basePath}${normalizedSlug === "/" ? "/" : normalizedSlug}`;

    window.history.pushState({}, "", nextPath);
    setCurrentSlug(normalizedSlug);
    setMode("public");
  }

  function createPage() {
    const newPage = createEmptyPage(site.pages.length);

    setSite((currentSite) => ({
      ...currentSite,
      pages: [...currentSite.pages, newPage],
    }));

    setSelectedPageId(newPage.id);
    setMode("admin");
  }

  function updatePage(updatedPage: SitePage) {
    setSite((currentSite) => ({
      ...currentSite,
      pages: currentSite.pages.map((page) =>
        page.id === updatedPage.id
          ? {
              ...updatedPage,
              slug: normalizeSlug(updatedPage.slug),
            }
          : page
      ),
    }));
  }

  function addSection(type: SiteSectionType) {
    if (!selectedPage) return;

    const newSection = createSection(type);

    updatePage({
      ...selectedPage,
      sections: [...selectedPage.sections, newSection],
    });
  }

  function updateSection(updatedSection: SiteSection) {
    if (!selectedPage) return;

    updatePage({
      ...selectedPage,
      sections: selectedPage.sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      ),
    });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>Morning Coffee Labs Builder</strong>
          <span>Foundation v0.3</span>
        </div>

        <div className="mode-switch">
          <button
            className={mode === "public" ? "active" : ""}
            onClick={() => setMode("public")}
          >
            Public site
          </button>
          <button
            className={mode === "admin" ? "active" : ""}
            onClick={() => setMode("admin")}
          >
            Admin
          </button>
        </div>
      </header>

      {mode === "public" ? (
        <PublicSite page={publicPage} />
      ) : (
        <AdminShell
          site={site}
          selectedPage={selectedPage}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          onCreatePage={createPage}
          onUpdatePage={updatePage}
          onAddSection={addSection}
          onUpdateSection={updateSection}
          onOpenPublicPage={setPublicPath}
        />
      )}
    </div>
  );
}
