import {
  Body1,
  Button,
  Field,
  Input,
  makeStyles,
} from "@fluentui/react-components";
import { MILESTONE_TARGET_ISO } from "@microbootcan/shared";
import { useEffect, useState } from "react";
import { ContentPanel } from "../components/shell/ContentPanel";
import { apiFetch } from "../lib/api";
import { useUserSettings } from "../hooks/useUserSettings";

const useStyles = makeStyles({
  form: {
    display: "grid",
    gap: "12px",
    maxWidth: "520px",
  },
});

export function SettingsPage() {
  const styles = useStyles();
  const { settings, setSettings } = useUserSettings();
  const [milestoneTargetIso, setMilestoneTargetIso] = useState(
    settings?.milestoneTargetIso ?? MILESTONE_TARGET_ISO,
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.milestoneTargetIso) {
      setMilestoneTargetIso(settings.milestoneTargetIso);
    }
  }, [settings?.milestoneTargetIso]);

  async function handleSave() {
    const updated = await apiFetch<{
      milestoneTargetIso: string;
      id: string;
      userId: string;
      updatedAt: string;
    }>("/settings/milestone", {
      method: "PUT",
      body: JSON.stringify({ milestoneTargetIso }),
    });
    setSettings(updated);
    setMessage("Milestone target updated.");
  }

  return (
    <ContentPanel>
      <div className={styles.form}>
        <Field label="Milestone target ISO">
          <Input
            value={milestoneTargetIso}
            onChange={(_, data) => setMilestoneTargetIso(data.value)}
          />
        </Field>
        <Button appearance="primary" onClick={() => void handleSave()}>
          Save milestone
        </Button>
        {message && <Body1>{message}</Body1>}
      </div>
    </ContentPanel>
  );
}
