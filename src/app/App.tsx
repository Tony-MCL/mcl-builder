import { useMemo, useState } from "react";
import { demoSite } from "../data/demoSite";
import { PublicSite } from "../public-site/PublicSite";
import { AdminShell } from "../admin/AdminShell";

type AppMode = "public" | "admin";

export default function App() {
  const [mode, setMode] = useState<AppMode>("public");

  const selectedPage = useMemo(() => {
    return demoSite.pages[0];
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>Morning Coffee Labs Builder</strong>
          <span>Foundation v0.1</span>
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
        <PublicSite page={selectedPage} />
      ) : (
        <AdminShell site={demoSite} selectedPage={selectedPage} />
      )}
    </div>
  );
}
