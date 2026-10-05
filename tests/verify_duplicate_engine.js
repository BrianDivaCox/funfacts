const fs = require('fs');

function normalizeText(text) {
  if (!text) return '';
  let clean = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
  const numMap = {
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    'ten': '10', 'twenty': '20', 'thirty': '30', 'forty': '40',
    'fifty': '50', 'sixty': '60', 'seventy': '70', 'eighty': '80',
    'ninety': '90', 'hundred': '100', 'thousand': '1000', 'million': '1000000'
  };
  return clean.split(' ').map(w => numMap[w] || w).join(' ');
}

function stemWord(word) {
  if (!word || word.length < 4) return word;
  if (word.endsWith('iness')) return word.slice(0, -5) + 'y';
  if (word.endsWith('ness'))  return word.slice(0, -4);
  if (word.endsWith('ment'))  return word.slice(0, -4);
  if (word.endsWith('tion'))  return word.slice(0, -4);
  if (word.endsWith('able'))  return word.slice(0, -4);
  if (word.endsWith('ible'))  return word.slice(0, -4);
  if (word.endsWith('ing'))   return word.length > 6 ? word.slice(0, -3) : word;
  if (word.endsWith('ied'))   return word.slice(0, -3) + 'y';
  if (word.endsWith('ies'))   return word.slice(0, -3) + 'y';
  if (word.endsWith('ed'))    return word.length > 5 ? word.slice(0, -2) : word;
  if (word.endsWith('ly'))    return word.slice(0, -2);
  if (word.endsWith('er'))    return word.length > 5 ? word.slice(0, -2) : word;
  if (word.endsWith('est'))   return word.length > 5 ? word.slice(0, -3) : word;
  if (word.endsWith('es'))    return word.slice(0, -2);
  if (word.endsWith('s'))     return word.length > 4 ? word.slice(0, -1) : word;
  return word;
}

const stopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
  'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'from', 'up', 'down', 'out', 'of', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'fact', 'you', 'know', 'that', 'this', 'these', 'those', 'funfact', 'dailyfact'
]);

function extractKeywords(text) {
  const words = normalizeText(text).split(' ');
  const stemmed = words.filter(w => w.length > 2 && !stopWords.has(w)).map(w => stemWord(w));
  return Array.from(new Set(stemmed));
}

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
      track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
    }
  }
  return 1.0 - (track[len2][len1] / Math.max(len1, len2));
}

function calculateJaccardOverlap(set1, set2) {
  const s1 = new Set(set1);
  const s2 = new Set(set2);
  let inter = 0;
  s1.forEach(x => { if (s2.has(x)) inter++; });
  const union = new Set([...s1, ...s2]).size;
  return union === 0 ? 0 : inter / union;
}

function checkDuplicate(targetFact, facts) {
  const cleanTarget = normalizeText(targetFact);
  const targetKeywords = extractKeywords(targetFact);
  let maxScore = 0;
  let bestMatch = null;

  for (const item of facts) {
    const cleanItem = normalizeText(item.factText);
    if (cleanTarget === cleanItem) {
      return { isDuplicate: true, similarityScore: 1.0, highestMatch: item };
    }
    const levScore = calculateLevenshteinSimilarity(cleanTarget, cleanItem);
    const itemKeywords = extractKeywords(item.factText);
    const jaccardScore = calculateJaccardOverlap(targetKeywords, itemKeywords);

    let matchingKeywordCount = 0;
    const targetSet = new Set(targetKeywords);
    itemKeywords.forEach(k => {
      if (targetSet.has(k)) matchingKeywordCount++;
    });

    let combinedScore = Math.max(levScore, jaccardScore);
    if (matchingKeywordCount >= 3) {
      const densityScore = matchingKeywordCount / Math.min(targetKeywords.length, itemKeywords.length);
      combinedScore = Math.max(combinedScore, 0.55 + (densityScore * 0.45));
    } else if (matchingKeywordCount === 2) {
      const densityScore = matchingKeywordCount / Math.min(targetKeywords.length, itemKeywords.length);
      if (densityScore >= 0.40) {
        combinedScore = Math.max(combinedScore, 0.50 + (densityScore * 0.40));
      }
    }

    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestMatch = item;
    }
  }

  const threshold = 0.50;
  return {
    isDuplicate: maxScore >= threshold,
    similarityScore: parseFloat(maxScore.toFixed(3)),
    highestMatch: bestMatch
  };
}

const seedFacts = JSON.parse(fs.readFileSync('data/facts.json', 'utf8'));

const tests = [
  { text: 'Did you know that sloths can hold their breath for forty minutes underwater? 🦥 #funfact', expected: true },
  { text: 'Octopuses possess three hearts, nine brains, and their blood is colored blue! 🐙 #funfact', expected: true },
  { text: 'Honey never spoils and archaeologists found pots of honey thousands of years old in Egyptian tombs! 🍯 #funfact', expected: true },
  { text: 'Wombat poop is shaped like cubes so it does not roll away! 🧱 #funfact', expected: true },
  { text: 'Flamingos are born gray and only turn pink because of the shrimp they eat! 🦩 #funfact', expected: true },
  { text: 'A day on Venus is actually longer than an entire Venusian year! 🪐 #funfact', expected: true },
  { text: 'Quantum computers can perform calculations in seconds that would take normal computers millennia! 💻 #funfact', expected: false }
];

console.log('=== RUNNING RIGOROUS DUPLICATE CHECK TEST SUITE ===');
let allPassed = true;
tests.forEach((t, i) => {
  const res = checkDuplicate(t.text, seedFacts);
  const pass = res.isDuplicate === t.expected;
  if (!pass) allPassed = false;
  console.log(`Test ${i + 1}: ${res.isDuplicate ? '🔴 DUPLICATE' : '🟢 UNIQUE'} (Score: ${res.similarityScore}) - Expected: ${t.expected ? 'DUPLICATE' : 'UNIQUE'} - ${pass ? 'PASSED ✅' : 'FAILED ❌'}`);
  if (res.isDuplicate && res.highestMatch) {
    console.log(`   Matched with: "${res.highestMatch.factText.substring(0, 70)}..."`);
  }
});

console.log('--------------------------------------------------');
if (allPassed) {
  console.log('🎉 ALL 7/7 TESTS PASSED! ZERO DUPLICATES SLIPPED THROUGH!');
} else {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
}
