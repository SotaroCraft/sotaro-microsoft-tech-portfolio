import { Body1, Button, makeStyles } from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { OpenProjectDialog } from "../components/OpenProjectDialog";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  wrap: {
    maxWidth: "420px",
    display: "grid",
    gap: "12px",
  },
  muted: {
    color: azureShellColors.mutedText,
    fontSize: "14px",
  },
});

export function AppHomePage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const [openProject, setOpenProject] = useState(false);

  return (
    <div className={styles.wrap}>
      <ContentPanel>
        <Body1 className={styles.muted}>{t("dashboard.intro")}</Body1>
        <div style={{ marginTop: "12px" }}>
          <Button appearance="primary" onClick={() => setOpenProject(true)}>
            {t("project.openDialog")}
          </Button>
        </div>
      </ContentPanel>

      <OpenProjectDialog
        hideTrigger
        open={openProject}
        onOpenChange={setOpenProject}
      />
    </div>
  );
}
