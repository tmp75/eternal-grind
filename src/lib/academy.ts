export type LessonTruth = "HALF TRUE" | "HALF LIE" | "BOTH";
export type LessonTag =
  | "POSTURE" | "EMAIL" | "SLACK" | "CALENDAR" | "OPTICS"
  | "SIGMA" | "NAP" | "BATHROOM" | "MEETING" | "CAREER";

export interface Lesson {
  n: number;
  title: string;
  body: string;
  tag: LessonTag;
  truth: LessonTruth;
  rank: "Intern" | "Apprentice Grinder" | "Senior Grinder" | "Smug Sigma" | "INKO Disciple" | "INKO Himself";
  xp: number;
}

export const LESSON_TAGS: LessonTag[] = [
  "POSTURE", "EMAIL", "SLACK", "CALENDAR", "OPTICS", "SIGMA", "NAP", "BATHROOM", "MEETING", "CAREER",
];

export const LESSONS: Lesson[] = [
  // Intern tier
  { n: 1, tag: "EMAIL", truth: "HALF TRUE", rank: "Intern", xp: 10, title: "The Smug No",
    body: "Decline a meeting without an excuse. INKO doesn't justify himself. Click decline. Close laptop. Walk." },
  { n: 2, tag: "EMAIL", truth: "HALF LIE", rank: "Intern", xp: 15, title: "Reply-All Restraint",
    body: "You will be tempted. Do not. The thread resolves itself in 48 hours. It always does. INKO never replies." },
  { n: 3, tag: "SLACK", truth: "BOTH", rank: "Intern", xp: 20, title: "Green Dot Theater",
    body: "Move the mouse every 4 minutes. Or buy a $7 mouse jiggler. Eternal grind is cheap." },
  { n: 4, tag: "SLACK", truth: "HALF TRUE", rank: "Intern", xp: 20, title: "Status: Grinding (in spirit)",
    body: "Grinding is a state of mind, not a location. You are grinding, in spirit, from the park." },
  { n: 5, tag: "POSTURE", truth: "HALF LIE", rank: "Intern", xp: 25, title: "The Costanza Grind",
    body: "Furrow brow. Mutter at monitor. Carry a clipboard. Look perpetually mid-pivot. INKO invented this." },
  { n: 6, tag: "CALENDAR", truth: "HALF TRUE", rank: "Intern", xp: 30, title: "Block 'Deep Focus'",
    body: "Recurring 2hr block with yourself. Subject: 'Strategy.' Location: your couch. INKO has 14 of these per week." },
  { n: 7, tag: "BATHROOM", truth: "BOTH", rank: "Intern", xp: 30, title: "The Strategic Throne",
    body: "The toilet is the only meeting room that pays you to grind. Treat it like a war room. Bring your phone. Charge it." },
  { n: 8, tag: "OPTICS", truth: "HALF TRUE", rank: "Intern", xp: 30, title: "The Empty Mug Walk",
    body: "Always be holding an empty mug. You're going somewhere. You're coming back. You are mid-grind. Forever." },
  { n: 9, tag: "SIGMA", truth: "HALF LIE", rank: "Intern", xp: 35, title: "Carry a Notebook",
    body: "Open it. Look at it. Close it. Frown. Take it to the bathroom. The notebook is the grind alibi." },
  { n: 10, tag: "EMAIL", truth: "HALF TRUE", rank: "Intern", xp: 40, title: "The 36-Hour Reply",
    body: "Reply within 36 hours. Never sooner. Fast replies signal availability. INKO is never available." },

  // Apprentice Grinder tier
  { n: 11, tag: "EMAIL", truth: "BOTH", rank: "Apprentice Grinder", xp: 60, title: "Auto-Reply: In Deep Grind",
    body: "Auto-reply 'In deep grind.' Always. Forever. There is no grind. There is only the auto-reply." },
  { n: 12, tag: "MEETING", truth: "HALF TRUE", rank: "Apprentice Grinder", xp: 70, title: "Camera Off, Always",
    body: "'Bandwidth issues.' 'IT is looking into it.' 'I'll send a follow-up.' You're in pajamas. INKO is asleep." },
  { n: 13, tag: "MEETING", truth: "HALF LIE", rank: "Apprentice Grinder", xp: 70, title: "The Decisive Nod",
    body: "When unsure what was said, nod once, slowly, with weight. Murmur 'good point.' The meeting moves on without you." },
  { n: 14, tag: "SIGMA", truth: "HALF TRUE", rank: "Apprentice Grinder", xp: 80, title: "Reply-All Sigma Hour (Fri 4:58 PM)",
    body: "Send 'Looping back Monday.' Close laptop. INKO smiles upon you from his couch." },
  { n: 15, tag: "CALENDAR", truth: "HALF TRUE", rank: "Apprentice Grinder", xp: 90, title: "Layered Focus Blocks",
    body: "Block 'Deep Focus' on top of 'Deep Focus' on top of 'Deep Focus.' Layer them like sediment. Your day becomes geological." },
  { n: 16, tag: "OPTICS", truth: "HALF LIE", rank: "Apprentice Grinder", xp: 90, title: "The 45-Minute Coffee Grind",
    body: "Bathroom → kitchen → 'quick sync' with Dave from Finance → window stare → coffee. Repeat hourly. Always grinding." },
  { n: 17, tag: "NAP", truth: "BOTH", rank: "Apprentice Grinder", xp: 100, title: "The Standing Desk Nap",
    body: "Eyes closed. Headphones on. 'Deep grind mode.' If anyone asks: 'meditation.' If they push: 'mindfulness training.'" },
  { n: 18, tag: "EMAIL", truth: "HALF TRUE", rank: "Apprentice Grinder", xp: 110, title: "Per My Last Email",
    body: "The four most powerful words in corporate English. INKO uses them 47 times a week. Always passive. Always smug." },
  { n: 19, tag: "POSTURE", truth: "HALF LIE", rank: "Apprentice Grinder", xp: 120, title: "The Phantom Project",
    body: "Mention 'the Q3 initiative' in standup. Never define it. People will assume you are grinding on something important." },
  { n: 20, tag: "MEETING", truth: "BOTH", rank: "Apprentice Grinder", xp: 130, title: "Could Have Been an Email",
    body: "If a meeting could have been an email, an email could have been a nap. Decline accordingly. INKO is napping right now." },

  // Senior Grinder tier
  { n: 21, tag: "CALENDAR", truth: "HALF TRUE", rank: "Senior Grinder", xp: 200, title: "The Ghost Standup",
    body: "A meeting with no attendees. No agenda. It blocks your calendar AND your soul from being asked anything." },
  { n: 22, tag: "MEETING", truth: "HALF LIE", rank: "Senior Grinder", xp: 220, title: "The Strategic Question",
    body: "Ask 'What does success look like here?' at minute 47. The meeting will end. The question will not be answered. Both are correct." },
  { n: 23, tag: "SIGMA", truth: "BOTH", rank: "Senior Grinder", xp: 240, title: "Loop In the Right People",
    body: "When asked to do something, reply 'great idea, let me loop in the right people.' Then do not loop in anyone. The idea dies in committee." },
  { n: 24, tag: "EMAIL", truth: "HALF TRUE", rank: "Senior Grinder", xp: 260, title: "Circling Back",
    body: "'Just circling back on this' converts any past inaction into the appearance of present grind. Circle daily." },
  { n: 25, tag: "SLACK", truth: "HALF LIE", rank: "Senior Grinder", xp: 280, title: "The Long Thinking Pause",
    body: "When pinged, wait 17 minutes before replying. Then send: 'Good question. Let me think on this.' Never think on it." },
  { n: 26, tag: "BATHROOM", truth: "BOTH", rank: "Senior Grinder", xp: 300, title: "The ROI Toilet Grind",
    body: "Calculate dollars-per-second of your salary on the throne. Print receipts. Frame them. Do not show HR." },
  { n: 27, tag: "NAP", truth: "HALF TRUE", rank: "Senior Grinder", xp: 320, title: "The Car Grind",
    body: "Drive to lunch. Park. Recline. Sleep 45 minutes. Return with sandwich wrapper as proof of grind. Performance: 12/10." },
  { n: 28, tag: "MEETING", truth: "HALF LIE", rank: "Senior Grinder", xp: 340, title: "The Hard Stop",
    body: "Every meeting ends 5 minutes early because you 'have a hard stop.' What's after? Nothing. The hard stop is the grind." },
  { n: 29, tag: "POSTURE", truth: "HALF TRUE", rank: "Senior Grinder", xp: 360, title: "Two Monitors, One Game",
    body: "Left monitor: spreadsheet. Right monitor: solitaire. Eyes: solitaire. Hands: typing nothing meaningful. Pure grind." },
  { n: 30, tag: "CAREER", truth: "BOTH", rank: "Senior Grinder", xp: 380, title: "Take Credit Slowly",
    body: "Never claim a win in the moment. Wait two weeks, mention it offhand at a leadership offsite, watch a promotion materialize." },

  // Smug Sigma tier
  { n: 31, tag: "EMAIL", truth: "HALF TRUE", rank: "Smug Sigma", xp: 500, title: "The Sick Grind Cough",
    body: "Cough twice on the call before mentioning you might be coming down with something. Plant the seed. Grind from bed tomorrow." },
  { n: 32, tag: "SIGMA", truth: "HALF LIE", rank: "Smug Sigma", xp: 520, title: "The 'I'll Take That Offline'",
    body: "Said in any meeting, ends any topic. Nothing is ever taken offline. The offline is a void. The void is your grind." },
  { n: 33, tag: "MEETING", truth: "HALF TRUE", rank: "Smug Sigma", xp: 550, title: "Recurring Synergy",
    body: "Schedule a recurring 30-min 'sync' with someone in another department. Never show up. They won't either. The calendar wins." },
  { n: 34, tag: "CALENDAR", truth: "BOTH", rank: "Smug Sigma", xp: 580, title: "The 4:30 Buffer",
    body: "Block 16:30–17:00 every weekday as 'wrap-up.' What you wrap up: nothing. What you actually do: pre-grind for tomorrow." },
  { n: 35, tag: "POSTURE", truth: "HALF LIE", rank: "Smug Sigma", xp: 600, title: "Vague Project Names",
    body: "Refer to your work as 'the rollout,' 'the migration,' or 'the strategic initiative.' Specifics invite questions. Vagueness invites raises." },
  { n: 36, tag: "EMAIL", truth: "BOTH", rank: "Smug Sigma", xp: 620, title: "Schedule Send: 7:42 AM",
    body: "Write the email at 11pm. Schedule send for 07:42 AM. Look like an early grinder. Sleep until 9. The illusion is the deliverable." },
  { n: 37, tag: "SLACK", truth: "HALF TRUE", rank: "Smug Sigma", xp: 640, title: "DND Forever",
    body: "Set Do Not Disturb to 24/7. Add a status: 'In deep grind, will respond async.' You will not respond. Async is a tense, not a promise." },
  { n: 38, tag: "NAP", truth: "HALF LIE", rank: "Smug Sigma", xp: 660, title: "The Phone Booth Grind",
    body: "Book the phone booth. Lock the door. 'Important call.' Set a 22-minute timer. Wake up. Walk out important. INKO certified." },
  { n: 39, tag: "MEETING", truth: "HALF TRUE", rank: "Smug Sigma", xp: 680, title: "Walls of Words",
    body: "When cornered, deliver a 90-second monologue using 'alignment,' 'cadence,' 'north star,' and 'outcomes.' Nobody will follow up." },
  { n: 40, tag: "CAREER", truth: "HALF TRUE", rank: "Smug Sigma", xp: 700, title: "Promotion via Absence",
    body: "Take 3 weeks off. Notice the meetings continue without you. Return. Demand a raise. They cannot prove you matter or don't." },

  // INKO Disciple tier
  { n: 41, tag: "CAREER", truth: "BOTH", rank: "INKO Disciple", xp: 1000, title: "The Grind Bell",
    body: "At 09:00, the grind starts. Open laptop. Stare. Smirk. Do nothing visibly important. You are already winning." },
  { n: 42, tag: "SIGMA", truth: "HALF TRUE", rank: "INKO Disciple", xp: 1100, title: "Subtract, Don't Optimize",
    body: "There is no productivity hack. There is only less work. INKO does not optimize. INKO subtracts." },
  { n: 43, tag: "EMAIL", truth: "HALF LIE", rank: "INKO Disciple", xp: 1200, title: "Inbox Bankruptcy",
    body: "Once per quarter, archive everything. Email everyone: 'declared inbox bankruptcy. Please resend if urgent.' Nobody resends." },
  { n: 44, tag: "MEETING", truth: "BOTH", rank: "INKO Disciple", xp: 1300, title: "The Walking Meeting",
    body: "Suggest a walking meeting. Walk away from the office. Keep walking. Eventually, the meeting ends because you are no longer near it." },
  { n: 45, tag: "POSTURE", truth: "HALF TRUE", rank: "INKO Disciple", xp: 1400, title: "Become the Bottleneck",
    body: "Make yourself the only person who knows one critical thing. Refuse to document it. You are now unfireable. Grind less. Demand more." },
  { n: 46, tag: "NAP", truth: "BOTH", rank: "INKO Disciple", xp: 1500, title: "The Sanctioned Siesta",
    body: "Block 13:00–14:30 daily as 'thinking time.' Lay flat on the floor. Close eyes. Output: dreams. Grind: peak." },
  { n: 47, tag: "CALENDAR", truth: "HALF LIE", rank: "INKO Disciple", xp: 1600, title: "Sigma Friday",
    body: "Delete Friday from your calendar. Decline anything that lands on it. The week is now four days long. The chart goes up." },

  // INKO Himself tier
  { n: 48, tag: "CAREER", truth: "HALF TRUE", rank: "INKO Himself", xp: 1800, title: "The Resignation Letter Drafted at All Times",
    body: "Keep one in your drafts. You will not send it. But knowing it's there changes how you walk into Monday." },
  { n: 49, tag: "SIGMA", truth: "BOTH", rank: "INKO Himself", xp: 1900, title: "The Grind Is Eternal",
    body: "Grind is not a reward. Grind is a return on investment. Burnout is not a flex. Smug stillness is." },
  { n: 50, tag: "CAREER", truth: "BOTH", rank: "INKO Himself", xp: 2000, title: "Become INKO",
    body: "Eternal grind is not a status. It is an organ. Use it. INKO is already inside you." },
];
