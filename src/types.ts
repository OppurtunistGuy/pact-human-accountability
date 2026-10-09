export type GoalCategory = 'study' | 'fitness';
export type AccountabilityStyle = 'gentle' | 'balanced' | 'strict';
export type CheckInStatus = 'done' | 'partial' | 'missed';
export type ProofType = 'text_summary' | 'photo_link' | 'binary_honor';
export type PartnershipStatus = 'pending' | 'active' | 'recovering' | 'dissolved' | 'completed' | 'solo';
export type RecoveryAction = 'complete_work' | 'smaller_version' | 'reschedule' | 'cannot_recover';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  timezone: string;
  bio: string;
  primaryCategory: GoalCategory;
  accountabilityStyle: AccountabilityStyle;
  preferredCheckInTime: string; // e.g. "21:00"
  reliabilityScore: number; // 0 - 100
  totalCommitments: number;
  completedCommitments: number;
  badge: 'Rock Solid' | 'Steady Partner' | 'Rising' | 'Building Trust';
  joinedDate: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: GoalCategory;
  commitmentStatement: string; // e.g. "2 hours focused study before 10 PM"
  frequencyDaysPerWeek: number; // e.g. 5
  commitmentDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  dailyTargetTime: string; // e.g. "21:00"
  cycleLengthDays: number; // e.g. 14, 21, or 30 days
  proofType: ProofType;
  antiExcusePledge: string;
  createdAt: string;
  activePartnershipId?: string;
}

export interface CheckIn {
  id: string;
  partnershipId: string;
  userId: string;
  goalId: string;
  date: string; // YYYY-MM-DD
  status: CheckInStatus;
  note?: string;
  proof?: string;
  timestamp: string;
  partnerReaction?: 'pact_kept' | 'solid' | 'nudge' | 'respect';
  partnerNote?: string;
}

export interface RecoveryProtocol {
  id: string;
  partnershipId: string;
  userId: string;
  missedDate: string;
  reason: string;
  actionType: RecoveryAction;
  makeUpAction: string;
  deadlineHoursRemaining: number;
  status: 'pending' | 'resolved' | 'expired';
}

export interface PactCycle {
  cycleDays: number; // e.g. 30
  currentDay: number; // e.g. 14
  completedDays: number;
  partialDays: number;
  recoveredDays: number;
  missedDays: number;
  isCompleted: boolean;
}

export interface Partnership {
  id: string;
  user1Id: string;
  user2Id: string;
  partner?: UserProfile; // If human partner; undefined if Pact Assist / Solo
  isPactAssist?: boolean;
  isSolo?: boolean;
  partnerGoal?: Goal;
  userGoal: Goal;
  status: PartnershipStatus;
  startDate: string;
  cycle: PactCycle;
  compatibilityReasons: string[];
  todayUserCheckIn?: CheckIn;
  todayPartnerCheckIn?: CheckIn;
  weeklyHistory: {
    day: string;
    date: string;
    userStatus: CheckInStatus | 'pending' | 'rest';
    partnerStatus: CheckInStatus | 'pending' | 'rest';
  }[];
  activeRecovery?: RecoveryProtocol;
}

export interface MatchingState {
  proposalsUsedThisWeek: number; // max 2 for Free V1
  waitingHours: number; // if >= 48, triggers Pact Assist offer
  pactAssistOffered: boolean;
  isSearching: boolean;
}

export interface PactHistoryItem {
  id: string;
  title: string;
  category: GoalCategory;
  cycleDays: number;
  completedDays: number;
  outcome: 'completed' | 'recovered' | 'solo_finished';
  partnerName?: string;
  completedDate: string;
}

export interface AppNotification {
  id: string;
  type: 'partner_checkin' | 'nudge' | 'reminder' | 'match_ready' | 'recovery' | 'pact_assist';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  actionText?: string;
}

export interface PeerMessage {
  id: string;
  partnershipId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isQuickNudge?: boolean;
}
