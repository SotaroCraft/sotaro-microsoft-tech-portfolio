import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FluentProvider } from "@fluentui/react-components";
import { WorkspaceShell } from "./components/shell/WorkspaceShell";
import { PublicShell } from "./components/shell/PublicShell";
import { LandingPage } from "./pages/LandingPage";
import { AppHomePage } from "./pages/AppHomePage";
import { JournalPage } from "./pages/JournalPage";
import { MatchPage } from "./pages/MatchPage";
import { InboxPage } from "./pages/InboxPage";
import { PipelinePage } from "./pages/PipelinePage";
import { SettingsPage } from "./pages/SettingsPage";
import { CharterPage } from "./pages/CharterPage";
import { SummaryPage } from "./pages/SummaryPage";
import { azureTheme } from "./theme/azureTheme";

export function App() {
  return (
    <FluentProvider theme={azureTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicShell>
                <LandingPage />
              </PublicShell>
            }
          />
          <Route
            path="/charter"
            element={
              <PublicShell>
                <CharterPage />
              </PublicShell>
            }
          />
          <Route path="/glossary" element={<Navigate to="/charter" replace />} />
          <Route path="/app" element={<WorkspaceShell />}>
            <Route index element={<AppHomePage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="match" element={<MatchPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}
