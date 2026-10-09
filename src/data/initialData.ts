import { UserProfile, Goal, Partnership, AppNotification, PeerMessage, PactHistoryItem } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_alex',
  email: 'alex.rivera@example.com',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  timezone: 'America/New_York (UTC-4)',
  bio: 'Studying distributed systems and preparing for certifications while maintaining evening discipline.',
  primaryCategory: 'study',
  accountabilityStyle: 'balanced',
  preferredCheckInTime: '21:00',
  reliabilityScore: 93,
  totalCommitments: 29,
  completedCommitments: 27,
  badge: 'Rock Solid',
  joinedDate: '3 months ago'
};

export const PARTNER_CANDIDATES: (UserProfile & { matchReasons: string[] })[] = [
  {
    id: 'user_david',
    email: 'david.kim@example.com',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    timezone: 'America/New_York (UTC-4)',
    bio: 'Candidate preparing for exam blocks. Need daily evening accountability to stay consistent.',
    primaryCategory: 'study',
    accountabilityStyle: 'balanced',
    preferredCheckInTime: '21:00',
    reliabilityScore: 93,
    totalCommitments: 34,
    completedCommitments: 31,
    badge: 'Steady Partner',
    joinedDate: '2 months ago',
    matchReasons: [
      'Similar study schedule (evening)',
      'Matching 90-minute daily intensity',
      'Both prefer balanced accountability'
    ]
  },
  {
    id: 'user_elena',
    email: 'elena.vance@example.com',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    timezone: 'America/New_York (UTC-4)',
    bio: 'Preparing for Bar exam case law reviews. Value no-excuse evening follow-through.',
    primaryCategory: 'study',
    accountabilityStyle: 'balanced',
    preferredCheckInTime: '21:30',
    reliabilityScore: 96,
    totalCommitments: 42,
    completedCommitments: 40,
    badge: 'Rock Solid',
    joinedDate: '4 months ago',
    matchReasons: [
      'Same timezone (America/New_York)',
      'High verified reliability (96%)',
      'Both committed to daily weekday study'
    ]
  },
  {
    id: 'user_marcus',
    email: 'marcus.t@example.com',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    timezone: 'America/New_York (UTC-4)',
    bio: 'Strength coach & conditioning trainee. Consistent 5-day lifting routine.',
    primaryCategory: 'fitness',
    accountabilityStyle: 'strict',
    preferredCheckInTime: '20:00',
    reliabilityScore: 95,
    totalCommitments: 60,
    completedCommitments: 57,
    badge: 'Rock Solid',
    joinedDate: '6 months ago',
    matchReasons: [
      'Structured 5-day fitness frequency',
      'Strict accountability preference',
      'Reliable 8:00 PM cutoff time'
    ]
  },
  {
    id: 'user_priya',
    email: 'priya.patel@example.com',
    name: 'Dr. Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    timezone: 'America/Chicago (UTC-5)',
    bio: 'Medical resident studying for board exams. Calm and consistent follow-through.',
    primaryCategory: 'study',
    accountabilityStyle: 'gentle',
    preferredCheckInTime: '22:00',
    reliabilityScore: 98,
    totalCommitments: 50,
    completedCommitments: 49,
    badge: 'Rock Solid',
    joinedDate: '5 months ago',
    matchReasons: [
      'Exam-level study commitment',
      'High follow-through record (98%)',
      'Compatible evening sync window'
    ]
  }
];

export const INITIAL_USER_GOAL: Goal = {
  id: 'goal_user_1',
  userId: 'user_alex',
  title: 'Focused Certification Study',
  category: 'study',
  commitmentStatement: '90 min focused study before 9:00 PM',
  frequencyDaysPerWeek: 5,
  commitmentDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  dailyTargetTime: '21:00',
  cycleLengthDays: 30,
  proofType: 'text_summary',
  antiExcusePledge: 'Be honest with your partner. If you fall short, report Partial or Missed instead of pretending.',
  createdAt: '2 weeks ago',
  activePartnershipId: 'partnership_active_1'
};

export const INITIAL_PARTNER_GOAL: Goal = {
  id: 'goal_partner_1',
  userId: 'user_david',
  title: 'Daily Algorithm & System Design',
  category: 'study',
  commitmentStatement: '90 min study before 9:00 PM',
  frequencyDaysPerWeek: 5,
  commitmentDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  dailyTargetTime: '21:00',
  cycleLengthDays: 30,
  proofType: 'text_summary',
  antiExcusePledge: 'Be honest with your partner. If you fall short, report Partial or Missed instead of pretending.',
  createdAt: '2 weeks ago',
  activePartnershipId: 'partnership_active_1'
};

export const INITIAL_PARTNERSHIP: Partnership = {
  id: 'partnership_active_1',
  user1Id: 'user_alex',
  user2Id: 'user_david',
  partner: PARTNER_CANDIDATES[0], // David Kim
  isPactAssist: false,
  isSolo: false,
  partnerGoal: INITIAL_PARTNER_GOAL,
  userGoal: INITIAL_USER_GOAL,
  status: 'active',
  startDate: '14 days ago',
  cycle: {
    cycleDays: 30,
    currentDay: 14,
    completedDays: 12,
    partialDays: 1,
    recoveredDays: 1,
    missedDays: 0,
    isCompleted: false
  },
  compatibilityReasons: [
    'Similar study schedule',
    'Same commitment intensity',
    'Both prefer balanced accountability'
  ],
  todayUserCheckIn: undefined, // Waiting for check-in today
  todayPartnerCheckIn: undefined, // Waiting for check-in today
  weeklyHistory: [
    { day: 'Mon', date: 'Oct 02', userStatus: 'done', partnerStatus: 'done' },
    { day: 'Tue', date: 'Oct 03', userStatus: 'done', partnerStatus: 'done' },
    { day: 'Wed', date: 'Oct 04', userStatus: 'partial', partnerStatus: 'done' },
    { day: 'Thu', date: 'Oct 05', userStatus: 'done', partnerStatus: 'done' },
    { day: 'Fri', date: 'Oct 06', userStatus: 'done', partnerStatus: 'partial' },
    { day: 'Sat', date: 'Oct 07', userStatus: 'rest', partnerStatus: 'rest' },
    { day: 'Sun', date: 'Today', userStatus: 'pending', partnerStatus: 'pending' }
  ]
};

export const INITIAL_PACT_HISTORY: PactHistoryItem[] = [
  {
    id: 'hist_1',
    title: 'CAT Preparation & Mock Tests',
    category: 'study',
    cycleDays: 30,
    completedDays: 28,
    outcome: 'completed',
    partnerName: 'David Kim',
    completedDate: 'Last month'
  },
  {
    id: 'hist_2',
    title: 'Morning Strength Habit',
    category: 'fitness',
    cycleDays: 21,
    completedDays: 19,
    outcome: 'recovered',
    partnerName: 'Marcus Thorne',
    completedDate: '2 months ago'
  }
];

export const INITIAL_MESSAGES: PeerMessage[] = [
  {
    id: 'msg_1',
    partnershipId: 'partnership_active_1',
    senderId: 'user_david',
    senderName: 'David Kim',
    message: 'Hey Alex! Ready for tonight’s session. Let’s hit 90m before 9 PM.',
    timestamp: 'Yesterday 4:15 PM'
  },
  {
    id: 'msg_2',
    partnershipId: 'partnership_active_1',
    senderId: 'user_alex',
    senderName: 'Alex Rivera',
    message: 'Locked in! Planning to do consensus protocols right after dinner.',
    timestamp: 'Yesterday 5:20 PM'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'reminder',
    title: 'Check-in Due Soon',
    message: 'Your 9:00 PM cutoff is in 1 hour. David is waiting for your update.',
    timeAgo: '1h ago',
    read: false,
    actionText: 'Check In'
  },
  {
    id: 'notif_2',
    type: 'match_ready',
    title: 'Pact Formed',
    message: 'Your 30-day Study Pact with David Kim is active.',
    timeAgo: '2w ago',
    read: true
  }
];
