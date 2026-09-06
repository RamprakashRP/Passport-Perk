export type TargetCity =
  | "Waterloo Region, ON"
  | "Toronto / Greater Toronto Area, ON"
  | "Vancouver / British Columbia, BC";

export type VisaType =
  | "Standard Study Permit"
  | "Post-Graduation Work Permit (PGWP)"
  | "Work Permit (LMIA / C10)"
  | "Permanent Resident (Express Entry / PNP)";

export type TargetInstitution =
  | "University of Waterloo (UW)"
  | "Wilfrid Laurier University (WLU)"
  | "Conestoga College"
  | "University of Toronto (UofT)"
  | "Toronto Metropolitan University (TMU)"
  | "York University"
  | "Humber / Seneca College"
  | "University of British Columbia (UBC)"
  | "Simon Fraser University (SFU)"
  | "BCIT / Langara College"
  | "Tech Professional / Relocating Specialist";

export type TimelineStage = "t_minus_45" | "transit_border" | "post_arrival";

export type PriorityTier =
  | "tier_1_mandatory"
  | "tier_2_essential"
  | "tier_3_perks";

export type TaskCategory =
  | "banking"
  | "telecom"
  | "housing"
  | "immigration"
  | "transit"
  | "health"
  | "academic"
  | "lifestyle";

export interface BankComparisonOption {
  id: string;
  partnerId: string;
  bankName: string;
  accountPackage: string;
  welcomeBonus: string;
  gicProcessingFee: string;
  monthlyFee: string;
  waterlooProximity: string;
  waterlooAddress: string;
  keyPerks: string[];
  ctaLink: string;
  ctaLabel: string;
  isRecommendedFor?: string;
  isDigitalOnly?: boolean;
}

export interface UserIntake {
  targetCity: TargetCity;
  visa_type: VisaType;
  arrival_date: string;
  intakeMonth: string;
  institution: TargetInstitution;
  hasGIC: "yes" | "yes_20635" | "yes_23448" | "no" | "in_progress";
  gicAmountTier?: "20635" | "23448";
  hasHousing: "yes" | "no" | "searching";
  hasSim: "yes" | "no";
  createdAt?: string;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  timelineStage: TimelineStage;
  priorityTier: PriorityTier;
  category: TaskCategory;
  isComplete: boolean;
  cta_label: string;
  cta_link: string;
  partnerId?: string;
  isAffiliate?: boolean;
  affiliatePartner?: string;
  affiliateBadge?: string;
  affiliateDiscount?: string;
  estimatedTime?: string;
  impactLevel?: "Critical" | "High" | "Recommended";
  localWaterlooTip?: string;
  keyRequirements?: string[];
  bankComparisonOptions?: BankComparisonOption[];
}

export interface TimelineStageInfo {
  id: TimelineStage;
  title: string;
  timeframe: string;
  description: string;
  badge: string;
}

export interface ChecklistStats {
  total: number;
  completed: number;
  percentage: number;
  criticalPending: number;
  stageProgress: Record<TimelineStage, { total: number; completed: number; percentage: number }>;
  tierProgress: Record<PriorityTier, { total: number; completed: number; percentage: number }>;
}

export interface TelemetryEventPayload {
  event_name: "outbound_click" | "page_view" | "intake_completed" | "task_toggled" | "bank_compared" | "feedback_submitted";
  partner_id?: string;
  category?: TaskCategory | string;
  destination_url?: string;
  timestamp: string;
  session_id: string;
  position_on_page?: string;
  user_intake_stage?: string;
  properties?: Record<string, any>;
}

export type FeedbackType = "perk_suggestion" | "bug_report" | "general_feedback";

export type FeedbackCategory =
  | "banking"
  | "telecom"
  | "housing"
  | "transit"
  | "lifestyle"
  | "immigration"
  | "ui_glitch"
  | "calculation_error"
  | "feature_request"
  | "general";

export interface FeedbackSubmission {
  id: string;
  type: FeedbackType;
  title: string;
  category: FeedbackCategory;
  description: string;
  // Specific for Perk Suggestions
  partnerName?: string;
  promoCode?: string;
  dealUrl?: string;
  estimatedSavings?: string;
  region?: string;
  // Specific for Bug Reports
  pageUrl?: string;
  browserInfo?: string;
  severity?: "low" | "medium" | "critical";
  // User info
  userEmail?: string;
  userName?: string;
  userId?: string;
  submittedAt: string;
  status?: "pending_review" | "approved" | "resolved" | "archived";
}

