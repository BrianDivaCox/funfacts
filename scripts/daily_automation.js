/**
 * Daily Fun Fact Automation Script — Node.js / GitHub Actions Edition
 * Version: 4.0.0
 * 
 * Runs nightly at midnight via GitHub Actions to generate a daily fun fact.
 * Completely eliminates Google Apps Script UrlFetch rate limits!
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxy4eoe4_VceSJrSxzX-tstmnLuRGKKkMr_VNoarVgRf5Qh-ByEGQwwJb9qqtmSIpI/exec";

const TOPIC_AREAS = [
  "Deep Ocean Biology & Bioluminescence",
  "Quantum Physics & Particle Science",
  "Volcanology & Geological Wonders",
  "Meteorology & Extreme Weather",
  "Entomology & Insect Behavior",
  "Mycology & Fungi Facts",
  "Botany & Carnivorous Plants",
  "Genetics & DNA Discoveries",
  "Paleontology & Prehistoric Life",
  "Astronomy & Exoplanets",
  "Black Holes & Neutron Stars",
  "Mars & Planetary Exploration",
  "Ancient Calendars & Timekeeping",
  "Ancient History & Archaeology",
  "Medieval Engineering & Castles",
  "Ancient Rome & Greece",
  "Viking Age & Norse Myths",
  "Cold War Secrets & Spy Tech",
  "Ancient Egypt & Pharaohs",
  "Aztec & Mayan Civilizations",
  "Silk Road & Trade History",
  "Neuroscience & Brain Quirks",
  "Sleep Science & Dreams",
  "Human Senses & Perception",
  "Psychology & Optical Illusions",
  "Medicine & Surgery History",
  "Food Chemistry & Culinary Trivia",
  "Linguistics & Word Origins",
  "Art History & Famous Forgeries",
  "Music Theory & Instrument Origins",
  "Film History & Silent Movies",
  "World Architecture & Megastructures",
  "Aviation & Air Travel History",
  "Cryptography & Code Breaking",
  "Sports World Records & Oddities",
  "Mathematics & Number Theory"
];

const MODELS_TO_TRY = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro"
];

// Helper: Normalize text
function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper: Minimal English stemmer
function stemWord(word) {
  if (!word || word.length < 4) return word;
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

// Helper: Keyword extraction
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
    .map(w => stemWord(w));
  return Array.from(new Set(stemmed));
}

// Helper: Levenshtein similarity
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

// Helper: Jaccard overlap
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

// Duplicate checker
function checkDuplicate(targetFact, existingFacts) {
  if (!existingFacts || existingFacts.length === 0) {
    return { isDuplicate: false, similarityScore: 0 };
  }
  const cleanTarget = normalizeText(targetFact);
  const targetKeywords = extractKeywords(targetFact);
  let maxScore = 0;
  let bestMatch = null;

  for (const item of existingFacts) {
    const cleanItem = normalizeText(item.factText);
    if (cleanTarget === cleanItem) {
      return { isDuplicate: true, similarityScore: 1.0, highestMatch: item };
    }
    const levScore = calculateLevenshteinSimilarity(cleanTarget, cleanItem);
    const itemKeywords = item.keywords && item.keywords.length > 0
      ? item.keywords.map(k => k.toLowerCase())
      : extractKeywords(item.factText);
    const jaccardScore = calculateJaccardOverlap(targetKeywords, itemKeywords);
    const combinedScore = Math.max((levScore * 0.5) + (jaccardScore * 0.5), jaccardScore * 0.9);

    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestMatch = item;
    }
  }
  const threshold = 0.60;
  return {
    isDuplicate: maxScore >= threshold,
    similarityScore: parseFloat(maxScore.toFixed(3)),
    highestMatch: bestMatch
  };
}

async function runAutomation() {
  console.log("🚀 Starting Daily Fun Fact Automation (GitHub Actions / Node.js)");
  const webAppUrl = process.env.WEB_APP_URL || DEFAULT_WEB_APP_URL;

  // Step 1: Fetch existing facts from Web App
  console.log(`📡 Fetching existing facts from Web App: ${webAppUrl}...`);
  const factsRes = await fetch(`${webAppUrl}?action=getFacts`);
  const factsData = await factsRes.json();
  if (!factsData.success) {
    throw new Error(`Failed to fetch facts: ${factsData.error}`);
  }
  const existingFacts = factsData.facts || [];
  console.log(`✅ Loaded ${existingFacts.length} existing facts for duplicate checking.`);

  // Step 2: Determine API Key
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("🔑 GEMINI_API_KEY environment variable not found. Fetching from Web App settings...");
    const settingsRes = await fetch(`${webAppUrl}?action=getSettings`);
    const settingsData = await settingsRes.json();
    if (settingsData.success && settingsData.settings && settingsData.settings.hasApiKey) {
      // Note: hasApiKey is boolean for security. If env var isn't set, throw helpful message.
      throw new Error("GEMINI_API_KEY secret is required in GitHub Repository Secrets.");
    }
  }

  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please set GEMINI_API_KEY environment variable or GitHub secret.");
  }

  // Sample recent facts to give Gemini prompt context
  const recentFactsSample = existingFacts
    .slice(-20)
    .map(f => `- [${f.category}] ${f.factText}`)
    .join("\n");

  let uniqueFact = null;
  let lastErrorDetail = "";

  for (const modelName of MODELS_TO_TRY) {
    console.log(`🤖 Attempting generation with model: ${modelName}...`);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    for (let retry = 1; retry <= 3; retry++) {
      const randomTopic = TOPIC_AREAS[Math.floor(Math.random() * TOPIC_AREAS.length)];
      console.log(`  🎯 Retry ${retry}/3 — Selected topic: "${randomTopic}"`);

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
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.95,
          topP: 0.99,
          maxOutputTokens: 300
        }
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const status = response.status;
        const resText = await response.text();

        if (status === 200) {
          let resData;
          try {
            resData = JSON.parse(resText);
          } catch (e) {
            console.log(`  ⚠️ Failed to parse top-level response JSON: ${e.message}`);
            continue;
          }

          if (!resData.candidates || !resData.candidates[0] || !resData.candidates[0].content) {
            console.log("  ⚠️ Gemini returned no candidates (possible safety block).");
            continue;
          }

          const rawText = resData.candidates[0].content.parts[0].text;
          const cleanJsonText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

          let parsed = null;
          try {
            parsed = JSON.parse(cleanJsonText);
          } catch (e) {
            const match = rawText.match(/"factText"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
              parsed = {
                factText: match[1],
                category: randomTopic.split(' ')[0],
                keywords: extractKeywords(match[1])
              };
            }
          }

          if (parsed && parsed.factText) {
            const dupCheck = checkDuplicate(parsed.factText, existingFacts);
            console.log(`  📊 Duplicate score: ${dupCheck.similarityScore} (isDuplicate: ${dupCheck.isDuplicate})`);

            if (!dupCheck.isDuplicate) {
              uniqueFact = {
                factText: parsed.factText,
                category: parsed.category || randomTopic.split(' ')[0],
                keywords: parsed.keywords || extractKeywords(parsed.factText),
                similarityScore: dupCheck.similarityScore
              };
              console.log(`  ✨ UNIQUE FACT GENERATED: "${uniqueFact.factText}"`);
              break;
            } else {
              console.log(`  ⚠️ Duplicate detected (score ${dupCheck.similarityScore}). Retrying...`);
            }
          }
        } else {
          lastErrorDetail = `HTTP ${status}: ${resText.substring(0, 150)}`;
          console.log(`  ❌ ${modelName} returned ${status}`);
          if (status === 503 || status === 429) {
            await new Promise(res => setTimeout(res, 2000));
          } else {
            break; // Move to next model for hard errors
          }
        }
      } catch (err) {
        console.log(`  ❌ Fetch error: ${err.message}`);
      }
    }

    if (uniqueFact) break;
  }

  if (!uniqueFact) {
    throw new Error(`Failed to generate non-duplicate fact. Last detail: ${lastErrorDetail}`);
  }

  // Step 3: Save to Web App (Appends to Google Sheet & syncs Google Keep)
  console.log("💾 Saving unique fact to Google Sheet & Google Keep via Web App REST POST...");
  const saveRes = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "addFact",
      factText: uniqueFact.factText,
      category: uniqueFact.category,
      keywords: uniqueFact.keywords,
      status: "Posted",
      source: "GitHub Actions Midnight Automation"
    })
  });

  const saveJson = await saveRes.json();
  if (saveJson.success) {
    console.log(`🎉 SUCCESS! Fact #${saveJson.fact.id} saved & pushed to Google Keep!`);
    console.log(`Fact: "${saveJson.fact.factText}"`);
  } else {
    throw new Error(`Failed to save fact to sheet: ${saveJson.error}`);
  }
}

runAutomation().catch(err => {
  console.error(`💥 Automation failed: ${err.message}`);
  process.exit(1);
});
