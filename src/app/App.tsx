import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../admin/AdminShell";
import { demoSite } from "../data/demoSite";
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

type AppMode = "public" | "admin";
type SaveStatus = "loaded" | "saving" | "saved" | "error";

const STORAGE_KEY = "mcl-builder-site-v1";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeSlug(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "/";
  if (trimmed === "/") return "/";

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getCurrentSlug() {
  const hash = window.location.hash.replace(/^#/, "");

  if (!hash) {
    return "/";
  }

  return normalizeSlug(hash);
}

function ensureSiteShape(site: SiteData): SiteData {
  return {
    ...site,
    header: site.header ?? {
      enabled: true,
      logoText: site.siteName,
      links: [],
    },
    footer: site.footer ?? {
      enabled: true,
      text: `© ${site.siteName}`,
      links: [],
    },
    pages: Array.isArray(site.pages) ? site.pages : demoSite.pages,
  };
}

function loadInitialSite(): SiteData {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return demoSite;
    }

    const parsed = JSON.parse(saved) as SiteData;

    if (!parsed.siteName || !Array.isArray(parsed.pages)) {
      return demoSite;
    }

    return ensureSiteShape(parsed);
  } catch {
    return demoSite;
  }
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
        buttonHref: "/",
      },
    ],
  };
}

function createSection(type: SiteSectionType): SiteSection {
  if (type === "hero") {
    return {
      id: createId("section"),
      internalName: "Hero section",
      enabled: true,
      type,
      title: "New hero section",
      subtitle: "Hero subtitle",
      body: "Write the main message for this hero section.",
      buttonLabel: "Call to action",
      buttonHref: "/",
    };
  }

  if (type === "cards") {
    return {
      id: createId("section"),
      internalName: "Cards section",
      enabled: true,
      type,
      title: "New cards section",
      subtitle: "A flexible card grid.",
      cardsColumns: 3,
      cards: [
        {
          id: createId("card"),
          title: "First card",
          body: "Write card content here.",
          linkLabel: "Read more",
          linkHref: "/",
        },
        {
          id: createId("card"),
          title: "Second card",
          body: "Write card content here.",
          linkLabel: "Read more",
          linkHref: "/",
        },
        {
          id: createId("card"),
          title: "Third card",
          body: "Write card content here.",
          linkLabel: "Read more",
          linkHref: "/",
        },
      ],
    };
  }

  if (type === "cta") {
    return {
      id: createId("section"),
      internalName: "CTA section",
      enabled: true,
      type,
      title: "New CTA section",
      body: "Write a clear action message here.",
      buttonLabel: "Get started",
      buttonHref: "/",
    };
  }

  return {
    id: createId("section"),
    internalName: "Text section",
    enabled: true,
    type,
    title: "New text section",
    body: "Write section content here.",
  };
}

function createLink(label = "New link"): SiteLink {
  return {
    id: createId("link"),
    label,
    href: "/",
  };
}

export default function App() {
  const initialSite = useMemo(() => loadInitialSite(), []);

  const [mode, setMode] = useState<AppMode>("public");
  const [site, setSite] = useState<SiteData>(initialSite);
  const [selectedPageId, setSelectedPageId] = useState(
    initialSite.pages[0]?.id ?? ""
  );
  const [currentSlug, setCurrentSlug] = useState(getCurrentSlug);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loaded");

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

  useEffect(() => {
    function handleHashChange() {
      setCurrentSlug(getCurrentSlug());
      setMode("public");
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    try {
      setSaveStatus("saving");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [site]);

  function setPublicPath(slug: string) {
    const normalizedSlug = normalizeSlug(slug);
    const basePath = import.meta.env.BASE_URL;

    window.history.pushState({}, "", `${basePath}#${normalizedSlug}`);
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

    updatePage({
      ...selectedPage,
      sections: [...selectedPage.sections, createSection(type)],
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

  function duplicateSection(sectionId: string) {
    if (!selectedPage) return;
  
    const sectionToDuplicate = selectedPage.sections.find(
      (section) => section.id === sectionId
    );
  
    if (!sectionToDuplicate) return;
  
    const duplicatedSection: SiteSection = {
      ...sectionToDuplicate,
      id: createId("section"),
      internalName: `${sectionToDuplicate.internalName ?? sectionToDuplicate.title} copy`,
      enabled: sectionToDuplicate.enabled ?? true,
      title: `${sectionToDuplicate.title} copy`,
      cards: sectionToDuplicate.cards?.map((card) => ({
        ...card,
        id: createId("card"),
      })),
    };
  
    const currentIndex = selectedPage.sections.findIndex(
      (section) => section.id === sectionId
    );
  
    const nextSections = [...selectedPage.sections];
    nextSections.splice(currentIndex + 1, 0, duplicatedSection);
  
    updatePage({
      ...selectedPage,
      sections: nextSections,
    });
  }

  function deleteSection(sectionId: string) {
    if (!selectedPage) return;

    updatePage({
      ...selectedPage,
      sections: selectedPage.sections.filter((section) => section.id !== sectionId),
    });
  }

  function moveSection(sectionId: string, direction: "up" | "down") {
    if (!selectedPage) return;

    const currentIndex = selectedPage.sections.findIndex(
      (section) => section.id === sectionId
    );

    if (currentIndex < 0) return;

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= selectedPage.sections.length) return;

    const nextSections = [...selectedPage.sections];
    const [movedSection] = nextSections.splice(currentIndex, 1);
    nextSections.splice(nextIndex, 0, movedSection);

    updatePage({
      ...selectedPage,
      sections: nextSections,
    });
  }

  function updateHeader(header: SiteHeader) {
    setSite((currentSite) => ({
      ...currentSite,
      header,
    }));
  }

  function updateFooter(footer: SiteFooter) {
    setSite((currentSite) => ({
      ...currentSite,
      footer,
    }));
  }

  function addHeaderLink() {
    updateHeader({
      ...site.header,
      links: [...site.header.links, createLink("Header link")],
    });
  }

  function addFooterLink() {
    updateFooter({
      ...site.footer,
      links: [...site.footer.links, createLink("Footer link")],
    });
  }

  function updateHeaderLink(updatedLink: SiteLink) {
    updateHeader({
      ...site.header,
      links: site.header.links.map((link) =>
        link.id === updatedLink.id ? updatedLink : link
      ),
    });
  }

  function updateFooterLink(updatedLink: SiteLink) {
    updateFooter({
      ...site.footer,
      links: site.footer.links.map((link) =>
        link.id === updatedLink.id ? updatedLink : link
      ),
    });
  }

  function deleteHeaderLink(linkId: string) {
    updateHeader({
      ...site.header,
      links: site.header.links.filter((link) => link.id !== linkId),
    });
  }

  function deleteFooterLink(linkId: string) {
    updateFooter({
      ...site.footer,
      links: site.footer.links.filter((link) => link.id !== linkId),
    });
  }

  function resetLocalSite() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSite(demoSite);
    setSelectedPageId(demoSite.pages[0]?.id ?? "");
    window.location.hash = "/";
    setCurrentSlug("/");
    setMode("admin");
    setSaveStatus("saved");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>Morning Coffee Labs Builder</strong>
          <span>Foundation v0.5</span>
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
        <PublicSite site={site} page={publicPage} onNavigate={setPublicPath} />
      ) : (
        <AdminShell
          site={site}
          selectedPage={selectedPage}
          selectedPageId={selectedPageId}
          saveStatus={saveStatus}
          onSelectPage={setSelectedPageId}
          onCreatePage={createPage}
          onUpdatePage={updatePage}
          onAddSection={addSection}
          onUpdateSection={updateSection}
          onDuplicateSection={duplicateSection}
          onDeleteSection={deleteSection}
          onMoveSection={moveSection}
          onOpenPublicPage={setPublicPath}
          onResetLocalSite={resetLocalSite}
          onUpdateHeader={updateHeader}
          onUpdateFooter={updateFooter}
          onAddHeaderLink={addHeaderLink}
          onAddFooterLink={addFooterLink}
          onUpdateHeaderLink={updateHeaderLink}
          onUpdateFooterLink={updateFooterLink}
          onDeleteHeaderLink={deleteHeaderLink}
          onDeleteFooterLink={deleteFooterLink}
        />
      )}
    </div>
  );
}
