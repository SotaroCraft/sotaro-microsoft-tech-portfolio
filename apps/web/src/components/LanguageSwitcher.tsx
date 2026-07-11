import {
  Dropdown,
  Option,
  makeStyles,
  mergeClasses,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { AppLocale } from "../i18n";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  dropdown: {
    minWidth: "120px",
  },
  onDark: {
    color: azureShellColors.topBarText,
  },
});

type LanguageSwitcherProps = {
  onDark?: boolean;
};

export function LanguageSwitcher({ onDark = true }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const styles = useStyles();
  const locale = i18n.language.startsWith("ja") ? "ja" : "en";

  return (
    <Dropdown
      className={mergeClasses(styles.dropdown, onDark && styles.onDark)}
      aria-label={t("language.label")}
      value={locale === "ja" ? t("language.ja") : t("language.en")}
      selectedOptions={[locale]}
      onOptionSelect={(_, data) => {
        const next = data.optionValue as AppLocale | undefined;
        if (next === "en" || next === "ja") {
          void i18n.changeLanguage(next);
        }
      }}
    >
      <Option value="en">{t("language.en")}</Option>
      <Option value="ja">{t("language.ja")}</Option>
    </Dropdown>
  );
}
