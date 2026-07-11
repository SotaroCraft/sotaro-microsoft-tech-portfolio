import { Spinner, makeStyles } from "@fluentui/react-components";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { loginUrl, useAuth } from "../hooks/useAuth";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    gap: "12px",
    padding: "24px",
  },
});

/** Mirror SWA route auth: unauthenticated users go to Entra (or local mock login). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.assign(loginUrl("/app"));
    }
  }, [loading, isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className={styles.root}>
        <Spinner label={t("auth.checking")} />
      </div>
    );
  }

  return <>{children}</>;
}
