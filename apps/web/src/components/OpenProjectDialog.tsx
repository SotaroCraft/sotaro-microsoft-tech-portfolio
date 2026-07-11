import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles,
} from "@fluentui/react-components";
import { FolderOpenRegular } from "@fluentui/react-icons";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { OpenProjectPanel } from "./OpenProjectPanel";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  surface: {
    maxWidth: "440px",
    width: "min(440px, 94vw)",
    backgroundColor: "transparent",
    boxShadow: "none",
    padding: 0,
  },
  content: {
    padding: 0,
  },
  ghost: {
    color: "#ffffff",
    ":hover": {
      backgroundColor: azureShellColors.topBarHover,
      color: "#ffffff",
    },
  },
});

type OpenProjectDialogProps = {
  triggerClassName?: string;
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function OpenProjectDialog({
  triggerClassName,
  hideTrigger = false,
  open: openProp,
  onOpenChange,
}: OpenProjectDialogProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  return (
    <Dialog open={open} onOpenChange={(_e, data) => setOpen(data.open)}>
      {!hideTrigger && (
        <DialogTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            className={triggerClassName ?? styles.ghost}
            icon={<FolderOpenRegular />}
          >
            {t("project.openDialog")}
          </Button>
        </DialogTrigger>
      )}
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogContent className={styles.content}>
            <OpenProjectPanel
              showClose
              onClose={() => setOpen(false)}
              onOpened={() => setOpen(false)}
            />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
