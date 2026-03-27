/* ═══════════════════════════════════════════════════════════
   MATHS PRACTICE PORTAL v2 — script.js
   • Bilingual (Hindi / English) full support
   • Stronger, detailed questions
   • Full step-by-step solutions
   • Skip question support
   • Animated dots progress tracker
   • Subdomain-ready (pure HTML/CSS/JS)
═══════════════════════════════════════════════════════════ */

// ── App State ──────────────────────────────────────────────
let allQuestions = [];
let currentIndex = 0;
let userAnswers  = [];        // -1 = not yet, -2 = skipped
let timerInterval = null;
let secondsLeft   = 30 * 60;
let currentLang   = 'en';    // 'en' | 'hi'

// ── Utility ────────────────────────────────────────────────
const rand     = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick     = arr  => arr[rand(0, arr.length - 1)];
const shuffle  = arr  => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Language Strings ───────────────────────────────────────
const L = {
  en: {
    answered:  'Answered:',
    skip:      'Skip →',
    next:      'Next →',
    submit:    'Submit Test',
    marks:     '+4 Marks',
    correct:   'Correct ✅',
    wrong:     'Wrong ❌',
    skipped:   'Skipped ⏭',
    yourAns:   'Your Answer:',
    corrAns:   'Correct Answer:',
    notAtt:    'Not Attempted',
    solTitle:  '📋 Detailed Solutions',
    stepHead:  '🔢 Step-by-Step Solution',
    finalAns:  '✅ Final Answer:',
    excellent: '🏆 Excellent! Outstanding Performance!',
    good:      '👍 Good Job! Keep it up!',
    average:   '📚 Average. More Practice Needed.',
    poor:      '💪 Needs Improvement. Don\'t Give Up!',
    brand:     'Maths Portal',
    yourRes:   'Your Result',
    playAgain: '🔄 Play Again',
    print:     '🖨 Print Result',
    startTest: 'Start Test →',
  },
  hi: {
    answered:  'उत्तरित:',
    skip:      'छोड़ें →',
    next:      'अगला →',
    submit:    'परीक्षा जमा करें',
    marks:     '+4 अंक',
    correct:   'सही ✅',
    wrong:     'गलत ❌',
    skipped:   'छोड़े ⏭',
    yourAns:   'आपका उत्तर:',
    corrAns:   'सही उत्तर:',
    notAtt:    'प्रयास नहीं किया',
    solTitle:  '📋 विस्तृत हल',
    stepHead:  '🔢 चरण-दर-चरण हल',
    finalAns:  '✅ अंतिम उत्तर:',
    excellent: '🏆 उत्कृष्ट! शानदार प्रदर्शन!',
    good:      '👍 अच्छा प्रदर्शन! जारी रखें!',
    average:   '📚 औसत। और अभ्यास करें।',
    poor:      '💪 सुधार की जरूरत। हिम्मत मत हारो!',
    brand:     'गणित पोर्टल',
    yourRes:   'आपका परिणाम',
    playAgain: '🔄 फिर से खेलें',
    print:     '🖨 प्रिंट करें',
    startTest: 'परीक्षा शुरू करें →',
  }
};

// ── Language Toggle ────────────────────────────────────────
function toggleLang() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  const newLabel = currentLang === 'en' ? 'हिंदी' : 'English';
  ['lang-label', 'lang-label-quiz', 'lang-label-result'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = newLabel;
  });
  applyLangToDOM();
  if (allQuestions.length > 0 && currentIndex < 25) renderQuestion();
}

function t(key) { return L[currentLang][key] || L.en[key]; }

function applyLangToDOM() {
  const attr = `data-${currentLang}`;
  document.querySelectorAll(`[data-en]`).forEach(el => {
    if (el.hasAttribute(attr)) el.textContent = el.getAttribute(attr);
  });
}

// ══════════════════════════════════════════════════════════════════
//   QUESTION GENERATORS
//   Each returns: { category:{en,hi}, text:{en,hi}, options[], correctIndex, steps:[{en,hi}], finalAns }
// ══════════════════════════════════════════════════════════════════

/* ── 1. Percentage — Basic ── */
function genPctBasic() {
  const p = pick([5,10,12,15,20,25,30,40,50]);
  const n = rand(200, 1200);
  const ans = (p * n) / 100;
  const opts = makeOpts(ans, [ans + rand(10,60), ans - rand(10,50), Math.round(ans * 1.5)]);
  return {
    category: { en: 'Percentage', hi: 'प्रतिशत' },
    text: {
      en: `What is ${p}% of ${n}?`,
      hi: `${n} का ${p}% क्या होगा?`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Percentage = ${p}%, Number = ${n}`, hi: `दिया गया: प्रतिशत = ${p}%, संख्या = ${n}` },
      { en: `Formula: (Percentage × Number) ÷ 100`, hi: `सूत्र: (प्रतिशत × संख्या) ÷ 100` },
      { en: `= (${p} × ${n}) ÷ 100`, hi: `= (${p} × ${n}) ÷ 100` },
      { en: `= ${p * n} ÷ 100`, hi: `= ${p * n} ÷ 100` },
      { en: `= ${ans}`, hi: `= ${ans}` },
    ],
    finalAns: String(ans)
  };
}

/* ── 2. Percentage — X is what % of Y ── */
function genWhatPct() {
  const base = rand(200, 1000);
  const pct  = pick([5,10,20,25,40,50]);
  const part = (pct * base) / 100;
  const ans  = pct;
  const opts = makeOpts(ans, [ans + 5, ans - 5, ans + 15]);
  return {
    category: { en: 'Percentage', hi: 'प्रतिशत' },
    text: { en: `${part} is what percent of ${base}?`, hi: `${part}, ${base} का कितना प्रतिशत है?` },
    options: opts.vals.map(v => v + '%'),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Part = ${part}, Whole = ${base}`, hi: `दिया गया: भाग = ${part}, पूर्ण = ${base}` },
      { en: `Formula: (Part ÷ Whole) × 100`, hi: `सूत्र: (भाग ÷ पूर्ण) × 100` },
      { en: `= (${part} ÷ ${base}) × 100`, hi: `= (${part} ÷ ${base}) × 100` },
      { en: `= ${(part/base).toFixed(4)} × 100`, hi: `= ${(part/base).toFixed(4)} × 100` },
      { en: `= ${ans}%`, hi: `= ${ans}%` }
    ],
    finalAns: ans + '%'
  };
}

/* ── 3. Percentage — Price increase/decrease ── */
function genPctChange() {
  const orig = rand(400, 2000);
  const pct  = pick([5, 8, 10, 12, 15, 20, 25]);
  const isUp = rand(0,1) === 1;
  const diff = Math.round((orig * pct) / 100);
  const newV = isUp ? orig + diff : orig - diff;
  const opts = makeOpts(newV, [newV + rand(20,80), newV - rand(15,60), newV + rand(30,100)]);
  return {
    category: { en: 'Percentage', hi: 'प्रतिशत' },
    text: {
      en: `The price of an item is ₹${orig}. It is ${isUp ? 'increased' : 'decreased'} by ${pct}%. What is the new price?`,
      hi: `एक वस्तु का मूल्य ₹${orig} है। इसे ${pct}% ${isUp ? 'बढ़ाया' : 'घटाया'} गया। नया मूल्य क्या होगा?`
    },
    options: opts.vals.map(v => '₹' + v),
    correctIndex: opts.idx,
    steps: [
      { en: `Original price = ₹${orig}`, hi: `मूल मूल्य = ₹${orig}` },
      { en: `${isUp ? 'Increase' : 'Decrease'} = ${pct}% of ${orig}`, hi: `${isUp ? 'वृद्धि' : 'कमी'} = ${orig} का ${pct}%` },
      { en: `= (${pct} × ${orig}) ÷ 100 = ₹${diff}`, hi: `= (${pct} × ${orig}) ÷ 100 = ₹${diff}` },
      { en: `New Price = ${orig} ${isUp ? '+' : '−'} ${diff} = ₹${newV}`, hi: `नया मूल्य = ${orig} ${isUp ? '+' : '−'} ${diff} = ₹${newV}` }
    ],
    finalAns: '₹' + newV
  };
}

/* ── 4. Profit & Loss — Find SP ── */
function genProfitLoss() {
  const cp  = rand(200, 1500);
  const pct = pick([5, 8, 10, 12, 15, 20, 25]);
  const isP = rand(0,1) === 1;
  const pl  = Math.round((cp * pct) / 100);
  const sp  = isP ? cp + pl : cp - pl;
  const opts = makeOpts(sp, [sp + rand(20,80), sp - rand(15,60), sp + rand(40,120)]);
  return {
    category: { en: 'Profit & Loss', hi: 'लाभ और हानि' },
    text: {
      en: `A shopkeeper buys an article for ₹${cp} and sells it at a ${isP ? 'profit' : 'loss'} of ${pct}%. Find the Selling Price.`,
      hi: `एक दुकानदार ₹${cp} में एक वस्तु खरीदता है और ${pct}% ${isP ? 'लाभ' : 'हानि'} पर बेचता है। विक्रय मूल्य ज्ञात करें।`
    },
    options: opts.vals.map(v => '₹' + v),
    correctIndex: opts.idx,
    steps: [
      { en: `Cost Price (CP) = ₹${cp}`, hi: `क्रय मूल्य (CP) = ₹${cp}` },
      { en: `${isP ? 'Profit' : 'Loss'} % = ${pct}%`, hi: `${isP ? 'लाभ' : 'हानि'} % = ${pct}%` },
      { en: `${isP ? 'Profit' : 'Loss'} = ${pct}% of CP = (${pct} × ${cp}) ÷ 100 = ₹${pl}`, hi: `${isP ? 'लाभ' : 'हानि'} = CP का ${pct}% = ₹${pl}` },
      { en: `SP = CP ${isP ? '+' : '−'} ${isP ? 'Profit' : 'Loss'} = ${cp} ${isP ? '+' : '−'} ${pl} = ₹${sp}`, hi: `विक्रय मूल्य = ${cp} ${isP ? '+' : '−'} ${pl} = ₹${sp}` }
    ],
    finalAns: '₹' + sp
  };
}

/* ── 5. Profit & Loss — Find % profit/loss ── */
function genFindPL() {
  const cp  = rand(300, 1200);
  const pct = pick([5, 10, 15, 20, 25]);
  const isP = rand(0,1);
  const sp  = isP ? cp + (cp * pct / 100) : cp - (cp * pct / 100);
  const diff = Math.abs(sp - cp);
  const opts = makeOpts(pct, [pct + 5, pct - 5, pct + 10]);
  return {
    category: { en: 'Profit & Loss', hi: 'लाभ और हानि' },
    text: {
      en: `A trader buys goods at ₹${cp} and sells at ₹${sp}. Find the ${isP ? 'profit' : 'loss'} percentage.`,
      hi: `एक व्यापारी ₹${cp} में माल खरीदकर ₹${sp} में बेचता है। ${isP ? 'लाभ' : 'हानि'} प्रतिशत ज्ञात करें।`
    },
    options: opts.vals.map(v => v + '%'),
    correctIndex: opts.idx,
    steps: [
      { en: `CP = ₹${cp},  SP = ₹${sp}`, hi: `क्रय मूल्य = ₹${cp},  विक्रय मूल्य = ₹${sp}` },
      { en: `${isP ? 'Profit' : 'Loss'} = SP ${isP ? '−' : '−'} CP = ${sp} − ${cp} = ₹${diff}`, hi: `${isP ? 'लाभ' : 'हानि'} = ${sp} − ${cp} = ₹${diff}` },
      { en: `${isP ? 'Profit' : 'Loss'} % = (${isP ? 'Profit' : 'Loss'} ÷ CP) × 100`, hi: `% = (${isP ? 'लाभ' : 'हानि'} ÷ CP) × 100` },
      { en: `= (${diff} ÷ ${cp}) × 100 = ${pct}%`, hi: `= (${diff} ÷ ${cp}) × 100 = ${pct}%` }
    ],
    finalAns: pct + '%'
  };
}

/* ── 6. Ratio — Divide amount ── */
function genRatioDiv() {
  const ratios = [[1,2],[2,3],[3,4],[3,5],[4,5],[2,5],[1,4]];
  const [a, b] = pick(ratios);
  const total  = (a + b) * rand(8, 30);
  const shareA = (a / (a + b)) * total;
  const shareB = total - shareA;
  const opts   = makeOpts(shareA, [shareA + rand(10,50), shareA - rand(10,40), shareB]);
  return {
    category: { en: 'Ratio & Proportion', hi: 'अनुपात और समानुपात' },
    text: {
      en: `₹${total} is divided between A and B in the ratio ${a}:${b}. Find A's share.`,
      hi: `₹${total} को A और B के बीच ${a}:${b} के अनुपात में बाँटा गया। A का हिस्सा ज्ञात करें।`
    },
    options: opts.vals.map(v => '₹' + v),
    correctIndex: opts.idx,
    steps: [
      { en: `Ratio = ${a}:${b} → Total parts = ${a} + ${b} = ${a+b}`, hi: `अनुपात = ${a}:${b} → कुल भाग = ${a+b}` },
      { en: `Value of 1 part = Total ÷ Total parts = ${total} ÷ ${a+b} = ₹${total/(a+b)}`, hi: `1 भाग का मान = ${total} ÷ ${a+b} = ₹${total/(a+b)}` },
      { en: `A's share = ${a} parts = ${a} × ${total/(a+b)} = ₹${shareA}`, hi: `A का हिस्सा = ${a} × ${total/(a+b)} = ₹${shareA}` },
      { en: `B's share = ${b} parts = ${b} × ${total/(a+b)} = ₹${shareB} (Verification: ${shareA}+${shareB}=₹${total} ✓)`, hi: `B का हिस्सा = ₹${shareB} (जाँच: ${shareA}+${shareB}=₹${total} ✓)` }
    ],
    finalAns: '₹' + shareA
  };
}

/* ── 7. Average — Simple ── */
function genAvg() {
  const n    = rand(4, 7);
  let nums, sum, avg;
  do {
    nums = Array.from({length: n}, () => rand(15, 120));
    sum  = nums.reduce((a,b) => a+b, 0);
    avg  = sum / n;
  } while (!Number.isInteger(avg));
  const opts = makeOpts(avg, [avg + rand(3,12), avg - rand(3,10), avg + rand(8,20)]);
  return {
    category: { en: 'Average', hi: 'औसत' },
    text: {
      en: `Find the average of the following numbers:\n${nums.join(', ')}`,
      hi: `निम्नलिखित संख्याओं का औसत ज्ञात करें:\n${nums.join(', ')}`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Numbers: ${nums.join(', ')}`, hi: `संख्याएँ: ${nums.join(', ')}` },
      { en: `Count of numbers = ${n}`, hi: `संख्याओं की कुल गिनती = ${n}` },
      { en: `Sum = ${nums.join(' + ')} = ${sum}`, hi: `योग = ${nums.join(' + ')} = ${sum}` },
      { en: `Formula: Average = Sum ÷ Count`, hi: `सूत्र: औसत = योग ÷ गिनती` },
      { en: `= ${sum} ÷ ${n} = ${avg}`, hi: `= ${sum} ÷ ${n} = ${avg}` }
    ],
    finalAns: String(avg)
  };
}

/* ── 8. Average — New member added ── */
function genNewAvg() {
  let n, avg, sum, newNum, newAvg;
  do {
    n      = rand(4, 8);
    avg    = rand(20, 80);
    sum    = n * avg;
    newNum = rand(avg + 5, avg + 40);
    newAvg = (sum + newNum) / (n + 1);
  } while (!Number.isInteger(newAvg));
  const opts = makeOpts(newAvg, [newAvg + rand(1,5), newAvg - rand(1,4), newAvg + rand(3,8)]);
  return {
    category: { en: 'Average', hi: 'औसत' },
    text: {
      en: `The average of ${n} numbers is ${avg}. A new number ${newNum} is added to the group. Find the new average.`,
      hi: `${n} संख्याओं का औसत ${avg} है। एक नई संख्या ${newNum} जोड़ी जाती है। नया औसत ज्ञात करें।`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Original count = ${n}, Original average = ${avg}`, hi: `मूल गिनती = ${n}, मूल औसत = ${avg}` },
      { en: `Original sum = Count × Average = ${n} × ${avg} = ${sum}`, hi: `मूल योग = ${n} × ${avg} = ${sum}` },
      { en: `New number added = ${newNum}`, hi: `नई संख्या = ${newNum}` },
      { en: `New sum = ${sum} + ${newNum} = ${sum + newNum}`, hi: `नया योग = ${sum} + ${newNum} = ${sum + newNum}` },
      { en: `New count = ${n} + 1 = ${n+1}`, hi: `नई गिनती = ${n+1}` },
      { en: `New Average = ${sum + newNum} ÷ ${n+1} = ${newAvg}`, hi: `नया औसत = ${sum + newNum} ÷ ${n+1} = ${newAvg}` }
    ],
    finalAns: String(newAvg)
  };
}

/* ── 9. Simplification — BODMAS ── */
function genBODMAS() {
  const a = rand(3,15), b = rand(2,10), c = rand(1,8), d = rand(2,6);
  const ans = a * b + c * d;
  const opts = makeOpts(ans, [a*b + c, ans + rand(3,10), ans - rand(2,8)]);
  return {
    category: { en: 'Simplification', hi: 'सरलीकरण' },
    text: {
      en: `Simplify using BODMAS:\n${a} × ${b} + ${c} × ${d}`,
      hi: `BODMAS नियम से सरल करें:\n${a} × ${b} + ${c} × ${d}`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Expression: ${a} × ${b} + ${c} × ${d}`, hi: `व्यंजक: ${a} × ${b} + ${c} × ${d}` },
      { en: `Step 1 (Multiplication first — BODMAS rule): ${a} × ${b} = ${a*b}`, hi: `चरण 1 (पहले गुणा — BODMAS): ${a} × ${b} = ${a*b}` },
      { en: `Step 2 (Multiply remaining): ${c} × ${d} = ${c*d}`, hi: `चरण 2 (बाकी गुणा): ${c} × ${d} = ${c*d}` },
      { en: `Step 3 (Now Add): ${a*b} + ${c*d} = ${ans}`, hi: `चरण 3 (अब जोड़): ${a*b} + ${c*d} = ${ans}` }
    ],
    finalAns: String(ans)
  };
}

/* ── 10. Simplification — Fraction ── */
function genFraction() {
  const n1 = rand(2,8), d1 = rand(2,6);
  const n2 = rand(2,8), d2 = rand(2,6);
  const lcm = (d1 * d2) / gcd(d1, d2);
  const num  = (n1 * (lcm/d1)) + (n2 * (lcm/d2));
  const ansN = num / gcd(num, lcm), ansD = lcm / gcd(num, lcm);
  const ans  = ansD === 1 ? String(ansN) : `${ansN}/${ansD}`;
  const wrong1 = `${n1+n2}/${d1+d2}`;
  const wrong2 = ansD === 1 ? String(ansN + 1) : `${ansN+1}/${ansD}`;
  const wrong3 = ansD === 1 ? String(ansN - 1) : `${ansN}/${ansD+1}`;
  const rawOpts = shuffle([ans, wrong1, wrong2, wrong3]);
  return {
    category: { en: 'Simplification', hi: 'सरलीकरण' },
    text: {
      en: `Simplify: ${n1}/${d1} + ${n2}/${d2}`,
      hi: `सरल करें: ${n1}/${d1} + ${n2}/${d2}`
    },
    options: rawOpts,
    correctIndex: rawOpts.indexOf(ans),
    steps: [
      { en: `Fractions: ${n1}/${d1} and ${n2}/${d2}`, hi: `भिन्न: ${n1}/${d1} और ${n2}/${d2}` },
      { en: `Find LCM of denominators ${d1} and ${d2}: LCM = ${lcm}`, hi: `हर ${d1} और ${d2} का LCM = ${lcm}` },
      { en: `Convert: ${n1}/${d1} = ${n1*(lcm/d1)}/${lcm}, ${n2}/${d2} = ${n2*(lcm/d2)}/${lcm}`, hi: `बदलें: ${n1}/${d1} = ${n1*(lcm/d1)}/${lcm}, ${n2}/${d2} = ${n2*(lcm/d2)}/${lcm}` },
      { en: `Add: ${n1*(lcm/d1)} + ${n2*(lcm/d2)} = ${num} → ${num}/${lcm}`, hi: `जोड़: ${num}/${lcm}` },
      { en: `Simplify: ${num}/${lcm} = ${ans}`, hi: `सरल रूप: ${ans}` }
    ],
    finalAns: ans
  };
}
function gcd(a,b){ return b===0?a:gcd(b,a%b); }

/* ── 11. Algebra — Linear ax + b = c ── */
function genLinear() {
  const a = rand(3,9), x = rand(3,15), b = rand(2,20);
  const c = a * x + b;
  const opts = makeOpts(x, [x+1, x-1, x+3]);
  return {
    category: { en: 'Basic Algebra', hi: 'बीजगणित' },
    text: {
      en: `Find the value of x:\n${a}x + ${b} = ${c}`,
      hi: `x का मान ज्ञात करें:\n${a}x + ${b} = ${c}`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Equation: ${a}x + ${b} = ${c}`, hi: `समीकरण: ${a}x + ${b} = ${c}` },
      { en: `Transpose ${b} to RHS: ${a}x = ${c} − ${b}`, hi: `${b} को दायीं ओर ले जाएँ: ${a}x = ${c} − ${b}` },
      { en: `${a}x = ${c - b}`, hi: `${a}x = ${c - b}` },
      { en: `Divide both sides by ${a}: x = ${c-b} ÷ ${a}`, hi: `दोनों पक्षों को ${a} से भाग दें: x = ${c-b} ÷ ${a}` },
      { en: `x = ${x}`, hi: `x = ${x}` },
      { en: `Verification: ${a}(${x}) + ${b} = ${a*x} + ${b} = ${c} ✓`, hi: `जाँच: ${a}×${x} + ${b} = ${c} ✓` }
    ],
    finalAns: 'x = ' + x
  };
}

/* ── 12. Algebra — Two variable word problem ── */
function genTwoVar() {
  const x = rand(5, 20), y = rand(3, 15);
  const s = x + y, d = x - y;
  const opts = makeOpts(x, [x+2, x-2, y]);
  return {
    category: { en: 'Basic Algebra', hi: 'बीजगणित' },
    text: {
      en: `The sum of two numbers is ${s} and their difference is ${d}. Find the larger number.`,
      hi: `दो संख्याओं का योग ${s} और अंतर ${d} है। बड़ी संख्या ज्ञात करें।`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Let larger = x, smaller = y`, hi: `मान लें बड़ी संख्या = x, छोटी = y` },
      { en: `Equation 1: x + y = ${s}`, hi: `समीकरण 1: x + y = ${s}` },
      { en: `Equation 2: x − y = ${d}`, hi: `समीकरण 2: x − y = ${d}` },
      { en: `Add both equations: 2x = ${s} + ${d} = ${s+d}`, hi: `दोनों जोड़ें: 2x = ${s+d}` },
      { en: `x = ${s+d} ÷ 2 = ${x}`, hi: `x = ${s+d} ÷ 2 = ${x}` }
    ],
    finalAns: String(x)
  };
}

/* ── 13. Time & Work — Two workers ── */
function genTimeWork() {
  const pairs = [[6,12],[8,12],[10,15],[12,18],[9,18],[6,9],[10,20],[12,24]];
  const [a, b] = pick(pairs);
  const lcm2 = (a*b)/gcd(a,b);
  const wa = lcm2/a, wb = lcm2/b;
  const together = lcm2/(wa+wb);
  const opts = makeOpts(together, [together+1, together-1, together+2]);
  return {
    category: { en: 'Time & Work', hi: 'समय और काम' },
    text: {
      en: `A can complete a piece of work in ${a} days and B in ${b} days. In how many days will they finish it together?`,
      hi: `A एक काम को ${a} दिनों में और B उसे ${b} दिनों में पूरा करता है। दोनों मिलकर कितने दिनों में पूरा करेंगे?`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `A completes 1 work in ${a} days → A's 1-day work = 1/${a}`, hi: `A का 1 दिन का कार्य = 1/${a}` },
      { en: `B completes 1 work in ${b} days → B's 1-day work = 1/${b}`, hi: `B का 1 दिन का कार्य = 1/${b}` },
      { en: `Together per day = 1/${a} + 1/${b} = ${wb+wa}/${lcm2}`, hi: `दोनों का 1 दिन का कार्य = 1/${a} + 1/${b} = ${wa+wb}/${lcm2}` },
      { en: `Days together = ${lcm2} ÷ ${wa+wb} = ${together} days`, hi: `दोनों मिलकर = ${lcm2} ÷ ${wa+wb} = ${together} दिन` }
    ],
    finalAns: together + ' days'
  };
}

/* ── 14. Time & Work — Efficiency (M × D constant) ── */
function genManDays() {
  let m1, d1, m2, d2;
  do {
    m1 = rand(4, 12); d1 = rand(6, 20);
    m2 = m1 + rand(1,6);
    d2 = (m1 * d1) / m2;
  } while (!Number.isInteger(d2));
  const opts = makeOpts(d2, [d2+1, d2-1, d2+2]);
  return {
    category: { en: 'Time & Work', hi: 'समय और काम' },
    text: {
      en: `${m1} workers can finish a job in ${d1} days. How many days will ${m2} workers take to finish the same job?`,
      hi: `${m1} मजदूर एक काम को ${d1} दिनों में पूरा करते हैं। ${m2} मजदूर इसे कितने दिनों में पूरा करेंगे?`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `This is an inverse proportion problem.`, hi: `यह व्युत्क्रम समानुपात का प्रश्न है।` },
      { en: `Total work (man-days) = Men × Days = ${m1} × ${d1} = ${m1*d1}`, hi: `कुल कार्य (मानव-दिवस) = ${m1} × ${d1} = ${m1*d1}` },
      { en: `More workers → Less days`, hi: `ज्यादा मजदूर → कम दिन` },
      { en: `Days = Total Work ÷ New Men = ${m1*d1} ÷ ${m2} = ${d2} days`, hi: `दिन = ${m1*d1} ÷ ${m2} = ${d2} दिन` }
    ],
    finalAns: d2 + ' days'
  };
}

/* ── 15. Speed, Distance, Time — Find Distance ── */
function genSDT_dist() {
  const spd = pick([30,40,45,50,60,72,80,90,100]);
  const hr  = rand(2,8);
  const dist = spd * hr;
  const opts = makeOpts(dist, [dist + rand(20,80), dist - rand(15,60), dist + rand(40,120)]);
  return {
    category: { en: 'Speed, Distance & Time', hi: 'गति, दूरी और समय' },
    text: {
      en: `A train travels at a speed of ${spd} km/h for ${hr} hours. What is the total distance covered?`,
      hi: `एक ट्रेन ${spd} km/h की गति से ${hr} घंटे चलती है। कुल दूरी ज्ञात करें।`
    },
    options: opts.vals.map(v => v + ' km'),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Speed = ${spd} km/h, Time = ${hr} hours`, hi: `दिया: गति = ${spd} km/h, समय = ${hr} घंटे` },
      { en: `Formula: Distance = Speed × Time`, hi: `सूत्र: दूरी = गति × समय` },
      { en: `= ${spd} × ${hr} = ${dist} km`, hi: `= ${spd} × ${hr} = ${dist} km` }
    ],
    finalAns: dist + ' km'
  };
}

/* ── 16. Speed — Find Time ── */
function genSDT_time() {
  const spd  = pick([20,25,30,40,50,60]);
  const mult = rand(2,8);
  const dist = spd * mult;
  const time = mult;
  const opts = makeOpts(time, [time+1, time-1, time+2]);
  return {
    category: { en: 'Speed, Distance & Time', hi: 'गति, दूरी और समय' },
    text: {
      en: `A car covers a distance of ${dist} km at a speed of ${spd} km/h. How much time does it take?`,
      hi: `एक कार ${spd} km/h की गति से ${dist} km की दूरी तय करती है। कितना समय लगेगा?`
    },
    options: opts.vals.map(v => v + ' hours'),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Distance = ${dist} km, Speed = ${spd} km/h`, hi: `दिया: दूरी = ${dist} km, गति = ${spd} km/h` },
      { en: `Formula: Time = Distance ÷ Speed`, hi: `सूत्र: समय = दूरी ÷ गति` },
      { en: `= ${dist} ÷ ${spd} = ${time} hours`, hi: `= ${dist} ÷ ${spd} = ${time} घंटे` }
    ],
    finalAns: time + ' hours'
  };
}

/* ── 17. Simple Interest ── */
function genSI() {
  const P = rand(2,10) * 500;
  const R = pick([4,5,6,8,10,12,15]);
  const T = rand(2,6);
  const SI = (P * R * T) / 100;
  const A  = P + SI;
  const opts = makeOpts(SI, [SI + rand(20,100), SI - rand(20,80), A]);
  return {
    category: { en: 'Simple Interest', hi: 'साधारण ब्याज' },
    text: {
      en: `Principal = ₹${P}, Rate = ${R}% per annum, Time = ${T} years.\nFind the Simple Interest.`,
      hi: `मूलधन = ₹${P}, दर = ${R}% प्रति वर्ष, समय = ${T} वर्ष।\nसाधारण ब्याज ज्ञात करें।`
    },
    options: opts.vals.map(v => '₹' + v),
    correctIndex: opts.idx,
    steps: [
      { en: `P = ₹${P}, R = ${R}%, T = ${T} years`, hi: `P = ₹${P}, R = ${R}%, T = ${T} वर्ष` },
      { en: `Formula: SI = (P × R × T) ÷ 100`, hi: `सूत्र: SI = (P × R × T) ÷ 100` },
      { en: `= (${P} × ${R} × ${T}) ÷ 100`, hi: `= (${P} × ${R} × ${T}) ÷ 100` },
      { en: `= ${P*R*T} ÷ 100 = ₹${SI}`, hi: `= ${P*R*T} ÷ 100 = ₹${SI}` },
      { en: `Amount = P + SI = ${P} + ${SI} = ₹${A}`, hi: `मिश्रधन = ${P} + ${SI} = ₹${A}` }
    ],
    finalAns: '₹' + SI
  };
}

/* ── 18. Compound Interest (2 yrs) ── */
function genCI() {
  const P = rand(2,8) * 1000;
  const R = pick([5,10,15,20]);
  const A = P * Math.pow(1 + R/100, 2);
  const CI = Math.round(A - P);
  const Ar = Math.round(A);
  const opts = makeOpts(CI, [CI + rand(20,80), CI - rand(20,70), Math.round(P*R*2/100)]);
  return {
    category: { en: 'Compound Interest', hi: 'चक्रवृद्धि ब्याज' },
    text: {
      en: `Find the Compound Interest on ₹${P} at ${R}% per annum for 2 years, compounded annually.`,
      hi: `₹${P} पर ${R}% वार्षिक दर से 2 वर्षों का चक्रवृद्धि ब्याज ज्ञात करें।`
    },
    options: opts.vals.map(v => '₹' + v),
    correctIndex: opts.idx,
    steps: [
      { en: `P = ₹${P}, R = ${R}%, T = 2 years`, hi: `P = ₹${P}, R = ${R}%, T = 2 वर्ष` },
      { en: `Formula: A = P × (1 + R/100)ⁿ`, hi: `सूत्र: A = P × (1 + R/100)ⁿ` },
      { en: `= ${P} × (1 + ${R}/100)²`, hi: `= ${P} × (1 + ${R}/100)²` },
      { en: `= ${P} × (${1 + R/100})² = ${P} × ${Math.pow(1+R/100,2).toFixed(4)} = ₹${Ar}`, hi: `= ₹${Ar}` },
      { en: `CI = A − P = ${Ar} − ${P} = ₹${CI}`, hi: `CI = ${Ar} − ${P} = ₹${CI}` }
    ],
    finalAns: '₹' + CI
  };
}

/* ── 19. LCM ── */
function genLCM() {
  const pairs = [[4,6],[6,8],[8,12],[9,12],[6,10],[5,8],[4,14],[6,15]];
  const [a, b] = pick(pairs);
  const l = (a*b)/gcd(a,b);
  const opts = makeOpts(l, [l+rand(2,8), l*2, l-rand(1,4)]);
  return {
    category: { en: 'Number System (LCM)', hi: 'संख्या पद्धति (LCM)' },
    text: {
      en: `Find the Least Common Multiple (LCM) of ${a} and ${b}.`,
      hi: `${a} और ${b} का लघुत्तम समापवर्त्य (LCM) ज्ञात करें।`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Prime factorize ${a}: ${primeFactors(a)}`, hi: `${a} के अभाज्य गुणनखंड: ${primeFactors(a)}` },
      { en: `Prime factorize ${b}: ${primeFactors(b)}`, hi: `${b} के अभाज्य गुणनखंड: ${primeFactors(b)}` },
      { en: `LCM = Highest power of all prime factors`, hi: `LCM = सभी अभाज्य गुणनखंडों की सर्वोच्च घात का गुणनफल` },
      { en: `LCM(${a}, ${b}) = ${l}`, hi: `LCM(${a}, ${b}) = ${l}` },
      { en: `Verify: ${l} ÷ ${a} = ${l/a} ✓  and  ${l} ÷ ${b} = ${l/b} ✓`, hi: `जाँच: ${l} ÷ ${a} = ${l/a} ✓  और  ${l} ÷ ${b} = ${l/b} ✓` }
    ],
    finalAns: String(l)
  };
}
function primeFactors(n) {
  let f = [], d = 2;
  while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; }
  return f.join(' × ');
}

/* ── 20. HCF ── */
function genHCF() {
  const pairs = [[12,18],[15,25],[16,24],[18,27],[20,30],[14,21],[24,36]];
  const [a, b] = pick(pairs);
  const h = gcd(a, b);
  const opts = makeOpts(h, [h+1, h*2, h+3]);
  return {
    category: { en: 'Number System (HCF)', hi: 'संख्या पद्धति (HCF)' },
    text: {
      en: `Find the Highest Common Factor (HCF) of ${a} and ${b}.`,
      hi: `${a} और ${b} का महत्तम समापवर्तक (HCF) ज्ञात करें।`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Factors of ${a}: ${getFactors(a)}`, hi: `${a} के गुणनखंड: ${getFactors(a)}` },
      { en: `Factors of ${b}: ${getFactors(b)}`, hi: `${b} के गुणनखंड: ${getFactors(b)}` },
      { en: `Common factors: pick those in both lists`, hi: `उभयनिष्ठ गुणनखंड: दोनों सूचियों में जो हैं` },
      { en: `HCF = Highest among common factors = ${h}`, hi: `HCF = उभयनिष्ठ गुणनखंडों में सबसे बड़ा = ${h}` }
    ],
    finalAns: String(h)
  };
}
function getFactors(n) {
  const f = [];
  for (let i=1; i<=n; i++) if (n%i===0) f.push(i);
  return f.join(', ');
}

/* ── 21. Area — Rectangle ── */
function genAreaRect() {
  const l = rand(6,30), w = rand(4,20);
  const area = l * w;
  const perim = 2 * (l + w);
  const opts  = makeOpts(area, [area + rand(10,40), l+w, perim]);
  return {
    category: { en: 'Mensuration', hi: 'क्षेत्रमिति' },
    text: {
      en: `A rectangle has length ${l} m and breadth ${w} m. Find its area.`,
      hi: `एक आयत की लंबाई ${l} m और चौड़ाई ${w} m है। उसका क्षेत्रफल ज्ञात करें।`
    },
    options: opts.vals.map(v => v + ' m²'),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Length (l) = ${l} m, Breadth (b) = ${w} m`, hi: `दिया: लंबाई = ${l} m, चौड़ाई = ${w} m` },
      { en: `Formula: Area of Rectangle = l × b`, hi: `सूत्र: आयत का क्षेत्रफल = लंबाई × चौड़ाई` },
      { en: `= ${l} × ${w} = ${area} m²`, hi: `= ${l} × ${w} = ${area} m²` },
      { en: `Perimeter = 2(l + b) = 2(${l}+${w}) = ${perim} m (for reference)`, hi: `परिमाप = 2(${l}+${w}) = ${perim} m (जानकारी के लिए)` }
    ],
    finalAns: area + ' m²'
  };
}

/* ── 22. Area — Circle ── */
function genAreaCircle() {
  const r   = pick([7, 14, 21]);
  const area = Math.round((22/7) * r * r);
  const circ = Math.round(2 * (22/7) * r);
  const opts = makeOpts(area, [area + rand(20,80), circ, area - rand(20,60)]);
  return {
    category: { en: 'Mensuration', hi: 'क्षेत्रमिति' },
    text: {
      en: `Find the area of a circle with radius ${r} cm. (Use π = 22/7)`,
      hi: `${r} cm त्रिज्या वाले वृत्त का क्षेत्रफल ज्ञात करें। (π = 22/7 लें)`
    },
    options: opts.vals.map(v => v + ' cm²'),
    correctIndex: opts.idx,
    steps: [
      { en: `Given: Radius (r) = ${r} cm, π = 22/7`, hi: `दिया: त्रिज्या (r) = ${r} cm, π = 22/7` },
      { en: `Formula: Area = π × r²`, hi: `सूत्र: क्षेत्रफल = π × r²` },
      { en: `= 22/7 × ${r}²`, hi: `= 22/7 × ${r}²` },
      { en: `= 22/7 × ${r*r}`, hi: `= 22/7 × ${r*r}` },
      { en: `= ${(22 * r * r).toFixed(0)} ÷ 7 = ${area} cm²`, hi: `= ${(22*r*r)} ÷ 7 = ${area} cm²` }
    ],
    finalAns: area + ' cm²'
  };
}

/* ── 23. Ages ── */
function genAges() {
  let age, yr, mult, pastAge;
  do {
    age  = rand(12, 35);
    yr   = rand(3, 8);
    mult = rand(2, 4);
    pastAge = age - yr;
  } while (pastAge < 1 || (age + yr) !== mult * pastAge);
  const futureAge = age + yr;
  const opts = makeOpts(age, [age+2, age-2, age+3]);
  return {
    category: { en: 'Ages', hi: 'आयु' },
    text: {
      en: `After ${yr} years, a person's age will be ${mult} times his age ${yr} years ago. Find his present age.`,
      hi: `${yr} वर्ष बाद किसी व्यक्ति की आयु, ${yr} वर्ष पूर्व की आयु की ${mult} गुना होगी। उसकी वर्तमान आयु ज्ञात करें।`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Let present age = x`, hi: `मान लें वर्तमान आयु = x` },
      { en: `Age ${yr} years ago = x − ${yr}`, hi: `${yr} वर्ष पूर्व आयु = x − ${yr}` },
      { en: `Age after ${yr} years = x + ${yr}`, hi: `${yr} वर्ष बाद आयु = x + ${yr}` },
      { en: `Given: x + ${yr} = ${mult}(x − ${yr})`, hi: `शर्त: x + ${yr} = ${mult}(x − ${yr})` },
      { en: `x + ${yr} = ${mult}x − ${mult*yr}`, hi: `x + ${yr} = ${mult}x − ${mult*yr}` },
      { en: `${yr} + ${mult*yr} = ${mult}x − x  →  ${yr+mult*yr} = ${mult-1}x`, hi: `${yr+mult*yr} = ${mult-1}x` },
      { en: `x = ${yr+mult*yr} ÷ ${mult-1} = ${age}`, hi: `x = ${yr+mult*yr} ÷ ${mult-1} = ${age}` }
    ],
    finalAns: String(age) + ' years'
  };
}

/* ── 24. Mixture & Alligation ── */
function genAlligation() {
  const cPrice = rand(20,60);
  const dPrice = cPrice + rand(10,30);
  const mean   = cPrice + rand(2, dPrice - cPrice - 1);
  const ratC   = dPrice - mean;
  const ratD   = mean - cPrice;
  const qC     = ratC * rand(2,6);
  const qD     = ratD * (qC / ratC);
  const opts   = makeOpts(qD, [qD + rand(5,20), qD - rand(5,15), qD + ratD]);
  return {
    category: { en: 'Mixture & Alligation', hi: 'मिश्रण और एलिगेशन' },
    text: {
      en: `Two varieties of rice priced at ₹${cPrice}/kg and ₹${dPrice}/kg are mixed to get a mixture at ₹${mean}/kg.\nIf ${qC} kg of cheaper variety is taken, how many kg of dearer variety is needed?`,
      hi: `₹${cPrice}/kg और ₹${dPrice}/kg वाले दो प्रकार के चावल मिलाकर ₹${mean}/kg की मिश्रण बनाई जाती है।\nयदि ${qC} kg सस्ती किस्म ली जाए, तो महँगी किस्म कितनी चाहिए?`
    },
    options: opts.vals.map(v => v + ' kg'),
    correctIndex: opts.idx,
    steps: [
      { en: `Alligation Rule: Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)`, hi: `एलिगेशन नियम: सस्ता : महँगा = (महँगा − माध्य) : (माध्य − सस्ता)` },
      { en: `= (${dPrice} − ${mean}) : (${mean} − ${cPrice}) = ${ratC} : ${ratD}`, hi: `= ${ratC} : ${ratD}` },
      { en: `So mix ${ratC} kg cheap with ${ratD} kg dear`, hi: `अतः ${ratC} kg सस्ते के साथ ${ratD} kg महँगा मिलाएँ` },
      { en: `For ${qC} kg cheap → Dear needed = ${qC} × ${ratD} ÷ ${ratC} = ${qD} kg`, hi: `${qC} kg सस्ते के लिए → महँगा = ${qC} × ${ratD} ÷ ${ratC} = ${qD} kg` }
    ],
    finalAns: qD + ' kg'
  };
}

/* ── 25. Number Pattern / Series ── */
function genSeries() {
  const start = rand(2,15), diff = rand(3,8);
  const series = Array.from({length:5}, (_,i) => start + diff*i);
  const next   = start + diff * 5;
  const opts   = makeOpts(next, [next + diff, next - diff, next + rand(1,3)]);
  return {
    category: { en: 'Number Series', hi: 'संख्या श्रृंखला' },
    text: {
      en: `Find the next number in the series:\n${series.join(', ')}, ?`,
      hi: `श्रृंखला में अगली संख्या ज्ञात करें:\n${series.join(', ')}, ?`
    },
    options: opts.vals.map(String),
    correctIndex: opts.idx,
    steps: [
      { en: `Series: ${series.join(', ')}`, hi: `श्रृंखला: ${series.join(', ')}` },
      { en: `Difference: ${series[1]}-${series[0]}=${diff}, ${series[2]}-${series[1]}=${diff}, ... (constant difference = ${diff})`, hi: `अंतर: हर बार ${diff} (समान्तर श्रेढ़ी)` },
      { en: `This is an Arithmetic Progression (AP)`, hi: `यह एक समान्तर श्रेढ़ी (AP) है` },
      { en: `Next term = Last term + Common Difference = ${series[4]} + ${diff} = ${next}`, hi: `अगला पद = ${series[4]} + ${diff} = ${next}` }
    ],
    finalAns: String(next)
  };
}

// ── Helper: create shuffled options ensuring ans is included ──
function makeOpts(ans, wrongs) {
  const cleaned = wrongs.map(w => {
    let v = Math.round(w);
    return v === Math.round(ans) ? v + rand(3,7) : v;
  });
  const four = [Math.round(ans), ...cleaned.slice(0,3)];
  const shuffled = shuffle(four);
  return { vals: shuffled, idx: shuffled.indexOf(Math.round(ans)) };
}

// ── All generators pool ────────────────────────────────────
const GENERATORS = [
  genPctBasic, genWhatPct, genPctChange,
  genProfitLoss, genFindPL,
  genRatioDiv,
  genAvg, genNewAvg,
  genBODMAS, genFraction,
  genLinear, genTwoVar,
  genTimeWork, genManDays,
  genSDT_dist, genSDT_time,
  genSI, genCI,
  genLCM, genHCF,
  genAreaRect, genAreaCircle,
  genAges, genAlligation, genSeries
];

// ── Generate 25 questions (1 per generator, shuffled order) ──
function generateQuestions() {
  const shuffled = shuffle(GENERATORS);
  const out = [];
  for (let i = 0; i < 25; i++) {
    let q, tries = 0;
    do { try { q = shuffled[i](); } catch(e){ q = null; } tries++; }
    while (!q && tries < 8);
    if (q) out.push(q);
  }
  return out;
}

// ══════════════════════════════════════════════════
//   SCREEN MANAGEMENT
// ══════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  window.scrollTo(0,0);
}

// ── Start Test ─────────────────────────────────────
function startTest() {
  allQuestions = generateQuestions();
  userAnswers  = new Array(25).fill(-1);
  currentIndex = 0;
  secondsLeft  = 30 * 60;

  buildDots();
  showScreen('screen-quiz');
  renderQuestion();
  startTimer();
  applyLangToDOM();
}

// ── Question Dots ──────────────────────────────────
function buildDots() {
  const wrap = document.getElementById('q-dots');
  wrap.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const d = document.createElement('div');
    d.className = 'q-dot';
    d.textContent = i + 1;
    d.id = `dot-${i}`;
    wrap.appendChild(d);
  }
}

function updateDot(i, state) {
  const d = document.getElementById(`dot-${i}`);
  if (!d) return;
  d.className = 'q-dot ' + state;
}

// ── Render Question ────────────────────────────────
function renderQuestion() {
  const q   = allQuestions[currentIndex];
  const txt = q.text[currentLang] || q.text.en;
  const cat = q.category[currentLang] || q.category.en;

  document.getElementById('q-counter').textContent  = `Q ${currentIndex+1} / 25`;
  document.getElementById('q-category').textContent = cat;
  document.getElementById('q-text').textContent     = txt;
  document.getElementById('progress-bar').style.width = `${((currentIndex+1)/25)*100}%`;

  const answered = userAnswers.filter(a => a !== -1).length;
  document.getElementById('answered-count').innerHTML =
    `<span data-en="Answered:" data-hi="उत्तरित:">${t('answered')}</span> ${answered}/25`;

  // Marks badge
  document.getElementById('q-marks-badge') &&
    (document.getElementById('q-marks-badge').textContent = t('marks'));

  // Update Next/Submit label
  const nextLabel = document.getElementById('next-label');
  if (nextLabel) nextLabel.textContent = currentIndex === 24 ? t('submit') : t('next');

  // Options
  const grid   = document.getElementById('options-grid');
  grid.innerHTML = '';
  const labels = ['A','B','C','D'];
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-label">${labels[idx]}</span><span class="opt-text">${opt}</span>`;
    btn.onclick   = () => selectOption(idx);
    if (userAnswers[currentIndex] === idx) btn.classList.add('selected');
    grid.appendChild(btn);
  });

  document.getElementById('btn-next').disabled = userAnswers[currentIndex] === -1;

  // If already answered/skipped, lock options
  if (userAnswers[currentIndex] >= 0)  lockOptions(userAnswers[currentIndex], q.correctIndex);
  if (userAnswers[currentIndex] === -2) {
    document.getElementById('btn-next').disabled = false;
  }

  // Dots
  for (let i = 0; i < 25; i++) {
    const ans = userAnswers[i];
    const state = i === currentIndex ? 'active'
      : ans === -1  ? ''
      : ans === -2  ? 'skipped'
      : ans === allQuestions[i].correctIndex ? 'answered'
      : 'wrong';
    updateDot(i, state);
  }
}

// ── Select Option ──────────────────────────────────
function selectOption(idx) {
  if (userAnswers[currentIndex] !== -1) return;
  userAnswers[currentIndex] = idx;
  const q = allQuestions[currentIndex];
  const answered = userAnswers.filter(a => a !== -1).length;
  document.getElementById('answered-count').innerHTML =
    `<span>${t('answered')}</span> ${answered}/25`;
  lockOptions(idx, q.correctIndex);
  document.getElementById('btn-next').disabled = false;
  updateDot(currentIndex, idx === q.correctIndex ? 'answered' : 'wrong');
}

function lockOptions(chosen, correct) {
  document.querySelectorAll('#options-grid .option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    if (i === chosen && chosen !== correct) btn.classList.add('wrong');
  });
}

// ── Skip Question ──────────────────────────────────
function skipQuestion() {
  if (userAnswers[currentIndex] !== -1) return;
  userAnswers[currentIndex] = -2;
  updateDot(currentIndex, 'skipped');
  document.getElementById('btn-next').disabled = false;
  if (currentIndex < 24) { currentIndex++; renderQuestion(); }
  else endTest();
}

// ── Next Question ──────────────────────────────────
function nextQuestion() {
  if (currentIndex < 24) {
    currentIndex++;
    renderQuestion();
    const card = document.getElementById('question-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  } else {
    endTest();
  }
}

// ── Timer ──────────────────────────────────────────
function startTimer() {
  clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimer();
    if (secondsLeft <= 0) { clearInterval(timerInterval); endTest(); }
  }, 1000);
}

function updateTimer() {
  const m   = Math.floor(secondsLeft/60).toString().padStart(2,'0');
  const s   = (secondsLeft%60).toString().padStart(2,'0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;

  const pct    = (secondsLeft / (30*60)) * 100;
  const fill   = document.getElementById('ring-fill');
  const offset = 100 - pct;
  if (fill) fill.style.strokeDashoffset = offset;

  const wrap = document.getElementById('timer-wrap');
  if (wrap) {
    wrap.className = 'timer-wrap';
    if (secondsLeft <= 60)        wrap.classList.add('danger');
    else if (secondsLeft <= 300)  wrap.classList.add('warning');
  }
}

// ── End Test ───────────────────────────────────────
function endTest() {
  clearInterval(timerInterval);

  const correct = allQuestions.filter((q,i) => userAnswers[i] === q.correctIndex).length;
  const wrong   = allQuestions.filter((q,i) => userAnswers[i] >= 0 && userAnswers[i] !== q.correctIndex).length;
  const skipped = allQuestions.filter((_,i) => userAnswers[i] === -1 || userAnswers[i] === -2).length;

  document.getElementById('score-num').textContent     = correct;
  document.getElementById('correct-count').textContent = correct;
  document.getElementById('wrong-count').textContent   = wrong;
  document.getElementById('skip-count').textContent    = skipped;

  // Score ring animation
  const circumference = 326.7;
  const pct = (correct / 25) * 100;
  setTimeout(() => {
    const fill = document.getElementById('sr-fill');
    if (fill) fill.style.strokeDashoffset = circumference - (circumference * pct / 100);
  }, 200);

  // Grade
  const grade = document.getElementById('grade-banner');
  if (pct >= 80)      { grade.textContent = t('excellent'); grade.style.cssText='background:#dcfce7;color:#15803d;'; }
  else if (pct >= 60) { grade.textContent = t('good');      grade.style.cssText='background:#dbeafe;color:#1552a0;'; }
  else if (pct >= 40) { grade.textContent = t('average');   grade.style.cssText='background:#fef3c7;color:#b45309;'; }
  else                { grade.textContent = t('poor');       grade.style.cssText='background:#fee2e2;color:#c81e1e;'; }

  // Update label strings
  document.querySelectorAll('[data-en]').forEach(el => {
    const attr = `data-${currentLang}`;
    if (el.hasAttribute(attr)) el.textContent = el.getAttribute(attr);
  });

  renderSolutions();
  showScreen('screen-result');
}

// ── Render Solutions ───────────────────────────────
function renderSolutions() {
  const labels  = ['A','B','C','D'];
  const section = document.getElementById('solutions-section');
  section.innerHTML = '';

  // section title
  const titleEl = document.getElementById('solutions-wrap')?.querySelector('.sol-section-title');
  if (titleEl) titleEl.textContent = t('solTitle');

  allQuestions.forEach((q, i) => {
    const ua       = userAnswers[i];
    const isCorrect = ua === q.correctIndex;
    const isSkipped = ua === -1 || ua === -2;
    const statusIcon = isSkipped ? '⏭' : isCorrect ? '✅' : '❌';

    const card = document.createElement('div');
    card.className = 'sol-card';
    card.style.animationDelay = `${i * 0.03}s`;

    const qText   = q.text[currentLang]  || q.text.en;
    const yourAns = isSkipped
      ? `<em>${t('notAtt')}</em>`
      : `${labels[ua]}. ${q.options[ua]}`;

    // Build step-by-step HTML
    const stepsHTML = q.steps.map((step, si) => {
      const txt = step[currentLang] || step.en;
      return `<div class="sol-step">
        <span class="step-num">${si+1}</span>
        <span class="step-text">${txt}</span>
      </div>`;
    }).join('');

    card.innerHTML = `
      <div class="sol-header">
        <span class="sol-num">Q ${i+1}</span>
        <span class="sol-q">${statusIcon} ${qText}</span>
      </div>
      <div class="sol-answers">
        <span class="ans-chip your-ans ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'wrong'}">
          ${t('yourAns')} ${yourAns}
        </span>
        <span class="ans-chip correct-ans">
          ${t('corrAns')} ${labels[q.correctIndex]}. ${q.options[q.correctIndex]}
        </span>
      </div>
      <div class="sol-steps">
        <div class="sol-steps-title">🔢 ${t('stepHead')}</div>
        ${stepsHTML}
        <div class="final-answer">${t('finalAns')} ${q.finalAns}</div>
      </div>
    `;

    section.appendChild(card);
  });
}

// ── Print ──────────────────────────────────────────
function printResult() { window.print(); }

// ── Play Again ─────────────────────────────────────
function playAgain() { showScreen('screen-home'); }
