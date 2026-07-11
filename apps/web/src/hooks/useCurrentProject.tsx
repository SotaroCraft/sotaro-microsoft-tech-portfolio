import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Project } from "@microstar/shared";

const STORAGE_KEY = "microstar.currentProjectId";

type ProjectContextValue = {
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  rememberOpened: (project: Project) => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProjectId, setCurrentProjectIdState] = useState<string | null>(
    () => {
      try {
        return sessionStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
  );

  const setCurrentProjectId = useCallback((id: string | null) => {
    setCurrentProjectIdState(id);
    try {
      if (id) sessionStorage.setItem(STORAGE_KEY, id);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const rememberOpened = useCallback(
    (project: Project) => {
      setCurrentProjectId(project.id);
    },
    [setCurrentProjectId],
  );

  useEffect(() => {
    // Keep sessionStorage in sync if cleared externally.
  }, [currentProjectId]);

  const value = useMemo(
    () => ({ currentProjectId, setCurrentProjectId, rememberOpened }),
    [currentProjectId, setCurrentProjectId, rememberOpened],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useCurrentProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useCurrentProject must be used within ProjectProvider");
  }
  return ctx;
}
