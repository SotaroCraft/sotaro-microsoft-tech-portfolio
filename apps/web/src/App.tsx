import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { AppLayout } from "./layouts/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { AppHomePage } from "./pages/AppHomePage";
import { JournalPage } from "./pages/JournalPage";
import { PipelinePage } from "./pages/PipelinePage";
import { SettingsPage } from "./pages/SettingsPage";
import { SummaryPage } from "./pages/SummaryPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <FluentProvider theme={webLightTheme}>
              <AppLayout />
            </FluentProvider>
          }
        >
          <Route index element={<AppHomePage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
