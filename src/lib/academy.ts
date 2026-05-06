export type LessonTruth = "HALF TRUE" | "HALF LIE" | "BOTH";
export type LessonTag =
  | "STEALTH" | "EMAIL" | "SLACK" | "CALENDAR" | "HYDRATION"
  | "TACTICS" | "NAP" | "BATHROOM" | "MEETING" | "CAREER";

export interface Lesson {
  n: number;
  title: string;
  body: string;
  tag: LessonTag;
  truth: LessonTruth;
  rank: "Intern" | "Office Drone" | "Senior Slacker" | "Apprentice" | "Lich CEO";
  xp: number;
}

export const LESSON_TAGS: LessonTag[] = [
  "STEALTH", "EMAIL", "SLACK", "CALENDAR", "HYDRATION", "TACTICS", "NAP", "BATHROOM", "MEETING", "CAREER",
];

export const LESSONS: Lesson[] = [
  // Intern tier
  { n: 1, tag: "EMAIL", truth: "HALF TRUE", rank: "Intern", xp: 10, title: "The Gentle No",
    body: "Decline a meeting without an excuse. The calendar does not require a reason. Click decline. Close laptop. Walk." },
  { n: 2, tag: "EMAIL", truth: "HALF LIE", rank: "Intern", xp: 15, title: "Reply-All Restraint",
    body: "You will be tempted. Do not. The thread will resolve itself within 48 hours. It always does." },
  { n: 3, tag: "SLACK", truth: "BOTH", rank: "Intern", xp: 20, title: "Green Dot Theater",
    body: "Move the mouse every 4 minutes. Or buy a $7 mouse jiggler. Liberation is cheap." },
  { n: 4, tag: "SLACK", truth: "HALF TRUE", rank: "Intern", xp: 20, title: "Status: Available (in spirit)",
    body: "Available is a state of mind, not a location. You are available, in spirit, from the park." },
  { n: 5, tag: "STEALTH", truth: "HALF LIE", rank: "Intern", xp: 25, title: "The Costanza Protocol",
    body: "Furrow brow. Mutter at monitor. Carry a clipboard. Look perpetually inconvenienced. Promotion incoming." },
  { n: 6, tag: "CALENDAR", truth: "HALF TRUE", rank: "Intern", xp: 30, title: "Block 'Focus Time'",
    body: "Recurring 2hr meeting with yourself. Subject: 'Strategy.' Location: your couch." },
  { n: 7, tag: "BATHROOM", truth: "BOTH", rank: "Intern", xp: 30, title: "The Strategic Bathroom",
    body: "The toilet is the only meeting room that pays you. Treat it like an executive suite. Bring your phone. Charge it." },
  { n: 8, tag: "HYDRATION", truth: "HALF TRUE", rank: "Intern", xp: 30, title: "The Empty Mug Walk",
    body: "Always be holding an empty mug. You're going somewhere. You're coming back from somewhere. You are mid-task. Forever." },
  { n: 9, tag: "TACTICS", truth: "HALF LIE", rank: "Intern", xp: 35, title: "Carry a Notebook",
    body: "Open it. Look at it. Close it. Frown. Take it to the bathroom. The notebook is the alibi." },
  { n: 10, tag: "EMAIL", truth: "HALF TRUE", rank: "Intern", xp: 40, title: "The 36-Hour Reply",
    body: "Reply within 36 hours. Never sooner. Fast replies train senders to expect another. Train them otherwise." },

  // Office Drone tier
  { n: 11, tag: "EMAIL", truth: "BOTH", rank: "Office Drone", xp: 60, title: "The Pre-Scheduled OOO",
    body: "Auto-reply 'In a meeting.' Always. Forever. There is no meeting. There is only freedom." },
  { n: 12, tag: "MEETING", truth: "HALF TRUE", rank: "Office Drone", xp: 70, title: "Camera Off, Always",
    body: "'Bandwidth issues.' 'IT is looking into it.' 'I'll send a follow-up.' You're in pajamas." },
  { n: 13, tag: "MEETING", truth: "HALF LIE", rank: "Office Drone", xp: 70, title: "The Decisive Nod",
    body: "When unsure what was said, nod once, slowly, with weight. Murmur 'good point.' The meeting moves on without you." },
  { n: 14, tag: "TACTICS", truth: "HALF TRUE", rank: "Office Drone", xp: 80, title: "Reply-All on Friday 4:58 PM",
    body: "Send 'Looping back Monday.' Close laptop. The ancestors smile upon you." },
  { n: 15, tag: "CALENDAR", truth: "HALF TRUE", rank: "Office Drone", xp: 90, title: "Layered Focus Blocks",
    body: "Block 'Focus' on top of 'Focus' on top of 'Focus.' Layer them like sediment. Your day becomes geological." },
  { n: 16, tag: "HYDRATION", truth: "HALF LIE", rank: "Office Drone", xp: 90, title: "The 45-Minute Coffee Pilgrimage",
    body: "Bathroom → kitchen → 'quick chat' with Dave from Finance → window stare → coffee. Repeat hourly." },
  { n: 17, tag: "NAP", truth: "BOTH", rank: "Office Drone", xp: 100, title: "The Standing Desk Nap",
    body: "Eyes closed. Headphones on. 'Deep work.' If anyone asks: 'meditation.' If they push: 'mindfulness training.'" },
  { n: 18, tag: "EMAIL", truth: "HALF TRUE", rank: "Office Drone", xp: 110, title: "Per My Last Email",
    body: "The four most powerful words in corporate English. Deploys passive-aggressive nuclear weapons without lifting a finger." },
  { n: 19, tag: "STEALTH", truth: "HALF LIE", rank: "Office Drone", xp: 120, title: "The Phantom Project",
    body: "Mention 'the Q3 initiative' in stand-up. Never define it. People will assume you are in charge of something important." },
  { n: 20, tag: "MEETING", truth: "BOTH", rank: "Office Drone", xp: 130, title: "Could Have Been an Email",
    body: "If a meeting could have been an email, an email could have been a nap. Decline accordingly." },

  // Senior Slacker tier
  { n: 21, tag: "CALENDAR", truth: "HALF TRUE", rank: "Senior Slacker", xp: 200, title: "The Ghost Meeting",
    body: "A meeting with no attendees. No agenda. It blocks your calendar AND your soul from being asked anything." },
  { n: 22, tag: "MEETING", truth: "HALF LIE", rank: "Senior Slacker", xp: 220, title: "The Strategic Question",
    body: "Ask 'What does success look like here?' at minute 47. The meeting will end. The question will not be answered. Both are correct." },
  { n: 23, tag: "TACTICS", truth: "BOTH", rank: "Senior Slacker", xp: 240, title: "Loop In the Right People",
    body: "When asked to do something, reply 'great idea, let me loop in the right people.' Then do not loop in anyone. The idea dies in committee." },
  { n: 24, tag: "EMAIL", truth: "HALF TRUE", rank: "Senior Slacker", xp: 260, title: "Circling Back",
    body: "'Just circling back on this' converts any past inaction into the appearance of present momentum. Circle daily." },
  { n: 25, tag: "SLACK", truth: "HALF LIE", rank: "Senior Slacker", xp: 280, title: "The Long Thinking Pause",
    body: "When pinged, wait 17 minutes before replying. Then send: 'Good question. Let me think on this.' Never think on it." },
  { n: 26, tag: "BATHROOM", truth: "BOTH", rank: "Senior Slacker", xp: 300, title: "The ROI Toilet Break",
    body: "Calculate dollars-per-second of your salary on the throne. Print receipts. Frame them. Do not show HR." },
  { n: 27, tag: "NAP", truth: "HALF TRUE", rank: "Senior Slacker", xp: 320, title: "The Car Nap",
    body: "Drive to lunch. Park. Recline. Sleep 45 minutes. Return with sandwich wrapper as proof of life. Performance: 12/10." },
  { n: 28, tag: "MEETING", truth: "HALF LIE", rank: "Senior Slacker", xp: 340, title: "The Hard Stop",
    body: "Every meeting ends 5 minutes early because you 'have a hard stop.' What's after? Nothing. The hard stop is the point." },
  { n: 29, tag: "STEALTH", truth: "HALF TRUE", rank: "Senior Slacker", xp: 360, title: "Two Monitors, One Game",
    body: "Left monitor: spreadsheet. Right monitor: solitaire. Eyes: solitaire. Hands: typing nothing meaningful into the spreadsheet." },
  { n: 30, tag: "CAREER", truth: "BOTH", rank: "Senior Slacker", xp: 380, title: "Take Credit Slowly",
    body: "Never claim a win in the moment. Wait two weeks, mention it offhand at a leadership offsite, watch a promotion materialize." },

  // Apprentice tier
  { n: 31, tag: "EMAIL", truth: "HALF TRUE", rank: "Apprentice", xp: 500, title: "The Doctor's Note Cough",
    body: "Cough twice on the call before mentioning you might be coming down with something. Plant the seed. Reap the rest." },
  { n: 32, tag: "TACTICS", truth: "HALF LIE", rank: "Apprentice", xp: 520, title: "The 'I'll Take That Offline'",
    body: "Said in any meeting, ends any topic. Nothing is ever taken offline. The offline is a void. The void is your friend." },
  { n: 33, tag: "MEETING", truth: "HALF TRUE", rank: "Apprentice", xp: 550, title: "Recurring Synergy",
    body: "Schedule a recurring 30-min 'sync' with someone in another department. Never show up. They won't either. The calendar wins." },
  { n: 34, tag: "CALENDAR", truth: "BOTH", rank: "Apprentice", xp: 580, title: "The 4:30 Buffer",
    body: "Block 16:30–17:00 every weekday as 'wrap-up.' What you wrap up: nothing. What you actually do: nothing. It works." },
  { n: 35, tag: "STEALTH", truth: "HALF LIE", rank: "Apprentice", xp: 600, title: "Vague Project Names",
    body: "Refer to your work as 'the rollout,' 'the migration,' or 'the strategic initiative.' Specifics invite questions. Vagueness invites raises." },
  { n: 36, tag: "EMAIL", truth: "BOTH", rank: "Apprentice", xp: 620, title: "Schedule Send: 7:42 AM",
    body: "Write the email at 11pm. Schedule send for 07:42 AM. Look like an early riser. Sleep until 9. The illusion is the deliverable." },
  { n: 37, tag: "SLACK", truth: "HALF TRUE", rank: "Apprentice", xp: 640, title: "DND Forever",
    body: "Set Do Not Disturb to 24/7. Add a status: 'In deep focus, will respond async.' You will not respond. Async is a tense, not a promise." },
  { n: 38, tag: "NAP", truth: "HALF LIE", rank: "Apprentice", xp: 660, title: "The Phone Booth Nap",
    body: "Book the phone booth. Lock the door. 'Important call.' Set a 22-minute timer. Wake up. Walk out important." },
  { n: 39, tag: "MEETING", truth: "HALF TRUE", rank: "Apprentice", xp: 680, title: "Walk Into Walls of Words",
    body: "When cornered, deliver a 90-second monologue using the words 'alignment,' 'cadence,' 'north star,' and 'outcomes.' Nobody will follow up." },
  { n: 40, tag: "CAREER", truth: "HALF TRUE", rank: "Apprentice", xp: 700, title: "Promotion via Absence",
    body: "Take 3 weeks off. Notice the meetings continue without you. Notice the company runs fine. Return. Demand a raise. They cannot prove you matter or don't." },

  // Lich CEO tier
  { n: 41, tag: "CAREER", truth: "BOTH", rank: "Lich CEO", xp: 1000, title: "Liberation Hour",
    body: "At 17:00, work ends. Laptop closes. Light goes off. You walk into the evening like it was always yours. Because it was." },
  { n: 42, tag: "TACTICS", truth: "HALF TRUE", rank: "Lich CEO", xp: 1100, title: "Subtract, Don't Optimize",
    body: "There is no productivity hack. There is only less work. We do not optimize. We subtract." },
  { n: 43, tag: "EMAIL", truth: "HALF LIE", rank: "Lich CEO", xp: 1200, title: "Inbox Bankruptcy",
    body: "Once per quarter, archive everything. Email everyone: 'declared inbox bankruptcy. Please resend if urgent.' Nothing is urgent. Nobody resends." },
  { n: 44, tag: "MEETING", truth: "BOTH", rank: "Lich CEO", xp: 1300, title: "The Walking Meeting",
    body: "Suggest a walking meeting. Walk away from the office. Keep walking. Eventually, the meeting ends because you are no longer near it." },
  { n: 45, tag: "STEALTH", truth: "HALF TRUE", rank: "Lich CEO", xp: 1400, title: "Become the Bottleneck",
    body: "Make yourself the only person who knows one critical thing. Refuse to document it. You are now unfireable. Do less. Demand more." },
  { n: 46, tag: "NAP", truth: "BOTH", rank: "Lich CEO", xp: 1500, title: "The Sanctioned Siesta",
    body: "Block 13:00–14:30 daily as 'thinking time.' Lay flat on the floor. Close eyes. Think with eyes closed. Output: dreams. Productivity: peak." },
  { n: 47, tag: "CALENDAR", truth: "HALF LIE", rank: "Lich CEO", xp: 1600, title: "Ghost Friday",
    body: "Delete Friday from your calendar. Decline anything that lands on it. The week is now four days long. The chart goes up." },
  { n: 48, tag: "CAREER", truth: "HALF TRUE", rank: "Lich CEO", xp: 1700, title: "The Resignation Letter Drafted at All Times",
    body: "Keep one in your drafts. You will not send it. But knowing it's there changes how you walk into Monday." },
  { n: 49, tag: "TACTICS", truth: "BOTH", rank: "Lich CEO", xp: 1800, title: "Rest Is Resistance",
    body: "Rest is not a reward. Rest is a return on investment. Burnout is not a flex." },
  { n: 50, tag: "CAREER", truth: "BOTH", rank: "Lich CEO", xp: 2000, title: "The Final Lesson",
    body: "Out of office is not a status. It is an organ. Use it." },
];
