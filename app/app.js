const PAS_KEY = "pas_v1_days";

const PILLARS = [
  {
    id: "econ",
    title: "Economic Stability",
    questions: [
      "Avoided unnecessary spending today",
      "Did one income-strengthening action (skill/outreach/performance)",
      "Followed my money plan for 5+ minutes (budget/debt/savings)"
    ],
    positives: {
      3: "You advanced your financial control today. Keep reinforcing this discipline.",
      2: "You held the line. One more push tomorrow turns stability into progress.",
      1: "You showed awareness by scoring honestly. Tomorrow, tighten one money behavior.",
      0: "Today was financially misaligned. Reset tomorrow with one clear money action."
    },
    actions: {
      3: "Repeat the same pattern tomorrow. Protect momentum.",
      2: "Add one 10-minute money action tomorrow (budget review or extra savings).",
      1: "Choose one: no spend today OR 10-minute budget OR make a debt payment.",
      0: "Tomorrow: 10-minute budget + no unnecessary spending. Keep it simple."
    }
  },
  {
    id: "intel",
    title: "Intellectual Development",
    questions: [
      "Completed 30+ minutes of serious learning/reading",
      "Limited low-value scrolling/TV to ≤ 30 minutes (outside work)",
      "Wrote one insight or question that improved judgment"
    ],
    positives: {
      3: "You trained your mind today. Strong judgment is built like muscle.",
      2: "You maintained mental standards. Add one deliberate learning block tomorrow.",
      1: "You see the gap clearly. Tomorrow, protect your attention and rebuild.",
      0: "Your attention was captured today. Tomorrow, reclaim it with one focused block."
    },
    actions: {
      3: "Keep the same routine. Add one page of notes.",
      2: "Tomorrow: 30 minutes learning + write one takeaway.",
      1: "Tomorrow: 30 minutes reading OR one lecture + one written insight.",
      0: "Tomorrow: 20–30 minutes learning before any social media."
    }
  },
  {
    id: "social",
    title: "Social & Relational Strength",
    questions: [
      "Strengthened one relationship with a positive interaction",
      "Avoided one draining person/place/situation",
      "Contributed without seeking validation"
    ],
    positives: {
      3: "You built strong social ground today. Relationships are infrastructure.",
      2: "You protected your energy. One intentional connection tomorrow increases leverage.",
      1: "You noticed the drain. Tomorrow, choose one relationship and invest deliberately.",
      0: "Your social environment pulled you off course today. Tomorrow, reset boundaries."
    },
    actions: {
      3: "Repeat: one meaningful call/text and one boundary kept.",
      2: "Tomorrow: send one purposeful message to a stable, forward-moving person.",
      1: "Tomorrow: avoid one draining interaction and replace it with a positive one.",
      0: "Tomorrow: set one boundary (leave early / don’t go / don’t engage)."
    }
  },
  {
    id: "disc",
    title: "Discipline & Health",
    questions: [
      "Completed 30+ minutes movement (walk/workout/active chores)",
      "Protected sleep / avoided late-night sabotage (or moved toward it)",
      "Kept one promise to myself (even small)"
    ],
    positives: {
      3: "You strengthened your body and self-trust today. This fuels everything else.",
      2: "You stayed functional. One extra disciplined choice tomorrow creates momentum.",
      1: "You’re not lying to yourself. Tomorrow: one health action, done early.",
      0: "Today weakened your foundation. Tomorrow: one simple reset and follow through."
    },
    actions: {
      3: "Keep it identical tomorrow. Consistency beats intensity.",
      2: "Tomorrow: add either 10 more minutes movement or a stricter bedtime.",
      1: "Tomorrow: 30-minute walk OR lights out 45 minutes earlier.",
      0: "Tomorrow: 20–30 minutes walking + no late-night sabotage."
    }
  },
  {
    id: "agency",
    title: "Agency & Intentionality",
    questions: [
      "Made one long-term decision (not impulse)",
      "Planned tomorrow in writing (top 3 priorities)",
      "Said “no” to something that weakens my future"
    ],
    positives: {
      3: "You acted with self-command today. This is what agency looks like.",
      2: "You resisted some drift. One more intentional decision tomorrow strengthens control.",
      1: "You see the pattern. Tomorrow, insert one pause before a key decision.",
      0: "Today was reactive. Tomorrow, reclaim control with one written plan and one ‘no’."
    },
    actions: {
      3: "Repeat: written top-3 + one ‘no’ + one long-term decision.",
      2: "Tomorrow: write top-3 priorities and enforce them.",
      1: "Tomorrow: before spending or social plans, pause and choose long-term.",
      0: "Tomorrow: write top-3, and say ‘no’ to one harmful option."
    }
  }
];

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function parseISO(s) {
  return new Date(s + "T00:00:00");
}

function fmtDate(d) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}

function startOfWeekISO(iso) {
  const d = parseISO(iso);
  const day = d.getDay(); // 0 Sun - 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  return fmtDate(d);
}

function avg(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function agencyScoreFromTotal(total) {
  return Math.round((total / 15) * 100);
}

function loadDays() {
  try {
    return JSON.parse(localStorage.getItem(PAS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDays(days) {
  localStorage.setItem(PAS_KEY, JSON.stringify(days));
}

function getColor(score) {
  if (score === 3) return { name: "Green", cls: "green" };
  if (score === 2) return { name: "Yellow", cls: "yellow" };
  if (score === 1) return { name: "Orange", cls: "orange" };
  return { name: "Red", cls: "red" };
}

function overallColor(total) {
  if (total >= 13) return { name: "Green", cls: "green" };
  if (total >= 10) return { name: "Yellow", cls: "yellow" };
  if (total >= 6) return { name: "Orange", cls: "orange" };
  return { name: "Red", cls: "red" };
}

function csvSafe(s) {
  return `"${String(s || "").replace(/"/g, '""')}"`;
}

const elDate = document.getElementById("date");
const elPillars = document.getElementById("pillars");
const elOverallScore = document.getElementById("overallScore");
const elDailyAgencyScore = document.getElementById("dailyAgencyScore");
const elOverallBadge = document.getElementById("overallColorBadge");
const elWin = document.getElementById("winToday");
const elFix = document.getElementById("fixTomorrow");
const elStatus = document.getElementById("saveStatus");
const elHistory = document.getElementById("history");

const viewDaily = document.getElementById("viewDaily");
const viewWeekly = document.getElementById("viewWeekly");
const tabDaily = document.getElementById("tabDaily");
const tabWeekly = document.getElementById("tabWeekly");
const elWeekStart = document.getElementById("weekStart");
const elWeekEnd = document.getElementById("weekEnd");
const btnThisWeek = document.getElementById("btnThisWeek");
const btnLastWeek = document.getElementById("btnLastWeek");
const btnPDF = document.getElementById("btnPDF");
const weeklyStatus = document.getElementById("weeklyStatus");
const weeklyDaysEl = document.getElementById("weeklyDays");
const overallChart = document.getElementById("overallChart");
const pillarChart = document.getElementById("pillarChart");
const overallCountsEl = document.getElementById("overallCounts");
const pillarAveragesEl = document.getElementById("pillarAverages");
const weeklyAgencyScoreEl = document.getElementById("weeklyAgencyScore");
const weeklyAgencySubEl = document.getElementById("weeklyAgencySub");
const weeklyStreakEl = document.getElementById("weeklyStreak");
const weeklyStreakSubEl = document.getElementById("weeklyStreakSub");

function pillarHTML(p) {
  return `
    <div class="pillar" data-pillar="${p.id}">
      <h3>${p.title}</h3>
      ${p.questions.map((q, i) => `
        <label>
          <input type="checkbox" id="${p.id}_q${i}" />
          ${q}
        </label>
      `).join("")}
      <div style="margin-top:10px;">
        <div class="label">Score</div>
        <div><strong><span class="pillarScore">0</span>/3</strong></div>
        <div class="badge gray pillarBadge">—</div>
      </div>
      <div style="margin-top:10px;">
        <div class="label">Positive</div>
        <div class="pillarPositive small muted">—</div>
      </div>
      <div style="margin-top:10px;">
        <div class="label">Action</div>
        <div class="pillarAction small muted">—</div>
      </div>
    </div>
  `;
}

function renderPillars() {
  elPillars.innerHTML = PILLARS.map(pillarHTML).join("");
  PILLARS.forEach(p => {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`${p.id}_q${i}`).addEventListener("change", recompute);
    }
  });
}

function getDayDraft() {
  const date = elDate.value;
  const draft = {
    date,
    pillars: {},
    winToday: elWin.value || "",
    fixTomorrow: elFix.value || ""
  };

  let total = 0;

  PILLARS.forEach(p => {
    const checks = [0, 1, 2].map(i =>
      document.getElementById(`${p.id}_q${i}`).checked ? 1 : 0
    );
    const score = checks.reduce((a, b) => a + b, 0);
    total += score;
    draft.pillars[p.id] = {
      score,
      checks,
      color: getColor(score).name
    };
  });

  draft.total = total;
  draft.overall = overallColor(total).name;
  draft.agencyScore = agencyScoreFromTotal(total);

  return draft;
}

function applyDay(day) {
  elDate.value = day?.date || todayISO();
  elWin.value = day?.winToday || "";
  elFix.value = day?.fixTomorrow || "";

  PILLARS.forEach(p => {
    const saved = day?.pillars?.[p.id];
    for (let i = 0; i < 3; i++) {
      document.getElementById(`${p.id}_q${i}`).checked = saved ? !!saved.checks[i] : false;
    }
  });

  recompute();
}

function recompute() {
  const draft = getDayDraft();
  let total = 0;

  PILLARS.forEach(p => {
    const box = document.querySelector(`.pillar[data-pillar="${p.id}"]`);
    const score = draft.pillars[p.id].score;
    total += score;

    const c = getColor(score);

    box.querySelector(".pillarScore").textContent = String(score);

    const badgeEl = box.querySelector(".pillarBadge");
    badgeEl.textContent = c.name;
    badgeEl.className = `badge ${c.cls} pillarBadge`;

    box.querySelector(".pillarPositive").textContent = p.positives[score];
    box.querySelector(".pillarAction").textContent = p.actions[score];
  });

  elOverallScore.textContent = String(total);
  elDailyAgencyScore.textContent = String(agencyScoreFromTotal(total));

  const oc = overallColor(total);
  elOverallBadge.textContent = oc.name;
  elOverallBadge.className = `badge ${oc.cls}`;
}

function upsertDay(day) {
  const days = loadDays();
  const idx = days.findIndex(d => d.date === day.date);
  if (idx >= 0) {
    days[idx] = day;
  } else {
    days.push(day);
  }
  saveDays(days);
}

function clearDayUI() {
  PILLARS.forEach(p => {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`${p.id}_q${i}`).checked = false;
    }
  });
  elWin.value = "";
  elFix.value = "";
  recompute();
}

function renderHistory() {
  const days = loadDays()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  if (!days.length) {
    elHistory.innerHTML = `<div class="muted small">No entries yet. Save your first day.</div>`;
    return;
  }

  elHistory.innerHTML = days.map(d => {
    const oc = overallColor(d.total);
    return `
      <div class="history-item">
        <strong>${d.date}</strong> — ${d.total}/15 — ${d.agencyScore || agencyScoreFromTotal(d.total)}/100
        <span class="badge ${oc.cls}" style="margin-left:8px;">${oc.name}</span>
        <button data-load="${d.date}" style="margin-left:8px;">Load</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll("button[data-load]").forEach(btn => {
    btn.addEventListener("click", () => {
      const date = btn.getAttribute("data-load");
      const day = loadDays().find(x => x.date === date);
      applyDay(day);
      switchView("daily");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function exportCSV() {
  const days = loadDays().sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) {
    elStatus.textContent = "Nothing to export yet.";
    return;
  }

  const header = [
    "date", "total", "agencyScore", "overall",
    ...PILLARS.flatMap(p => [
      `${p.id}_score`, `${p.id}_color`, `${p.id}_q1`, `${p.id}_q2`, `${p.id}_q3`
    ]),
    "winToday", "fixTomorrow"
  ];

  const rows = days.map(d => {
    const base = [d.date, d.total, d.agencyScore || agencyScoreFromTotal(d.total), d.overall];
    const pillarCols = PILLARS.flatMap(p => {
      const pv = d.pillars?.[p.id] || { score: 0, color: "Red", checks: [0, 0, 0] };
      return [pv.score, pv.color, ...pv.checks];
    });
    return [...base, ...pillarCols, csvSafe(d.winToday), csvSafe(d.fixTomorrow)];
  });

  const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "PAS_export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  elStatus.textContent = "Exported PAS_export.csv";
}

function getRangeDays(startISO, endISO) {
  return loadDays()
    .filter(d => d.date >= startISO && d.date <= endISO)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function computeWeeklyMetrics(daysInRange) {
  const overallCounts = { Green: 0, Yellow: 0, Orange: 0, Red: 0 };
  const pillarSum = {};
  const pillarCount = {};

  PILLARS.forEach(p => {
    pillarSum[p.id] = 0;
    pillarCount[p.id] = 0;
  });

  daysInRange.forEach(d => {
    overallCounts[d.overall] = (overallCounts[d.overall] || 0) + 1;

    PILLARS.forEach(p => {
      const pv = d.pillars?.[p.id];
      if (pv && typeof pv.score === "number") {
        pillarSum[p.id] += pv.score;
        pillarCount[p.id] += 1;
      }
    });
  });

  const pillarAvg = {};
  PILLARS.forEach(p => {
    pillarAvg[p.id] = pillarCount[p.id] ? (pillarSum[p.id] / pillarCount[p.id]) : 0;
  });

  return { overallCounts, pillarAvg };
}

function drawBarChart(canvas, labels, values, maxValue) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const pad = 30;
  const chartW = W - pad * 2;
  const chartH = H - pad * 2;
  const barGap = 16;
  const barW = (chartW - barGap * (labels.length - 1)) / labels.length;

  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + chartH);
  ctx.lineTo(pad + chartW, pad + chartH);
  ctx.stroke();

  for (let i = 0; i < labels.length; i++) {
    const value = values[i];
    const h = maxValue ? (value / maxValue) * chartH : 0;
    const x = pad + i * (barW + barGap);
    const y = pad + chartH - h;

    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.fillRect(x, y, barW, h);

    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      Number.isInteger(value) ? String(value) : value.toFixed(2),
      x + barW / 2,
      y - 6
    );

    ctx.fillStyle = "rgba(255,255,255,.6)";
    ctx.fillText(labels[i], x + barW / 2, pad + chartH + 18);
  }
}

function getWeekRange(weekStartISO) {
  return { start: weekStartISO, end: addDays(weekStartISO, 6) };
}

function weeklyAverageScore(weekStartISO) {
  const r = getWeekRange(weekStartISO);
  const days = getRangeDays(r.start, r.end);
  const scores = days.map(d => d.agencyScore || agencyScoreFromTotal(d.total));
  return { avgScore: avg(scores), daysCount: days.length, range: r };
}

function computeWeeklyStreak() {
  const all = loadDays();
  if (!all.length) {
    return { current: 0, best: 0, thisWeekAvg: 0, thisWeekDays: 0 };
  }

  const thisWeekStart = startOfWeekISO(todayISO());
  const weeks = [];

  for (let i = 0; i < 52; i++) {
    const ws = addDays(thisWeekStart, -7 * i);
    const w = weeklyAverageScore(ws);
    if (w.daysCount > 0) weeks.push({ weekStart: ws, ...w });
  }

  if (!weeks.length) {
    return { current: 0, best: 0, thisWeekAvg: 0, thisWeekDays: 0 };
  }

  let current = 0;
  for (let i = 0; i < weeks.length - 1; i++) {
    if (weeks[i].avgScore >= weeks[i + 1].avgScore + 1) current += 1;
    else break;
  }

  let best = 0;
  let run = 0;
  for (let i = 0; i < weeks.length - 1; i++) {
    if (weeks[i].avgScore >= weeks[i + 1].avgScore + 1) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  return {
    current,
    best,
    thisWeekAvg: weeks[0].avgScore,
    thisWeekDays: weeks[0].daysCount
  };
}

function renderWeekly() {
  const start = elWeekStart.value;
  const end = elWeekEnd.value;

  if (!start || !end) {
    weeklyStatus.textContent = "Pick a week start and end date.";
    return;
  }

  if (end < start) {
    weeklyStatus.textContent = "End date must be after start date.";
    return;
  }

  const daysInRange = getRangeDays(start, end);
  const { overallCounts, pillarAvg } = computeWeeklyMetrics(daysInRange);

  const dayScores = daysInRange.map(d => d.agencyScore || agencyScoreFromTotal(d.total));
  const weeklyAvgScore = avg(dayScores);

  weeklyAgencyScoreEl.textContent = daysInRange.length ? Math.round(weeklyAvgScore) : "—";
  weeklyAgencySubEl.textContent = daysInRange.length
    ? `Average across ${daysInRange.length} day(s) in range`
    : "No days logged in this range";

  const streak = computeWeeklyStreak();
  weeklyStreakEl.textContent = String(streak.current);
  weeklyStreakSubEl.textContent = `Best: ${streak.best} • This week avg: ${Math.round(streak.thisWeekAvg)}/100 (${streak.thisWeekDays} day(s))`;

  const overallLabels = ["Green", "Yellow", "Orange", "Red"];
  const overallValues = overallLabels.map(k => overallCounts[k] || 0);
  drawBarChart(overallChart, overallLabels, overallValues, Math.max(1, ...overallValues));

  overallCountsEl.innerHTML = overallLabels
    .map(k => `<span class="badge ${k.toLowerCase()}" style="margin-right:8px;">${k}: ${overallCounts[k] || 0}</span>`)
    .join("");

  const pillarLabels = PILLARS.map(p => p.title.split(" ").slice(0, 2).join(" "));
  const pillarValues = PILLARS.map(p => pillarAvg[p.id] || 0);
  drawBarChart(pillarChart, pillarLabels, pillarValues, 3);

  pillarAveragesEl.innerHTML = PILLARS
    .map(p => `<span class="badge gray" style="margin-right:8px;">${p.title}: ${(pillarAvg[p.id] || 0).toFixed(2)}/3</span>`)
    .join("");

  if (!daysInRange.length) {
    weeklyDaysEl.innerHTML = `<div class="muted small">No saved days in this range.</div>`;
  } else {
    weeklyDaysEl.innerHTML = daysInRange.map(d => `
      <div class="history-item">
        <strong>${d.date}</strong> — ${d.total}/15 — ${(d.agencyScore || agencyScoreFromTotal(d.total))}/100
        <span class="badge ${overallColor(d.total).cls}" style="margin-left:8px;">${d.overall}</span>
      </div>
    `).join("");
  }

  weeklyStatus.textContent = `Showing ${daysInRange.length} saved day(s) from ${start} to ${end}.`;
}

function buildWeeklyPDF() {
  const start = elWeekStart.value;
  const end = elWeekEnd.value;

  if (!start || !end) {
    weeklyStatus.textContent = "Pick a week start and end date.";
    return;
  }

  const daysInRange = getRangeDays(start, end);
  const { overallCounts, pillarAvg } = computeWeeklyMetrics(daysInRange);
  const scores = daysInRange.map(d => d.agencyScore || agencyScoreFromTotal(d.total));
  const weeklyAvgScore = avg(scores);
  const streak = computeWeeklyStreak();

  const jsPDFCtor = window.jspdf && window.jspdf.jsPDF;
  if (!jsPDFCtor) {
    weeklyStatus.textContent = "PDF library not loaded.";
    return;
  }

  const doc = new jsPDFCtor({ unit: "pt", format: "letter" });
  const margin = 48;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Personal Agency Scorecard (PAS) — Weekly Report", margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Range: ${start} to ${end}`, margin, y);
  y += 16;
  doc.text(`Days recorded: ${daysInRange.length}`, margin, y);
  y += 16;
  doc.text(`Weekly Agency Score: ${daysInRange.length ? Math.round(weeklyAvgScore) : 0}/100`, margin, y);
  y += 16;
  doc.text(`Weekly improvement streak: ${streak.current} week(s) • Best: ${streak.best}`, margin, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Overall Color Counts", margin, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.text(
    `Green: ${overallCounts.Green || 0}    Yellow: ${overallCounts.Yellow || 0}    Orange: ${overallCounts.Orange || 0}    Red: ${overallCounts.Red || 0}`,
    margin,
    y
  );
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Pillar Averages (0–3)", margin, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  PILLARS.forEach(p => {
    doc.text(`${p.title}: ${(pillarAvg[p.id] || 0).toFixed(2)}/3`, margin, y);
    y += 14;
  });

  y += 10;

  const bestPillar = [...PILLARS].sort((a, b) => (pillarAvg[b.id] || 0) - (pillarAvg[a.id] || 0))[0];
  const worstPillar = [...PILLARS].sort((a, b) => (pillarAvg[a.id] || 0) - (pillarAvg[b.id] || 0))[0];

  doc.setFont("helvetica", "bold");
  doc.text("Weekly Signals", margin, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.text(`Strongest pillar: ${bestPillar.title} (${(pillarAvg[bestPillar.id] || 0).toFixed(2)}/3)`, margin, y);
  y += 14;
  doc.text(`Weakest pillar: ${worstPillar.title} (${(pillarAvg[worstPillar.id] || 0).toFixed(2)}/3)`, margin, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.text("One Focus for Next Week", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.text(`Choose ${worstPillar.title}. Aim to convert one Orange/Red day to Yellow/Green.`, margin, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Days in Range", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");

  const lines = daysInRange.map(d =>
    `${d.date} — ${d.total}/15 — ${(d.agencyScore || agencyScoreFromTotal(d.total))}/100 — ${d.overall}`
  );

  const wrapped = doc.splitTextToSize(lines.join("\n"), 520);
  doc.text(wrapped, margin, y);

  doc.save(`PAS_Weekly_Report_${start}_to_${end}.pdf`);
  weeklyStatus.textContent = "Downloaded weekly PDF report.";
}

function switchView(which) {
  if (which === "weekly") {
    viewDaily.classList.add("hidden");
    viewWeekly.classList.remove("hidden");
    renderWeekly();
  } else {
    viewWeekly.classList.add("hidden");
    viewDaily.classList.remove("hidden");
  }
}

document.getElementById("btnSave").addEventListener("click", () => {
  const draft = getDayDraft();
  if (!draft.date) {
    elStatus.textContent = "Pick a date first.";
    return;
  }

  upsertDay(draft);
  renderHistory();
  renderWeekly();
  elStatus.textContent = `Saved: ${draft.date} (${draft.total}/15 • ${draft.agencyScore}/100 • ${draft.overall})`;
});

document.getElementById("btnReset").addEventListener("click", () => {
  clearDayUI();
  elStatus.textContent = "Cleared this day (not deleted from history unless you save).";
});

document.getElementById("btnToday").addEventListener("click", () => {
  const date = todayISO();
  const existing = loadDays().find(d => d.date === date);
  applyDay(existing || { date });
  elStatus.textContent = "Loaded today.";
});

document.getElementById("btnExport").addEventListener("click", exportCSV);

tabDaily.addEventListener("click", () => switchView("daily"));
tabWeekly.addEventListener("click", () => switchView("weekly"));

btnThisWeek.addEventListener("click", () => {
  const s = startOfWeekISO(todayISO());
  elWeekStart.value = s;
  elWeekEnd.value = addDays(s, 6);
  renderWeekly();
});

btnLastWeek.addEventListener("click", () => {
  const thisStart = startOfWeekISO(todayISO());
  const lastStart = addDays(thisStart, -7);
  elWeekStart.value = lastStart;
  elWeekEnd.value = addDays(lastStart, 6);
  renderWeekly();
});

elWeekStart.addEventListener("change", renderWeekly);
elWeekEnd.addEventListener("change", renderWeekly);
btnPDF.addEventListener("click", buildWeeklyPDF);

renderPillars();
applyDay({ date: todayISO() });
renderHistory();

const defaultWeek = startOfWeekISO(todayISO());
elWeekStart.value = defaultWeek;
elWeekEnd.value = addDays(defaultWeek, 6);
renderWeekly();
