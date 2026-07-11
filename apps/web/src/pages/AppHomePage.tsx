import { makeStyles } from "@fluentui/react-components";
import { useEffect } from "react";
import { OpenProjectPanel } from "../components/OpenProjectPanel";
import { useCurrentProject } from "../hooks/useCurrentProject";

const useStyles = makeStyles({
  center: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

/** Gate screen: centered open-project panel (no sidebar). */
export function AppHomePage() {
  const styles = useStyles();
  const { setCurrentProjectId } = useCurrentProject();

  useEffect(() => {
    setCurrentProjectId(null);
  }, [setCurrentProjectId]);

  return (
    <div className={styles.center}>
      <OpenProjectPanel />
    </div>
  );
}
