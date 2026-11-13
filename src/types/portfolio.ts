export type Language = "vi" | "en";

export interface LocalizedText {
  vi: string;
  en: string;
}

export type ProjectCategory = "all" | "imc" | "marcom-event" | "performance-b2b";

export interface HeroMetric {
  id: string;
  categoryLabel: LocalizedText;
  value: string;
  label: LocalizedText;
  subtext: LocalizedText;
}

export interface CardMiniMetric {
  value: string;
  label: LocalizedText;
}

export interface KpiComparisonItem {
  metric: LocalizedText;
  target: string;
  achieved: string;
  delta: string;
}

export interface FunnelSynergyStage {
  stageCode: "TOFU" | "MOFU" | "BOFU";
  stageName: LocalizedText;
  marcomAction: LocalizedText;
  performanceAction: LocalizedText;
  kpis: string[];
}

export interface MarcomShowcaseAsset {
  id: string;
  mediaSrc: string;
  mediaType: "image" | "video-9-16";
  aspectLabel: string;
  tag: LocalizedText;
  caption: LocalizedText;
}

export interface BudgetSplitItem {
  label: LocalizedText;
  percentage: number;
  channelNote: LocalizedText;
}

export interface DataToCreativeLoop {
  discovery: LocalizedText;
  actionTaken: LocalizedText;
  outcomeLift: LocalizedText;
  fullNarrative: LocalizedText;
}

export interface BeforeAfterMetric {
  label: LocalizedText;
  before: number;
  after: number;
  unit: string;
  displayBefore: string;
  displayAfter: string;
  deltaBadge: string;
}

export interface FeaturedProject {
  slug: string;
  category: Exclude<ProjectCategory, "all">;
  thumbnail: string;
  visualAccentCode: string;
  industryPill: LocalizedText;
  rolePill: LocalizedText;
  timeframe: string;
  budgetScale: LocalizedText;
  channels: string[];
  title: LocalizedText;
  shortSummary: LocalizedText; // strictly <= 20 words for card front
  cardMiniMetrics: [CardMiniMetric, CardMiniMetric, CardMiniMetric];
  kpiComparison: [
    KpiComparisonItem,
    KpiComparisonItem,
    KpiComparisonItem,
    KpiComparisonItem
  ];
  challenge: {
    marketContext: LocalizedText;
    marcomBottleneck: LocalizedText;
    performanceBottleneck: LocalizedText;
    customerInsight: LocalizedText;
    bigIdea: LocalizedText;
  };
  funnelSynergy: [FunnelSynergyStage, FunnelSynergyStage, FunnelSynergyStage];
  marcomShowcase: MarcomShowcaseAsset[];
  performanceProof: {
    funnelDiagramNote: LocalizedText;
    retargetingLayers: {
      layerCode: string;
      audience: LocalizedText;
      creativeHook: LocalizedText;
      conversionGoal: LocalizedText;
    }[];
    budgetSplit: BudgetSplitItem[];
    dataToCreativeLoop: DataToCreativeLoop;
  };
  retrospective: {
    beforeAfterMetrics: BeforeAfterMetric[];
    businessImpact: LocalizedText[];
    brandImpact: LocalizedText[];
    winningFormula: LocalizedText;
    whatToImprove: LocalizedText;
  };
}

export interface ArchiveProject {
  year: string;
  name: LocalizedText;
  clientType: LocalizedText;
  specialty: LocalizedText;
  highlightResult: LocalizedText;
  href?: string;
}

export interface LabShowcaseItem {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  format: "16:9" | "9:16";
  mediaType: "image" | "video-9-16";
  mediaSrc: string;
  metricBadge: string;
  hookMetric: string;
  caption: LocalizedText;
}

export interface SimulatorPreset {
  id: "b2b-lead" | "edu-admissions" | "ecommerce-retail";
  label: LocalizedText;
  badge: string;
  defaultBudgetVndM: number; // in Million VND
  defaultCpcVndK: number; // in Thousand VND
  defaultLandingCvr: number; // percentage e.g. 4.5
  defaultSqlCloseRate: number; // percentage e.g. 18
  avgDealValueVndM: number; // in Million VND per closed deal/order
  benchmarkCplVndK: number; // historical CPL benchmark in Thousand VND
  benchmarkCvr: number; // historical CVR benchmark %
  strategicNoteHigh: LocalizedText;
  strategicNoteLowCvr: LocalizedText;
  strategicNoteHighCpl: LocalizedText;
}

export interface CapabilityPillar {
  id: string;
  code: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  coreStrengths: LocalizedText[];
  deliverables: LocalizedText[];
  tools: string[];
}

export interface CareerMilestone {
  id: string;
  period: string;
  role: LocalizedText;
  organization: LocalizedText;
  badge: LocalizedText;
  achievement: LocalizedText; // strictly 1 concise sentence
}

export interface TestimonialItem {
  id: string;
  quote: LocalizedText;
  author: string;
  role: LocalizedText;
  company: LocalizedText;
  metricHighlight: string;
}

export interface CredentialItem {
  id: string;
  issuer: string;
  title: LocalizedText;
  year: string;
  credentialCode: string;
}
