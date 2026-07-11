import {
  Body1,
  Button,
  Field,
  Input,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { MILESTONE_TARGET_ISO } from "@microbootcan/shared";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useUserSettings } from "../hooks/useUserSettings";

const useStyles = makeStyles({
  form: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
    padding: "16px",
    maxWidth: "480px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
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
    <section>
      <Title2>Workspace settings</Title2>
      <Body1>Configure milestone countdown target (ISO 8601 with offset).</Body1>

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
    </section>
  );
}
