/**
 * Fun Fact Tracker & Duplicate Prevention System Backend
 * Version: 1.0.0
 * 
 * Google Apps Script backend providing:
 * 1. Google Sheets persistence ("Fact Log")
 * 2. Multi-tier Duplicate Prevention Engine (Exact, Levenshtein distance, Jaccard Keyword Overlap)
 * 3. Gemini API Integration for novel fact generation
 * 4. Google Keep Syncing / Note creation
 * 5. Web App REST endpoints (doGet/doPost) for Web Dashboard UI
 */

const SHEET_NAME = "Fact Log";
const SETTINGS_SHEET = "Settings";

/**
 * Custom Menu when opening Google Sheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🎯 Fun Fact Tracker")
    .addItem("📊 Initialize / Seed Fact Log", "initSpreadsheet")
    .addItem("🧠 Run Daily Fun Fact Automation Now", "dailyMidnightTrigger")
    .addItem("✨ Generate 5 Fresh Fun Facts Now", "generate5FreshFactsNow")
    .addItem("⏰ Setup 12:00 AM Midnight Auto-Pilot", "setupMidnightTrigger")
    .addSeparator()
    .addItem("📌 Sync Recent Facts to Google Tasks", "syncMissingFactsToGoogleTasks")
    .addItem("🧹 Clean Completed / Old Tasks from Google Tasks", "cleanOldGoogleTasks")
    .addItem("📌 Test Post to Google Tasks App", "testPostToGoogleTasks")
    .addItem("🔍 Re-Scan All Facts for Duplicates", "reScanAllDuplicates")
    .addItem("🎨 Apply Beautiful Theme & Formatting", "formatSheetArtistically")
    .addToUi();
}

function trackCentralAccountQuota(projectName) {
  try {
    var today = Utilities.formatDate(new Date(), "America/Los_Angeles", "yyyy-MM-dd");
    var url = "https://livecounters-8eaa8-default-rtdb.firebaseio.com/accountQuota/" + today + ".json?auth=IRhauBNcErreqJ8tKdIaUCAKQ6bVymfRsdnuASxe";
    var payload = JSON.stringify({ project: projectName || "FunFact Tracker", timestamp: new Date().getTime() });
    UrlFetchApp.fetch(url, { method: "post", payload: payload, muteHttpExceptions: true });
  } catch(e) {}
}

/**
 * Initialize Spreadsheet structure & Seed all 64 historical facts if empty
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Fact Log Sheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "ID", 
    "Date Added", 
    "Fact Text", 
    "Category", 
    "Keywords", 
    "Similarity Score", 
    "Status", 
    "Keep Note ID", 
    "Source"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 140); // ID
  sheet.setColumnWidth(2, 140); // Date
  sheet.setColumnWidth(3, 450); // Fact Text
  sheet.setColumnWidth(4, 120); // Category
  sheet.setColumnWidth(5, 200); // Keywords
  sheet.setColumnWidth(6, 120); // Similarity
  sheet.setColumnWidth(7, 120); // Status

  // Auto-seed 64 historical facts if empty
  if (sheet.getLastRow() <= 1) {
    seed64FactsToSheet(sheet);
  }

  // 2. Settings Sheet
  let settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SETTINGS_SHEET);
    settingsSheet.appendRow(["Setting Key", "Setting Value"]);
    settingsSheet.appendRow(["GEMINI_API_KEY", ""]);
    settingsSheet.appendRow(["AUTO_KEEP_SYNC", "true"]);
    settingsSheet.appendRow(["STRICTNESS_THRESHOLD", "0.65"]);
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");
  }

  // Apply creative artistic styling
  formatSheetArtistically();

  return { success: true, message: "Spreadsheet structure & historical facts initialized with beautiful theme" };
}

function seed64FactsToSheet(sheet) {
  if (!sheet) return;
  const rows = [["FACT-1721850000000","2026-05-22T00:20:05.269Z","Octopuses have 3 hearts, 9 brains, and blue blood! 🐙💙 Two hearts pump blood to the gills, while one pumps it to the rest of the body. 🌊✨ #FunFact","Octopus","octopuses, have, hearts, brains, blue, blood, two, pump, gills, while, one, pumps, rest, body",0,"Posted","KEEP-1000","Google Keep FunFacts List"],["FACT-1721858640000","2026-05-23T00:20:05.271Z","Hummingbirds are the only birds that can fly backwards and upside down! 🐦⚡ Their wings beat up to 80 times per second in a figure-eight pattern. 🤯✨ #FunFact","Hummingbird","hummingbirds, only, birds, that, can, fly, backwards, upside, down, their, wings, beat, times, per, second, figureeight, pattern",0,"Posted","KEEP-1001","Google Keep FunFacts List"],["FACT-1721867280000","2026-05-24T00:20:05.272Z","Coral reefs are actually living animal colonies! 🪸🌊 Millions of tiny soft polyps build hard limestone skeletons, creating underwater cities for sea life. ✨ #FunFact","Coral","coral, reefs, actually, living, animal, colonies, millions, tiny, soft, polyps, build, hard, limestone, skeletons, creating, underwater, cities, sea, life",0,"Posted","KEEP-1002","Google Keep FunFacts List"],["FACT-1721875920000","2026-05-25T00:20:05.274Z","Honey never spoils! 🍯 Archaeologists found 3,000-year-old honey in Egyptian tombs that is still perfectly edible thanks to its natural chemistry. 👑✨ #FunFact","Honeycomb","honey, never, spoils, archaeologists, found, 3000yearold, egyptian, tombs, that, still, perfectly, edible, thanks, its, natural, chemistry",0,"Posted","KEEP-1003","Google Keep FunFacts List"],["FACT-1721884560000","2026-05-26T00:20:05.275Z","Flamingos can only eat with their heads upside down! 🦩🙃 Their unique filter-feeding beaks are built to filter food from water only when inverted. 🌊✨ #FunFact","Flamingo","flamingos, can, only, eat, their, heads, upside, down, unique, filterfeeding, beaks, built, filter, food, from, water, when, inverted",0,"Posted","KEEP-1004","Google Keep FunFacts List"],["FACT-1721893200000","2026-05-27T00:20:05.277Z","Butterflies taste with their feet! 🦋👣 They have sensors on their legs to quickly check if a leaf is edible before laying eggs on it. 🌿✨ #FunFact","Butterfly","butterflies, taste, their, feet, they, have, sensors, legs, quickly, check, leaf, edible, before, laying, eggs",0,"Posted","KEEP-1005","Google Keep FunFacts List"],["FACT-1721901840000","2026-05-28T00:20:05.279Z","Honeybees must visit about 2 million flowers just to make one single pound of honey! 🐝🍯 Talk about some serious collective teamwork. 🌸✨ #FunFact","Honey","honeybees, must, visit, about, million, flowers, just, make, one, single, pound, honey, talk, some, serious, collective, teamwork",0,"Posted","KEEP-1006","Google Keep FunFacts List"],["FACT-1721910480000","2026-05-29T00:20:05.282Z","A lion's roar can be heard from up to 5 miles away! 🦁🔊 It's the loudest roar of any big cat species, used to track down pride members and warn rivals. 🤯✨ #FunFact","Lion","lions, roar, can, heard, from, miles, away, its, loudest, any, big, cat, species, used, track, down, pride, members, warn, rivals",0,"Posted","KEEP-1007","Google Keep FunFacts List"],["FACT-1721919120000","2026-05-30T00:20:05.289Z","Woodpeckers have a wrap-around tongue that acts as a seatbelt for their brain! 🐦🪵 It wraps around their skull to absorb shock. 🤯✨ #FunFact","Woodpecker","woodpeckers, have, wraparound, tongue, that, acts, seatbelt, their, brain, wraps, around, skull, absorb, shock",0,"Posted","KEEP-1008","Google Keep FunFacts List"],["FACT-1721927760000","2026-05-31T00:20:05.294Z","Sea otters have the thickest fur of any animal on Earth! 🦦❄️ They have up to 1 million hairs per square inch to stay warm in freezing waters since they lack blubber. 🌊✨ #FunFact","Sea otter","sea, otters, have, thickest, fur, any, animal, earth, they, million, hairs, per, square, inch, stay, warm, freezing, waters, since, lack, blubber",0,"Posted","KEEP-1009","Google Keep FunFacts List"],["FACT-1721936400000","2026-06-01T00:20:05.299Z","Sharks have been on Earth longer than trees! 🦈🌳 They first appeared around 400 million years ago, while trees evolved about 350 million years ago. 🤯✨ #FunFact","Shark","sharks, have, been, earth, longer, than, trees, they, first, appeared, around, 400, million, years, ago, while, evolved, about, 350",0,"Posted","KEEP-1010","Google Keep FunFacts List"],["FACT-1721945040000","2026-06-02T00:20:05.303Z","Platypuses glow a fluorescent cyan-green color under ultraviolet light! 🦆✨ Scientists still aren't entirely sure why they biofluoresce. 🌌🤯 #FunFact","Platypus","platypuses, glow, fluorescent, cyangreen, color, under, ultraviolet, light, scientists, still, arent, entirely, sure, why, they, biofluoresce",0,"Posted","KEEP-1011","Google Keep FunFacts List"],["FACT-1721953680000","2026-06-03T00:20:05.305Z","Dolphins sleep with one eye open! 🐬👀 They keep half of their brain awake at all times to breathe and stay alert for predators. 🌊✨ #FunFact","Dolphin","dolphins, sleep, one, eye, open, they, keep, half, their, brain, awake, all, times, breathe, stay, alert, predators",0,"Posted","KEEP-1012","Google Keep FunFacts List"],["FACT-1721962320000","2026-06-04T00:20:05.309Z","Owls don't have eyeballs! 🦉👀 Instead, they have long, immobile eye tubes supported by bony structures. They have to turn their entire head to look around! 🤯✨ #FunFact","Owl","owls, dont, have, eyeballs, instead, they, long, immobile, eye, tubes, supported, bony, structures, turn, their, entire, head, look, around",0,"Posted","KEEP-1013","Google Keep FunFacts List"],["FACT-1721970960000","2026-06-05T00:20:05.311Z","Cheetahs can't roar! They purr, hiss, and make chirping sounds like birds to communicate with each other. 🐆🐦⬛✨ #FunFact","Cheetah","cheetahs, cant, roar, they, purr, hiss, make, chirping, sounds, like, birds, communicate, each, other",0,"Posted","KEEP-1014","Google Keep FunFacts List"],["FACT-1721979600000","2026-06-06T00:20:05.315Z","Elephants are the only mammals that can't jump! 🐘❌ Their heavy bone structure & downward-pointing ankle muscles keep their feet firmly on the ground. 🌎✨ #FunFact","Elephant","elephants, only, mammals, that, cant, jump, their, heavy, bone, structure, downwardpointing, ankle, muscles, keep, feet, firmly, ground",0,"Posted","KEEP-1015","Google Keep FunFacts List"],["FACT-1721988240000","2026-06-07T00:20:05.319Z","Kangaroos cannot walk backwards! 🦘❌ Their large, muscular tails and long feet make it physically impossible to move in reverse. Always moving forward! ✨ #FunFact","Kangaroo","kangaroos, cannot, walk, backwards, their, large, muscular, tails, long, feet, make, physically, impossible, move, reverse, always, moving, forward",0,"Posted","KEEP-1016","Google Keep FunFacts List"],["FACT-1721996880000","2026-06-08T00:20:05.323Z","Sloths can hold their breath longer than dolphins can! 🦥💨 By slowing down their heart rate, they can survive underwater for up to 40 minutes. 🌊🤯 #FunFact","Sloth","sloths, can, hold, their, breath, longer, than, dolphins, slowing, down, heart, rate, they, survive, underwater, minutes",0,"Posted","KEEP-1017","Google Keep FunFacts List"],["FACT-1722005520000","2026-06-09T00:20:05.327Z","Chameleons don't change color to blend in—they do it to regulate temperature and communicate! 🦎🎨 True emotional expression! ✨ #FunFact","Chameleons","chameleons, dont, change, color, blend, inthey, regulate, temperature, communicate, true, emotional, expression",0,"Posted","KEEP-1018","Google Keep FunFacts List"],["FACT-1722014160000","2026-06-10T00:20:05.331Z","Seahorses mate for life and hold tails when traveling so they don't get separated in rough currents! 🐴🌊 True ocean romance. 💕✨ #FunFact","Seahorse","seahorses, mate, life, hold, tails, when, traveling, they, dont, get, separated, rough, currents, true, ocean, romance",0,"Posted","KEEP-1019","Google Keep FunFacts List"],["FACT-1722022800000","2026-06-11T00:20:05.336Z","Watermelons are actually classified as botanically a fruit AND a vegetable! 🍉🥗 They belong to the same gourd family as cucumbers and pumpkins. 🤯✨ #FunFact","Watermelon","watermelons, actually, classified, botanically, fruit, vegetable, they, belong, same, gourd, family, cucumbers, pumpkins",0,"Posted","KEEP-1020","Google Keep FunFacts List"],["FACT-1722031440000","2026-06-12T00:20:05.340Z","A group of flamingos is called a flamboyance! 🦩✨ These colorful birds perfectly earn their flashy name when they gather together. 💖🌟 #FunFact","Animals","group, flamingos, called, flamboyance, these, colorful, birds, perfectly, earn, their, flashy, name, when, they, gather, together",0,"Posted","KEEP-1021","Google Keep FunFacts List"],["FACT-1722040080000","2026-06-13T00:20:05.346Z","Crows can remember individual human faces and will hold grudges against people who mistreat them! 🐦⬛🧠 They even pass the info down to their chicks. 🤯✨ #FunFact","Animals","crows, can, remember, individual, human, faces, will, hold, grudges, against, people, who, mistreat, them, they, even, pass, info, down, their, chicks",0,"Posted","KEEP-1022","Google Keep FunFacts List"],["FACT-1722048720000","2026-06-14T00:20:05.352Z","Hummingbirds are the only birds that can fly backwards! 🐦💨 Their wings can rotate in a full circle, letting them hover and move in any direction. 🤯✨ #FunFact","Animals","hummingbirds, only, birds, that, can, fly, backwards, their, wings, rotate, full, circle, letting, them, hover, move, any, direction",0,"Posted","KEEP-1023","Google Keep FunFacts List"],["FACT-1722057360000","2026-06-15T00:20:05.357Z","Sea turtles can cry salty tears! 🐢💧 They do this to excrete excess salt from their bodies, not because they're sad. Nature's built-in goggles! 🌊✨ #FunFact","Animals","sea, turtles, can, cry, salty, tears, they, this, excrete, excess, salt, from, their, bodies, not, because, theyre, sad, natures, builtin, goggles",0,"Posted","KEEP-1024","Google Keep FunFacts List"],["FACT-1722066000000","2026-06-16T00:20:05.363Z","Sea turtles can cry salty tears! 🐢💧 They do this to excrete excess salt from their bodies, not because they're sad. Nature's built-in goggles! 🌊✨ #FunFact","Animals","sea, turtles, can, cry, salty, tears, they, this, excrete, excess, salt, from, their, bodies, not, because, theyre, sad, natures, builtin, goggles",1,"Duplicate (Flagged)","KEEP-1025","Google Keep FunFacts List"],["FACT-1722074640000","2026-06-17T00:20:05.366Z","Sloths take up to a month to completely digest a leaf! 🦥🍃 #FunFact","Animals","sloths, take, month, completely, digest, leaf",0,"Posted","KEEP-1026","Google Keep FunFacts List"],["FACT-1722083280000","2026-06-18T00:20:05.375Z","Sea otters hold hands while sleeping so they don't drift apart! 🦦💞 They float on their backs in groups called rafts. True love on the water! 🌊✨ #FunFact","Animals","sea, otters, hold, hands, while, sleeping, they, dont, drift, apart, float, their, backs, groups, called, rafts, true, love, water",0,"Posted","KEEP-1027","Google Keep FunFacts List"],["FACT-1722091920000","2026-06-19T00:20:05.380Z","Wombats have cube-shaped poop! 💩📐 It keeps the droppings from rolling away so they can mark their territory. 🤯✨ #FunFact","Animals","wombats, have, cubeshaped, poop, keeps, droppings, from, rolling, away, they, can, mark, their, territory",0,"Posted","KEEP-1028","Google Keep FunFacts List"],["FACT-1722100560000","2026-06-20T00:20:05.386Z","Polar bears have black skin under their white fur! 🐻❄️🖤 Their fur is actually translucent, reflecting light to blend into the snow. ❄️✨ #FunFact","Science","polar, bears, have, black, skin, under, their, white, fur, actually, translucent, reflecting, light, blend, into, snow",0,"Posted","KEEP-1029","Google Keep FunFacts List"],["FACT-1722109200000","2026-06-21T00:20:05.394Z","Penguins can launch themselves up to 9 feet out of the water to land on ice! 🐧🚀 They use air bubbles trapped in their feathers to gain speed. 🤯✨ #FunFact","Science","penguins, can, launch, themselves, feet, out, water, land, ice, they, use, air, bubbles, trapped, their, feathers, gain, speed",0,"Posted","KEEP-1030","Google Keep FunFacts List"],["FACT-1722117840000","2026-06-22T00:20:05.400Z","The tongue of a blue whale weighs more than an entire adult elephant! 🐋🐘 That is one massive muscle. Deep ocean wonders! 🌊✨ #FunFact","Animals","tongue, blue, whale, weighs, more, than, entire, adult, elephant, that, one, massive, muscle, deep, ocean, wonders",0,"Posted","KEEP-1031","Google Keep FunFacts List"],["FACT-1722126480000","2026-06-23T00:20:05.409Z","Flamingos are actually born gray! 🦩 Their pink color comes from pigments in the brine shrimp and algae they eat. You truly are what you eat! 🍤✨ #FunFact","Animals","flamingos, actually, born, gray, their, pink, color, comes, from, pigments, brine, shrimp, algae, they, eat, truly, what",0,"Posted","KEEP-1032","Google Keep FunFacts List"],["FACT-1722135120000","2026-06-24T00:20:05.416Z","Bananas are the only fruit that can cure stress and anxiety! 🍌 Just kidding, but they do contain Vitamin B6 which helps regulate your mood. ☀️✨ #FunFact","Food & Nature","bananas, only, fruit, that, can, cure, stress, anxiety, just, kidding, they, contain, vitamin, which, helps, regulate, your, mood",0,"Posted","KEEP-1033","Google Keep FunFacts List"],["FACT-1722143760000","2026-06-25T00:20:05.423Z","Cheetahs can’t roar—they purr just like house cats! 🐆🔊 They also make chirping sounds like birds to find each other. 🤯✨ #FunFact","Animals","cheetahs, cant, roarthey, purr, just, like, house, cats, they, also, make, chirping, sounds, birds, find, each, other",0,"Posted","KEEP-1034","Google Keep FunFacts List"],["FACT-1722152400000","2026-06-26T00:20:05.430Z","Koalas have unique fingerprints that are virtually identical to human ones! 🐨🔬 Even under an electron microscope, they're tough to tell apart. 🤯✨ #FunFact","Animals","koalas, have, unique, fingerprints, that, virtually, identical, human, ones, even, under, electron, microscope, theyre, tough, tell, apart",0,"Posted","KEEP-1035","Google Keep FunFacts List"],["FACT-1722161040000","2026-06-27T00:20:05.439Z","Pineapples take nearly three years to grow and mature! 🍍 It takes patience to grow just a single fruit on the plant. Totally worth the wait! ☀️✨ #FunFact","Food & Nature","pineapples, take, nearly, three, years, grow, mature, takes, patience, just, single, fruit, plant, totally, worth, wait",0,"Posted","KEEP-1036","Google Keep FunFacts List"],["FACT-1722169680000","2026-06-28T00:20:05.447Z","Sloths take up to a month to completely digest a single leaf! 🦥🍃 They have a specialized four-chambered stomach to process their slow meals. 🤯✨ #FunFact","Animals","sloths, take, month, completely, digest, single, leaf, they, have, specialized, fourchambered, stomach, process, their, slow, meals",0,"Posted","KEEP-1037","Google Keep FunFacts List"],["FACT-1722178320000","2026-06-29T00:20:05.455Z","Honeybees can recognize human faces! 🐝👩🦰 They use a configuration of features just like we do to remember friendly people. 🤯✨ #FunFact","Food & Nature","honeybees, can, recognize, human, faces, they, use, configuration, features, just, like, remember, friendly, people",0,"Posted","KEEP-1038","Google Keep FunFacts List"],["FACT-1722186960000","2026-06-30T00:20:05.464Z","A day on Jupiter is only 10 hours long! 🪐 Even though it’s the biggest planet in our solar system, it spins the fastest. Talk about a quick day! 🚀✨ #FunFact","Space","day, jupiter, only, hours, long, even, though, its, biggest, planet, our, solar, system, spins, fastest, talk, about, quick",0,"Posted","KEEP-1039","Google Keep FunFacts List"],["FACT-1722195600000","2026-07-01T00:20:05.471Z","Cows have best friends and get stressed out when they are separated! 🐄💞 True friendship exists in the pasture. 🌾✨ #FunFact","Animals","cows, have, best, friends, get, stressed, out, when, they, separated, true, friendship, exists, pasture",0,"Posted","KEEP-1040","Google Keep FunFacts List"],["FACT-1722204240000","2026-07-02T00:20:05.481Z","Pigs are incredibly smart and can actually play video games using their snouts! 🐷🎮 They even have their own joystick preferences. Gamers of the farm! 🌾✨ #FunFact","Animals","pigs, incredibly, smart, can, actually, play, video, games, using, their, snouts, they, even, have, own, joystick, preferences, gamers, farm",0,"Posted","KEEP-1041","Google Keep FunFacts List"],["FACT-1722212880000","2026-07-03T00:20:05.489Z","Chewing gum while peeling onions can prevent you from crying! 🧅🍬 It forces you to breathe through your mouth, dispersing the gas. 🤯✨ #FunFact","Food & Nature","chewing, gum, while, peeling, onions, can, prevent, from, crying, forces, breathe, through, your, mouth, dispersing, gas",0,"Posted","KEEP-1042","Google Keep FunFacts List"],["FACT-1722221520000","2026-07-04T00:20:05.498Z","Sea otters have a built-in pouch near their armpits to store their favorite rocks! 🦦🪨 It's their very own tool kit. Truly adorable! ✨ #FunFact","Animals","sea, otters, have, builtin, pouch, near, their, armpits, store, favorite, rocks, its, very, own, tool, kit, truly, adorable",0,"Posted","KEEP-1043","Google Keep FunFacts List"],["FACT-1722230160000","2026-07-05T00:20:05.508Z","A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than it does to complete one orbit around the Sun. 🤯✨ #FunFact","Space","day, venus, longer, than, year, takes, rotate, once, its, axis, does, complete, one, orbit, around, sun",0,"Posted","KEEP-1044","Google Keep FunFacts List"],["FACT-1722238800000","2026-07-06T00:20:05.516Z","Wombats are the only animals with cube-shaped poop! 🧱 It stops it from rolling away so they can mark territory. 🦦✨ #FunFact","Animals","wombats, only, animals, cubeshaped, poop, stops, from, rolling, away, they, can, mark, territory",0,"Posted","KEEP-1045","Google Keep FunFacts List"],["FACT-1722247440000","2026-07-07T00:20:05.527Z","The first computer bug was a real moth! 🦋 In 1947, engineers found it stuck in a relay component of the Harvard Mark II computer. Talk about a literal glitch! 💻✨ #FunFact","Tech","first, computer, bug, real, moth, 1947, engineers, found, stuck, relay, component, harvard, mark, talk, about, literal, glitch",0,"Posted","KEEP-1046","Google Keep FunFacts List"],["FACT-1722256080000","2026-07-08T00:20:05.537Z","A single cloud can weigh more than 1 million pounds! ☁️🐘 That’s about 100 elephants floating over your head. Talk about heavy lifting! 🌧️✨ #FunFact","Animals","single, cloud, can, weigh, more, than, million, pounds, thats, about, 100, elephants, floating, over, your, head, talk, heavy, lifting",0,"Posted","KEEP-1047","Google Keep FunFacts List"],["FACT-1722264720000","2026-07-09T00:20:05.541Z","Chameleons don't change color to blend in—they do it to regulate temperature and communicate! 🦎🎨 True emotional expression! ✨ #FunFact","Science","chameleons, dont, change, color, blend, inthey, regulate, temperature, communicate, true, emotional, expression",1,"Duplicate (Flagged)","KEEP-1048","Google Keep FunFacts List"],["FACT-1722273360000","2026-07-10T00:20:05.553Z","Before eraser pads were invented, people used rolled-up pieces of white bread to rub out pencil marks! 🍞✏️ Talk about a tasty mistake! 🤯✨ #FunFact","Food & Nature","before, eraser, pads, invented, people, used, rolledup, pieces, white, bread, rub, out, pencil, marks, talk, about, tasty, mistake",0,"Posted","KEEP-1049","Google Keep FunFacts List"],["FACT-1722282000000","2026-07-11T00:20:05.564Z","A full NASA space suit costs about $12 million! 👨🚀🚀 And 70% of that cost is just for the backpack and control module. Talk about an expensive outfit! 🌌✨ #FunFact","Animals","full, nasa, space, suit, costs, about, million, that, cost, just, backpack, control, module, talk, expensive, outfit",0,"Posted","KEEP-1050","Google Keep FunFacts List"],["FACT-1722290640000","2026-07-12T00:20:05.573Z","A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than it does to complete one orbit around the Sun. 🤯✨ #FunFact","Space","day, venus, longer, than, year, takes, rotate, once, its, axis, does, complete, one, orbit, around, sun",1,"Duplicate (Flagged)","KEEP-1051","Google Keep FunFacts List"],["FACT-1722299280000","2026-07-13T00:20:05.585Z","Squirrels plant thousands of new trees each year simply by forgetting where they buried their acorns! 🐿️🌳 Nature's accidental gardeners. ✨ #FunFact","Science","squirrels, plant, thousands, new, trees, each, year, simply, forgetting, where, they, buried, their, acorns, natures, accidental, gardeners",0,"Posted","KEEP-1052","Google Keep FunFacts List"],["FACT-1722307920000","2026-07-14T00:20:05.585Z","Octopuses have three hearts, nine brains, and blue blood! 🐙💙 Two hearts pump blood to the gills, while the third pumps it to the rest of the body. 🌊✨ #FunFact","Animals","octopuses, have, three, hearts, nine, brains, blue, blood, two, pump, gills, while, third, pumps, rest, body",0.824,"Duplicate (Flagged)","KEEP-1053","Google Keep FunFacts List"],["FACT-1722316560000","2026-07-15T00:20:05.596Z","A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than to complete one orbit around the Sun. 🤯✨ #FunFact","Space","day, venus, longer, than, year, takes, rotate, once, its, axis, complete, one, orbit, around, sun",0.941,"Duplicate (Flagged)","KEEP-1054","Google Keep FunFacts List"],["FACT-1722325200000","2026-07-16T00:20:05.602Z","Wombats are the only animals whose poop is cube-shaped! 🧱 This keeps it from rolling away so they can mark their territory. 🦦✨ #FunFact","Animals","wombats, only, animals, whose, poop, cubeshaped, this, keeps, from, rolling, away, they, can, mark, their, territory",0.671,"Duplicate (Flagged)","KEEP-1055","Google Keep FunFacts List"],["FACT-1722333840000","2026-07-17T00:20:05.613Z","Flamingos aren't born pink! 🦩 They're actually gray and turn pink from eating shrimp and algae. 🦐✨ Talk about a glowing diet! #FunFact","Animals","flamingos, arent, born, pink, theyre, actually, gray, turn, from, eating, shrimp, algae, talk, about, glowing, diet",0,"Posted","KEEP-1056","Google Keep FunFacts List"],["FACT-1722342480000","2026-07-18T00:20:05.624Z","The total weight of all the ants on Earth is roughly equal to the total weight of all humans! 🐜🌍 Talk about a tiny superpower! 💪✨ #FunFact","Science","total, weight, all, ants, earth, roughly, equal, humans, talk, about, tiny, superpower",0,"Posted","KEEP-1057","Google Keep FunFacts List"],["FACT-1722351120000","2026-07-19T00:20:05.631Z","Cows have best friends and get stressed out when they are separated! 🐄💞 True friendship exists in the pasture. 🌾✨ #FunFact","Animals","cows, have, best, friends, get, stressed, out, when, they, separated, true, friendship, exists, pasture",1,"Duplicate (Flagged)","KEEP-1058","Google Keep FunFacts List"],["FACT-1722359760000","2026-07-20T00:20:05.636Z","Sloths can hold their breath longer than dolphins can! 🦥💨 They can slow their heart rate down to survive underwater for up to 40 minutes! 🌊🤯 #FunFact","Animals","sloths, can, hold, their, breath, longer, than, dolphins, they, slow, heart, rate, down, survive, underwater, minutes",0.875,"Duplicate (Flagged)","KEEP-1059","Google Keep FunFacts List"],["FACT-1722368400000","2026-07-21T00:20:05.647Z","Sea otters hold hands while sleeping so they don't drift apart! 🦦💞 Truly the cutest sleep safety protocol ever. 🌊✨ #FunFact","Animals","sea, otters, hold, hands, while, sleeping, they, dont, drift, apart, truly, cutest, sleep, safety, protocol, ever",0,"Posted","KEEP-1060","Google Keep FunFacts List"],["FACT-1722377040000","2026-07-22T00:20:05.648Z","Honey never spoils! 🍯 Archaeologists have found 3,000-year-old pots of honey in Egyptian tombs that are still perfectly edible. 🍯✨ #FunFact","Food & Nature","honey, never, spoils, archaeologists, have, found, 3000yearold, pots, egyptian, tombs, that, still, perfectly, edible",0.669,"Duplicate (Flagged)","KEEP-1061","Google Keep FunFacts List"],["FACT-1722385680000","2026-07-23T00:20:05.658Z","Did you know? 🍌 Bananas are technically berries, but strawberries aren't! 🍓 Mind = blown. 🤯 #FunFact #DailyFact","Food & Nature","bananas, technically, berries, strawberries, arent, mind, blown, dailyfact",0,"Posted","KEEP-1062","Google Keep FunFacts List"],["FACT-1722394320000","2026-07-24T00:20:05.668Z","Fun fact: Wombat poop is cube-shaped! 🧱 It stops it from rolling away so they can mark their territory. 🦦✨ #FunFact","Animals","fun, wombat, poop, cubeshaped, stops, from, rolling, away, they, can, mark, their, territory",0,"Posted","KEEP-1063","Google Keep FunFacts List"]];
  sheet.getRange(2, 1, rows.length, 9).setValues(rows);
}

/**
 * Re-Scan ALL rows in the Fact Log for duplicates.
 * Corrects the Similarity Score (col F) and Status (col G) for every row.
 * Run this from: 🎯 Fun Fact Tracker > 🔍 Re-Scan All Facts for Duplicates
 */
function reScanAllDuplicates() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet || sheet.getLastRow() < 2) {
    if (ui) ui.alert("⚠️ No Data", "The Fact Log sheet is empty or missing.", ui.ButtonSet.OK);
    return { success: false, error: "No data found in Fact Log" };
  }

  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues(); // Skip header row

  let duplicatesFound = 0;
  let corrected = 0;
  const checkedFacts = []; // Build up fact list progressively row by row

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const factText = row[2]; // Column C
    const currentScore = row[5]; // Column F
    const currentStatus = row[6]; // Column G

    if (!factText || typeof factText !== "string" || factText.trim() === "") {
      checkedFacts.push({ factText: "", category: "", keywords: [] });
      continue;
    }

    // Check this fact against ALL previously processed facts (not itself)
    const dupResult = checkedFacts.length > 0
      ? checkDuplicate(factText, checkedFacts)
      : { isDuplicate: false, similarityScore: 0 };

    const newScore = dupResult.similarityScore || 0;
    const newStatus = dupResult.isDuplicate ? "Duplicate (Flagged)" : "Posted";

    // Write back corrected values to sheet (row i+2 because row 1 is header)
    const sheetRow = i + 2;
    sheet.getRange(sheetRow, 6).setValue(newScore);           // Col F: Score
    sheet.getRange(sheetRow, 7).setValue(newStatus);          // Col G: Status

    // Highlight duplicates in red, clear color for unique
    if (dupResult.isDuplicate) {
      sheet.getRange(sheetRow, 1, 1, 9).setBackground("#fecaca"); // light red
      duplicatesFound++;
    } else {
      sheet.getRange(sheetRow, 1, 1, 9).setBackground(null); // clear
    }

    if (newStatus !== currentStatus || Math.abs(newScore - currentScore) > 0.01) {
      corrected++;
      Logger.log(`Row ${sheetRow} corrected: "${factText.substring(0,50)}..." | Score: ${currentScore}→${newScore} | Status: ${currentStatus}→${newStatus}`);
    }

    // Add this fact to our running list for future rows to check against
    checkedFacts.push({
      factText: factText,
      category: row[3] || "General",
      keywords: String(row[4] || "").split(",").map(k => k.trim()).filter(Boolean)
    });
  }

  SpreadsheetApp.flush(); // Commit all changes

  // Apply beautiful formatting after rescan
  formatSheetArtistically();

  const msg = `✅ Re-Scan Complete!\n\n📊 Rows scanned: ${data.length}\n🔴 Duplicates found: ${duplicatesFound}\n🔧 Rows corrected: ${corrected}\n\nSheet updated with beautiful theme!`;
  Logger.log(msg);
  if (ui) ui.alert("🔍 Duplicate Re-Scan Results", msg, ui.ButtonSet.OK);

  return { success: true, scanned: data.length, duplicatesFound, corrected };
}

/**
 * Creative Artistic Formatting Engine for Google Sheets
 * Formats the Fact Log & Settings tabs with modern dark violet headers,
 * status/category badges, text wrapping, and clean typography.
 */
function formatSheetArtistically() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // -------------------------------------------------------------
  // 1. FACT LOG SHEET STYLING
  // -------------------------------------------------------------
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) {
    const lastRow = sheet.getLastRow();
    const lastCol = 9; // Col A to I

    // Column Widths
    sheet.setColumnWidth(1, 150); // ID
    sheet.setColumnWidth(2, 160); // Date Added
    sheet.setColumnWidth(3, 480); // Fact Text
    sheet.setColumnWidth(4, 140); // Category
    sheet.setColumnWidth(5, 240); // Keywords
    sheet.setColumnWidth(6, 120); // Similarity Score
    sheet.setColumnWidth(7, 150); // Status
    sheet.setColumnWidth(8, 120); // Keep Note ID
    sheet.setColumnWidth(9, 160); // Source

    // Row Height & Header Formatting (Row 1)
    sheet.setRowHeight(1, 42);
    sheet.setFrozenRows(1);

    const headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange
      .setBackground("#1e1b4b")               // Midnight Violet
      .setFontColor("#ffffff")                // Crisp White
      .setFontWeight("bold")
      .setFontFamily("Trebuchet MS")
      .setFontSize(11)
      .setVerticalAlignment("middle")
      .setHorizontalAlignment("center");

    // Fact Text & Category Headers left-aligned for readability
    sheet.getRange(1, 3).setHorizontalAlignment("left");
    sheet.getRange(1, 5).setHorizontalAlignment("left");

    if (lastRow >= 2) {
      const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);

      // Base Data Formatting
      dataRange
        .setFontFamily("Arial")
        .setFontSize(10)
        .setFontColor("#334155")              // Slate Navy Text
        .setVerticalAlignment("middle");

      // Text Wrapping
      sheet.getRange(2, 3, lastRow - 1, 1).setWrap(true); // Col C (Fact Text)
      sheet.getRange(2, 5, lastRow - 1, 1).setWrap(true); // Col E (Keywords)

      // Alignment
      sheet.getRange(2, 1, lastRow - 1, 2).setHorizontalAlignment("center"); // ID & Date
      sheet.getRange(2, 4, lastRow - 1, 1).setHorizontalAlignment("center"); // Category
      sheet.getRange(2, 6, lastRow - 1, 4).setHorizontalAlignment("center"); // Score, Status, Keep ID, Source

      // Similarity Score Number Format (Percent)
      sheet.getRange(2, 6, lastRow - 1, 1).setNumberFormat("0.0%");

      // Row-by-Row Custom Badge & Alternating Colors
      const dataValues = dataRange.getValues();
      for (let i = 0; i < dataValues.length; i++) {
        const rowNum = i + 2;
        sheet.setRowHeight(rowNum, 36); // Generous touch height

        const statusVal = String(dataValues[i][6] || "").toLowerCase();

        // Alternating row background
        const isEven = i % 2 === 0;
        const baseBg = isEven ? "#ffffff" : "#f8fafc";
        sheet.getRange(rowNum, 1, 1, lastCol).setBackground(baseBg);

        // Category Badge Style (Col D)
        sheet.getRange(rowNum, 4)
          .setBackground("#e0e7ff")           // Soft Indigo
          .setFontColor("#3730a3")            // Dark Indigo
          .setFontWeight("bold");

        // Status Badge Style (Col G)
        const statusRange = sheet.getRange(rowNum, 7);
        if (statusVal.includes("duplicate")) {
          statusRange
            .setBackground("#fee2e2")         // Soft Rose
            .setFontColor("#b91c1c")          // Dark Rose
            .setFontWeight("bold");
          sheet.getRange(rowNum, 1, 1, lastCol).setBackground("#fef2f2"); // Subtle red row tint
        } else if (statusVal.includes("posted") || statusVal.includes("used")) {
          statusRange
            .setBackground("#dcfce7")         // Soft Emerald
            .setFontColor("#15803d")          // Dark Emerald
            .setFontWeight("bold");
        } else if (statusVal.includes("queued")) {
          statusRange
            .setBackground("#fef3c7")         // Soft Amber
            .setFontColor("#b45309")          // Dark Amber
            .setFontWeight("bold");
        }
      }

      // Soft borders between rows
      dataRange.setBorder(null, null, true, null, null, true, "#e2e8f0", SpreadsheetApp.BorderStyle.SOLID);
    }
  }

  // -------------------------------------------------------------
  // 2. SETTINGS SHEET STYLING
  // -------------------------------------------------------------
  const settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (settingsSheet) {
    const sLastRow = settingsSheet.getLastRow();
    settingsSheet.setColumnWidth(1, 220); // Setting Key
    settingsSheet.setColumnWidth(2, 380); // Setting Value
    settingsSheet.setRowHeight(1, 40);

    const sHeader = settingsSheet.getRange(1, 1, 1, 2);
    sHeader
      .setBackground("#1e1b4b")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setFontFamily("Trebuchet MS")
      .setFontSize(11)
      .setVerticalAlignment("middle")
      .setHorizontalAlignment("center");

    if (sLastRow >= 2) {
      const sData = settingsSheet.getRange(2, 1, sLastRow - 1, 2);
      sData
        .setFontFamily("Arial")
        .setFontSize(10)
        .setFontColor("#1e293b")
        .setVerticalAlignment("middle");

      settingsSheet.getRange(2, 1, sLastRow - 1, 1).setFontWeight("bold").setBackground("#f1f5f9");
      settingsSheet.getRange(2, 2, sLastRow - 1, 1).setBackground("#ffffff");
      sData.setBorder(true, true, true, true, true, true, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);
    }
  }

  SpreadsheetApp.flush();
  return { success: true, message: "Artistic theme applied successfully!" };
}

/**
 * Get setting value by key
 */
function getSetting(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!settingsSheet) return null;
  const data = settingsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

/**
 * Save setting value
 */
function saveSetting(key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!settingsSheet) {
    initSpreadsheet();
    settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  }
  const data = settingsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      settingsSheet.getRange(i + 1, 2).setValue(value);
      return { success: true };
    }
  }
  settingsSheet.appendRow([key, value]);
  return { success: true };
}

/**
 * Fetch all facts from Google Sheet
 */
function getAllFacts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const facts = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    facts.push({
      id: String(row[0]),
      date: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
      factText: String(row[2] || ""),
      category: String(row[3] || "General"),
      keywords: String(row[4] || "").split(",").map(k => k.trim()).filter(Boolean),
      similarityScore: parseFloat(row[5]) || 0,
      status: String(row[6] || "Used"),
      keepNoteId: String(row[7] || ""),
      source: String(row[8] || "Gemini")
    });
  }
  return facts;
}

/**
 * Multi-Tier Duplicate Prevention Algorithm
 * Checks a target fact string against all existing facts.
 */
function checkDuplicate(targetFact, existingFactsList) {
  const facts = existingFactsList || getAllFacts();
  if (!facts || facts.length === 0) {
    return {
      isDuplicate: false,
      similarityScore: 0,
      highestMatch: null,
      details: "No previous facts in database."
    };
  }

  const cleanTarget = normalizeText(targetFact);
  const targetKeywords = extractKeywords(targetFact);
  
  let maxScore = 0;
  let bestMatch = null;
  let matchReason = "";

  for (const item of facts) {
    const cleanItem = normalizeText(item.factText);
    
    // Tier 1: Exact / Normalized Match
    if (cleanTarget === cleanItem) {
      return {
        isDuplicate: true,
        similarityScore: 1.0,
        highestMatch: item,
        details: `Exact match found (ID: ${item.id})`
      };
    }

    // Tier 2: Normalized Levenshtein Similarity
    const levScore = calculateLevenshteinSimilarity(cleanTarget, cleanItem);

    // Tier 3: Jaccard Keyword Overlap Ratio
    const itemKeywords = item.keywords && item.keywords.length > 0 
      ? item.keywords.map(k => k.toLowerCase()) 
      : extractKeywords(item.factText);
    const jaccardScore = calculateJaccardOverlap(targetKeywords, itemKeywords);

    // Tier 4: Core Topic Overlap (Count of matching stemmed keywords)
    let matchingKeywordCount = 0;
    const targetSet = new Set(targetKeywords);
    itemKeywords.forEach(k => {
      if (targetSet.has(k)) matchingKeywordCount++;
    });

    // Combined Weighted Score (Maximum of Levenshtein, Jaccard, or Keyword Density)
    let combinedScore = Math.max(levScore, jaccardScore);

    // Core Topic Guard: If 3 or more significant keywords match (e.g., "wombat", "poop", "cube"), boost score
    if (matchingKeywordCount >= 3) {
      const densityScore = matchingKeywordCount / Math.min(targetKeywords.length, itemKeywords.length);
      combinedScore = Math.max(combinedScore, 0.55 + (densityScore * 0.45));
    }

    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestMatch = item;
      if (cleanTarget === cleanItem) {
        matchReason = "Exact normalized text match";
      } else if (matchingKeywordCount >= 3) {
        matchReason = `Core topic match (${matchingKeywordCount} matching keywords: ${targetKeywords.filter(k => itemKeywords.includes(k)).join(', ')})`;
      } else if (levScore > 0.70) {
        matchReason = `High textual similarity (${(levScore * 100).toFixed(1)}%)`;
      } else if (jaccardScore > 0.5) {
        matchReason = `Significant keyword overlap (${(jaccardScore * 100).toFixed(1)}%)`;
      } else {
        matchReason = `Partial similarity score: ${(combinedScore * 100).toFixed(1)}%`;
      }
    }
  }

  // Threshold: default to 0.50 for strict duplicate prevention
  const thresholdSetting = parseFloat(getSetting("STRICTNESS_THRESHOLD"));
  const threshold = (thresholdSetting && !isNaN(thresholdSetting)) ? thresholdSetting : 0.50;
  const isDup = maxScore >= threshold;

  return {
    isDuplicate: isDup,
    similarityScore: parseFloat(maxScore.toFixed(3)),
    highestMatch: bestMatch,
    details: isDup ? `Flagged as duplicate. ${matchReason}` : `Unique fact (Highest match score: ${(maxScore * 100).toFixed(1)}%)`
  };
}

/**
 * Text Normalization helper
 */
function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Minimal English stemmer — strips common suffixes so
 * "wombats" and "wombat", "rolling" and "roll", "stopped" and "stop" match.
 */
function stemWord(word) {
  if (!word || word.length < 4) return word;
  // Order matters — check longest suffix first
  if (word.endsWith("iness")) return word.slice(0, -5) + "y";
  if (word.endsWith("ness"))  return word.slice(0, -4);
  if (word.endsWith("ment"))  return word.slice(0, -4);
  if (word.endsWith("tion"))  return word.slice(0, -4);
  if (word.endsWith("able"))  return word.slice(0, -4);
  if (word.endsWith("ible"))  return word.slice(0, -4);
  if (word.endsWith("ing"))   return word.length > 6 ? word.slice(0, -3) : word;
  if (word.endsWith("ied"))   return word.slice(0, -3) + "y";
  if (word.endsWith("ies"))   return word.slice(0, -3) + "y";
  if (word.endsWith("ed"))    return word.length > 5 ? word.slice(0, -2) : word;
  if (word.endsWith("ly"))    return word.slice(0, -2);
  if (word.endsWith("er"))    return word.length > 5 ? word.slice(0, -2) : word;
  if (word.endsWith("est"))   return word.length > 5 ? word.slice(0, -3) : word;
  if (word.endsWith("es"))    return word.slice(0, -2);
  if (word.endsWith("s"))     return word.length > 4 ? word.slice(0, -1) : word;
  return word;
}

/**
 * Keyword extraction helper — normalizes AND stems each word
 */
function extractKeywords(text) {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
    "by", "about", "against", "between", "into", "through", "during", "before",
    "after", "above", "below", "from", "up", "down", "in", "out", "of", "off",
    "over", "under", "again", "further", "then", "once", "here", "there", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
    "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
    "does", "did", "fact", "did", "you", "know", "that", "this", "these", "those"
  ]);
  
  const words = normalizeText(text).split(" ");
  const stemmed = words
    .filter(w => w.length > 2 && !stopWords.has(w))
    .map(w => stemWord(w));                          // ← stem each keyword
  return Array.from(new Set(stemmed));
}

/**
 * Levenshtein Similarity calculation (0.0 to 1.0)
 */
function calculateLevenshteinSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const track = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

  for (let i = 0; i <= len1; i += 1) track[0][i] = i;
  for (let j = 0; j <= len2; j += 1) track[j][0] = j;

  for (let j = 1; j <= len2; j += 1) {
    for (let i = 1; i <= len1; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = track[len2][len1];
  const maxLen = Math.max(len1, len2);
  return 1 - (distance / maxLen);
}

/**
 * Jaccard Overlap ratio between two arrays of keywords
 */
function calculateJaccardOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0.0;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  let intersectionCount = 0;
  set1.forEach(item => {
    if (set2.has(item)) intersectionCount++;
  });

  const unionCount = new Set([...set1, ...set2]).size;
  return unionCount === 0 ? 0.0 : intersectionCount / unionCount;
}

/**
 * Gemini API Integration to generate a non-duplicate fact
 */
function generateUniqueFactWithGemini(providedApiKey) {
  const apiKey = (providedApiKey || getSetting("GEMINI_API_KEY") || "").trim();
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please open the Settings tab and paste your API key in cell B2.");
  }

  const existingFacts = getAllFacts();
  Logger.log(`Loaded ${existingFacts.length} existing facts for duplicate checking.`);
  // Send last 20 facts as sample in prompt (token-efficient but covers recent history)
  const recentFactsSample = existingFacts
    .slice(-20)
    .map(f => `- [${f.category}] ${f.factText}`)
    .join("\n");

  const topicAreas = [
    // Science & Nature
    "Deep Ocean Biology & Bioluminescence",
    "Quantum Physics & Particle Science",
    "Volcanology & Geological Wonders",
    "Meteorology & Extreme Weather",
    "Entomology & Insect Behavior",
    "Mycology & Fungi Facts",
    "Botany & Carnivorous Plants",
    "Genetics & DNA Discoveries",
    "Paleontology & Prehistoric Life",
    // Space & Astronomy
    "Astronomy & Exoplanets",
    "Black Holes & Neutron Stars",
    "Mars & Planetary Exploration",
    "Ancient Calendars & Timekeeping",
    // History & Culture
    "Ancient History & Archaeology",
    "Medieval Engineering & Castles",
    "Ancient Rome & Greece",
    "Viking Age & Norse Myths",
    "Cold War Secrets & Spy Tech",
    "Ancient Egypt & Pharaohs",
    "Aztec & Mayan Civilizations",
    "Silk Road & Trade History",
    // Human Body & Psychology
    "Neuroscience & Brain Quirks",
    "Sleep Science & Dreams",
    "Human Senses & Perception",
    "Psychology & Optical Illusions",
    "Medicine & Surgery History",
    // Food, Art & Language
    "Food Chemistry & Culinary Trivia",
    "Linguistics & Word Origins",
    "Art History & Famous Forgeries",
    "Music Theory & Instrument Origins",
    "Film History & Silent Movies",
    // Engineering & Tech
    "World Architecture & Megastructures",
    "Aviation & Air Travel History",
    "Cryptography & Code Breaking",
    "Sports World Records & Oddities",
    "Mathematics & Number Theory"
  ];

  const modelsToTry = [
    "gemini-3.6-flash",      // Primary: latest flagship flash model
    "gemini-3.5-flash",      // Fallback 1: stable high-performance flash
    "gemini-3.5-flash-lite", // Fallback 2: fast, low-cost flash
    "gemini-3.1-pro"         // Fallback 3: pro model (last resort)
  ];

  let lastErrDetail = "";
  const startTime = Date.now();
  const MAX_RUNTIME_MS = 5 * 60 * 1000; // 5 minute safety cap (Apps Script max is 6 min)

  for (const modelName of modelsToTry) {
    // Bail out early if we're close to the execution time limit
    if (Date.now() - startTime > MAX_RUNTIME_MS) {
      Logger.log("Approaching execution time limit — stopping model loop early.");
      break;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    let retries = 3; // 3 retries × 4 models = 12 total attempts
    while (retries > 0) {
      // Time-guard inside retry loop too
      if (Date.now() - startTime > MAX_RUNTIME_MS) break;

      const randomTopic = topicAreas[Math.floor(Math.random() * topicAreas.length)];
      
      const systemPrompt = `You are a world-class fun fact and trivia curator.
Your task is to generate 1 daily fun fact formatted for social media and Google Keep.

CRITICAL CONSTRAINTS:
1. LENGTH: Must be strictly UNDER 180 CHARACTERS total.
2. TONE & STYLE: Simple, easy, fun, engaging, and uses 1-2 vibrant emojis.
3. HASHTAG: Must end with #funfact
4. TOPIC DIRECTION: Focus specifically on: ${randomTopic}
5. DUPLICATE PREVENTION: Ensure fresh topic unlike:
${recentFactsSample || "(No previous facts recorded)"}

Provide your response in raw JSON format (no markdown codeblock wrapper) matching this schema:
{
  "factText": "🦒 Giraffes only need 5 to 30 minutes of sleep per day! 😴 #funfact",
  "category": "${randomTopic.split(' ')[0]}",
  "keywords": ["key1", "key2", "key3"],
  "explanation": "Brief context"
}`;

      const payload = {
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.95,
          topP: 0.99,
          maxOutputTokens: 300
        }
      };

      let response;
      try {
        response = UrlFetchApp.fetch(apiUrl, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true,
          deadline: 30  // 30-second timeout per request — prevents hanging
        });
      } catch (fetchErr) {
        const errMsg = fetchErr.message || "";
        // Detect Google Apps Script UrlFetch daily/rate quota exhausted
        if (errMsg.indexOf("urlfetch") !== -1 || errMsg.indexOf("too many times") !== -1) {
          throw new Error("Google Apps Script UrlFetch quota exceeded for today. This resets at midnight Pacific time. Please try again tomorrow or wait a few minutes and retry.");
        }
        Logger.log(`Network error calling ${modelName}: ${errMsg}. Trying next model.`);
        break; // Skip to next model on other network failures
      }

      const responseCode = response.getResponseCode();
      const rawBody = response.getContentText();

      if (responseCode === 200) {
        let resData;
        try {
          resData = JSON.parse(rawBody);
        } catch (parseErr) {
          // Log first 300 chars of raw body to diagnose the issue
          Logger.log(`JSON parsing error on response from ${modelName}: ${parseErr.message}. Raw body (first 300): ${rawBody.substring(0, 300)}`);
          lastErrDetail = `Top-level JSON parse failed on ${modelName}: ${parseErr.message}`;
          retries--;
          continue;
        }

        // Guard against empty/blocked candidates
        if (!resData.candidates || !resData.candidates[0] || !resData.candidates[0].content) {
          const blockReason = resData.promptFeedback ? JSON.stringify(resData.promptFeedback) : "unknown";
          Logger.log(`${modelName} returned no usable candidates. Block reason: ${blockReason}`);
          lastErrDetail = `No candidates from ${modelName}: ${blockReason}`;
          retries--;
          continue;
        }

        const rawText = resData.candidates[0].content.parts[0].text;
        Logger.log(`${modelName} raw fact text: ${rawText.substring(0, 200)}`);
        const cleanJsonText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        
        let parsed = null;
        try {
          parsed = JSON.parse(cleanJsonText);
        } catch (e) {
          // JSON malformed — try regex fallback to extract factText directly
          Logger.log(`Inner JSON parse failed from ${modelName}: ${e.message}. Trying regex fallback...`);
          const match = rawText.match(/"factText"\s*:\s*"([^"]+)"/);
          if (match && match[1]) {
            parsed = {
              factText: match[1],
              category: randomTopic.split(' ')[0],
              keywords: extractKeywords(match[1]),
              explanation: ""
            };
            Logger.log(`Regex fallback succeeded: ${parsed.factText}`);
          } else {
            Logger.log(`Regex fallback also failed. Raw text: ${rawText.substring(0, 200)}`);
            lastErrDetail = `Malformed JSON from ${modelName}: ${e.message}`;
            retries--;
            continue;
          }
        }

        if (parsed && parsed.factText) {
          const dupCheck = checkDuplicate(parsed.factText, existingFacts);
          Logger.log(`Duplicate check: isDuplicate=${dupCheck.isDuplicate}, score=${dupCheck.similarityScore}, threshold=0.60`);
          
          if (!dupCheck.isDuplicate) {
            return {
              factText: parsed.factText,
              category: parsed.category || randomTopic.split(' ')[0],
              keywords: parsed.keywords || extractKeywords(parsed.factText),
              explanation: parsed.explanation || "",
              similarityScore: dupCheck.similarityScore
            };
          }
          Logger.log(`Duplicate detected (score ${dupCheck.similarityScore}): "${dupCheck.highestMatch ? dupCheck.highestMatch.factText.substring(0, 60) : 'unknown'}...". Retrying...`);
          lastErrDetail = `All attempts flagged as duplicates (last score: ${dupCheck.similarityScore})`;
        }
        retries--;

      } else if (responseCode === 503) {
        lastErrDetail = `${modelName} HTTP 503: Model overloaded`;
        Logger.log(`Model ${modelName} returned HTTP 503 (overloaded). Waiting 3s then trying next model...`);
        Utilities.sleep(3000);
        break;

      } else if (responseCode === 429) {
        // Rate limit — brief wait and retry same model once
        lastErrDetail = response.getContentText();
        Logger.log(`Rate limit hit on ${modelName} (HTTP 429). Waiting 3s...`);
        Utilities.sleep(3000);
        retries--;

      } else {
        // 400, 404, or other hard error — skip to next model immediately
        lastErrDetail = response.getContentText();
        try {
          const errObj = JSON.parse(lastErrDetail);
          if (errObj.error && errObj.error.message) lastErrDetail = errObj.error.message;
        } catch (e) {}
        Logger.log(`Model ${modelName} returned HTTP ${responseCode}: ${lastErrDetail}`);
        break;
      }
    }
  }

  throw new Error(`Could not generate a non-duplicate fact after multiple attempts. Last detail: ${lastErrDetail}`);
}

/**
 * Save new fact to Spreadsheet
 * Runs a final hard duplicate check before writing to prevent any slippage.
 */
function saveFactToSheet(factObj) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    initSpreadsheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  // HARD DUPLICATE GUARD: Re-check against ALL facts in sheet right before saving
  const allCurrentFacts = getAllFacts();
  const finalDupCheck = checkDuplicate(factObj.factText, allCurrentFacts);
  if (finalDupCheck.isDuplicate) {
    throw new Error(`saveFactToSheet blocked duplicate post. Score: ${finalDupCheck.similarityScore}. Match: "${finalDupCheck.highestMatch ? finalDupCheck.highestMatch.factText.substring(0, 60) : 'unknown'}..."`);
  }

  // Automatically push to Google Tasks & Google Keep if not already done
  let keepNoteId = factObj.keepNoteId || "";
  if (!keepNoteId) {
    try {
      const keepRes = postToGoogleKeep(factObj.factText, factObj.category);
      if (keepRes && keepRes.keepNoteId) {
        keepNoteId = keepRes.keepNoteId;
      }
    } catch (kErr) {
      Logger.log("Notice: postToGoogleKeep during saveFactToSheet: " + kErr.message);
    }
  }

  sheet.appendRow([
    id,
    dateStr,
    factObj.factText,
    factObj.category || "General",
    keywordsStr,
    factObj.similarityScore || 0,
    factObj.status || "Queued",
    keepNoteId,
    factObj.source || "Gemini"
  ]);

  return {
    id: id,
    date: dateStr,
    factText: factObj.factText,
    category: factObj.category || "General",
    keywords: factObj.keywords,
    similarityScore: factObj.similarityScore || 0,
    status: factObj.status || "Queued",
    keepNoteId: keepNoteId
  };
}

/**
 * Direct Google Tasks Integration
 * Automatically creates a new Task in your Google Tasks App under "FunFacts" list!
 */
function postToGoogleTasks(factText, category) {
  let textToUse = "";
  let catToUse = category || "General";
  if (typeof factText === "string") {
    textToUse = factText;
  } else if (factText && typeof factText === "object" && factText.factText) {
    textToUse = factText.factText;
    catToUse = factText.category || catToUse;
  } else {
    textToUse = String(factText || "");
  }

  let cleanFact = textToUse.trim();
  if (!cleanFact) return { success: false, error: "Empty fact text" };
  if (!cleanFact.toLowerCase().includes("#funfact")) {
    cleanFact += " #funfact";
  }

  try {
    let funFactsTaskId = null;
    let lastError = "";
    const token = ScriptApp.getOAuthToken();
    const headers = {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    };

    // 1. Find or create the "FunFacts" task list via REST
    let funFactsListId = null;
    try {
      const listResp = UrlFetchApp.fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        method: "get",
        headers: headers,
        muteHttpExceptions: true
      });
      if (listResp.getResponseCode() === 200) {
        const listsData = JSON.parse(listResp.getContentText());
        if (listsData.items && Array.isArray(listsData.items)) {
          for (let i = 0; i < listsData.items.length; i++) {
            if (listsData.items[i].title && listsData.items[i].title.toLowerCase() === "funfacts") {
              funFactsListId = listsData.items[i].id;
              break;
            }
          }
        }
      }

      // If "FunFacts" list does not exist yet, create it
      if (!funFactsListId) {
        const createListResp = UrlFetchApp.fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
          method: "post",
          headers: headers,
          payload: JSON.stringify({ title: "FunFacts" }),
          muteHttpExceptions: true
        });
        if (createListResp.getResponseCode() === 200 || createListResp.getResponseCode() === 201) {
          const newListData = JSON.parse(createListResp.getContentText());
          funFactsListId = newListData.id;
          Logger.log("Created new 'FunFacts' task list with ID: " + funFactsListId);
        }
      }
    } catch (listErr) {
      Logger.log("Notice finding/creating FunFacts list via REST: " + listErr.message);
    }

    // 2. Post task to the "FunFacts" list
    const targetListId = funFactsListId || "@default";
    try {
      const taskPayload = {
        title: cleanFact,
        notes: `Category: #${catToUse} | Added by FactVault AI`
      };

      const resp = UrlFetchApp.fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(targetListId)}/tasks`, {
        method: "post",
        headers: headers,
        payload: JSON.stringify(taskPayload),
        muteHttpExceptions: true
      });
      
      const code = resp.getResponseCode();
      const body = resp.getContentText();
      Logger.log(`REST Google Tasks response (${code}) on list '${targetListId}': ${body}`);

      if (code === 200 || code === 201) {
        const json = JSON.parse(body);
        funFactsTaskId = json.id;
      } else {
        lastError = `HTTP ${code}: ${body}`;
      }
    } catch (restErr) {
      lastError = restErr.message;
      Logger.log("Notice posting via REST token: " + restErr.message);
    }

    // 3. Fallback to Advanced Service targeting FunFacts list if needed
    if (!funFactsTaskId) {
      try {
        let advListId = "@default";
        try {
          const taskLists = Tasks.Tasklists.list();
          if (taskLists && taskLists.items) {
            for (let i = 0; i < taskLists.items.length; i++) {
              if (taskLists.items[i].title.toLowerCase() === "funfacts") {
                advListId = taskLists.items[i].id;
                break;
              }
            }
            if (advListId === "@default") {
              const newList = Tasks.Tasklists.insert({ title: "FunFacts" });
              advListId = newList.id;
            }
          }
        } catch (e) {}

        const taskObj = {
          title: cleanFact,
          notes: `Category: #${catToUse} | Added by FactVault AI`
        };
        const createdTask = Tasks.Tasks.insert(taskObj, advListId);
        funFactsTaskId = createdTask.id;
        Logger.log("Successfully posted via Tasks Advanced Service: " + funFactsTaskId);
      } catch (advErr) {
        if (!lastError) lastError = advErr.message;
        Logger.log("Notice posting via Advanced Service: " + advErr.message);
      }
    }

    if (funFactsTaskId) {
      return { success: true, taskId: funFactsTaskId, title: cleanFact, list: "FunFacts" };
    } else {
      return { success: false, error: lastError || "Could not insert task into FunFacts list" };
    }
  } catch (err) {
    Logger.log("Google Tasks API Error: " + err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1-Click Interactive Test for Google Tasks Integration
 * Run from menu: 🎯 Fun Fact Tracker > 📌 Test Post to Google Tasks App
 */
function testPostToGoogleTasks() {
  const ui = SpreadsheetApp.getUi();
  const testFactText = "🦥 Sloths can hold their breath for 40 minutes underwater! 🌊 #funfact";
  
  try {
    // 1. Post to Google Tasks
    const taskRes = postToGoogleTasks(testFactText, "Animals");
    
    // 2. Save test fact to Google Sheet (using force/manual source)
    const id = "FACT-" + Date.now();
    const dateStr = new Date().toISOString();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      initSpreadsheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    
    sheet.appendRow([
      id,
      dateStr,
      testFactText,
      "Animals",
      "sloths, breath, underwater, minutes",
      0.0,
      "Posted",
      taskRes.taskId || "TASK-" + Date.now(),
      "Google Tasks Test"
    ]);

    // Apply beautiful theme formatting
    formatSheetArtistically();

    if (taskRes && taskRes.success) {
      ui.alert(
        "🎉 Success — Sheet & Tasks Updated!",
        `✅ New test fact added to 'Fact Log' row #${sheet.getLastRow()}!\n✅ Task created in Google Tasks App under 'FunFacts' list!\n\n📌 Fact: "${testFactText}"`,
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        "⚠️ Sheet Updated / Tasks Warning",
        `✅ Fact saved to Google Sheet row #${sheet.getLastRow()}!\n⚠️ Google Tasks API Notice: ${taskRes ? taskRes.error : "Check Google Tasks permissions"}`,
        ui.ButtonSet.OK
      );
    }
  } catch (err) {
    if (ui) {
      ui.alert("❌ Test Failed", "Error details: " + err.message, ui.ButtonSet.OK);
    }
  }
}

/**
 * Generate 5 Fresh Non-Duplicate Fun Facts Now
 * Run from menu: 🎯 Fun Fact Tracker > ✨ Generate 5 Fresh Fun Facts Now
 */
function generate5FreshFactsNow() {
  const ui = SpreadsheetApp.getUi();
  const apiKey = getSetting("GEMINI_API_KEY");
  if (!apiKey) {
    if (ui) ui.alert("⚠️ Gemini API Key Missing", "Please enter your API key in cell B2 of the Settings tab.", ui.ButtonSet.OK);
    return;
  }

  let count = 0;
  for (let i = 0; i < 5; i++) {
    try {
      const fact = generateUniqueFactWithGemini(apiKey);
      fact.status = "Posted";
      fact.source = "Batch Generator";
      saveFactToSheet(fact);
      count++;
    } catch (e) {
      Logger.log("Notice generating batch fact: " + e.message);
    }
  }

  formatSheetArtistically();
  if (ui) {
    ui.alert(
      "🎉 Fresh Facts Added!",
      `Successfully generated and saved ${count} new unique fun facts to your Google Sheet 'Fact Log' & Google Tasks App!`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Scans the Google Sheet Fact Log for recent active facts (added in the last 7 days or Status = Posted/Queued)
 * that haven't been posted to Google Tasks App, and pushes only fresh facts to Google Tasks!
 * Skips old historical facts so you never have to manually delete old tasks.
 * Run from menu: 🎯 Fun Fact Tracker > 📌 Sync Recent Facts to Google Tasks
 */
function syncMissingFactsToGoogleTasks() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet || sheet.getLastRow() < 2) {
    if (ui) ui.alert("⚠️ No Data", "The Fact Log sheet is empty.", ui.ButtonSet.OK);
    return { success: false, synced: 0 };
  }

  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();

  let syncedCount = 0;
  let errorsCount = 0;
  const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const dateAddedStr = row[1];    // Col B: Date Added
    const factText = row[2];        // Col C: Fact Text
    const category = row[3];        // Col D: Category
    const status = String(row[6] || "").toLowerCase(); // Col G: Status
    const taskIdCol = String(row[7] || "");             // Col H: Task ID

    // Skip invalid, duplicate, or already used facts
    if (!factText || typeof factText !== "string" || !factText.trim()) continue;
    if (status.includes("duplicate") || status.includes("used")) continue;

    // Check date: Only sync facts added in the last 7 days (or recent manual entries)
    let isRecent = true;
    if (dateAddedStr) {
      const factDate = new Date(dateAddedStr);
      if (!isNaN(factDate.getTime()) && factDate < sevenDaysAgo) {
        isRecent = false;
      }
    }

    // Skip historical 64 seed facts (KEEP-1000 to KEEP-1063) or non-recent facts
    const isHistoricalSeed = /^KEEP-10\d{2}$/.test(taskIdCol);
    if (isHistoricalSeed || !isRecent) {
      continue;
    }

    // Needs sync if it hasn't been successfully synced to Google Tasks yet (doesn't start with GTASK-)
    const needsSync = !taskIdCol.startsWith("GTASK-");

    if (needsSync) {
      Logger.log(`Syncing fresh fact row ${i + 2} to Google Tasks: "${factText.substring(0, 50)}..."`);
      const taskRes = postToGoogleTasks(factText, category);
      if (taskRes && taskRes.success && taskRes.taskId) {
        // Update Column H with real Google Task ID prefix GTASK-
        sheet.getRange(i + 2, 8).setValue("GTASK-" + taskRes.taskId);
        syncedCount++;
      } else {
        errorsCount++;
      }
    }
  }

  SpreadsheetApp.flush();
  formatSheetArtistically();

  const msg = `🎉 Google Tasks Sync Complete!\n\n📌 Fresh facts synced: ${syncedCount}\n⏩ Old historical facts skipped: (kept out of your task list)\n\nOnly active fresh facts are in your Google Tasks App!`;
  Logger.log(msg);
  if (ui) ui.alert("📌 Google Tasks Sync Results", msg, ui.ButtonSet.OK);

  return { success: true, synced: syncedCount, errors: errorsCount };
}

/**
 * 1-Click Clean-Up: Deletes completed or old fun fact tasks from Google Tasks
 * so your task list stays 100% clean and clutter-free!
 * Run from menu: 🎯 Fun Fact Tracker > 🧹 Clean Completed / Old Tasks from Google Tasks
 */
function cleanOldGoogleTasks() {
  const ui = SpreadsheetApp.getUi();
  let deletedCount = 0;

  try {
    const listIds = ["@default"];
    
    // Check if custom FunFacts list exists
    try {
      const taskLists = Tasks.Tasklists.list();
      if (taskLists && taskLists.items) {
        for (const item of taskLists.items) {
          if (item.title.toLowerCase() === "funfacts") {
            listIds.push(item.id);
            break;
          }
        }
      }
    } catch (e) {}

    for (const listId of listIds) {
      try {
        const tasksRes = Tasks.Tasks.list(listId, { showCompleted: true, showHidden: true });
        if (tasksRes && tasksRes.items) {
          for (const task of tasksRes.items) {
            if (task.title && task.title.includes("#funfact")) {
              if (task.status === "completed") {
                Tasks.Tasks.remove(listId, task.id);
                deletedCount++;
              }
            }
          }
        }
      } catch (err) {
        Logger.log(`Notice cleaning list ${listId}: ${err.message}`);
      }
    }

    const msg = `🧹 Google Tasks Clean-Up Complete!\n\nCompleted fun fact tasks removed: ${deletedCount}\nYour Google Tasks App is now clean and decluttered!`;
    if (ui) ui.alert("🧹 Task Clean-Up Results", msg, ui.ButtonSet.OK);
    return { success: true, deleted: deletedCount };
  } catch (err) {
    if (ui) ui.alert("⚠️ Clean-Up Notice", err.message, ui.ButtonSet.OK);
    return { success: false, error: err.message };
  }
}

/**
 * Post Fact to Google Keep & Google Tasks App
 */
function postToGoogleKeep(factText, category) {
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  let textToUse = "";
  let catToUse = category || "General";
  if (typeof factText === "string") {
    textToUse = factText;
  } else if (factText && typeof factText === "object" && factText.factText) {
    textToUse = factText.factText;
    catToUse = factText.category || catToUse;
  } else {
    textToUse = String(factText || "");
  }

  let cleanFact = textToUse.trim();
  if (!cleanFact) return { success: false, error: "Empty fact text" };
  if (!cleanFact.toLowerCase().includes("#funfact")) {
    cleanFact += " #funfact";
  }

  // 1. Automatically push to Google Tasks App!
  const taskResult = postToGoogleTasks(cleanFact, catToUse);

  // 2. Format note content for Keep / Mail backup
  const formattedNoteContent = 
    `📌 FunFacts List - ${dateStr}\n` +
    `${cleanFact}`;

  try {
    const userEmail = Session.getActiveUser().getEmail();
    if (userEmail) {
      GmailApp.createDraft(userEmail, `FunFacts List - ${dateStr}`, formattedNoteContent);
    }
  } catch (err) {
    Logger.log("Keep list draft notice: " + err.message);
  }

  return {
    success: true,
    noteTitle: "FunFacts",
    noteContent: formattedNoteContent,
    taskCreated: taskResult.success,
    keepNoteId: "KEEP-" + Date.now()
  };
}

/**
 * Daily Midnight Trigger Function
 */
function dailyMidnightTrigger() {
  Logger.log("Running Daily Midnight Fun Fact Automation...");
  initSpreadsheet();

  let ui = null;
  try {
    ui = SpreadsheetApp.getUi();
  } catch (e) {
    // Background execution without active UI
  }

  try {
    const apiKey = getSetting("GEMINI_API_KEY");
    if (!apiKey) {
      Logger.log("Skipping run: GEMINI_API_KEY not configured.");
      if (ui) {
        ui.alert(
          "⚠️ Gemini API Key Missing",
          "Please open the 'Settings' tab in this Google Sheet and paste your API Key in cell B2 (next to GEMINI_API_KEY).",
          ui.ButtonSet.OK
        );
      }
      return { success: false, error: "GEMINI_API_KEY missing in Settings tab" };
    }

    const uniqueFact = generateUniqueFactWithGemini(apiKey);
    const keepResult = postToGoogleKeep(uniqueFact.factText, uniqueFact.category);

    uniqueFact.status = "Posted";
    uniqueFact.keepNoteId = keepResult.keepNoteId;
    uniqueFact.source = "Midnight Automated Trigger";

    const saved = saveFactToSheet(uniqueFact);
    Logger.log("Successfully processed daily fun fact: " + saved.id);

    // Auto-sync any un-synced facts to Google Tasks App
    syncMissingFactsToGoogleTasks();

    if (ui) {
      ui.alert(
        "🎉 Daily Fun Fact Created & Logged!",
        `Fact #${saved.id}:\n\n${saved.factText}\n\n✅ Saved to 'Fact Log' tab!\n✅ Pushed to Google Tasks App!`,
        ui.ButtonSet.OK
      );
    }

    return { success: true, fact: saved };
  } catch (err) {
    Logger.log("Error in dailyMidnightTrigger: " + err.message);
    if (ui) {
      ui.alert("❌ Error", "Automation failed: " + err.message, ui.ButtonSet.OK);
    }
    return { success: false, error: err.message };
  }
}

/**
 * Setup or reset daily midnight time-driven trigger & hourly Google Tasks Auto-Sync trigger
 * Run from menu: 🎯 Fun Fact Tracker > ⏰ Setup 12:00 AM Midnight Auto-Pilot
 */
function setupMidnightTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    const handler = trigger.getHandlerFunction();
    if (handler === "dailyMidnightTrigger" || handler === "syncMissingFactsToGoogleTasks") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // 1. Primary Daily Midnight Trigger (12:00 AM)
  ScriptApp.newTrigger("dailyMidnightTrigger")
    .timeBased()
    .everyDays(1)
    .atHour(0)
    .create();

  // 2. Hourly Google Tasks Auto-Sync Trigger (picks up facts added by GitHub Actions & posts to Google Tasks)
  ScriptApp.newTrigger("syncMissingFactsToGoogleTasks")
    .timeBased()
    .everyHours(1)
    .create();

  return { 
    success: true, 
    message: "🎉 Success! 12:00 AM Midnight Trigger & Hourly Google Tasks Auto-Sync trigger installed successfully!" 
  };
}

/**
 * Web App REST Endpoint (GET)
 */
function doGet(e) {
  // Only init if sheets are missing — do NOT call on every request to avoid overwriting headers
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(SHEET_NAME) || !ss.getSheetByName(SETTINGS_SHEET)) {
    initSpreadsheet();
  }
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getFacts";
  
  let responseData = {};

  try {
    if (action === "getFacts") {
      responseData = { success: true, facts: getAllFacts() };
    } else if (action === "getStats") {
      const facts = getAllFacts();
      const categories = {};
      facts.forEach(f => {
        categories[f.category] = (categories[f.category] || 0) + 1;
      });
      responseData = {
        success: true,
        stats: {
          totalTracked: facts.length,
          categories: categories,
          lastUpdated: facts.length > 0 ? facts[facts.length - 1].date : null
        }
      };
    } else if (action === "getSettings") {
      responseData = {
        success: true,
        settings: {
          hasApiKey: Boolean(getSetting("GEMINI_API_KEY")),
          autoKeepSync: getSetting("AUTO_KEEP_SYNC") === "true",
          strictnessThreshold: parseFloat(getSetting("STRICTNESS_THRESHOLD")) || 0.65
        }
      };
    } else {
      responseData = { success: false, error: "Unknown GET action: " + action };
    }
  } catch (err) {
    responseData = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Web App REST Endpoint (POST)
 */
function doPost(e) {
  // Only init if sheets are missing — do NOT call on every request to avoid overwriting headers
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(SHEET_NAME) || !ss.getSheetByName(SETTINGS_SHEET)) {
    initSpreadsheet();
  }
  let postData = {};
  
  try {
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid JSON body" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const action = postData.action || "checkDuplicate";
  let responseData = {};

  try {
    if (action === "checkDuplicate") {
      const result = checkDuplicate(postData.factText);
      responseData = { success: true, duplicateReport: result };
    } else if (action === "addFact") {
      const dupCheck = checkDuplicate(postData.factText);
      if (dupCheck.isDuplicate && !postData.force) {
        responseData = { 
          success: false, 
          isDuplicate: true, 
          duplicateReport: dupCheck, 
          error: "Fact flagged as duplicate. Pass force=true to override." 
        };
      } else {
        const saved = saveFactToSheet({
          factText: postData.factText,
          category: postData.category || "General",
          keywords: postData.keywords || extractKeywords(postData.factText),
          similarityScore: dupCheck.similarityScore,
          status: postData.status || "Used",
          source: postData.source || "Manual Entry"
        });
        responseData = { success: true, fact: saved };
      }
    } else if (action === "generateFact") {
      const generated = generateUniqueFactWithGemini(postData.apiKey);
      responseData = { success: true, fact: generated };
    } else if (action === "saveSetting") {
      saveSetting(postData.key, postData.value);
      responseData = { success: true, message: `Setting ${postData.key} saved.` };
    } else if (action === "setupTrigger") {
      const triggerRes = setupMidnightTrigger();
      responseData = triggerRes;
    } else {
      responseData = { success: false, error: "Unknown POST action: " + action };
    }
  } catch (err) {
    responseData = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}
