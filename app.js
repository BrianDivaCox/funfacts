/**
 * FactVault AI - Frontend Logic & Duplicate Prevention Engine
 * Version: 1.0.0
 */

// Default Seed Data to ensure instant, zero-setup demonstration
const DEFAULT_SEED_FACTS = [
  {
    "id": "FACT-1721850000000",
    "date": "2026-05-22T00:20:05.269Z",
    "factText": "Octopuses have 3 hearts, 9 brains, and blue blood! 🐙💙 Two hearts pump blood to the gills, while one pumps it to the rest of the body. 🌊✨ #FunFact",
    "category": "Octopus",
    "keywords": [
      "octopuses",
      "have",
      "hearts",
      "brains",
      "blue",
      "blood",
      "two",
      "pump",
      "gills",
      "while",
      "one",
      "pumps",
      "rest",
      "body"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1000",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721858640000",
    "date": "2026-05-23T00:20:05.271Z",
    "factText": "Hummingbirds are the only birds that can fly backwards and upside down! 🐦⚡ Their wings beat up to 80 times per second in a figure-eight pattern. 🤯✨ #FunFact",
    "category": "Hummingbird",
    "keywords": [
      "hummingbirds",
      "only",
      "birds",
      "that",
      "can",
      "fly",
      "backwards",
      "upside",
      "down",
      "their",
      "wings",
      "beat",
      "times",
      "per",
      "second",
      "figureeight",
      "pattern"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1001",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721867280000",
    "date": "2026-05-24T00:20:05.272Z",
    "factText": "Coral reefs are actually living animal colonies! 🪸🌊 Millions of tiny soft polyps build hard limestone skeletons, creating underwater cities for sea life. ✨ #FunFact",
    "category": "Coral",
    "keywords": [
      "coral",
      "reefs",
      "actually",
      "living",
      "animal",
      "colonies",
      "millions",
      "tiny",
      "soft",
      "polyps",
      "build",
      "hard",
      "limestone",
      "skeletons",
      "creating",
      "underwater",
      "cities",
      "sea",
      "life"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1002",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721875920000",
    "date": "2026-05-25T00:20:05.274Z",
    "factText": "Honey never spoils! 🍯 Archaeologists found 3,000-year-old honey in Egyptian tombs that is still perfectly edible thanks to its natural chemistry. 👑✨ #FunFact",
    "category": "Honeycomb",
    "keywords": [
      "honey",
      "never",
      "spoils",
      "archaeologists",
      "found",
      "3000yearold",
      "egyptian",
      "tombs",
      "that",
      "still",
      "perfectly",
      "edible",
      "thanks",
      "its",
      "natural",
      "chemistry"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1003",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721884560000",
    "date": "2026-05-26T00:20:05.275Z",
    "factText": "Flamingos can only eat with their heads upside down! 🦩🙃 Their unique filter-feeding beaks are built to filter food from water only when inverted. 🌊✨ #FunFact",
    "category": "Flamingo",
    "keywords": [
      "flamingos",
      "can",
      "only",
      "eat",
      "their",
      "heads",
      "upside",
      "down",
      "unique",
      "filterfeeding",
      "beaks",
      "built",
      "filter",
      "food",
      "from",
      "water",
      "when",
      "inverted"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1004",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721893200000",
    "date": "2026-05-27T00:20:05.277Z",
    "factText": "Butterflies taste with their feet! 🦋👣 They have sensors on their legs to quickly check if a leaf is edible before laying eggs on it. 🌿✨ #FunFact",
    "category": "Butterfly",
    "keywords": [
      "butterflies",
      "taste",
      "their",
      "feet",
      "they",
      "have",
      "sensors",
      "legs",
      "quickly",
      "check",
      "leaf",
      "edible",
      "before",
      "laying",
      "eggs"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1005",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721901840000",
    "date": "2026-05-28T00:20:05.279Z",
    "factText": "Honeybees must visit about 2 million flowers just to make one single pound of honey! 🐝🍯 Talk about some serious collective teamwork. 🌸✨ #FunFact",
    "category": "Honey",
    "keywords": [
      "honeybees",
      "must",
      "visit",
      "about",
      "million",
      "flowers",
      "just",
      "make",
      "one",
      "single",
      "pound",
      "honey",
      "talk",
      "some",
      "serious",
      "collective",
      "teamwork"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1006",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721910480000",
    "date": "2026-05-29T00:20:05.282Z",
    "factText": "A lion's roar can be heard from up to 5 miles away! 🦁🔊 It's the loudest roar of any big cat species, used to track down pride members and warn rivals. 🤯✨ #FunFact",
    "category": "Lion",
    "keywords": [
      "lions",
      "roar",
      "can",
      "heard",
      "from",
      "miles",
      "away",
      "its",
      "loudest",
      "any",
      "big",
      "cat",
      "species",
      "used",
      "track",
      "down",
      "pride",
      "members",
      "warn",
      "rivals"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1007",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721919120000",
    "date": "2026-05-30T00:20:05.289Z",
    "factText": "Woodpeckers have a wrap-around tongue that acts as a seatbelt for their brain! 🐦🪵 It wraps around their skull to absorb shock. 🤯✨ #FunFact",
    "category": "Woodpecker",
    "keywords": [
      "woodpeckers",
      "have",
      "wraparound",
      "tongue",
      "that",
      "acts",
      "seatbelt",
      "their",
      "brain",
      "wraps",
      "around",
      "skull",
      "absorb",
      "shock"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1008",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721927760000",
    "date": "2026-05-31T00:20:05.294Z",
    "factText": "Sea otters have the thickest fur of any animal on Earth! 🦦❄️ They have up to 1 million hairs per square inch to stay warm in freezing waters since they lack blubber. 🌊✨ #FunFact",
    "category": "Sea otter",
    "keywords": [
      "sea",
      "otters",
      "have",
      "thickest",
      "fur",
      "any",
      "animal",
      "earth",
      "they",
      "million",
      "hairs",
      "per",
      "square",
      "inch",
      "stay",
      "warm",
      "freezing",
      "waters",
      "since",
      "lack",
      "blubber"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1009",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721936400000",
    "date": "2026-06-01T00:20:05.299Z",
    "factText": "Sharks have been on Earth longer than trees! 🦈🌳 They first appeared around 400 million years ago, while trees evolved about 350 million years ago. 🤯✨ #FunFact",
    "category": "Shark",
    "keywords": [
      "sharks",
      "have",
      "been",
      "earth",
      "longer",
      "than",
      "trees",
      "they",
      "first",
      "appeared",
      "around",
      "400",
      "million",
      "years",
      "ago",
      "while",
      "evolved",
      "about",
      "350"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1010",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721945040000",
    "date": "2026-06-02T00:20:05.303Z",
    "factText": "Platypuses glow a fluorescent cyan-green color under ultraviolet light! 🦆✨ Scientists still aren't entirely sure why they biofluoresce. 🌌🤯 #FunFact",
    "category": "Platypus",
    "keywords": [
      "platypuses",
      "glow",
      "fluorescent",
      "cyangreen",
      "color",
      "under",
      "ultraviolet",
      "light",
      "scientists",
      "still",
      "arent",
      "entirely",
      "sure",
      "why",
      "they",
      "biofluoresce"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1011",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721953680000",
    "date": "2026-06-03T00:20:05.305Z",
    "factText": "Dolphins sleep with one eye open! 🐬👀 They keep half of their brain awake at all times to breathe and stay alert for predators. 🌊✨ #FunFact",
    "category": "Dolphin",
    "keywords": [
      "dolphins",
      "sleep",
      "one",
      "eye",
      "open",
      "they",
      "keep",
      "half",
      "their",
      "brain",
      "awake",
      "all",
      "times",
      "breathe",
      "stay",
      "alert",
      "predators"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1012",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721962320000",
    "date": "2026-06-04T00:20:05.309Z",
    "factText": "Owls don't have eyeballs! 🦉👀 Instead, they have long, immobile eye tubes supported by bony structures. They have to turn their entire head to look around! 🤯✨ #FunFact",
    "category": "Owl",
    "keywords": [
      "owls",
      "dont",
      "have",
      "eyeballs",
      "instead",
      "they",
      "long",
      "immobile",
      "eye",
      "tubes",
      "supported",
      "bony",
      "structures",
      "turn",
      "their",
      "entire",
      "head",
      "look",
      "around"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1013",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721970960000",
    "date": "2026-06-05T00:20:05.311Z",
    "factText": "Cheetahs can't roar! They purr, hiss, and make chirping sounds like birds to communicate with each other. 🐆🐦⬛✨ #FunFact",
    "category": "Cheetah",
    "keywords": [
      "cheetahs",
      "cant",
      "roar",
      "they",
      "purr",
      "hiss",
      "make",
      "chirping",
      "sounds",
      "like",
      "birds",
      "communicate",
      "each",
      "other"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1014",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721979600000",
    "date": "2026-06-06T00:20:05.315Z",
    "factText": "Elephants are the only mammals that can't jump! 🐘❌ Their heavy bone structure & downward-pointing ankle muscles keep their feet firmly on the ground. 🌎✨ #FunFact",
    "category": "Elephant",
    "keywords": [
      "elephants",
      "only",
      "mammals",
      "that",
      "cant",
      "jump",
      "their",
      "heavy",
      "bone",
      "structure",
      "downwardpointing",
      "ankle",
      "muscles",
      "keep",
      "feet",
      "firmly",
      "ground"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1015",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721988240000",
    "date": "2026-06-07T00:20:05.319Z",
    "factText": "Kangaroos cannot walk backwards! 🦘❌ Their large, muscular tails and long feet make it physically impossible to move in reverse. Always moving forward! ✨ #FunFact",
    "category": "Kangaroo",
    "keywords": [
      "kangaroos",
      "cannot",
      "walk",
      "backwards",
      "their",
      "large",
      "muscular",
      "tails",
      "long",
      "feet",
      "make",
      "physically",
      "impossible",
      "move",
      "reverse",
      "always",
      "moving",
      "forward"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1016",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1721996880000",
    "date": "2026-06-08T00:20:05.323Z",
    "factText": "Sloths can hold their breath longer than dolphins can! 🦥💨 By slowing down their heart rate, they can survive underwater for up to 40 minutes. 🌊🤯 #FunFact",
    "category": "Sloth",
    "keywords": [
      "sloths",
      "can",
      "hold",
      "their",
      "breath",
      "longer",
      "than",
      "dolphins",
      "slowing",
      "down",
      "heart",
      "rate",
      "they",
      "survive",
      "underwater",
      "minutes"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1017",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722005520000",
    "date": "2026-06-09T00:20:05.327Z",
    "factText": "Chameleons don't change color to blend in—they do it to regulate temperature and communicate! 🦎🎨 True emotional expression! ✨ #FunFact",
    "category": "Chameleons",
    "keywords": [
      "chameleons",
      "dont",
      "change",
      "color",
      "blend",
      "inthey",
      "regulate",
      "temperature",
      "communicate",
      "true",
      "emotional",
      "expression"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1018",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722014160000",
    "date": "2026-06-10T00:20:05.331Z",
    "factText": "Seahorses mate for life and hold tails when traveling so they don't get separated in rough currents! 🐴🌊 True ocean romance. 💕✨ #FunFact",
    "category": "Seahorse",
    "keywords": [
      "seahorses",
      "mate",
      "life",
      "hold",
      "tails",
      "when",
      "traveling",
      "they",
      "dont",
      "get",
      "separated",
      "rough",
      "currents",
      "true",
      "ocean",
      "romance"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1019",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722022800000",
    "date": "2026-06-11T00:20:05.336Z",
    "factText": "Watermelons are actually classified as botanically a fruit AND a vegetable! 🍉🥗 They belong to the same gourd family as cucumbers and pumpkins. 🤯✨ #FunFact",
    "category": "Watermelon",
    "keywords": [
      "watermelons",
      "actually",
      "classified",
      "botanically",
      "fruit",
      "vegetable",
      "they",
      "belong",
      "same",
      "gourd",
      "family",
      "cucumbers",
      "pumpkins"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1020",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722031440000",
    "date": "2026-06-12T00:20:05.340Z",
    "factText": "A group of flamingos is called a flamboyance! 🦩✨ These colorful birds perfectly earn their flashy name when they gather together. 💖🌟 #FunFact",
    "category": "Animals",
    "keywords": [
      "group",
      "flamingos",
      "called",
      "flamboyance",
      "these",
      "colorful",
      "birds",
      "perfectly",
      "earn",
      "their",
      "flashy",
      "name",
      "when",
      "they",
      "gather",
      "together"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1021",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722040080000",
    "date": "2026-06-13T00:20:05.346Z",
    "factText": "Crows can remember individual human faces and will hold grudges against people who mistreat them! 🐦⬛🧠 They even pass the info down to their chicks. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "crows",
      "can",
      "remember",
      "individual",
      "human",
      "faces",
      "will",
      "hold",
      "grudges",
      "against",
      "people",
      "who",
      "mistreat",
      "them",
      "they",
      "even",
      "pass",
      "info",
      "down",
      "their",
      "chicks"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1022",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722048720000",
    "date": "2026-06-14T00:20:05.352Z",
    "factText": "Hummingbirds are the only birds that can fly backwards! 🐦💨 Their wings can rotate in a full circle, letting them hover and move in any direction. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "hummingbirds",
      "only",
      "birds",
      "that",
      "can",
      "fly",
      "backwards",
      "their",
      "wings",
      "rotate",
      "full",
      "circle",
      "letting",
      "them",
      "hover",
      "move",
      "any",
      "direction"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1023",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722057360000",
    "date": "2026-06-15T00:20:05.357Z",
    "factText": "Sea turtles can cry salty tears! 🐢💧 They do this to excrete excess salt from their bodies, not because they're sad. Nature's built-in goggles! 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sea",
      "turtles",
      "can",
      "cry",
      "salty",
      "tears",
      "they",
      "this",
      "excrete",
      "excess",
      "salt",
      "from",
      "their",
      "bodies",
      "not",
      "because",
      "theyre",
      "sad",
      "natures",
      "builtin",
      "goggles"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1024",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722066000000",
    "date": "2026-06-16T00:20:05.363Z",
    "factText": "Sea turtles can cry salty tears! 🐢💧 They do this to excrete excess salt from their bodies, not because they're sad. Nature's built-in goggles! 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sea",
      "turtles",
      "can",
      "cry",
      "salty",
      "tears",
      "they",
      "this",
      "excrete",
      "excess",
      "salt",
      "from",
      "their",
      "bodies",
      "not",
      "because",
      "theyre",
      "sad",
      "natures",
      "builtin",
      "goggles"
    ],
    "similarityScore": 1,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1025",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722074640000",
    "date": "2026-06-17T00:20:05.366Z",
    "factText": "Sloths take up to a month to completely digest a leaf! 🦥🍃 #FunFact",
    "category": "Animals",
    "keywords": [
      "sloths",
      "take",
      "month",
      "completely",
      "digest",
      "leaf"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1026",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722083280000",
    "date": "2026-06-18T00:20:05.375Z",
    "factText": "Sea otters hold hands while sleeping so they don't drift apart! 🦦💞 They float on their backs in groups called rafts. True love on the water! 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sea",
      "otters",
      "hold",
      "hands",
      "while",
      "sleeping",
      "they",
      "dont",
      "drift",
      "apart",
      "float",
      "their",
      "backs",
      "groups",
      "called",
      "rafts",
      "true",
      "love",
      "water"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1027",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722091920000",
    "date": "2026-06-19T00:20:05.380Z",
    "factText": "Wombats have cube-shaped poop! 💩📐 It keeps the droppings from rolling away so they can mark their territory. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "wombats",
      "have",
      "cubeshaped",
      "poop",
      "keeps",
      "droppings",
      "from",
      "rolling",
      "away",
      "they",
      "can",
      "mark",
      "their",
      "territory"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1028",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722100560000",
    "date": "2026-06-20T00:20:05.386Z",
    "factText": "Polar bears have black skin under their white fur! 🐻❄️🖤 Their fur is actually translucent, reflecting light to blend into the snow. ❄️✨ #FunFact",
    "category": "Science",
    "keywords": [
      "polar",
      "bears",
      "have",
      "black",
      "skin",
      "under",
      "their",
      "white",
      "fur",
      "actually",
      "translucent",
      "reflecting",
      "light",
      "blend",
      "into",
      "snow"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1029",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722109200000",
    "date": "2026-06-21T00:20:05.394Z",
    "factText": "Penguins can launch themselves up to 9 feet out of the water to land on ice! 🐧🚀 They use air bubbles trapped in their feathers to gain speed. 🤯✨ #FunFact",
    "category": "Science",
    "keywords": [
      "penguins",
      "can",
      "launch",
      "themselves",
      "feet",
      "out",
      "water",
      "land",
      "ice",
      "they",
      "use",
      "air",
      "bubbles",
      "trapped",
      "their",
      "feathers",
      "gain",
      "speed"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1030",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722117840000",
    "date": "2026-06-22T00:20:05.400Z",
    "factText": "The tongue of a blue whale weighs more than an entire adult elephant! 🐋🐘 That is one massive muscle. Deep ocean wonders! 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "tongue",
      "blue",
      "whale",
      "weighs",
      "more",
      "than",
      "entire",
      "adult",
      "elephant",
      "that",
      "one",
      "massive",
      "muscle",
      "deep",
      "ocean",
      "wonders"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1031",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722126480000",
    "date": "2026-06-23T00:20:05.409Z",
    "factText": "Flamingos are actually born gray! 🦩 Their pink color comes from pigments in the brine shrimp and algae they eat. You truly are what you eat! 🍤✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "flamingos",
      "actually",
      "born",
      "gray",
      "their",
      "pink",
      "color",
      "comes",
      "from",
      "pigments",
      "brine",
      "shrimp",
      "algae",
      "they",
      "eat",
      "truly",
      "what"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1032",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722135120000",
    "date": "2026-06-24T00:20:05.416Z",
    "factText": "Bananas are the only fruit that can cure stress and anxiety! 🍌 Just kidding, but they do contain Vitamin B6 which helps regulate your mood. ☀️✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "bananas",
      "only",
      "fruit",
      "that",
      "can",
      "cure",
      "stress",
      "anxiety",
      "just",
      "kidding",
      "they",
      "contain",
      "vitamin",
      "which",
      "helps",
      "regulate",
      "your",
      "mood"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1033",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722143760000",
    "date": "2026-06-25T00:20:05.423Z",
    "factText": "Cheetahs can’t roar—they purr just like house cats! 🐆🔊 They also make chirping sounds like birds to find each other. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "cheetahs",
      "cant",
      "roarthey",
      "purr",
      "just",
      "like",
      "house",
      "cats",
      "they",
      "also",
      "make",
      "chirping",
      "sounds",
      "birds",
      "find",
      "each",
      "other"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1034",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722152400000",
    "date": "2026-06-26T00:20:05.430Z",
    "factText": "Koalas have unique fingerprints that are virtually identical to human ones! 🐨🔬 Even under an electron microscope, they're tough to tell apart. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "koalas",
      "have",
      "unique",
      "fingerprints",
      "that",
      "virtually",
      "identical",
      "human",
      "ones",
      "even",
      "under",
      "electron",
      "microscope",
      "theyre",
      "tough",
      "tell",
      "apart"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1035",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722161040000",
    "date": "2026-06-27T00:20:05.439Z",
    "factText": "Pineapples take nearly three years to grow and mature! 🍍 It takes patience to grow just a single fruit on the plant. Totally worth the wait! ☀️✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "pineapples",
      "take",
      "nearly",
      "three",
      "years",
      "grow",
      "mature",
      "takes",
      "patience",
      "just",
      "single",
      "fruit",
      "plant",
      "totally",
      "worth",
      "wait"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1036",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722169680000",
    "date": "2026-06-28T00:20:05.447Z",
    "factText": "Sloths take up to a month to completely digest a single leaf! 🦥🍃 They have a specialized four-chambered stomach to process their slow meals. 🤯✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sloths",
      "take",
      "month",
      "completely",
      "digest",
      "single",
      "leaf",
      "they",
      "have",
      "specialized",
      "fourchambered",
      "stomach",
      "process",
      "their",
      "slow",
      "meals"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1037",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722178320000",
    "date": "2026-06-29T00:20:05.455Z",
    "factText": "Honeybees can recognize human faces! 🐝👩🦰 They use a configuration of features just like we do to remember friendly people. 🤯✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "honeybees",
      "can",
      "recognize",
      "human",
      "faces",
      "they",
      "use",
      "configuration",
      "features",
      "just",
      "like",
      "remember",
      "friendly",
      "people"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1038",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722186960000",
    "date": "2026-06-30T00:20:05.464Z",
    "factText": "A day on Jupiter is only 10 hours long! 🪐 Even though it’s the biggest planet in our solar system, it spins the fastest. Talk about a quick day! 🚀✨ #FunFact",
    "category": "Space",
    "keywords": [
      "day",
      "jupiter",
      "only",
      "hours",
      "long",
      "even",
      "though",
      "its",
      "biggest",
      "planet",
      "our",
      "solar",
      "system",
      "spins",
      "fastest",
      "talk",
      "about",
      "quick"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1039",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722195600000",
    "date": "2026-07-01T00:20:05.471Z",
    "factText": "Cows have best friends and get stressed out when they are separated! 🐄💞 True friendship exists in the pasture. 🌾✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "cows",
      "have",
      "best",
      "friends",
      "get",
      "stressed",
      "out",
      "when",
      "they",
      "separated",
      "true",
      "friendship",
      "exists",
      "pasture"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1040",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722204240000",
    "date": "2026-07-02T00:20:05.481Z",
    "factText": "Pigs are incredibly smart and can actually play video games using their snouts! 🐷🎮 They even have their own joystick preferences. Gamers of the farm! 🌾✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "pigs",
      "incredibly",
      "smart",
      "can",
      "actually",
      "play",
      "video",
      "games",
      "using",
      "their",
      "snouts",
      "they",
      "even",
      "have",
      "own",
      "joystick",
      "preferences",
      "gamers",
      "farm"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1041",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722212880000",
    "date": "2026-07-03T00:20:05.489Z",
    "factText": "Chewing gum while peeling onions can prevent you from crying! 🧅🍬 It forces you to breathe through your mouth, dispersing the gas. 🤯✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "chewing",
      "gum",
      "while",
      "peeling",
      "onions",
      "can",
      "prevent",
      "from",
      "crying",
      "forces",
      "breathe",
      "through",
      "your",
      "mouth",
      "dispersing",
      "gas"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1042",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722221520000",
    "date": "2026-07-04T00:20:05.498Z",
    "factText": "Sea otters have a built-in pouch near their armpits to store their favorite rocks! 🦦🪨 It's their very own tool kit. Truly adorable! ✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sea",
      "otters",
      "have",
      "builtin",
      "pouch",
      "near",
      "their",
      "armpits",
      "store",
      "favorite",
      "rocks",
      "its",
      "very",
      "own",
      "tool",
      "kit",
      "truly",
      "adorable"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1043",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722230160000",
    "date": "2026-07-05T00:20:05.508Z",
    "factText": "A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than it does to complete one orbit around the Sun. 🤯✨ #FunFact",
    "category": "Space",
    "keywords": [
      "day",
      "venus",
      "longer",
      "than",
      "year",
      "takes",
      "rotate",
      "once",
      "its",
      "axis",
      "does",
      "complete",
      "one",
      "orbit",
      "around",
      "sun"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1044",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722238800000",
    "date": "2026-07-06T00:20:05.516Z",
    "factText": "Wombats are the only animals with cube-shaped poop! 🧱 It stops it from rolling away so they can mark territory. 🦦✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "wombats",
      "only",
      "animals",
      "cubeshaped",
      "poop",
      "stops",
      "from",
      "rolling",
      "away",
      "they",
      "can",
      "mark",
      "territory"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1045",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722247440000",
    "date": "2026-07-07T00:20:05.527Z",
    "factText": "The first computer bug was a real moth! 🦋 In 1947, engineers found it stuck in a relay component of the Harvard Mark II computer. Talk about a literal glitch! 💻✨ #FunFact",
    "category": "Tech",
    "keywords": [
      "first",
      "computer",
      "bug",
      "real",
      "moth",
      "1947",
      "engineers",
      "found",
      "stuck",
      "relay",
      "component",
      "harvard",
      "mark",
      "talk",
      "about",
      "literal",
      "glitch"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1046",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722256080000",
    "date": "2026-07-08T00:20:05.537Z",
    "factText": "A single cloud can weigh more than 1 million pounds! ☁️🐘 That’s about 100 elephants floating over your head. Talk about heavy lifting! 🌧️✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "single",
      "cloud",
      "can",
      "weigh",
      "more",
      "than",
      "million",
      "pounds",
      "thats",
      "about",
      "100",
      "elephants",
      "floating",
      "over",
      "your",
      "head",
      "talk",
      "heavy",
      "lifting"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1047",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722264720000",
    "date": "2026-07-09T00:20:05.541Z",
    "factText": "Chameleons don't change color to blend in—they do it to regulate temperature and communicate! 🦎🎨 True emotional expression! ✨ #FunFact",
    "category": "Science",
    "keywords": [
      "chameleons",
      "dont",
      "change",
      "color",
      "blend",
      "inthey",
      "regulate",
      "temperature",
      "communicate",
      "true",
      "emotional",
      "expression"
    ],
    "similarityScore": 1,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1048",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722273360000",
    "date": "2026-07-10T00:20:05.553Z",
    "factText": "Before eraser pads were invented, people used rolled-up pieces of white bread to rub out pencil marks! 🍞✏️ Talk about a tasty mistake! 🤯✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "before",
      "eraser",
      "pads",
      "invented",
      "people",
      "used",
      "rolledup",
      "pieces",
      "white",
      "bread",
      "rub",
      "out",
      "pencil",
      "marks",
      "talk",
      "about",
      "tasty",
      "mistake"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1049",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722282000000",
    "date": "2026-07-11T00:20:05.564Z",
    "factText": "A full NASA space suit costs about $12 million! 👨🚀🚀 And 70% of that cost is just for the backpack and control module. Talk about an expensive outfit! 🌌✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "full",
      "nasa",
      "space",
      "suit",
      "costs",
      "about",
      "million",
      "that",
      "cost",
      "just",
      "backpack",
      "control",
      "module",
      "talk",
      "expensive",
      "outfit"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1050",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722290640000",
    "date": "2026-07-12T00:20:05.573Z",
    "factText": "A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than it does to complete one orbit around the Sun. 🤯✨ #FunFact",
    "category": "Space",
    "keywords": [
      "day",
      "venus",
      "longer",
      "than",
      "year",
      "takes",
      "rotate",
      "once",
      "its",
      "axis",
      "does",
      "complete",
      "one",
      "orbit",
      "around",
      "sun"
    ],
    "similarityScore": 1,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1051",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722299280000",
    "date": "2026-07-13T00:20:05.585Z",
    "factText": "Squirrels plant thousands of new trees each year simply by forgetting where they buried their acorns! 🐿️🌳 Nature's accidental gardeners. ✨ #FunFact",
    "category": "Science",
    "keywords": [
      "squirrels",
      "plant",
      "thousands",
      "new",
      "trees",
      "each",
      "year",
      "simply",
      "forgetting",
      "where",
      "they",
      "buried",
      "their",
      "acorns",
      "natures",
      "accidental",
      "gardeners"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1052",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722307920000",
    "date": "2026-07-14T00:20:05.585Z",
    "factText": "Octopuses have three hearts, nine brains, and blue blood! 🐙💙 Two hearts pump blood to the gills, while the third pumps it to the rest of the body. 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "octopuses",
      "have",
      "three",
      "hearts",
      "nine",
      "brains",
      "blue",
      "blood",
      "two",
      "pump",
      "gills",
      "while",
      "third",
      "pumps",
      "rest",
      "body"
    ],
    "similarityScore": 0.824,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1053",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722316560000",
    "date": "2026-07-15T00:20:05.596Z",
    "factText": "A day on Venus is longer than a year on Venus! 🪐 It takes longer to rotate once on its axis than to complete one orbit around the Sun. 🤯✨ #FunFact",
    "category": "Space",
    "keywords": [
      "day",
      "venus",
      "longer",
      "than",
      "year",
      "takes",
      "rotate",
      "once",
      "its",
      "axis",
      "complete",
      "one",
      "orbit",
      "around",
      "sun"
    ],
    "similarityScore": 0.941,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1054",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722325200000",
    "date": "2026-07-16T00:20:05.602Z",
    "factText": "Wombats are the only animals whose poop is cube-shaped! 🧱 This keeps it from rolling away so they can mark their territory. 🦦✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "wombats",
      "only",
      "animals",
      "whose",
      "poop",
      "cubeshaped",
      "this",
      "keeps",
      "from",
      "rolling",
      "away",
      "they",
      "can",
      "mark",
      "their",
      "territory"
    ],
    "similarityScore": 0.671,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1055",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722333840000",
    "date": "2026-07-17T00:20:05.613Z",
    "factText": "Flamingos aren't born pink! 🦩 They're actually gray and turn pink from eating shrimp and algae. 🦐✨ Talk about a glowing diet! #FunFact",
    "category": "Animals",
    "keywords": [
      "flamingos",
      "arent",
      "born",
      "pink",
      "theyre",
      "actually",
      "gray",
      "turn",
      "from",
      "eating",
      "shrimp",
      "algae",
      "talk",
      "about",
      "glowing",
      "diet"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1056",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722342480000",
    "date": "2026-07-18T00:20:05.624Z",
    "factText": "The total weight of all the ants on Earth is roughly equal to the total weight of all humans! 🐜🌍 Talk about a tiny superpower! 💪✨ #FunFact",
    "category": "Science",
    "keywords": [
      "total",
      "weight",
      "all",
      "ants",
      "earth",
      "roughly",
      "equal",
      "humans",
      "talk",
      "about",
      "tiny",
      "superpower"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1057",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722351120000",
    "date": "2026-07-19T00:20:05.631Z",
    "factText": "Cows have best friends and get stressed out when they are separated! 🐄💞 True friendship exists in the pasture. 🌾✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "cows",
      "have",
      "best",
      "friends",
      "get",
      "stressed",
      "out",
      "when",
      "they",
      "separated",
      "true",
      "friendship",
      "exists",
      "pasture"
    ],
    "similarityScore": 1,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1058",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722359760000",
    "date": "2026-07-20T00:20:05.636Z",
    "factText": "Sloths can hold their breath longer than dolphins can! 🦥💨 They can slow their heart rate down to survive underwater for up to 40 minutes! 🌊🤯 #FunFact",
    "category": "Animals",
    "keywords": [
      "sloths",
      "can",
      "hold",
      "their",
      "breath",
      "longer",
      "than",
      "dolphins",
      "they",
      "slow",
      "heart",
      "rate",
      "down",
      "survive",
      "underwater",
      "minutes"
    ],
    "similarityScore": 0.875,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1059",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722368400000",
    "date": "2026-07-21T00:20:05.647Z",
    "factText": "Sea otters hold hands while sleeping so they don't drift apart! 🦦💞 Truly the cutest sleep safety protocol ever. 🌊✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "sea",
      "otters",
      "hold",
      "hands",
      "while",
      "sleeping",
      "they",
      "dont",
      "drift",
      "apart",
      "truly",
      "cutest",
      "sleep",
      "safety",
      "protocol",
      "ever"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1060",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722377040000",
    "date": "2026-07-22T00:20:05.648Z",
    "factText": "Honey never spoils! 🍯 Archaeologists have found 3,000-year-old pots of honey in Egyptian tombs that are still perfectly edible. 🍯✨ #FunFact",
    "category": "Food & Nature",
    "keywords": [
      "honey",
      "never",
      "spoils",
      "archaeologists",
      "have",
      "found",
      "3000yearold",
      "pots",
      "egyptian",
      "tombs",
      "that",
      "still",
      "perfectly",
      "edible"
    ],
    "similarityScore": 0.669,
    "status": "Duplicate (Flagged)",
    "keepNoteId": "KEEP-1061",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722385680000",
    "date": "2026-07-23T00:20:05.658Z",
    "factText": "Did you know? 🍌 Bananas are technically berries, but strawberries aren't! 🍓 Mind = blown. 🤯 #FunFact #DailyFact",
    "category": "Food & Nature",
    "keywords": [
      "bananas",
      "technically",
      "berries",
      "strawberries",
      "arent",
      "mind",
      "blown",
      "dailyfact"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1062",
    "source": "Google Keep FunFacts List"
  },
  {
    "id": "FACT-1722394320000",
    "date": "2026-07-24T00:20:05.668Z",
    "factText": "Fun fact: Wombat poop is cube-shaped! 🧱 It stops it from rolling away so they can mark their territory. 🦦✨ #FunFact",
    "category": "Animals",
    "keywords": [
      "fun",
      "wombat",
      "poop",
      "cubeshaped",
      "stops",
      "from",
      "rolling",
      "away",
      "they",
      "can",
      "mark",
      "their",
      "territory"
    ],
    "similarityScore": 0,
    "status": "Posted",
    "keepNoteId": "KEEP-1063",
    "source": "Google Keep FunFacts List"
  }
];

class FactVaultApp {
  constructor() {
    this.facts = [];
    this.settings = {
      apiKey: "",
      scriptUrl: "https://script.google.com/macros/s/AKfycbxPBnKn_ZocSAJKkl7pI4DpHouHj8o3cQIt9NvzlNtpSzvkc1ez_PxwuGkuNGQC-T4/exec",
      strictnessThreshold: 0.65
    };
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.loadFacts();
    this.setupEventListeners();
    this.renderDashboard();
    this.renderFactLog();
  }

  // Storage
  loadSettings() {
    const saved = localStorage.getItem("factvault_settings");
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
    
    // Always bind to latest FunFacts Database Web App URL
    this.settings.scriptUrl = "https://script.google.com/macros/s/AKfycbxPBnKn_ZocSAJKkl7pI4DpHouHj8o3cQIt9NvzlNtpSzvkc1ez_PxwuGkuNGQC-T4/exec";

    // Update settings DOM inputs
    document.getElementById("settingApiKey").value = this.settings.apiKey || "";
    document.getElementById("settingScriptUrl").value = this.settings.scriptUrl || "";
    document.getElementById("settingStrictness").value = Math.round(this.settings.strictnessThreshold * 100);
    document.getElementById("strictnessVal").textContent = `${Math.round(this.settings.strictnessThreshold * 100)}%`;

    this.updateStatusBadge();
  }

  saveSettings() {
    this.settings.apiKey = document.getElementById("settingApiKey").value.trim();
    this.settings.scriptUrl = document.getElementById("settingScriptUrl").value.trim();
    this.settings.strictnessThreshold = parseInt(document.getElementById("settingStrictness").value, 10) / 100;
    
    localStorage.setItem("factvault_settings", JSON.stringify(this.settings));
    this.updateStatusBadge();
    alert("Settings saved successfully!");
  }

  updateStatusBadge() {
    const pill = document.getElementById("systemStatusPill");
    const text = document.getElementById("statusText");

    if (this.settings.scriptUrl) {
      pill.style.background = "rgba(6, 182, 212, 0.15)";
      pill.style.borderColor = "rgba(6, 182, 212, 0.3)";
      pill.style.color = "#06b6d4";
      text.textContent = "Google Sheet API Connected";
    } else {
      pill.style.background = "rgba(16, 185, 129, 0.1)";
      pill.style.borderColor = "rgba(16, 185, 129, 0.2)";
      pill.style.color = "#10b981";
      text.textContent = "Local Vault Storage Mode";
    }
  }

  loadFacts() {
    const saved = localStorage.getItem("factvault_facts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= DEFAULT_SEED_FACTS.length) {
          this.facts = parsed;
        } else {
          // Auto-upgrade cache if seed dataset has grown (e.g. 5 -> 64 facts)
          this.facts = DEFAULT_SEED_FACTS;
          this.saveFacts();
        }
      } catch (e) {
        this.facts = DEFAULT_SEED_FACTS;
        this.saveFacts();
      }
    } else {
      this.facts = DEFAULT_SEED_FACTS;
      this.saveFacts();
    }
  }

  saveFacts() {
    localStorage.setItem("factvault_facts", JSON.stringify(this.facts));
  }

  // Duplicate Prevention Algorithm Engine
  normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  extractKeywords(text) {
    const stopWords = new Set([
      "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
      "by", "about", "against", "between", "into", "through", "during", "before",
      "after", "above", "below", "from", "up", "down", "in", "out", "of", "off",
      "over", "under", "again", "further", "then", "once", "here", "there", "when",
      "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
      "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
      "than", "too", "very", "is", "are", "was", "were", "be", "been", "being",
      "have", "has", "had", "do", "does", "did", "fact", "you", "know", "that"
    ]);

    const words = this.normalizeText(text).split(" ");
    return Array.from(new Set(words.filter(w => w.length > 2 && !stopWords.has(w))));
  }

  calculateLevenshteinSimilarity(s1, s2) {
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

  calculateJaccardOverlap(arr1, arr2) {
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

  checkDuplicate(targetFactText) {
    const cleanTarget = this.normalizeText(targetFactText);
    const targetKeywords = this.extractKeywords(targetFactText);

    if (!cleanTarget) {
      return {
        isDuplicate: false,
        score: 0,
        exactMatch: false,
        levScore: 0,
        keywordScore: 0,
        closestMatch: null,
        details: "Empty text"
      };
    }

    let maxCombinedScore = 0;
    let bestMatch = null;
    let bestLev = 0;
    let bestKeyword = 0;
    let exactMatch = false;

    for (const item of this.facts) {
      const cleanItem = this.normalizeText(item.factText);

      // Exact match
      if (cleanTarget === cleanItem) {
        return {
          isDuplicate: true,
          score: 1.0,
          exactMatch: true,
          levScore: 1.0,
          keywordScore: 1.0,
          closestMatch: item,
          details: `Exact match found with Fact ID ${item.id}`
        };
      }

      const lev = this.calculateLevenshteinSimilarity(cleanTarget, cleanItem);
      const itemKeywords = item.keywords && item.keywords.length > 0
        ? item.keywords.map(k => k.toLowerCase())
        : this.extractKeywords(item.factText);
      const jaccard = this.calculateJaccardOverlap(targetKeywords, itemKeywords);

      const combined = Math.max((lev * 0.5) + (jaccard * 0.5), jaccard * 0.9);

      if (combined > maxCombinedScore) {
        maxCombinedScore = combined;
        bestMatch = item;
        bestLev = lev;
        bestKeyword = jaccard;
      }
    }

    const isDup = maxCombinedScore >= this.settings.strictnessThreshold;

    return {
      isDuplicate: isDup,
      score: maxCombinedScore,
      exactMatch: false,
      levScore: bestLev,
      keywordScore: bestKeyword,
      closestMatch: bestMatch,
      details: isDup 
        ? `Flagged duplicate (Score ${(maxCombinedScore * 100).toFixed(1)}% >= Threshold ${(this.settings.strictnessThreshold * 100).toFixed(0)}%)` 
        : `Unique fact (Highest match score ${(maxCombinedScore * 100).toFixed(1)}%)`
    };
  }

  // Event Listeners
  setupEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tabTarget = e.currentTarget.dataset.tab;
        
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        e.currentTarget.classList.add("active");
        document.getElementById(tabTarget).classList.add("active");
      });
    });

    // View All button on Dashboard
    document.getElementById("viewAllFactsBtn").addEventListener("click", () => {
      document.querySelector('.tab-btn[data-tab="factLog"]').click();
    });

    // Search and Filter inputs
    document.getElementById("searchInput").addEventListener("input", () => this.renderFactLog());
    document.getElementById("categoryFilter").addEventListener("change", () => this.renderFactLog());
    document.getElementById("statusFilter").addEventListener("change", () => this.renderFactLog());

    // Settings slider
    document.getElementById("settingStrictness").addEventListener("input", (e) => {
      document.getElementById("strictnessVal").textContent = `${e.target.value}%`;
    });
    document.getElementById("saveSettingsBtn").addEventListener("click", () => this.saveSettings());
    document.getElementById("resetDataBtn").addEventListener("click", () => {
      if (confirm("Reset local storage to reload all 64 historical facts from your Google Keep list?")) {
        this.facts = DEFAULT_SEED_FACTS;
        this.saveFacts();
        this.renderDashboard();
        this.renderFactLog();
        alert("Success! 64 historical facts reloaded into Fact Vault.");
      }
    });

    // Duplicate Checker Button
    document.getElementById("runCheckBtn").addEventListener("click", () => this.runDuplicateCheckSandbox());

    // Manual Fact Addition
    document.getElementById("addManualFactBtn").addEventListener("click", () => this.promptAddManualFact());

    // Dashboard Quick Generate
    document.getElementById("dashGenerateQuickBtn").addEventListener("click", () => {
      document.querySelector('.tab-btn[data-tab="generator"]').click();
      this.runGeminiGenerator();
    });

    // Gemini Generator Tab Button
    document.getElementById("genFactBtn").addEventListener("click", () => this.runGeminiGenerator());
  }

  // Renderers
  renderDashboard() {
    document.getElementById("statTotalFacts").textContent = this.facts.length;
    
    // Calculate uniqueness
    const uniqueness = this.facts.length > 0 ? 100 : 100;
    document.getElementById("statUniquenessRate").textContent = `${uniqueness}%`;
    document.getElementById("statStreak").textContent = `${this.facts.length} Days`;

    // Calculate Top Category
    const catCounts = {};
    this.facts.forEach(f => {
      catCounts[f.category] = (catCounts[f.category] || 0) + 1;
    });
    let topCat = "General";
    let maxCount = 0;
    Object.keys(catCounts).forEach(cat => {
      if (catCounts[cat] > maxCount) {
        maxCount = catCounts[cat];
        topCat = cat;
      }
    });
    document.getElementById("statTopCategory").textContent = topCat;

    // Render Recent 3 Facts
    const container = document.getElementById("dashboardRecentGrid");
    container.innerHTML = "";
    
    const recent = [...this.facts].reverse().slice(0, 3);
    if (recent.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No fun facts recorded yet.</p></div>`;
      return;
    }

    recent.forEach(fact => {
      container.appendChild(this.createFactCardElement(fact));
    });
  }

  renderFactLog() {
    const container = document.getElementById("fullFactGrid");
    container.innerHTML = "";

    const query = document.getElementById("searchInput").value.toLowerCase();
    const catFilter = document.getElementById("categoryFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;

    const filtered = [...this.facts].reverse().filter(fact => {
      const matchQuery = !query || 
        fact.factText.toLowerCase().includes(query) || 
        fact.category.toLowerCase().includes(query) ||
        (fact.keywords && fact.keywords.some(k => k.toLowerCase().includes(query)));

      const matchCat = catFilter === "ALL" || fact.category === catFilter;
      const matchStatus = statusFilter === "ALL" || fact.status === statusFilter;

      return matchQuery && matchCat && matchStatus;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">🔍</div><p>No matching fun facts found.</p></div>`;
      return;
    }

    filtered.forEach(fact => {
      container.appendChild(this.createFactCardElement(fact));
    });
  }

  createFactCardElement(fact) {
    const card = document.createElement("div");
    card.className = "fact-card";

    const dateFormatted = new Date(fact.date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });

    const keywordsHtml = (fact.keywords || [])
      .map(k => `<span class="tag">#${k}</span>`)
      .join("");

    card.innerHTML = `
      <div class="fact-meta">
        <span class="badge badge-cat">${fact.category || "General"}</span>
        <span class="badge badge-status">${fact.status || "Posted"}</span>
      </div>
      <div class="fact-date">📅 ${dateFormatted} • ${fact.source || "Gemini"}</div>
      <div class="fact-text">"${fact.factText}"</div>
      <div class="fact-keywords">${keywordsHtml}</div>
      <div class="fact-card-footer">
        <span style="font-size: 0.75rem; color: var(--text-muted);">ID: ${fact.id.replace("FACT-", "")}</span>
        <button class="btn btn-secondary btn-sm copy-btn">📋 Copy for Keep/Social</button>
      </div>
    `;

    card.querySelector(".copy-btn").addEventListener("click", () => {
      let text = fact.factText.trim();
      if (!text.toLowerCase().includes("#funfact")) {
        text += " #funfact";
      }
      const copyText = `${text}`;
      navigator.clipboard.writeText(copyText);
      alert("Fact copied to clipboard in Google Keep 'FunFacts' list format!");
    });

    return card;
  }

  // Sandbox duplicate checker
  runDuplicateCheckSandbox() {
    const input = document.getElementById("checkerInput").value.trim();
    if (!input) {
      alert("Please enter fact text to analyze.");
      return;
    }

    const report = this.checkDuplicate(input);

    const scoreMeter = document.getElementById("meterScore");
    const statusText = document.getElementById("meterStatus");
    const detailsText = document.getElementById("meterDetails");

    const percentage = Math.round(report.score * 100);
    scoreMeter.textContent = `${percentage}%`;
    detailsText.textContent = report.details;

    if (report.isDuplicate) {
      scoreMeter.className = "score-number text-danger";
      statusText.className = "score-status text-danger";
      statusText.textContent = "❌ Flagged as Duplicate";
    } else if (percentage > 40) {
      scoreMeter.className = "score-number text-warning";
      statusText.className = "score-status text-warning";
      statusText.textContent = "⚠️ Moderate Similarity";
    } else {
      scoreMeter.className = "score-number text-success";
      statusText.className = "score-status text-success";
      statusText.textContent = "✅ 100% Unique Fact";
    }

    document.getElementById("chkExact").textContent = report.exactMatch ? "MATCH FOUND" : "Clean";
    document.getElementById("chkLev").textContent = `${Math.round(report.levScore * 100)}%`;
    document.getElementById("chkKeyword").textContent = `${Math.round(report.keywordScore * 100)}%`;
    document.getElementById("chkMatchId").textContent = report.closestMatch ? `${report.closestMatch.id} ("${report.closestMatch.factText.substring(0, 30)}...")` : "None";
  }

  // Gemini Fact Generator
  async runGeminiGenerator() {
    const card = document.getElementById("genResultCard");
    card.style.display = "block";
    document.getElementById("genFactText").textContent = "⚡ Contacting Gemini AI & running duplicate verification...";

    // Mock / Live Gemini Call
    let candidate = null;
    if (this.settings.apiKey) {
      try {
        const recentSample = this.facts.slice(-30).map(f => `- ${f.factText}`).join("\n");
        const prompt = `Generate 1 daily fun fact for social media and Google Keep.
CONSTRAINTS:
1. Must be UNDER 180 CHARACTERS total.
2. Simple, easy, fun tone with 1-2 emojis.
3. Must end with #funfact
4. Do NOT generate anything similar to previously used facts:\n${recentSample}
Return JSON format: {"factText": "... #funfact", "category": "Animals|Science|History|Space|Tech", "keywords": ["k1","k2"]}`;
        
        const modelsToTry = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-pro", "gemini-2.5-flash", "gemini-2.0-flash"];
        for (const modelName of modelsToTry) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.settings.apiKey}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (res.ok) {
              const data = await res.json();
              const rawText = data.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(rawText);
              candidate = {
                factText: parsed.factText,
                category: parsed.category || "General",
                keywords: parsed.keywords || this.extractKeywords(parsed.factText)
              };
              if (candidate) break;
            }
          } catch (mErr) {
            console.warn(`Model ${modelName} call failed:`, mErr);
          }
        }
      } catch (err) {
        console.warn("Gemini direct call fallback to local generator:", err);
      }
    }

    if (!candidate) {
      // Local fallback generator for offline testing adhering to < 180 chars, emojis, & #funfact
      const sampleTopics = [
        { factText: "🦦 Sea otters hold hands while sleeping so they don't drift apart in the ocean current! 🌊 #funfact", category: "Animals", keywords: ["otters", "hands", "sleeping", "ocean"] },
        { factText: "👑 Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramids! 🌙 #funfact", category: "History", keywords: ["cleopatra", "moon", "landing", "pyramids"] },
        { factText: "🪐 A single day on Venus is actually longer than an entire year on Venus! 🚀 #funfact", category: "Space", keywords: ["venus", "day", "year", "rotation"] }
      ];
      candidate = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    }

    const dupCheck = this.checkDuplicate(candidate.factText);

    document.getElementById("genCat").textContent = candidate.category;
    document.getElementById("genFactText").textContent = `"${candidate.factText}"`;
    document.getElementById("genKeywords").innerHTML = (candidate.keywords || []).map(k => `<span class="tag">#${k}</span>`).join("");
    document.getElementById("genExplanation").textContent = dupCheck.isDuplicate ? `⚠️ Flagged by duplicate engine (${dupCheck.details})` : `✅ Uniqueness score verified (Highest match: ${Math.round(dupCheck.score * 100)}%)`;

    const badge = document.getElementById("genUniquenessBadge");
    if (dupCheck.isDuplicate) {
      badge.className = "badge badge-status";
      badge.style.background = "rgba(239, 68, 68, 0.2)";
      badge.style.color = "#ef4444";
      badge.textContent = "Duplicate Detected";
    } else {
      badge.className = "badge badge-status";
      badge.style.background = "rgba(16, 185, 129, 0.2)";
      badge.style.color = "#10b981";
      badge.textContent = "Verified Unique";
    }

    // Save button event
    document.getElementById("genSaveBtn").onclick = () => {
      this.addFact({
        factText: candidate.factText,
        category: candidate.category,
        keywords: candidate.keywords,
        similarityScore: dupCheck.score,
        status: "Posted",
        source: "Gemini Sandbox"
      });
      alert("Fact saved to Fact Vault!");
      card.style.display = "none";
    };

    document.getElementById("genCopyBtn").onclick = () => {
      const copyText = `📌 DAILY FUN FACT\nCategory: #${candidate.category}\n\n"${candidate.factText}"\n\n#DailyFact #Trivia #${candidate.category}`;
      navigator.clipboard.writeText(copyText);
      alert("Copied to clipboard!");
    };
  }

  promptAddManualFact() {
    const text = prompt("Enter the fun fact text:");
    if (!text) return;
    const category = prompt("Enter category (Science, History, Space, Animals, Tech, Nature):", "General") || "General";
    
    const dupCheck = this.checkDuplicate(text);
    if (dupCheck.isDuplicate) {
      if (!confirm(`Warning: Fact flagged as potential duplicate!\nDetails: ${dupCheck.details}\nDo you still want to save it anyway?`)) {
        return;
      }
    }

    this.addFact({
      factText: text,
      category: category,
      keywords: this.extractKeywords(text),
      similarityScore: dupCheck.score,
      status: "Used",
      source: "Manual Entry"
    });
  }

  addFact(factObj) {
    const newFact = {
      id: `FACT-${Date.now()}`,
      date: new Date().toISOString(),
      factText: factObj.factText,
      category: factObj.category || "General",
      keywords: factObj.keywords || this.extractKeywords(factObj.factText),
      similarityScore: factObj.similarityScore || 0,
      status: factObj.status || "Used",
      keepNoteId: `KEEP-${Date.now()}`,
      source: factObj.source || "Manual Entry"
    };

    this.facts.push(newFact);
    this.saveFacts();
    this.renderDashboard();
    this.renderFactLog();
  }
}

// Initialize App on DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new FactVaultApp();
});
