import { Body1, makeStyles, tokens } from "@fluentui/react-components";
import { Outlet } from "react-router-dom";
import { StickyCountdown } from "../components/StickyCountdown";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  main: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
});

export function AppLayout() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <StickyCountdown />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer style={{ padding: "16px 24px", textAlign: "center" }}>
        <Body1>Authenticated workspace — personal data stays private.</Body1>
      </footer>
    </div>
  );
}
