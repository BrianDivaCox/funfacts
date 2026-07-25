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
 * Initialize Spreadsheet structure if missing
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Fact Log Sheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
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
    sheet.setColumnWidth(1, 120); // ID
    sheet.setColumnWidth(2, 140); // Date
    sheet.setColumnWidth(3, 400); // Fact Text
    sheet.setColumnWidth(4, 120); // Category
    sheet.setColumnWidth(5, 200); // Keywords
    sheet.setColumnWidth(6, 120); // Similarity
    sheet.setColumnWidth(7, 100); // Status
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

  return { success: true, message: "Spreadsheet structure initialized" };
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

    // Combined Weighted Score (Levenshtein + Keyword Overlap)
    const combinedScore = Math.max((levScore * 0.5) + (jaccardScore * 0.5), jaccardScore * 0.9);

    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestMatch = item;
      if (levScore > 0.75) {
        matchReason = `High textual similarity (${(levScore * 100).toFixed(1)}%)`;
      } else if (jaccardScore > 0.6) {
        matchReason = `Significant keyword overlap (${(jaccardScore * 100).toFixed(1)}%)`;
      } else {
        matchReason = `Partial similarity score: ${(combinedScore * 100).toFixed(1)}%`;
      }
    }
  }

  const threshold = parseFloat(getSetting("STRICTNESS_THRESHOLD")) || 0.65;
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
 * Keyword extraction helper
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
  const keywords = words.filter(w => w.length > 2 && !stopWords.has(w));
  return Array.from(new Set(keywords));
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
  const apiKey = providedApiKey || getSetting("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key is not configured in Settings.");
  }

  const existingFacts = getAllFacts();
  const recentFactsSample = existingFacts
    .slice(-50)
    .map(f => `- [${f.category}] ${f.factText}`)
    .join("\n");

  const systemPrompt = `You are a world-class fun fact and trivia curator.
Your task is to generate 1 daily fun fact formatted for social media and Google Keep.

CRITICAL CONSTRAINTS:
1. LENGTH: Must be strictly UNDER 180 CHARACTERS total.
2. TONE & STYLE: Simple, easy, fun, engaging, and uses 1-2 vibrant emojis.
3. HASHTAG: Must end with #funfact
4. DUPLICATE PREVENTION: Cross-reference against this history of used facts to ensure it is completely fresh and NOT a repeat:
${recentFactsSample || "(No previous facts recorded)"}

Provide your response in raw JSON format (no markdown codeblock wrapper) matching this schema:
{
  "factText": "🦒 Giraffes only need 5 to 30 minutes of sleep per day! 😴 #funfact",
  "category": "Animals | Science | History | Space | Pop Culture | Tech | Nature",
  "keywords": ["giraffes", "sleep", "minutes"],
  "explanation": "Brief context or source note"
}`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{ text: systemPrompt }]
    }],
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 500
    }
  };

  let retries = 3;
  let candidateFact = null;

  while (retries > 0) {
    const response = UrlFetchApp.fetch(apiUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error(`Gemini API Error (${responseCode}): ${response.getContentText()}`);
    }

    const resData = JSON.parse(response.getContentText());
    const rawText = resData.candidates[0].content.parts[0].text;
    const cleanJsonText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    try {
      const parsed = JSON.parse(cleanJsonText);
      const dupCheck = checkDuplicate(parsed.factText, existingFacts);
      
      if (!dupCheck.isDuplicate) {
        candidateFact = {
          factText: parsed.factText,
          category: parsed.category || "General",
          keywords: parsed.keywords || extractKeywords(parsed.factText),
          explanation: parsed.explanation || "",
          similarityScore: dupCheck.similarityScore
        };
        break;
      }
      Logger.log(`Duplicate detected during Gemini generation (${dupCheck.details}). Retrying...`);
    } catch (e) {
      Logger.log("JSON parsing error on Gemini output: " + e.message);
    }
    retries--;
  }

  if (!candidateFact) {
    throw new Error("Failed to generate a non-duplicate fact after 3 attempts.");
  }

  return candidateFact;
}

/**
 * Save new fact to Spreadsheet
 */
function saveFactToSheet(factObj) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    initSpreadsheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  const id = "FACT-" + Date.now();
  const dateStr = new Date().toISOString();
  const keywordsStr = Array.isArray(factObj.keywords) ? factObj.keywords.join(", ") : String(factObj.keywords || "");

  sheet.appendRow([
    id,
    dateStr,
    factObj.factText,
    factObj.category || "General",
    keywordsStr,
    factObj.similarityScore || 0,
    factObj.status || "Queued",
    factObj.keepNoteId || "",
    factObj.source || "Gemini"
  ]);

  return {
    id: id,
    date: dateStr,
    factText: factObj.factText,
    category: factObj.category || "General",
    keywords: factObj.keywords,
    similarityScore: factObj.similarityScore || 0,
    status: factObj.status || "Queued"
  };
}

/**
 * Post Fact to Google Keep "FunFacts" Note / List
 */
function postToGoogleKeep(factText, category) {
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  // Clean & ensure #funfact tag
  let cleanFact = factText.trim();
  if (!cleanFact.toLowerCase().includes("#funfact")) {
    cleanFact += " #funfact";
  }

  const formattedNoteContent = 
    `📌 FunFacts List - ${dateStr}\n` +
    `${cleanFact}`;

  // Sync draft / note copy to Gmail / Keep list pipeline
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
    keepNoteId: "KEEP-" + Date.now()
  };
}

/**
 * Daily Midnight Trigger Function
 */
function dailyMidnightTrigger() {
  Logger.log("Running Daily Midnight Fun Fact Automation...");
  initSpreadsheet();

  try {
    const apiKey = getSetting("GEMINI_API_KEY");
    if (!apiKey) {
      Logger.log("Skipping midnight run: GEMINI_API_KEY not configured.");
      return;
    }

    const uniqueFact = generateUniqueFactWithGemini(apiKey);
    const keepResult = postToGoogleKeep(uniqueFact.factText, uniqueFact.category);

    uniqueFact.status = "Posted";
    uniqueFact.keepNoteId = keepResult.keepNoteId;
    uniqueFact.source = "Midnight Automated Trigger";

    const saved = saveFactToSheet(uniqueFact);
    Logger.log("Successfully processed daily fun fact: " + saved.id);
  } catch (err) {
    Logger.log("Error in dailyMidnightTrigger: " + err.message);
  }
}

/**
 * Setup or reset daily midnight time-driven trigger
 */
function setupMidnightTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "dailyMidnightTrigger") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  ScriptApp.newTrigger("dailyMidnightTrigger")
    .timeBased()
    .everyDays(1)
    .atHour(0) // 12:00 AM Midnight
    .create();

  return { success: true, message: "Daily Midnight Trigger installed for 12:00 AM daily." };
}

/**
 * Web App REST Endpoint (GET)
 */
function doGet(e) {
  initSpreadsheet();
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
  initSpreadsheet();
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
