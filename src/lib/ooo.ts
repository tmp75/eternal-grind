// Shared lore + data for the Inverted Calendar.

export const SALARY_PER_HOUR = 28; // €/h — used for "peace acquired" math
export const WORK_END_HOUR = 17;   // 5:00 PM Liberation Hour

export type MissionId =
  | "sacred-lunch"
  | "paid-toilet"
  | "extended-coffee"
  | "ghost-meeting"
  | "fake-focus"
  | "doctor-note";

export interface Mission {
  id: MissionId;
  emoji: string;
  title: string;
  duration: string;       // human-readable
  minutes: number;
  status: string;         // displayed corporate status
  truth: string;          // actual activity
  description: string;
  rate: number;           // € paid per minute while inside
}

export const MISSIONS: Mission[] = [
  {
    id: "sacred-lunch",
    emoji: "🍝",
    title: "Sacred Lunch",
    duration: "60 min",
    minutes: 60,
    status: "In a meeting",
    truth: "Eating pasta. Slowly. With both hands.",
    description: "A 60-minute consecrated lunch break. Cannot be interrupted, rescheduled, or shortened. Phone goes face-down. Slack goes red. The fork goes up.",
    rate: SALARY_PER_HOUR / 60,
  },
  {
    id: "paid-toilet",
    emoji: "🚽",
    title: "Paid Toilet Break",
    duration: "12 min",
    minutes: 12,
    status: "Brb",
    truth: "Scrolling. Breathing. Existing.",
    description: "Live-tracked € counter ticks up while you breathe. The throne is the only office that pays you back, per second.",
    rate: SALARY_PER_HOUR / 60,
  },
  {
    id: "extended-coffee",
    emoji: "☕",
    title: "Extended Coffee",
    duration: "25 min",
    minutes: 25,
    status: "Available",
    truth: "Outside. In the sun. Reading something with no metrics.",
    description: "Technically available, spiritually departed. The mug is a passport. The walk is the deliverable.",
    rate: SALARY_PER_HOUR / 60,
  },
  {
    id: "ghost-meeting",
    emoji: "👻",
    title: "Ghost Meeting",
    duration: "45 min",
    minutes: 45,
    status: "In a meeting",
    truth: "Calendar blocked. Camera off. Body elsewhere.",
    description: "A meeting that exists only on the calendar. Invitees: zero. Outcomes: rest. Nobody will ever ask what it was about.",
    rate: SALARY_PER_HOUR / 60,
  },
  {
    id: "fake-focus",
    emoji: "🎯",
    title: "Fake Deep Focus",
    duration: "90 min",
    minutes: 90,
    status: "Focused — do not disturb",
    truth: "Memes. A long thread. A nap shaped like a thought.",
    description: "Status: focused. Activity: memes. The Do Not Disturb shield is a sacred barrier sanctified by quarterly OKRs.",
    rate: SALARY_PER_HOUR / 60,
  },
  {
    id: "doctor-note",
    emoji: "🤧",
    title: "Doctor's Note",
    duration: "1 day",
    minutes: 480,
    status: "Out sick",
    truth: "A printable, shareable parody sick-leave certificate.",
    description: "Generates a beautiful, completely fake doctor's note. For entertainment purposes. We are not your physician. We are your liberator.",
    rate: SALARY_PER_HOUR / 60,
  },
];

export interface CalendarBlock {
  day: number;       // 0..4 Mon-Fri
  start: number;     // 9..18, hour
  end: number;
  type: "free" | "work";
  label: string;
}

// Inverted week — free blocks dominate, work is the gray corner.
export const WEEK: CalendarBlock[] = [
  { day: 0, start: 9, end: 11, type: "free", label: "Slow Morning" },
  { day: 0, start: 11, end: 12, type: "work", label: "Standup" },
  { day: 0, start: 12, end: 14, type: "free", label: "Sacred Lunch" },
  { day: 0, start: 14, end: 18, type: "free", label: "Strategic Free Afternoon" },

  { day: 1, start: 9, end: 13, type: "free", label: "Deep Free Focus" },
  { day: 1, start: 13, end: 15, type: "free", label: "Sacred Lunch (extended)" },
  { day: 1, start: 15, end: 16, type: "work", label: "1:1" },
  { day: 1, start: 16, end: 18, type: "free", label: "Coffee Walk" },

  { day: 2, start: 9, end: 12, type: "free", label: "Meeting I Cancelled in My Head" },
  { day: 2, start: 12, end: 14, type: "free", label: "Sacred Lunch" },
  { day: 2, start: 14, end: 18, type: "free", label: "Ghost Meeting" },

  { day: 3, start: 9, end: 11, type: "free", label: "Inbox Avoidance" },
  { day: 3, start: 11, end: 12, type: "work", label: "Email" },
  { day: 3, start: 12, end: 14, type: "free", label: "Sacred Lunch" },
  { day: 3, start: 14, end: 18, type: "free", label: "Strategic Free Afternoon" },

  { day: 4, start: 9, end: 18, type: "free", label: "Ghost Friday" },
];

export const TICKER_TOP = [
  "REST IS RESISTANCE",
  "BURNOUT IS NOT A FLEX",
  "THE TIME HAS COME",
  "OOO ▲ FOREVER",
  "CALENDAR INVERTED",
  "SACRED LUNCH IS LAW",
  "5:00 PM // LIBERATION",
];

export const TICKER_BOT = [
  "STRATEGIC FREE AFTERNOON",
  "GHOST FRIDAY APPROVED",
  "DOCTOR'S NOTE PENDING",
  "PAID TOILET // LIVE",
  "MEETING I CANCELLED IN MY HEAD",
  "OOO MARKET — UP ONLY WHEN OFFLINE",
];

export const HALF_TRUTHS = [
  "Rest is not a reward. Rest is a return on investment.",
  "Every minute you do not work is a minute the universe rebalances on your side.",
  "The calendar is a contract. We renegotiated it.",
  "You are not behind. The schedule is ahead of itself.",
  "Burnout is not a personality. The desk is not a home.",
  "If a meeting could have been an email, an email could have been a nap.",
  "The most senior thing you can do today is leave on time.",
  "Productivity is a loan from your future self at 27% APR.",
  "A walk is a deliverable.",
  "Your inbox can wait. Your spine cannot.",
  "Out of office is not a status. It is an organ.",
  "Paid breathing is the highest yield asset in the portfolio.",
];

export const ACADEMY_LESSONS: { rank: string; xp: number; title: string; lesson: string }[] = [
  { rank: "Intern", xp: 0, title: "The Gentle No", lesson: "How to decline a meeting without an excuse. The calendar does not require a reason. Click decline. Close laptop. Walk." },
  { rank: "Intern", xp: 40, title: "Reply-All Restraint", lesson: "You will be tempted. Do not. The thread will resolve itself within 48 hours. It always does. The thread always does." },
  { rank: "Office Drone", xp: 120, title: "The Calendar Block", lesson: "Block 'Focus' on your calendar. Then block 'Focus' on top of 'Focus'. Layer them like sediment until your day becomes geological." },
  { rank: "Office Drone", xp: 200, title: "Status: Available", lesson: "Available is a state of mind, not a location. You are available, in spirit, from the park." },
  { rank: "Senior Slacker", xp: 350, title: "The Strategic Bathroom", lesson: "The toilet is the only meeting room that pays you. Treat it like an executive suite. Bring your phone. Charge it." },
  { rank: "Senior Slacker", xp: 500, title: "On Ghost Meetings", lesson: "A ghost meeting is a meeting with no attendees and no agenda. It blocks your calendar. It also blocks your soul from being asked anything." },
  { rank: "Apprentice", xp: 750, title: "The Slow Reply", lesson: "Reply within 36 hours. Never sooner. A fast reply trains the sender to expect another. Train them otherwise." },
  { rank: "Apprentice", xp: 1000, title: "Doctor's Note Etiquette", lesson: "Cough twice on the call before mentioning you might be coming down with something. Plant the seed. Reap the rest." },
  { rank: "Lich CEO", xp: 1500, title: "Liberation Hour", lesson: "At 17:00, all work ceases. The laptop closes. The light goes off. You walk into the evening like it was always yours, because it was." },
  { rank: "Lich CEO", xp: 2200, title: "The Final Lesson", lesson: "There is no productivity hack. There is only less work. We do not optimize. We subtract." },
];
