// === NPCS ===
// Dialogue convention: speech goes in double quotes; everything outside
// them is action/narration. The engine renders each on its own line
// (bright speech, dim action) - see printNpcBeats in engine/ui.js.
// Every NPC introduces themselves, in their first greeting, by a name
// the player can address them with.

const NPCS = {
  // The Porter: the Keep's clerk. Immaculate, measured, formally kind.
  // Never surprised. Never cruel. Sorry about everything, precisely once.
  porter: {
    name: "The Porter",
    aliases: ["gatekeeper", "keeper", "tall figure", "clerk"],
    presence: "The Porter stands at the portcullis chains, ledger closed, exactly where it has always stood.",
    givesOnFirstMeet: "minor_healing_tome",
    giftText: `Before you turn to go, the Porter produces a slim book from within the coat - impossibly, as though the coat had been keeping it against this exact moment. "One thing more. A minor mending-cant. One use in it, no more." It offers the book across its two gloved hands, level as a scale. "You will want it, if you mean to go further than the gate. Or to help the one who already tried, and is paying for it by the fountain." It does not say which you should choose. "Consider it the first thing the Keep gives freely. There is not a second."`,
    desc: "A tall figure in a gatekeeper's coat mended so many times the original cloth is a rumour. Its face is not hidden, merely difficult - the way a word can be difficult to recall. It stands by the portcullis chains with a closed ledger, and it stands the way furniture stands: as if it has always been exactly here.",
    greeting: `The tall figure inclines its head by one measured degree. "Ah. The new arrival. Welcome, formally, to the Hollowed Keep." "I am the Porter. I keep the gate, the ledger, and - where possible - the tone." It does not open the ledger. It has never needed to. "Received at threshold: one self, complete. The Toll is paid in full. You will have questions. That is usual, and it is encouraged. Orientation is part of the service."`,
    returnGreeting: `"The arrival, returned." The Porter inclines its head by the customary degree. "The gate stands. The terms hold. Ask, if the Keep has raised new questions." A pause. "It usually has."`,
    deathGreeting: `"Ah." The Porter regards you with the mild interest of a clerk confirming a postmark. "Yes. That will happen. It is not posted anywhere, because then nobody would enter - but it is in the terms." A pause, measured to the grain. "The Keep returns what it cannot yet use. Do try to be flattered. Precious little comes back at all."`,
    farewell: `"Orientation concludes." The Porter inclines its head by one degree. "It resumes whenever you wish. The gate is patient, and so, professionally, am I."`,
    topics: {
      toll: `"Name, past, trade, loves. Assessed on entry, collected in full. There are no part-payments, and there are no refunds." A pause, precisely as long as respect requires. "I am required to tell you this. I am also sorry to tell you this. Both of those are true, and I have found they do not interfere with one another."`,
      terms: { text: `"Posted on the gate, in the language you knew before. Three clauses." The Porter recites without looking at anything. "All who enter, pay. What is paid, settles below. What settles - may be sought." It straightens a chain that was already straight. "The Keep honours its terms. It left you your blood, and it left you one keepsake. It always leaves those. In eleven thousand years of service, I have not been told why."`, reveals: ["keepsake"] },
      keepsake: { hidden: true, text: `"Check your pockets, when you have a quiet moment. One item survives the Toll, per soul. Some arrivals call it an oversight." The Porter's grip settles on the ledger. "I have never known the Keep to overlook anything. I have known it to leave a receipt."`, },
      gates: `"The gates open inward. That is their design, and that is the whole of their design." It says this gently, the way one tells a child about winter. "You are welcome to walk south and put your hand to the iron. Everyone does. Consider it part of arriving."`,
      down: `"What the Keep takes, settles. Floor beneath floor beneath floor, older as you go. Your self is down there now, among everyone's." A measured pause. "The stairs are open. The stairs are always open. That is what stairs are for."`,
      porter: { hidden: true, text: `"I signed the same terms, once. I no longer recall what I paid, or who did the paying." The Porter aligns the ledger with the table's edge. "The position came with the coat. The coat came with the post. I find the work steadying." Its head tilts, one degree. "You will find your own equivalent, or you will find the stairs. Most find the stairs."`, },
    },
    topicReveals: { toll: ["porter"] },
    onAttackStages: [
      `The Porter does not move. Your blow lands on its coat and stops, the way sound stops in snow. "I will enter that as a clerical error," it says, without reproach. "The Keep is less generous with its filing. Please do not do it again."`,
      "FLICK",
    ],
  },

  // Wick: a small ghost of pure helpfulness. Speaks in third person,
  // short sentences, earnest and literal. Loves fire, loves the player,
  // does not entirely remember why. Occasionally a sentence that belongs
  // to somebody else escapes the lantern; Wick always owns up to it.
  wick: {
    name: "Wick",
    aliases: ["hooded figure", "hooded shape", "hooded man", "figure", "lantern bearer", "lantern"],
    unmetName: "Hooded Figure",
    presence: "Wick drifts near the fountain, lantern up, lighting nothing in particular on purpose.",
    presenceUnmet: "The small hooded figure keeps near the fountain, lantern raised in patient invitation.",
    desc: "A small hooded shape holding a lantern that burns without oil. Whatever Wick was, it was so long ago that personhood has worn off like paint; what remains is helpfulness, a lamp, and a memory of manners. Sentences that belonged to other people sometimes escape the lantern, like sparks.",
    greeting: `The lantern rises. The voice beneath the hood is small and dry, like a draft under a door. "Welcome home, my lord. Supper is nearly - " The light flinches. "No. Wick is sorry. That sentence belonged to somebody else. They escape, sometimes. The Keep is full of leftover words and Wick's lantern draws them." The flame steadies, warm. "Wick. That is the name, or near enough to answer to. Wick lights things. It is a small job. Wick does it well."`,
    returnGreeting: `The lantern bobs up, bright. "The friend returns. Wick kept your place." A beat. "Wick keeps everyone's place. But yours on purpose."`,
    deathGreeting: `The lantern flares before you have crossed half the yard. "There. THERE. Wick felt the Keep collect, and Wick hoped it was not you, and hoping is hard work for a lantern." The light settles into something very like a sigh. "Welcome back, friend. The dying gets easier. That is the worst thing Wick knows, and Wick tells it to you for free."`,
    farewell: `The lantern dips - a small bow of light. "Wick will be about. Wick is always about. Mind the dark corners." A beat. "Or bring them to Wick. Wick has strong opinions about dark corners."`,
    onAttack: `Your hand passes through the hood and out the other side, trailing cold. The lantern does not so much as gutter. "The last one who tried that is a smell now," Wick says, without rancour. "Not Wick's doing. Wick only lit the room so everyone could see it happen."`,
    topics: {
      wick: `"Wick was someone. The Keep took the someone at the gate. The errand stayed behind, holding the lantern." The flame tips, considering. "Light the dark corners. That was the whole errand. Wick has done it so long that Wick suspects the errand is now also the soul." A pause. "It could be worse. Some people's souls are debts."`,
      hearths: `The lantern swings toward the north archways, suddenly all business. "Cold hearths, all through the Keep. Light one and it learns you. Then, when the Keep collects you - and it will, friend, it is not personal - you wake beside your fire instead of on the stones." "Rest at a lit hearth and sleep comes easy. Nothing else in here comes easy. The great hall keeps a hearth. Wick recommends the great hall." A beat. "Wick recommends fire generally."`,
      keep: `"Do not hate it. Hate wants a face, and the Keep will not lend you one." The flame burns very steady, which you are beginning to understand is how Wick looks serious. "It is not cruel. Cruelty wants something. The Keep only settles accounts. So: do not be owed. Do not owe. Light the hearths. That is everything Wick knows, and Wick has been here longer than the moss."`,
      down: `"Down is where everything settles. Down is where yours went." The flame sinks to a bead, the smallest Wick has ever made itself. "Wick went down once, to look for the someone. Wick came back as Wick." The light does not rise again until you look away. "Weigh that before the stairs, friend. Weigh it twice."`,
    },
  },

  // The Wounded Knight -> Avalonne: a soldier bleeding out at the fountain.
  // Wounded: urgent, spare, no lore, no name - he needs help, that's all.
  // Healed: grateful, human, and the game's combat teacher. He does NOT
  // ramble about the Toll; he deals in staying alive.
  wounded_knight: {
    name: "Wounded Knight",
    postQuestName: "Avalonne",
    aliases: ["injured man", "wounded man", "man in armour", "armoured man", "knight", "avalonne", "soldier"],
    presence: "The wounded knight is down against the fountain, one gauntlet clamped over his side, watching the archways the way a man watches a door he expects to open.",
    postQuestPresence: "Avalonne is on his feet by the fountain, moving through slow guard-forms, testing a side that holds.",
    desc: "A knight in battered plate, sat against the fountain because standing is beyond him. One gauntlet is pressed hard to a wound in his side that has slowed but not stopped. His breathing is careful, rationed. Whatever did this was still climbing when he ran out of the strength to follow.",
    greeting: `He hears you before he sees you, and his hand twitches toward a sword he hasn't the strength to lift. Then he places you as living, and the hand eases. "You're - not one of them. Good." A short, wet breath. "Haven't the wind for long talk, so I'll be plain. Something up there put a hole in me, and I couldn't put one back. I need mending, not a bandage." His eyes hold yours, steady despite it all. "Do that, and everything I know about staying alive in here is yours. It's worth more than it sounds."`,
    returnGreeting: `He is where you left him, hand to his side, paler than before. "Still here. Still leaking." A thin breath. "Still trading, if you've found a way to mend a man."`,
    postQuestGreeting: `He rises to meet you now - a little stiff, but his own man again. "The one who put me back together. Well met, properly this time." He sets his shoulders. "Avalonne. Ask me what you like - and ask me about the fighting. I owe you that lesson, and it's the kind that keeps you breathing."`,
    farewell: `"Go careful out there." He eases back against the cool of the fountain. "I'll be here till my legs agree to more."`,
    onAttack: `He gets an arm up, barely. "Don't - " A ragged breath. "I'm no use to you dead, and you're the first thing with a pulse I've seen in days. Don't make us both regret it."`,
    topics: {
      wound: `"Steel. Through the side. From something that fought like it had a hundred years to practise the stroke." He presses the wound; it costs him. "I've stopped the worst. Stopping isn't mending, and I'm running out of the difference. Find me a way to close it. Please."`,
      help: `"Mend me, and I teach you to read a fight before it lands on you." His jaw tightens against the pain. "That one trick is the only reason I'm bleeding instead of buried. It'll do the same for you. Cheap price for a life - mine now, yours later."`,
    },
    postQuestTopics: {
      combat: `He settles into a slow stance, and for a moment the wound doesn't exist. "Everything in here tips its hand before it strikes. You only have to be looking for the wind-up." He talks you through it, unhurried. "A big loaded blow - a heavy - you don't trade with that. You kill it early: set your guard against it, or slip it if you're quick on your feet. Do it clean and the miss throws them wide open - then you make them pay." He shifts. "Something that hunkers behind its guard won't break to hammering. Sell it a strike, draw the parry, and go through the hole it leaves. That's a feint." Another shift. "A wild, everything-behind-it swing? Don't dance for it. Just hit - it's already handed you the opening." He straightens. "And a small, testing blow isn't worth a whole move to answer. Take it on the chin and hit back. Read the tell, answer it true, and every fight gets shorter. That's the whole of the craft."`,
      avalonne: `"Avalonne. Borrowed, like everything else I've got left." A faint grin, the first one that hasn't hurt. "The little lamp by the fountain gave it me when I woke with none - said a man should have something to be called by, even in here. It stuck. I've worn worse things gladly." He shrugs. "Be kind to the lamp. It has better manners than most of what's below."`,
      below: `"Past the guard room, the stairs go down. A skeleton holds them - fights like a drillmaster, all rehearsed angles. Don't fight it like a soldier. Feint it; it answers the war it remembers, not the one in front of it." He says it plainly, one professional to another. "And carry silver into the catacombs. Steel's a rumour down there."`,
    },
    quest: {
      id: "heal_knight",
      name: "Find a Way to Heal the Knight",
      requiresAny: ["minor_healing_tome", "healing_potion"],
      onComplete: `Whatever you brought, it takes - the wound draws closed like a shutter against weather. He goes very still, disbelieving, then breathes deep for the first time without paying for it. Colour comes back into him like a garrison relieved. "That's - that's the first breath that hasn't cost me. My thanks. Truly." He gets up in stages and finds his feet hold under him. "Avalonne. The little lamp at the fountain gave me the name when I woke without one. It'll serve." He presses a heavy iron key into your palm. "Lower levels - yours now, earnest against what I owe. And ask me about the fighting when you've a moment. I promised you the lesson, and a soldier keeps his books."`,
      reward: ["iron_key_2"],
      rewardText: "Avalonne gives you a dungeon key, and offers to teach you how to read a fight. (Ask him about combat.)",
      statBonus: { attack: 2 },
    },
  },

  // Cedric, Ghost of the Scribe: a pedant with a cause. Precise, fussy,
  // secretly proud. Believes documentation is the only immortality that
  // has ever actually worked - and he is the proof.
  ghost_scribe: {
    name: "Ghost of the Scribe",
    aliases: ["scribe", "ghost", "scholar", "cedric", "translucent figure", "writer"],
    presence: "Cedric hunches at the reading desk, writing without pause in the book that is not there.",
    presenceUnmet: "A translucent scholar hunches at the reading desk, writing without pause in a book that is not there.",
    desc: "A translucent figure hunches over a reading desk, eternally writing in a book that does not exist. His robes mark him as a scholar. His expression is one of desperate concentration, of a man keeping something alive by hand.",
    greeting: `The quill stops. He looks up, and his eyes focus on you with visible effort, like a man surfacing from deep water. "You can see me. Truly see me. Do you know how few can?" He straightens his robes, remembering his manners one at a time. "Cedric. Keeper of the household ledgers - the Scribe, if titles come easier. The name survives because I wrote it in nineteen places, and the Keep respects paperwork." The quill starts moving again, on its own. "I wrote the truth about this place, once. Five pages of it - the five that mattered. The last Steward tore them out and scattered them the night the Keep came for him." He leans forward. "Find them. I have been right for three hundred years with no way to prove it, and it is INTOLERABLE."`,
    returnGreeting: `"Back. Good. The living make excellent legs." The quill never stops. "Five pages, still scattered. The truth has waited three centuries." A precise pause. "It is developing opinions about waiting longer."`,
    farewell: `"Yes, yes, go." The quill does not stop. "Paper waits better than people. It is the only thing in this building that does."`,
    onAttack: `Your hand passes through him. He looks down at where it went, more disappointed than alarmed. "Nineteen places," he says. "My name survives in nineteen places, and you have just put your fist through several decades of filing." He re-dips the quill that does not exist. "I shall make a note of you."`,
    topics: {
      journal: `"Five pages. In order: the Toll, and what it actually is. The Takings, and where they settle. What sits at the bottom of everything. And what Malchor did - two pages, that one, because what Malchor did took two pages." The quill jabs at the air for emphasis. "He scattered them the night the Keep noticed him. Truth was the one theft he never got the knack of. It kept sticking to things."`,
      steward: `"Understand the arrangement first. The household kept the Keep - fed it gently at the gate, so it would not feed itself inside. And the Keep kept its distance. It does not hunt what feeds it." He sets down the quill; this is serious. "Malchor was the last Steward and the cleverest, and cleverness curdles in a building like this. He began to skim. Fragments of taken selves, palmed off the Toll like a tollman palming coins." The quill resumes, harder. "I documented it. Naturally. That is what I am FOR."`,
      keep: `"You are standing inside a hunger that learned architecture." He says it the way other men say 'mind the step'. "It takes. What it takes, settles - floors of it, going down past my ability to footnote. The household existed to keep the taking orderly." A sniff. "Malchor made it personal. Never make anything personal with a building."`,
      help: `"Find my five pages and I will teach you the Word of Sundering." He watches your face for the appropriate awe, and continues before it can fail to arrive. "The Keep stitches its servants out of taken shadow. The Word unpicks the seam. You will want it below - and I will want my pages read by someone whose hands can turn them. We are, as the merchants say, in business."`,
    },
    quest: {
      id: "find_pages",
      name: "Collect the Five Journal Pages",
      requires: ["journal_page_1", "journal_page_2", "journal_page_3", "journal_page_4", "journal_page_5"],
      onComplete: `"Yes. YES. Whole again - careful with the corners." Cedric brightens, becoming almost solid, and reads his own pages through like a man checking a verdict. The relief in his face goes grave by the final line. "It is as I wrote. The Rod. The Crown. The choice." He looks up. "You will need what I promised." He speaks a word that skips your ears entirely and lodges in your mind like a splinter of cold. "The Word of Sundering. It unpicks anything the Keep stitched from shadow. Including, if it comes to that, what the Steward carries." He squares the pages with two taps. "Three hundred years. And I was RIGHT."`,
      reward: [],
      rewardText: "Cedric teaches you the Word of Sundering spell.",
      teachesSpell: "sunder",
    },
  },

  // Wren, the Imprisoned Thief: charm as a lockpick. Everything is a
  // negotiation, everyone is an opportunity, and none of it is personal.
  // Genuinely good company, which is itself a technique.
  imprisoned_thief: {
    name: "Imprisoned Thief",
    aliases: ["thief", "prisoner", "wren", "captive", "wiry figure"],
    leavesAfterQuest: true,
    presence: "From the locked cell, Wren's eyes follow you between the bars, unhurried, still taking inventory of everything you carry.",
    presenceUnmet: "From the locked middle cell, sharp eyes track you between the bars.",
    desc: "A wiry figure in dark clothing crouches in the locked cell, at ease the way cats are at ease - completely, and provisionally. Sharp eyes have already valued everything you carry, plus sentimental markup.",
    greeting: `The figure in the cell doesn't get up, but the voice arrives like a handshake. "Well. A living soul, walking upright, with pockets. This is the best thing that has happened to me in a month." A grin surfaces in the dark. "Call me Wren. It's what I answered to when I woke at the gate, so I've decided it's mine - possession being, in my professional opinion, all ten tenths of the law." The eyes flick to your belt, your boots, your hands, pricing as they go. "I'm a thief. I'd shake on it, but there are bars. Which brings us neatly to business: get me out, and I make it worth your while. I always make it worth people's while. It's why I'm still - " a gesture at the cell " - well. It's why I'm still."`,
    returnGreeting: `"My favourite passing acquaintance." Wren doesn't bother rising. "Situation report: me, bars, an unreasonable quantity of time. Gatehouse key, guard room key, or lockpicks." A beat. "Observe how good I've become at waiting. It's the only thing in here worth stealing."`,
    farewell: `"Off you go, then." Wren settles back into the dark of the cell like it's upholstered. "Shout if you find a key. Or a guard to lift one from. I'm flexible on method."`,
    onAttack: `Wren doesn't flinch behind the bars. "Bold. Hitting someone in a cage." The grin doesn't move an inch. "When I'm out of here, remind me to teach you where to aim. Free of charge. I'm a giver."`,
    topics: {
      name: `"Wren. Small bird, gets into everything, difficult to catch." A shrug. "Whether that was my name or my file, I couldn't tell you. The Toll took the who and left the how - I remember locks, quiet floors, the weight of a purse from across a room. The hands remember." The grin sharpens. "The rest paid the toll so the talent could travel light. I choose to read it that way."`,
      escape: `"Inventory of my requirements: one key, OR one set of picks, OR one person with your shoulders and a low opinion of these bars." The eyes go businesslike. "The key should be in the gatehouse or the guard room - guards are creatures of habit, it's why they're so easy to rob. Fail all that, come back and we'll discuss the shoulders option."`,
      treasure: `"Oh, there's treasure. More than you could carry, and I say that having audited your carrying capacity when you walked in." The voice drops, professional. "But the real stock is below. Guarded by things that don't stay dead when you kill them - which offends me on a technical level. I got down two floors and came back up at a speed I'm not proud of." A pause. "I am a little proud of it."`,
      passages: `"This place is riddled with ways it half-wants found. Behind the library shelves there's a laboratory - I've been through it. There'll be more. Buildings that keep secrets always overdo it." The grin returns. "Get me out and I'll tell you which book to push. Consider it the free sample."`,
    },
    quest: {
      id: "free_thief",
      name: "Free the Imprisoned Thief",
      requires: "iron_key",
      onComplete: `The door swings and Wren is out before it finishes, stretching like a cat that has decided the nap is over. "Freedom. I'd forgotten the ceiling was that colour." A set of lockpicks appears between two fingers, produced from somewhere the cell search evidently never found. "A deal's a deal, and I keep the profitable ones. These have opened places you wouldn't believe. They're yours." The picks land in your palm. "And the promised sample: the reading nook, off the library. Red-bound book, deeper crimson than its brothers. Push it, and the shelf remembers it's a door." Wren is already halfway into the dark, travelling light. "You're welcome. Spend it well."`,
      reward: ["lockpicks"],
      rewardText: "Wren gives you lockpicks and reveals the location of a hidden passage.",
      revealsHidden: "reading_nook",
    },
  },

  // The Spectral Guardian: the last consecrated thing in the building.
  // Liturgical, grave, kind underneath - a soldier of a faith whose
  // congregation is one chapel and whoever walks into it.
  spectral_guardian: {
    name: "Spectral Guardian",
    aliases: ["guardian", "spirit", "figure of light", "ghost", "warden"],
    presence: "The Spectral Guardian stands before the altar, sword point-down, patient as the stone it guards.",
    desc: "A figure of blue-white light stands before the chapel altar, in armour of an ancient design, hands folded on the pommel of a sword that gleams with silver fire. Its face is stern but not unkind. Around it, the Keep's pervasive wrongness stands back, like weather outside a doorway.",
    greeting: `The figure of light raises its head, and the chapel gets one shade brighter for it. "Halt, seeker. Be at ease - halting is a courtesy here, not a threat." The voice is the voice of cold water: clear, old, direct. "I am the Guardian. I kept this chapel in life. I keep it still. It is the last sanctified ground in the Keep, and it holds the last blessed weapon: the Silver Dagger." The gauntleted hand lifts, formal as scripture. "The dagger is given, never taken - and it is given for truth. Answer my riddle truly, and it is yours. I have cities, but no houses. Mountains, but no trees. Water, but no fish. Roads, but no travellers. What am I?"`,
    returnGreeting: `"Seeker. You return to sanctified ground." The silver fire along the blade breathes once, low. "The chapel holds. It always holds. Speak, if you have need - or an answer."`,
    farewell: `"Go in what light you can find." The Guardian returns to its watch, and the fire of the blade banks low. "This ground does not move. Remember that, when everything else does."`,
    topics: {
      riddle: `"Hear it again, and hear it exactly." The Guardian speaks the words like a rite. "I have cities, but no houses. Mountains, but no trees. Water, but no fish. Roads, but no travellers. What am I?" (Type 'answer [your answer]' to respond.)`,
      silver: `"The Silver Dagger was forged in this chapel by the first priest of the Keep, in the years when the Keep could still be argued with." The Guardian's hand rests on its own sword, remembering. "It carries the last blessing this place ever gave. The dead below fear little. They fear that."`,
      chapel: `"This is the one floor the Keep has never digested. It cannot. Consecration disagrees with it - profoundly, and forever." The light dims by a reverent fraction. "The saints in the alcoves gave their faces to the walls, that the walls would hold. The bargain stands. Only I remain to see that it is honoured, and I intend to be sufficient."`,
    },
    riddleAnswer: "map",
    riddleReward: "silver_dagger",
  },

  // The Mad Alchemist: a delighted empiricist with no surviving sense of
  // danger. Everything is an experiment; you are a promising data source.
  // Speaks in enthusiasms and lists. The 'Mad' was awarded, not chosen.
  mad_alchemist: {
    name: "The Mad Alchemist",
    aliases: ["alchemist", "elderly figure", "old man", "madman", "chemist"],
    presence: "The Mad Alchemist mutters over the bubbling apparatus, one brown eye on the work and the white one, somehow, on you.",
    desc: "An elderly figure in a stained robe, presiding over bubbling apparatus with the joy of a conductor. Their eyes are mismatched - one brown, one entirely white - and they stand at a slight angle to reality, as if leaning over its shoulder to check its working.",
    greeting: `The elderly figure whirls from the apparatus with alarming delight. "A VISITOR. Living, ambulatory, and - " a sniff " - only lightly wounded. Wonderful. Sit anywhere that isn't fizzing." A stained hand waves at the entire laboratory, which is mostly fizzing. "They called me the Alchemist when this was a household. The 'Mad' accreted later - unfairly, in my view, but I've kept it. Titles are data too." The white eye fixes on you; the brown one checks a retort. "I brew. Potions, poisons - the distinction is mostly dosage and entirely the customer's business. Bring me ingredients and we shall do SCIENCE at each other."`,
    returnGreeting: `"The customer returns! Or the test subject." A jar is shaken and squinted at. "The distinction, as ever, is dosage. Ingredients out, if you brought them. Symptoms also accepted." The white eye gleams. "Everything is data."`,
    farewell: `"Yes, go, go - come back with ingredients! Or symptoms!" The Alchemist is already arguing with the retort again. "Either advances the work. YOU advance the work. I like you enormously."`,
    onAttack: `The Alchemist sways out of reach with the practiced ease of someone who has been swung at by professionals. "Interesting! Aggression, unprompted, in a subject with no prior - " a squint " - no, SOME prior head trauma." A pencil appears. "Do that again, but slower. It's all data."`,
    topics: {
      potions: `"The menu, such as it is." Fingers count, stained in colours fingers shouldn't be. "Moonpetal and holy water: an Antidote of Warding - purges shadow corruption, essential below. Moonpetal and an empty vial: a healing draught, honest work. Moonpetal grows in the east garden, among the fungi. The fungi are NOT an ingredient." A pause. "One learns which things are not ingredients. Usually once."`,
      shadow: `"Attend, because everyone gets this wrong." Both eyes align on you, which is worse than either alone. "Shadow, here, is not darkness. Darkness is an absence. Shadow is a MATERIAL - the Keep stitches its servants out of taken selves, the way you'd stitch a coat from... well. From people." A delighted shudder. "Disrupt the stitching and they unravel. There is a Word for it. Find someone old enough to teach it. I'm old, but I'm the wrong KIND of old."`,
      patron: `"I had a patron once. There is a hole in my head where his name was." They tap the white eye, casually, as if it explains itself. "The Keep took him whole, in anger - and took his name out of MY memory too, which strikes me as showing off." A shrug. "The hole still pays, in a sense. I keep the laboratory. The laboratory keeps me. Symbiosis. I'd write it up, but my referee ate my patron."`,
      brew: `"Practicalities!" Hands clap once, raising a small green cloud. "Bring moonpetal and holy water together, and I make you the antidote - you will WANT the antidote where you're going. Moonpetal and an empty vial gets you a healing draught." The brown eye softens, briefly and sincerely. "Bring yourself back in one piece to drink them. Good test subjects are irreplaceable. That is a compliment. I don't give many."`,
    },
    canBrew: true,
  },

  // Bartholomew, the Ghost Merchant: a salesman so committed that death
  // registered as a change of premises. Warm, quick, genuinely content;
  // reframes everything as commerce and is usually right to.
  merchant_ghost: {
    name: "Ghost Merchant",
    aliases: ["merchant", "bartholomew", "ghost", "trader", "shopkeeper", "portly figure", "translucent figure", "salesman"],
    presence: "Bartholomew presides at the head of the banquet table, arranging wares only half of which exist, and brightens as you pass.",
    presenceUnmet: "A portly, translucent figure presides at the head of the banquet table, over wares only half of which exist.",
    desc: "A portly, translucent figure sits at the head of the banquet table, examining spectral wares with the tenderness of a man counting his own blessings, which, in a sense, he is. Unlike every other ghost in the building, he looks like he'd renew the lease.",
    greeting: `The portly ghost looks up, and his whole translucent face reorganizes itself into delight. "A customer! LIVING! You have no idea how the haggling thins out when everyone's dead - the deceased hold grudges about prices from centuries I don't have stock for." He rises, bows as far as his spectral waistcoat permits. "Bartholomew. Merchant. The name is bought and paid for - the man who sold it had no further use for it, and I don't deal in stories sadder than that before lunch." He spreads his hands over the half-visible wares. "Browse. Everything is genuine, my prices are fair, and my returns policy is eternal. That last one used to be a joke."`,
    returnGreeting: `"Repeat custom!" Bartholomew beams like a hearth. "The rarest stock in the building, and it walks in on its own legs." He gestures at the wares. "Business as usual, friend. Fair prices, eternal returns, inventory at least partially real."`,
    farewell: `"Do come again. Repeat custom is the soul of commerce." He polishes something invisible, contented. "And in my case, the only soul on offer."`,
    onAttack: `Your fist passes through Bartholomew and disturbs a spectral display of something. "Striking the shopkeep," he says, mildly, restacking it. "That voids the returns policy, friend. And I have an eternal memory for faces. It's the one inventory that never depreciates."`,
    topics: {
      trade: `"The house rules, simple as scales." He taps the table, once per clause. "You show me valuables - gold coins, gemstones, oddments with a shine - and I quote you honestly. In return: supplies. The kind that keep a customer breathing, which is enlightened self-interest, because breathing customers come BACK." A wink. "Type 'trade' when you're ready and we'll talk numbers."`,
      wares: `"Healing potions, chiefly. The living always need those - it's the steadiest market there has ever been." He leans in, confiding. "I also carry antidotes, torches, the occasional oddity. And information, which is the best good there is: weighs nothing, never spoils, and I'm the only stall in the building." He pats a stack of nothing, fondly. "Ask around the shelves. Everything's priced."`,
      keep: `"I died here, decades back. The dungeon stairs - one moment a man of commerce, the next a cautionary tale with excellent inventory." He says it cheerfully, a man long since done grieving himself. "But mark this, because it's the only free thing I stock." He raises one translucent finger. "The Keep took my name at the gate and my life on the stairs - and it has never ONCE touched my ledger. Commerce, it respects. I've decided not to examine why." The finger lowers. "One does not audit a miracle."`,
    },
    canTrade: true,
    inventory: {
      healing_potion: 30,
      antidote: 40,
      torch: 10,
    },
  },

  // The Talking Skull: a dead adventurer's sense of humour, outliving the
  // adventurer. Sardonic, chatty, and lonelier than it will ever admit -
  // every insult is an invitation to stay another minute.
  talking_skull: {
    name: "Talking Skull",
    aliases: ["skull", "bones", "glowing skull"],
    presence: "On the shelf of skulls, the talkative one has already noticed you. It is visibly composing remarks.",
    desc: "A human skull on a shelf of quieter colleagues, distinguished by the green glow in its sockets and the fact that it won't shut up. Centuries of dignity have been traded, apparently willingly, for an audience.",
    greeting: `The green glow swings toward you like a lighthouse with opinions. "Oh, wonderful. Another hollow hero. Let me guess: down to the bottom, take back what the gate took. Groundbreaking. Nobody's ever thought of it." The jaw doesn't move, which somehow makes the voice more insolent. "I'm the Talking Skull. The name is descriptive - I was an adventurer, then an archery lesson, and now I'm the best conversation on this floor, which tells you everything about this floor." The glow brightens, betraying itself. "Stay a minute. Ask me things. The femurs are terrible company and the wraith doesn't do banter."`,
    returnGreeting: `"Back again. The shelf and I were just talking about you." A beat. "Fine. I was." The green glow brightens a grudging shade. "Go on, ask your questions. It's this or the femurs, and the femurs haven't held up their end of a conversation in nine hundred years."`,
    deathGreeting: `"Oh-ho. There it is. The complexion of the recently collected." The skull would lean forward if it could; the glow does it instead. "Died, did you? It shows around the eyes. Don't take it to heart - the Keep does it to everyone." A pause, almost gentle, by skull standards. "I used to have a whole body about it. You're handling it better than I did. I screamed for a decade. Ask the femurs."`,
    farewell: `"Yes, wander off. They all do." The glow dims to a sulk. "The shelf and I will be here. We're very committed." A beat, called after you: "Ask for me by name below! It won't help! But I enjoy the publicity!"`,
    onAttack: `You flick the skull off its shelf. It clatters, rolls, and comes to rest facing you, which feels deliberate. "Ow," it says, flatly. "Centuries of dignity. Put me back and we shall never speak of this." A pause. "The shelf, however, judges you. The shelf never forgets."`,
    gravekinTopics: {
      kinship: `The glow settles, and for once the voice comes down off the stage. "Ah. Quiet-blood. You hear us without the theatrics, don't you." A rare, unperformed pause. "A tip between relatives, then: ask the bones before you trust the doors. The bones have no reason left to lie. The doors have nothing BUT reasons."`,
    },
    topics: {
      catacombs: `"Pay attention, this is the good material." The glow sharpens to a lecturer's point. "The bone arrangements aren't decor. They're a warning, a history, and a map, all three at once. Skulls face the safe paths. Ribcages arch over danger. Read the bones and you'll probably survive." A beat. "PROBABLY is load-bearing in that sentence."`,
      wraith: `"The wraith down here was the Keep's chaplain. I know. Holy man gone very, very unholy - it happens, apparently, the way milk goes off." The glow flattens, serious for once. "Silver hurts it. Holy water unmakes it. Ordinary steel just makes it ANGRY, and an angry wraith is a weather system with a grudge. Kit accordingly."`,
      skull_key: `"The key. Yes. I know exactly where it is, because I've had nine centuries and no hobbies." The glow tips, indicating direction with maximum smugness. "The bone mandala, three alcoves north. Behind the left femur of the third row. Search the mandala and thank me after." A pause. "People forget the thanking. Don't be people."`,
      self: `"I was an adventurer. Like you, but - and I say this with love - probably better dressed." The glow does something that is unmistakably a shrug. "Came in hollow, went down loud, took an arrow to the everything. Now I'm a skull, and here's the joke: it's not all bad. No hunger, no rent, no feet to hurt. The Toll can't take much from a skull." The green light glitters. "That, friend, is called winning on a technicality, and I'll thank you to record it as a win."`,
      rod: `The glow goes still, and the voice drops its act entirely. "Listen, because the comedy stops for this one. The Toll-Rod is not power. It's AUTHORITY - the Keep's own, lent out for collecting." No jokes now. "Hold it, and you become the collection plate. It fills, and fills, and eventually there's no hand left holding it. Just the collecting." The green light gutters once. "The Steward down there was a person. That's the whole horror story. It's quite short."`,
    },
  },

  // The Ancient Spirit: older than the Keep, speaks in bedrock. Vast,
  // deliberate, and - underneath the scale of it - courteous. Every word
  // costs it effort; it does not waste any.
  ancient_spirit: {
    name: "Ancient Spirit",
    aliases: ["spirit", "presence", "voice", "old one"],
    presence: "The air at the shrine's centre is still thicker than air has any right to be. It is still aware of you.",
    desc: "Not a ghost but something older - a presence without form, felt the way depth is felt. The air thickens around a central point, and when it speaks, the words skip your ears and arrive directly, already understood, like things you had forgotten knowing.",
    greeting: `The pressure arrives before the words - a weight behind your eyes, patient and immense, like a hand testing whether you will hold. "YOU COME TO THE OLD PLACE. HOLLOW ONE. SEEKER. FOOL. PERHAPS ALL THREE. MOST ARE." The words are not sound. They are conclusions. "I HAVE NO NAME YOU COULD CARRY. CALL ME SPIRIT. IT IS NOT CORRECT. IT WILL SERVE." The weight eases, fractionally - which you understand, somehow, to be politeness. "SPEAK YOUR PURPOSE. I HAVE TIME. I AM LARGELY MADE OF IT."`,
    returnGreeting: `The pressure builds behind your eyes - familiar now, almost fond, the way a vice can be fond. "YOU RETURN TO THE OLD PLACE. THE OLD PLACE HAS NOT MOVED. IT DOES NOT, ANYMORE. SPEAK."`,
    farewell: `The pressure eases like a tide going out, and one last word arrives as it goes, quieter than the rest: "DESCEND WISELY."`,
    topics: {
      purpose: `"IF YOU DESCEND FOR POWER, YOU ARE A FOOL, AND THE KEEP EATS FOOLS GENTLY. THEY NEVER NOTICE." The weight turns, considering you from another angle. "IF YOU DESCEND TO RECLAIM WHAT WAS TAKEN, YOU ARE BRAVE. IF YOU DESCEND TO UNDERSTAND, YOU ARE WISE. THE THREE ARE PAID DIFFERENTLY." A pause like a held breath, geologic. "TAKE THE AMULET FROM MY ALTAR. THE STEWARD'S SHADOW EATS WILL BEFORE FLESH. I WOULD HAVE YOURS OUTLAST YOUR SKIN."`,
      shrine: `"THIS PLACE WAS OLD WHEN THE KEEP WAS SMALL." The words settle like sediment. "YES. SMALL. IT WAS NOT ALWAYS A CASTLE. IT WAS NOT ALWAYS ANYTHING. IT IS A HOLLOW THAT LEARNED TO BUILD WALLS AROUND ITS HUNGER." The pressure tilts, very slightly, in what might be a bow toward the stones. "IT HAS BEEN FILLING ITSELF SINCE BEFORE YOUR PEOPLE COUNTED YEARS. IT IS NOT FULL. THAT IS THE WHOLE OF WHAT YOU NEED TO KNOW ABOUT IT."`,
      amulet: `"THE AMULET OF WARDING SHIELDS THE MIND FROM SHADOW'S TOUCH. IT IS ON THE ALTAR. IT WAS ALWAYS FOR WHOEVER CAME." The words come slower now, deliberate as masonry. "WITHOUT IT, THE HOLLOWED STEWARD CONSUMES YOUR WILL BEFORE YOUR BODY. YOU WOULD KNEEL, AND MEAN IT. WITH IT, YOU HAVE A CHANCE." The pressure holds you, steady. "A CHANCE IS MORE THAN MOST RECEIVE. SPEND IT WITH BOTH HANDS."`,
      crown: `"BEHIND THE THRONE LIES WHAT THE STEWARD HID. EVERY FRAGMENT HE SKIMMED FROM THE TOLL, GROWN TOGETHER INTO A CROWN." The weight goes very still, and the stillness is the warning. "GIVE IT BACK WITH YOUR OWN HANDS UPON IT, AND EVERY SOUL HE ROBBED GOES FREE." A pause. "THE HANDS, IT MUST BE SAID, STAY. I AM TOLD IT IS QUICK. I AM NOT TOLD BY ANYONE WHO CAME BACK TO SAY IT TWICE."`,
    },
  },
};
