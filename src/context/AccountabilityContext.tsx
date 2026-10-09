import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Goal,
  Partnership,
  CheckIn,
  AppNotification,
  PeerMessage,
  CheckInStatus,
  AccountabilityStyle,
  GoalCategory,
  RecoveryProtocol,
  RecoveryAction,
  PactHistoryItem,
  MatchingState
} from '../types';
import {
  CURRENT_USER,
  PARTNER_CANDIDATES,
  INITIAL_USER_GOAL,
  INITIAL_PARTNER_GOAL,
  INITIAL_PARTNERSHIP,
  INITIAL_PACT_HISTORY,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { calculateReliability } from '../lib/pactEngine';

interface AccountabilityContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile;
  activeGoal: Goal;
  partnership: Partnership | null;
  candidates: (UserProfile & { matchReasons: string[] })[];
  notifications: AppNotification[];
  messages: PeerMessage[];
  pactHistory: PactHistoryItem[];
  matchingState: MatchingState;
  unreadNotifsCount: number;

  // Auth actions
  login: (email: string) => void;
  signUp: (name: string, email: string, timezone: string) => void;
  signOut: () => void;

  // Core Daily Flow
  submitCheckIn: (status: CheckInStatus, note?: string, proof?: string) => void;
  reactToPartnerCheckIn: (reaction: 'pact_kept' | 'solid' | 'nudge' | 'respect', note?: string) => void;
  sendNudge: (customMessage?: string) => void;
  sendMessage: (text: string) => void;

  // Recovery & Rematch & Solo
  resolveRecovery: (actionType: RecoveryAction, details: string) => void;
  requestRematch: (reason: string) => void;
  continueSolo: () => void;

  // Matching & Proposals (Free V1 max 2 per 7 days)
  consumeMatchProposal: () => void;
  acceptMatchWithCandidate: (candidateId: string) => void;
  startWithPactAssist: () => void;
  transitionPactAssistToHuman: (candidateId: string) => void;

  // Cycle Completion
  completePactCycle: () => void;
  startNewPact: (goalData: {
    title: string;
    category: GoalCategory;
    commitmentStatement: string;
    frequencyDaysPerWeek: number;
    commitmentDays: string[];
    dailyTargetTime: string;
    cycleLengthDays: number;
  }) => void;

  // Goals & Preferences
  updateGoal: (goalUpdates: Partial<Goal>) => void;
  updatePreferences: (prefs: {
    style: AccountabilityStyle;
    checkInTime: string;
    timezone: string;
  }) => void;
  markNotificationsRead: () => void;
}

const STORAGE_KEY = 'pact_free_v1_state';

const AccountabilityContext = createContext<AccountabilityContextType | undefined>(undefined);

export const AccountabilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [activeGoal, setActiveGoal] = useState<Goal>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goal`);
    return saved ? JSON.parse(saved) : INITIAL_USER_GOAL;
  });

  const [partnership, setPartnership] = useState<Partnership | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_partnership`);
    if (saved !== null) {
      return saved === 'null' ? null : JSON.parse(saved);
    }
    return INITIAL_PARTNERSHIP;
  });

  const [candidates] = useState<(UserProfile & { matchReasons: string[] })[]>(PARTNER_CANDIDATES);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [messages, setMessages] = useState<PeerMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [pactHistory, setPactHistory] = useState<PactHistoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
    return saved ? JSON.parse(saved) : INITIAL_PACT_HISTORY;
  });

  const [matchingState, setMatchingState] = useState<MatchingState>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_match_state`);
    return saved ? JSON.parse(saved) : {
      proposalsUsedThisWeek: 0,
      waitingHours: 0,
      pactAssistOffered: false,
      isSearching: false
    };
  });

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goal`, JSON.stringify(activeGoal));
  }, [activeGoal]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_partnership`, JSON.stringify(partnership));
  }, [partnership]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(pactHistory));
  }, [pactHistory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_match_state`, JSON.stringify(matchingState));
  }, [matchingState]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timeAgo' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timeAgo: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth
  const login = (email: string) => {
    setIsAuthenticated(true);
    if (email === CURRENT_USER.email) {
      setCurrentUser(CURRENT_USER);
      setPartnership(INITIAL_PARTNERSHIP);
    } else {
      const derivedName = email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
      setCurrentUser(prev => ({
        ...prev,
        id: `user_${Date.now()}`,
        name: derivedName,
        email: email,
        reliabilityScore: 100,
        totalCommitments: 0,
        completedCommitments: 0
      }));
      setPartnership(null);
    }
  };

  const signUp = (name: string, email: string, timezone: string) => {
    setIsAuthenticated(true);
    setCurrentUser(prev => ({
      ...prev,
      id: `user_${Date.now()}`,
      name,
      email,
      timezone,
      reliabilityScore: 100,
      totalCommitments: 0,
      completedCommitments: 0,
      joinedDate: 'Today'
    }));
    // New user starts unmatched
    setPartnership(null);
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  // Check-In
  const submitCheckIn = (status: CheckInStatus, note?: string, proof?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const checkInRecord: CheckIn = {
      id: `chk_${Date.now()}`,
      partnershipId: partnership ? partnership.id : 'solo',
      userId: currentUser.id,
      goalId: activeGoal.id,
      date: todayStr,
      status,
      note,
      proof,
      timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    if (partnership) {
      let activeRecovery: RecoveryProtocol | undefined = partnership.activeRecovery;

      if (status === 'missed') {
        activeRecovery = {
          id: `rec_${Date.now()}`,
          partnershipId: partnership.id,
          userId: currentUser.id,
          missedDate: todayStr,
          reason: note || 'Missed commitment today',
          actionType: 'complete_work',
          makeUpAction: 'Submit recovery plan',
          deadlineHoursRemaining: 24,
          status: 'pending'
        };
        addNotification({
          type: 'recovery',
          title: 'Recovery Window Started (24h)',
          message: 'You reported a missed commitment. Recovery make-up is active to protect your partnership.'
        });
      } else if (status === 'done') {
        addNotification({
          type: 'reminder',
          title: 'Commitment Kept',
          message: partnership.partner 
            ? `Your check-in was logged. ${partnership.partner.name} will see your progress.`
            : 'Your check-in was confirmed.'
        });
      }

      // Update user reliability metrics
      setCurrentUser(prev => {
        const completedDelta = status === 'done' ? 1 : 0;
        const partialDelta = status === 'partial' ? 1 : 0;
        const newTotal = prev.totalCommitments + 1;
        const newCompleted = prev.completedCommitments + completedDelta;
        const newScore = calculateReliability(newCompleted, newTotal, partialDelta);
        return {
          ...prev,
          totalCommitments: newTotal,
          completedCommitments: newCompleted,
          reliabilityScore: newScore
        };
      });

      // Update cycle days
      const currentDay = Math.min(partnership.cycle.cycleDays, partnership.cycle.currentDay + 1);
      const isCompleted = currentDay >= partnership.cycle.cycleDays;

      setPartnership(prev => {
        if (!prev) return null;
        return {
          ...prev,
          todayUserCheckIn: checkInRecord,
          activeRecovery,
          cycle: {
            ...prev.cycle,
            currentDay,
            completedDays: status === 'done' ? prev.cycle.completedDays + 1 : prev.cycle.completedDays,
            partialDays: status === 'partial' ? prev.cycle.partialDays + 1 : prev.cycle.partialDays,
            missedDays: status === 'missed' ? prev.cycle.missedDays + 1 : prev.cycle.missedDays,
            isCompleted
          },
          weeklyHistory: prev.weeklyHistory.map(day => (day.day === 'Sun' || day.date === 'Today') ? { ...day, userStatus: status } : day)
        };
      });

      // Peer thread update
      setMessages(prev => [
        ...prev,
        {
          id: `msg_sys_${Date.now()}`,
          partnershipId: partnership.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          message: status === 'done' ? '✓ Checked in: Done' : status === 'partial' ? '½ Checked in: Partial' : '× Checked in: Missed. Recovery active.',
          timestamp: 'Just now'
        }
      ]);
    }
  };

  // Reactions & Nudges
  const reactToPartnerCheckIn = (reaction: 'pact_kept' | 'solid' | 'nudge' | 'respect', note?: string) => {
    if (!partnership || !partnership.todayPartnerCheckIn) return;
    setPartnership(prev => {
      if (!prev || !prev.todayPartnerCheckIn) return null;
      return {
        ...prev,
        todayPartnerCheckIn: {
          ...prev.todayPartnerCheckIn,
          partnerReaction: reaction,
          partnerNote: note
        }
      };
    });

    const labels = {
      pact_kept: '🤝 Pact Kept',
      solid: '💪 Solid',
      nudge: '🔔 Nudge',
      respect: '✨ Respect'
    };

    setMessages(prev => [
      ...prev,
      {
        id: `msg_react_${Date.now()}`,
        partnershipId: partnership.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: `${labels[reaction]}`,
        timestamp: 'Just now'
      }
    ]);
  };

  const sendNudge = (customMessage?: string) => {
    if (!partnership) return;
    const partnerName = partnership.partner ? partnership.partner.name : 'Pact Assist';
    const text = customMessage || `Hey ${partnerName.split(' ')[0]}, checking in on our daily commitment!`;
    setMessages(prev => [
      ...prev,
      {
        id: `msg_nudge_${Date.now()}`,
        partnershipId: partnership.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: text,
        timestamp: 'Just now',
        isQuickNudge: true
      }
    ]);
  };

  const sendMessage = (text: string) => {
    if (!partnership || !text.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        partnershipId: partnership.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: text.trim(),
        timestamp: 'Just now'
      }
    ]);
  };

  // Phase 4: Recovery Actions
  const resolveRecovery = (actionType: RecoveryAction, details: string) => {
    if (!partnership || !partnership.activeRecovery) return;

    setPartnership(prev => {
      if (!prev || !prev.activeRecovery) return null;
      return {
        ...prev,
        activeRecovery: {
          ...prev.activeRecovery,
          actionType,
          makeUpAction: details,
          status: 'resolved'
        },
        cycle: {
          ...prev.cycle,
          recoveredDays: prev.cycle.recoveredDays + 1
        }
      };
    });

    // Restore user reliability score
    setCurrentUser(prev => ({
      ...prev,
      reliabilityScore: calculateReliability(prev.completedCommitments, prev.totalCommitments, 0, 1)
    }));

    addNotification({
      type: 'recovery',
      title: 'Recovery Resolved',
      message: `Make-up confirmed: "${details}". Your commitment continues.`
    });

    setMessages(prev => [
      ...prev,
      {
        id: `msg_rec_${Date.now()}`,
        partnershipId: partnership.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: `↻ Recovery make-up logged: "${details}". Back on track.`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Phase 4: Rematch or Continue Solo
  const requestRematch = (reason: string) => {
    if (!partnership) return;
    setPartnership(null);
    setMatchingState(prev => ({
      ...prev,
      waitingHours: 0,
      pactAssistOffered: false,
      isSearching: true
    }));
    addNotification({
      type: 'match_ready',
      title: 'Partnership Concluded',
      message: `Pact ended respectfully ("${reason}"). Searching for a fresh partner match.`
    });
  };

  const continueSolo = () => {
    if (!partnership) return;
    setPartnership(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isSolo: true,
        partner: undefined,
        partnerGoal: undefined,
        status: 'solo'
      };
    });
    addNotification({
      type: 'reminder',
      title: 'Continuing Solo',
      message: 'Partnership concluded. Your daily commitment remains active in Solo mode.'
    });
  };

  // Phase 2 & 5D: Matching & Free limit
  const consumeMatchProposal = () => {
    setMatchingState(prev => ({
      ...prev,
      proposalsUsedThisWeek: Math.min(2, prev.proposalsUsedThisWeek + 1)
    }));
  };

  const acceptMatchWithCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
    const newPartnership: Partnership = {
      id: `pact_${Date.now()}`,
      user1Id: currentUser.id,
      user2Id: candidate.id,
      partner: candidate,
      isPactAssist: false,
      isSolo: false,
      partnerGoal: {
        id: `goal_${candidate.id}`,
        userId: candidate.id,
        title: candidate.primaryCategory === 'study' ? 'Daily Deep Study' : 'Daily Conditioning',
        category: candidate.primaryCategory,
        commitmentStatement: `Consistent daily commitment before ${candidate.preferredCheckInTime}`,
        frequencyDaysPerWeek: 5,
        commitmentDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        dailyTargetTime: candidate.preferredCheckInTime,
        cycleLengthDays: 30,
        proofType: 'text_summary',
        antiExcusePledge: 'Be honest with your partner.',
        createdAt: 'Today'
      },
      userGoal: activeGoal,
      status: 'active',
      startDate: 'Today',
      cycle: {
        cycleDays: 30,
        currentDay: 1,
        completedDays: 0,
        partialDays: 0,
        recoveredDays: 0,
        missedDays: 0,
        isCompleted: false
      },
      compatibilityReasons: candidate.matchReasons || [
        'Similar schedule',
        'Same commitment intensity',
        'Both prefer balanced accountability'
      ],
      weeklyHistory: [
        { day: 'Mon', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Tue', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Wed', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Thu', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Fri', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Sat', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'pending' },
        { day: 'Sun', date: 'Today', userStatus: 'pending', partnerStatus: 'pending' }
      ]
    };

    setPartnership(newPartnership);
    setMatchingState(prev => ({
      ...prev,
      isSearching: false,
      pactAssistOffered: false
    }));

    addNotification({
      type: 'match_ready',
      title: 'Pact Formed! 🤝',
      message: `You and ${candidate.name} formed an active accountability pact.`
    });

    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        partnershipId: newPartnership.id,
        senderId: candidate.id,
        senderName: candidate.name,
        message: `Hey ${currentUser.name.split(' ')[0]}! Glad we paired up. Let's stay consistent!`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Phase 5D: Pact Assist temporary bridge
  const startWithPactAssist = () => {
    const pactAssistPartnership: Partnership = {
      id: `pact_assist_${Date.now()}`,
      user1Id: currentUser.id,
      user2Id: 'pact_assist',
      isPactAssist: true,
      isSolo: false,
      partner: {
        id: 'pact_assist',
        email: 'assist@pact.local',
        name: 'Pact Assist',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        timezone: currentUser.timezone,
        bio: 'Temporary accountability bridge while human matching continues.',
        primaryCategory: activeGoal.category,
        accountabilityStyle: currentUser.accountabilityStyle,
        preferredCheckInTime: activeGoal.dailyTargetTime,
        reliabilityScore: 100,
        totalCommitments: 0,
        completedCommitments: 0,
        badge: 'Steady Partner',
        joinedDate: 'System'
      },
      partnerGoal: {
        id: 'goal_assist',
        userId: 'pact_assist',
        title: 'Accountability Bridge',
        category: activeGoal.category,
        commitmentStatement: `Daily accountability check at ${activeGoal.dailyTargetTime}`,
        frequencyDaysPerWeek: activeGoal.frequencyDaysPerWeek,
        commitmentDays: activeGoal.commitmentDays,
        dailyTargetTime: activeGoal.dailyTargetTime,
        cycleLengthDays: activeGoal.cycleLengthDays,
        proofType: 'text_summary',
        antiExcusePledge: 'Keeping you on track until your human match is confirmed.',
        createdAt: 'Today'
      },
      userGoal: activeGoal,
      status: 'active',
      startDate: 'Today',
      cycle: {
        cycleDays: activeGoal.cycleLengthDays,
        currentDay: 1,
        completedDays: 0,
        partialDays: 0,
        recoveredDays: 0,
        missedDays: 0,
        isCompleted: false
      },
      compatibilityReasons: [
        'Continuous accountability bridge',
        'Human matching continues in background'
      ],
      weeklyHistory: [
        { day: 'Mon', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Tue', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Wed', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Thu', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Fri', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Sat', date: 'Upcoming', userStatus: 'pending', partnerStatus: 'done' },
        { day: 'Sun', date: 'Today', userStatus: 'pending', partnerStatus: 'done' }
      ]
    };

    setPartnership(pactAssistPartnership);
    addNotification({
      type: 'pact_assist',
      title: 'Pact Assist Active',
      message: 'Pact Assist is keeping you accountable. Searching for your human match in the background.'
    });

    setMessages([
      {
        id: `msg_pa_1`,
        partnershipId: pactAssistPartnership.id,
        senderId: 'pact_assist',
        senderName: 'Pact Assist',
        message: `Welcome! I will prompt your check-in before ${activeGoal.dailyTargetTime}. We are continuing to search for your human partner in the background.`,
        timestamp: 'Just now'
      }
    ]);
  };

  const transitionPactAssistToHuman = (candidateId: string) => {
    acceptMatchWithCandidate(candidateId);
  };

  // Phase 5B: Cycle Completion
  const completePactCycle = () => {
    if (!partnership) return;
    const historyItem: PactHistoryItem = {
      id: `hist_${Date.now()}`,
      title: activeGoal.title,
      category: activeGoal.category,
      cycleDays: partnership.cycle.cycleDays,
      completedDays: partnership.cycle.completedDays,
      outcome: partnership.cycle.recoveredDays > 0 ? 'recovered' : 'completed',
      partnerName: partnership.partner ? partnership.partner.name : 'Solo',
      completedDate: 'Today'
    };

    setPactHistory(prev => [historyItem, ...prev]);
    setPartnership(prev => prev ? ({
      ...prev,
      cycle: { ...prev.cycle, isCompleted: true },
      status: 'completed'
    }) : null);

    addNotification({
      type: 'reminder',
      title: 'Pact Cycle Complete! 🎉',
      message: `Congratulations! You finished your ${partnership.cycle.cycleDays}-day Pact.`
    });
  };

  const startNewPact = (goalData: {
    title: string;
    category: GoalCategory;
    commitmentStatement: string;
    frequencyDaysPerWeek: number;
    commitmentDays: string[];
    dailyTargetTime: string;
    cycleLengthDays: number;
  }) => {
    const newG: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      userId: currentUser.id,
      proofType: 'text_summary',
      antiExcusePledge: 'Be honest with your partner.',
      createdAt: 'Today'
    };
    setActiveGoal(newG);
    setPartnership(null);
    setMatchingState({
      proposalsUsedThisWeek: 0,
      waitingHours: 0,
      pactAssistOffered: false,
      isSearching: true
    });
  };

  const updateGoal = (goalUpdates: Partial<Goal>) => {
    setActiveGoal(prev => ({ ...prev, ...goalUpdates }));
  };

  const updatePreferences = (prefs: {
    style: AccountabilityStyle;
    checkInTime: string;
    timezone: string;
  }) => {
    setCurrentUser(prev => ({
      ...prev,
      accountabilityStyle: prefs.style,
      preferredCheckInTime: prefs.checkInTime,
      timezone: prefs.timezone
    }));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AccountabilityContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeGoal,
        partnership,
        candidates,
        notifications,
        messages,
        pactHistory,
        matchingState,
        unreadNotifsCount,
        login,
        signUp,
        signOut,
        submitCheckIn,
        reactToPartnerCheckIn,
        sendNudge,
        sendMessage,
        resolveRecovery,
        requestRematch,
        continueSolo,
        consumeMatchProposal,
        acceptMatchWithCandidate,
        startWithPactAssist,
        transitionPactAssistToHuman,
        completePactCycle,
        startNewPact,
        updateGoal,
        updatePreferences,
        markNotificationsRead
      }}
    >
      {children}
    </AccountabilityContext.Provider>
  );
};

export const useAccountability = () => {
  const context = useContext(AccountabilityContext);
  if (!context) throw new Error('useAccountability must be used within an AccountabilityProvider');
  return context;
};
