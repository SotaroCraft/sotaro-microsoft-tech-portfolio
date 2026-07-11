import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FluentProvider } from "@fluentui/react-components";
import { RequireAuth } from "./components/RequireAuth";
import { WorkspaceShell } from "./components/shell/WorkspaceShell";
import { AppHomePage } from "./pages/AppHomePage";
import { JournalPage } from "./pages/JournalPage";
import { MatchPage } from "./pages/MatchPage";
import { InboxPage } from "./pages/InboxPage";
import { PipelinePage } from "./pages/PipelinePage";
import { SettingsPage } from "./pages/SettingsPage";
import { CharterPage } from "./pages/CharterPage";
import { SummaryPage } from "./pages/SummaryPage";
import { ProjectWorkspacePage } from "./pages/ProjectWorkspacePage";
import { ProjectProvider } from "./hooks/useCurrentProject";
import { azureTheme } from "./theme/azureTheme";

export function App() {
  return (
    <FluentProvider theme={azureTheme}>
      <BrowserRouter>
        <RequireAuth>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route
                path="/charter"
                element={<Navigate to="/app/charter" replace />}
              />
              <Route
                path="/glossary"
                element={<Navigate to="/app/charter" replace />}
              />
              <Route path="/app" element={<WorkspaceShell />}>
                <Route index element={<AppHomePage />} />
                <Route
                  path="projects/:projectId"
                  element={<ProjectWorkspacePage />}
                />
                <Route path="journal" element={<JournalPage />} />
                <Route path="match" element={<MatchPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="pipeline" element={<PipelinePage />} />
                <Route path="summary" element={<SummaryPage />} />
                <Route path="charter" element={<CharterPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </ProjectProvider>
        </RequireAuth>
      </BrowserRouter>
    </FluentProvider>
  );
}
