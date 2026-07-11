/** Neutral public labels — see CHARTER.md */

export type ProductLayer = {
  order: number;
  labelEn: string;
  labelJa: string;
  descriptionEn: string;
  descriptionJa: string;
};

export type GlossaryTerm = {
  id: string;
  labelEn: string;
  labelJa: string;
  summaryEn: string;
  summaryJa: string;
  moduleEn: string;
  moduleJa: string;
  appRoute?: string;
};

export type StarField = {
  letter: "S" | "T" | "A" | "R";
  labelEn: string;
  labelJa: string;
  promptEn: string;
  promptJa: string;
};

export const PRODUCT_LAYERS: ProductLayer[] = [
  {
    order: 1,
    labelEn: "Framework",
    labelJa: "フレームワーク",
    descriptionEn:
      "STAR structures raw notes so experience becomes searchable, reusable data—not a one-off diary.",
    descriptionJa:
      "STAR でバラバラなメモを同じ粒度にそろえ、日記の一行ではなく再利用できるデータにする。",
  },
  {
    order: 2,
    labelEn: "Web app",
    labelJa: "Web アプリ",
    descriptionEn:
      "Persist, search, and connect entries in a private workspace backed by Azure.",
    descriptionJa:
      "Azure 上のワークスペースに蓄積・検索し、機能同士をつなぐ最初のステップ。",
  },
  {
    order: 3,
    labelEn: "Modules",
    labelJa: "モジュール",
    descriptionEn:
      "Summary, pipeline, and context matching turn structured records into current-state views.",
    descriptionJa:
      "サマリー・パイプライン・コンテキスト・マッチングで、記録を「いま」の状態に変換する。",
  },
];

export const STAR_FIELDS: StarField[] = [
  {
    letter: "S",
    labelEn: "Situation",
    labelJa: "状況",
    promptEn: "What was the background, scope, or constraint?",
    promptJa: "どんな背景・制約・文脈があったか。",
  },
  {
    letter: "T",
    labelEn: "Task",
    labelJa: "役割・課題",
    promptEn: "What were you responsible for or asked to deliver?",
    promptJa: "自分に求められたこと・担当したこと。",
  },
  {
    letter: "A",
    labelEn: "Action",
    labelJa: "行動",
    promptEn: "What concrete steps did you take?",
    promptJa: "実際に取った具体的なアクション。",
  },
  {
    letter: "R",
    labelEn: "Result",
    labelJa: "結果",
    promptEn: "What changed—metrics, outcomes, or learnings?",
    promptJa: "数値・成果・学びなど、何が変わったか。",
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "milestone-countdown",
    labelEn: "Milestone countdown",
    labelJa: "マイルストーン・カウントダウン",
    summaryEn:
      "Live countdown to a configurable target date—keeps the deadline visible while you work.",
    summaryJa:
      "設定した目標日までを秒単位で表示し、期限意識を常に維持する。",
    moduleEn: "Must · always visible in workspace header",
    moduleJa: "Must · ワークスペース上部に常時表示",
    appRoute: "/app",
  },
  {
    id: "achievement-journal",
    labelEn: "Achievement journal",
    labelJa: "実績ジャーナル",
    summaryEn:
      "Structured notes for milestones and deliverables. STAR fields are optional per entry.",
    summaryJa:
      "マイルストーンや成果物に関する構造化メモ。STAR 各項目は任意入力。",
    moduleEn: "Must · Journal",
    moduleJa: "Must · ジャーナル",
    appRoute: "/app/journal",
  },
  {
    id: "star",
    labelEn: "STAR",
    labelJa: "STAR 形式",
    summaryEn:
      "Situation / Task / Action / Result—a framework to capture experience in a consistent shape.",
    summaryJa:
      "Situation / Task / Action / Result の4要素で経験を同じ型にそろえるフレームワーク。",
    moduleEn: "Framework · used inside Achievement journal",
    moduleJa: "フレームワーク · 実績ジャーナル内で使用",
    appRoute: "/app/journal",
  },
  {
    id: "metrics-summary",
    labelEn: "Metrics & summary",
    labelJa: "メトリクスとサマリー",
    summaryEn:
      "Rolling KPIs plus bilingual summary text derived from your structured records.",
    summaryJa:
      "構造化した記録から KPI と日英サマリー文を常に最新化する。",
    moduleEn: "Must · Summary",
    moduleJa: "Must · サマリー",
    appRoute: "/app/summary",
  },
  {
    id: "pipeline-tracker",
    labelEn: "Pipeline tracker",
    labelJa: "パイプライン管理",
    summaryEn:
      "Kanban-style board for opportunities moving through neutral pipeline stages.",
    summaryJa:
      "オポチュニティの進捗を中立ラベルのステージでカンバン管理する。",
    moduleEn: "Must · Pipeline",
    moduleJa: "Must · パイプライン",
    appRoute: "/app/pipeline",
  },
  {
    id: "context-matching",
    labelEn: "Context matching",
    labelJa: "コンテキスト・マッチング",
    summaryEn:
      "Matches reference text against journal entries to surface relevant structured experience.",
    summaryJa:
      "参照テキストとジャーナルエントリを照合し、関連する構造化実績を引き出す。",
    moduleEn: "Should · AI-assisted (Match)",
    moduleJa: "Should · AI 支援（マッチ）",
    appRoute: "/app/match",
  },
  {
    id: "reference-text",
    labelEn: "Reference text input",
    labelJa: "参照テキスト入力",
    summaryEn:
      "Paste or import neutral reference text used as input for context matching.",
    summaryJa:
      "コンテキスト・マッチングの入力として、参照テキストを貼付または取り込む。",
    moduleEn: "Should · Match / match API",
    moduleJa: "Should · マッチ / match API",
    appRoute: "/app/match",
  },
  {
    id: "workspace",
    labelEn: "Workspace",
    labelJa: "ワークスペース",
    summaryEn:
      "Entra ID–protected /app area where personal data lives—separate from the public landing.",
    summaryJa:
      "Entra ID で保護された /app 領域。個人データは公開ランディングと分離される。",
    moduleEn: "Route · /app/*",
    moduleJa: "ルート · /app/*",
    appRoute: "/app",
  },
];
