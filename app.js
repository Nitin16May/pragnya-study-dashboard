// ==============================================================================
// PRAGNYA ICSE 10TH BOARD STUDY TRACKER - APPLICATION ENGINE
// Miraculous Ladybug Edition
// ==============================================================================

import { ICSE_SUBJECTS, STUDY_TYPES, LADYBUG_QUOTES } from './data.js';
import {
  fetchStudySessions,
  addStudySession,
  deleteStudySession,
  fetchMockMarks,
  addMockMark,
  deleteMockMark,
  isSupabaseConnected,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testConnection,
  resetToSampleData
} from './supabase-client.js';
import {
  configureChartDefaults,
  renderDailyStudyChart,
  renderSubjectDistributionChart,
  renderDayOfWeekChart,
  renderMockMarksProgressChart,
  renderSubjectScoreComparisonChart
} from './charts.js';

// ==============================================================================
// APP STATE
// ==============================================================================
const state = {
  sessions: [],
  mockMarks: [],
  activeTab: 'overview',
  dailyChartDays: 7,
  marksChartSubject: 'all',
  
  // Stopwatch / Pomodoro Timer State
  timer: {
    isRunning: false,
    seconds: 0,
    intervalId: null,
    subject: ICSE_SUBJECTS[0].name,
    topic: ''
  }
};

// ==============================================================================
// INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  configureChartDefaults();
  populateDropdowns();
  setupEventListeners();
  setupTimer();
  updateSyncStatusIndicator();
  displayRandomQuote();
  updateExamCountdown();
  loadSqlSchemaDisplay();

  // Load initial data
  await refreshData();
  lucide.createIcons();
});

// Refresh both datasets from Supabase / Local storage
async function refreshData() {
  try {
    const [sessionsData, marksData] = await Promise.all([
      fetchStudySessions(),
      fetchMockMarks()
    ]);
    state.sessions = sessionsData || [];
    state.mockMarks = marksData || [];

    updateKPIs();
    renderActiveTabContent();
    lucide.createIcons();
  } catch (err) {
    console.error("Error refreshing dashboard data:", err);
    showToast("Error updating study data", false);
  }
}

// ==============================================================================
// POPULATE SUBJECT DROPDOWNS & STUDY TYPES
// ==============================================================================
function populateDropdowns() {
  const subjectSelects = [
    document.getElementById('timer-subject-select'),
    document.getElementById('input-session-subject'),
    document.getElementById('input-mark-subject'),
    document.getElementById('filter-session-subject'),
    document.getElementById('filter-marks-subject'),
    document.getElementById('filter-marks-chart-subject')
  ];

  subjectSelects.forEach(select => {
    if (!select) return;
    const isFilter = select.id.startsWith('filter-');
    
    // Keep the "All" option if it's a filter
    if (isFilter) {
      select.innerHTML = '<option value="all">All ICSE Subjects</option>';
    } else {
      select.innerHTML = '';
    }

    ICSE_SUBJECTS.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = `${sub.name} (${sub.group})`;
      select.appendChild(opt);
    });
  });

  // Populate Study Types
  const typeSelect = document.getElementById('input-session-type');
  if (typeSelect) {
    typeSelect.innerHTML = '';
    STUDY_TYPES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      typeSelect.appendChild(opt);
    });
  }

  // Pre-fill today's date in forms
  const todayStr = new Date().toISOString().split('T')[0];
  const dateInputs = [
    document.getElementById('input-session-date'),
    document.getElementById('input-mark-date')
  ];
  dateInputs.forEach(inp => {
    if (inp) inp.value = todayStr;
  });
}

// ==============================================================================
// KPI COMPUTATIONS & MOTIVATION
// ==============================================================================
function updateKPIs() {
  const todayStr = new Date().toISOString().split('T')[0];
  const DAILY_GOAL_HOURS = 4.5;

  // 1. Today's Study Time
  let todayMinutes = 0;
  state.sessions.forEach(sess => {
    if (sess.study_date === todayStr) {
      todayMinutes += Number(sess.duration_minutes) || 0;
    }
  });

  const todayHours = Math.floor(todayMinutes / 60);
  const todayRemMins = todayMinutes % 60;
  const kpiTodayElem = document.getElementById('kpi-today-time');
  if (kpiTodayElem) {
    kpiTodayElem.textContent = `${todayHours}h ${todayRemMins}m`;
  }

  const todayPct = Math.min(Math.round((todayMinutes / (DAILY_GOAL_HOURS * 60)) * 100), 100);
  const kpiProgressElem = document.getElementById('kpi-today-progress');
  if (kpiProgressElem) {
    kpiProgressElem.style.width = `${todayPct}%`;
  }

  const kpiStatusElem = document.getElementById('kpi-today-status');
  if (kpiStatusElem) {
    if (todayMinutes >= DAILY_GOAL_HOURS * 60) {
      kpiStatusElem.textContent = '🎉 Goal Smashed! (Spots On!)';
      kpiStatusElem.style.color = 'var(--cn-green)';
    } else {
      kpiStatusElem.textContent = `🎯 ${todayPct}% of daily target`;
      kpiStatusElem.style.color = 'var(--lucky-gold)';
    }
  }

  // 2. This Week's Total Time (Past 7 days)
  const past7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    past7Days.push(d.toISOString().split('T')[0]);
  }

  let weekMinutes = 0;
  let weekSessionCount = 0;
  state.sessions.forEach(sess => {
    if (past7Days.includes(sess.study_date)) {
      weekMinutes += Number(sess.duration_minutes) || 0;
      weekSessionCount++;
    }
  });

  const kpiWeekElem = document.getElementById('kpi-week-time');
  if (kpiWeekElem) {
    kpiWeekElem.textContent = `${(weekMinutes / 60).toFixed(1)} hrs`;
  }
  const kpiWeekCountElem = document.getElementById('kpi-week-count');
  if (kpiWeekCountElem) {
    kpiWeekCountElem.textContent = `${weekSessionCount} study sessions this week`;
  }

  // 3. Average Mock Test Score
  let totalScorePct = 0;
  let countMarks = state.mockMarks.length;
  let highestMarkPct = 0;
  let highestSubject = 'N/A';

  state.mockMarks.forEach(m => {
    const pct = Number(m.percentage) || ((m.marks_obtained / m.max_marks) * 100);
    totalScorePct += pct;
    if (pct > highestMarkPct) {
      highestMarkPct = pct;
      highestSubject = `${m.subject} (${pct.toFixed(1)}%)`;
    }
  });

  const avgPct = countMarks > 0 ? (totalScorePct / countMarks).toFixed(1) : '0.0';
  const kpiAvgMarksElem = document.getElementById('kpi-avg-marks');
  if (kpiAvgMarksElem) {
    kpiAvgMarksElem.textContent = `${avgPct}%`;
  }

  const kpiMarksGradeElem = document.getElementById('kpi-marks-grade');
  if (kpiMarksGradeElem) {
    if (avgPct >= 90) {
      kpiMarksGradeElem.textContent = '🌟 ICSE Distinction Grade';
      kpiMarksGradeElem.style.color = 'var(--cn-green)';
    } else if (avgPct >= 75) {
      kpiMarksGradeElem.textContent = '✨ Grade 1 / First Class';
      kpiMarksGradeElem.style.color = '#0ABDE3';
    } else {
      kpiMarksGradeElem.textContent = '⚡ Practice in Progress';
      kpiMarksGradeElem.style.color = 'var(--lucky-gold)';
    }
  }

  // Papers Solved & Highest Score in Mock Tab
  const kpiPapersElem = document.getElementById('kpi-papers-count');
  if (kpiPapersElem) kpiPapersElem.textContent = countMarks;

  const kpiHighestScoreElem = document.getElementById('kpi-highest-score');
  if (kpiHighestScoreElem) kpiHighestScoreElem.textContent = `${highestMarkPct.toFixed(1)}%`;

  const kpiHighestSubjectElem = document.getElementById('kpi-highest-subject');
  if (kpiHighestSubjectElem) kpiHighestSubjectElem.textContent = `Best: ${highestSubject}`;

  // 4. Top Focus Subject
  const subjectTotals = {};
  state.sessions.forEach(sess => {
    subjectTotals[sess.subject] = (subjectTotals[sess.subject] || 0) + (Number(sess.duration_minutes) || 0);
  });

  let topSubject = 'Mathematics';
  let maxMinutes = 0;
  Object.entries(subjectTotals).forEach(([sub, mins]) => {
    if (mins > maxMinutes) {
      maxMinutes = mins;
      topSubject = sub;
    }
  });

  const kpiTopSubjectElem = document.getElementById('kpi-top-subject');
  if (kpiTopSubjectElem) kpiTopSubjectElem.textContent = topSubject;

  const kpiTopSubjectHoursElem = document.getElementById('kpi-top-subject-hours');
  if (kpiTopSubjectHoursElem) {
    kpiTopSubjectHoursElem.textContent = `${(maxMinutes / 60).toFixed(1)}h logged total`;
  }

  // 5. Active Study Streak Calculation
  calculateStreak();
}

function calculateStreak() {
  const datesStudied = new Set(state.sessions.map(s => s.study_date));
  let streak = 0;
  let checkDate = new Date();

  // If today isn't logged yet, check starting from yesterday
  const todayKey = checkDate.toISOString().split('T')[0];
  if (!datesStudied.has(todayKey)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = checkDate.toISOString().split('T')[0];
    if (datesStudied.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const streakBadge = document.getElementById('streak-count');
  if (streakBadge) {
    streakBadge.textContent = streak > 0 ? `${streak} Day Streak! 🔥` : 'Start Streak Today!';
  }
}

function updateExamCountdown() {
  // ICSE 10th Board Exam estimated start: mid-February 2027 (or 2026)
  // Let's calculate days remaining to next Feb 15
  const now = new Date();
  let targetYear = now.getFullYear();
  if (now.getMonth() > 1 || (now.getMonth() === 1 && now.getDate() > 20)) {
    targetYear += 1;
  }
  const examDate = new Date(targetYear, 1, 15); // Feb 15
  const diffTime = examDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const countdownText = document.getElementById('countdown-text');
  if (countdownText) {
    if (diffDays > 0) {
      countdownText.textContent = `${diffDays} Days to ICSE Boards`;
    } else {
      countdownText.textContent = `Board Exams In Progress! 🐞`;
    }
  }
}

function displayRandomQuote() {
  const quoteObj = LADYBUG_QUOTES[Math.floor(Math.random() * LADYBUG_QUOTES.length)];
  const quoteElem = document.getElementById('hero-quote-text');
  const authorElem = document.getElementById('hero-quote-author');
  if (quoteElem) quoteElem.textContent = `"${quoteObj.quote}"`;
  if (authorElem) authorElem.textContent = `— ${quoteObj.author}`;
}

// ==============================================================================
// TAB SWITCHING & CONTENT RENDERING
// ==============================================================================
function renderActiveTabContent() {
  if (state.activeTab === 'overview') {
    renderOverviewTab();
  } else if (state.activeTab === 'time-analytics') {
    renderTimeAnalyticsTab();
  } else if (state.activeTab === 'mock-marks') {
    renderMockMarksTab();
  }
}

function renderOverviewTab() {
  renderDailyStudyChart('chart-daily-study', state.sessions, state.dailyChartDays);
  renderSubjectDistributionChart('chart-subject-distribution', state.sessions);
  renderRecentSessionsSnippet();
}

function renderTimeAnalyticsTab() {
  renderDayOfWeekChart('chart-day-of-week', state.sessions);
  renderSubjectHoursRankList();
  renderFullSessionsTable();
}

function renderMockMarksTab() {
  renderMockMarksProgressChart('chart-mock-progress', state.mockMarks, state.marksChartSubject);
  renderSubjectScoreComparisonChart('chart-subject-comparison', state.mockMarks);
  renderFullMarksTable();
}

// ==============================================================================
// TABLES & LISTS RENDERING
// ==============================================================================

// 1. Overview Recent Sessions Snippet (top 5)
function renderRecentSessionsSnippet() {
  const tbody = document.getElementById('overview-recent-sessions-body');
  if (!tbody) return;

  const recent = state.sessions.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No study sessions logged yet. Click "Log Study Time" or start the Spots On timer!</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(s => {
    const subObj = ICSE_SUBJECTS.find(sub => sub.name.toLowerCase() === (s.subject || '').toLowerCase());
    const color = subObj ? subObj.color : '#E51A4C';
    const bg = subObj ? subObj.badgeBg : 'rgba(229, 26, 76, 0.15)';
    const hours = (Number(s.duration_minutes) / 60).toFixed(1);

    return `
      <tr>
        <td><strong>${formatDisplayDate(s.study_date)}</strong></td>
        <td>
          <span class="subject-badge" style="color: ${color}; background: ${bg}; border: 1px solid ${color}33;">
            <i data-lucide="${subObj ? subObj.icon : 'book'}" style="width: 13px; height: 13px;"></i>
            ${escapeHtml(s.subject)}
          </span>
        </td>
        <td>${escapeHtml(s.chapter_topic || 'General Practice')}</td>
        <td><strong>${s.duration_minutes}m</strong> <span style="color: var(--text-muted); font-size: 11px;">(${hours}h)</span></td>
        <td><span style="font-size: 12px; color: var(--text-secondary);">${escapeHtml(s.study_type || 'Self Study')}</span></td>
        <td style="color: var(--text-muted); font-size: 12px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${escapeHtml(s.notes || '-')}
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// 2. Full Sessions Table in Time Measurement Tab
function renderFullSessionsTable() {
  const tbody = document.getElementById('full-sessions-table-body');
  if (!tbody) return;

  const filterSubject = document.getElementById('filter-session-subject')?.value || 'all';
  const searchTerm = (document.getElementById('search-sessions-input')?.value || '').toLowerCase().trim();

  let filtered = [...state.sessions];
  if (filterSubject !== 'all') {
    filtered = filtered.filter(s => s.subject.toLowerCase() === filterSubject.toLowerCase());
  }
  if (searchTerm) {
    filtered = filtered.filter(s => 
      (s.chapter_topic || '').toLowerCase().includes(searchTerm) ||
      (s.notes || '').toLowerCase().includes(searchTerm) ||
      (s.subject || '').toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No matching study sessions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const subObj = ICSE_SUBJECTS.find(sub => sub.name.toLowerCase() === (s.subject || '').toLowerCase());
    const color = subObj ? subObj.color : '#E51A4C';
    const bg = subObj ? subObj.badgeBg : 'rgba(229, 26, 76, 0.15)';
    const hours = (Number(s.duration_minutes) / 60).toFixed(1);
    const stars = '⭐'.repeat(Math.min(s.efficiency_rating || 5, 5));

    return `
      <tr>
        <td><strong>${formatDisplayDate(s.study_date)}</strong></td>
        <td>
          <span class="subject-badge" style="color: ${color}; background: ${bg}; border: 1px solid ${color}33;">
            <i data-lucide="${subObj ? subObj.icon : 'book'}" style="width: 13px; height: 13px;"></i>
            ${escapeHtml(s.subject)}
          </span>
        </td>
        <td><strong>${escapeHtml(s.chapter_topic || '-')}</strong></td>
        <td><strong>${s.duration_minutes} mins</strong> <span style="color: var(--text-muted); font-size: 11px;">(${hours}h)</span></td>
        <td><span style="font-size: 12px; color: var(--text-secondary);">${escapeHtml(s.study_type || 'Self Study')}</span></td>
        <td style="font-size: 11px;">${stars}</td>
        <td style="color: var(--text-secondary); font-size: 12px; max-width: 200px;">
          ${escapeHtml(s.notes || '-')}
        </td>
        <td style="text-align: right;">
          <button class="action-btn-del btn-delete-session" data-id="${s.id}" title="Delete session">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Attach delete handlers
  tbody.querySelectorAll('.btn-delete-session').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm("Delete this study session?")) {
        await deleteStudySession(id);
        showToast("Study session deleted", true);
        await refreshData();
      }
    });
  });

  lucide.createIcons();
}

// 3. Subject Hours Ranking List (in Time Analytics Tab)
function renderSubjectHoursRankList() {
  const container = document.getElementById('subject-hours-rank-list');
  if (!container) return;

  const subjectTotals = {};
  let maxHours = 0.1;

  ICSE_SUBJECTS.forEach(sub => {
    subjectTotals[sub.name] = 0;
  });

  state.sessions.forEach(s => {
    const mins = Number(s.duration_minutes) || 0;
    subjectTotals[s.subject] = (subjectTotals[s.subject] || 0) + mins;
  });

  const sorted = Object.entries(subjectTotals)
    .map(([sub, mins]) => ({ subject: sub, hours: Number((mins / 60).toFixed(1)) }))
    .sort((a, b) => b.hours - a.hours);

  maxHours = Math.max(...sorted.map(s => s.hours), 1);

  container.innerHTML = sorted.map(item => {
    const subObj = ICSE_SUBJECTS.find(s => s.name === item.subject);
    const color = subObj ? subObj.color : '#E51A4C';
    const pct = Math.round((item.hours / maxHours) * 100);

    return `
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 6px 10px; background: var(--bg-surface); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="font-weight: 600; color: #fff;">${escapeHtml(item.subject)}</span>
          <span style="color: ${color}; font-weight: 700;">${item.hours} hrs</span>
        </div>
        <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 4px;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Full Mock Marks Table (in Marks Tab)
function renderFullMarksTable() {
  const tbody = document.getElementById('full-marks-table-body');
  if (!tbody) return;

  const filterSubject = document.getElementById('filter-marks-subject')?.value || 'all';
  const searchTerm = (document.getElementById('search-marks-input')?.value || '').toLowerCase().trim();

  let filtered = [...state.mockMarks];
  if (filterSubject !== 'all') {
    filtered = filtered.filter(m => m.subject.toLowerCase() === filterSubject.toLowerCase());
  }
  if (searchTerm) {
    filtered = filtered.filter(m =>
      (m.paper_name || '').toLowerCase().includes(searchTerm) ||
      (m.subject || '').toLowerCase().includes(searchTerm) ||
      (m.weak_areas || '').toLowerCase().includes(searchTerm) ||
      (m.notes || '').toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No sample paper marks recorded yet. Click "Enter Paper Marks" to log Pragnya's scores!</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const subObj = ICSE_SUBJECTS.find(sub => sub.name.toLowerCase() === (m.subject || '').toLowerCase());
    const color = subObj ? subObj.color : '#E51A4C';
    const bg = subObj ? subObj.badgeBg : 'rgba(229, 26, 76, 0.15)';
    const pct = Number(m.percentage) || Number(((m.marks_obtained / m.max_marks) * 100).toFixed(1));

    let scoreClass = 'distinction';
    if (pct < 75) scoreClass = 'needs-work';
    else if (pct < 90) scoreClass = 'first-class';

    return `
      <tr>
        <td><strong>${formatDisplayDate(m.test_date)}</strong></td>
        <td>
          <span class="subject-badge" style="color: ${color}; background: ${bg}; border: 1px solid ${color}33;">
            <i data-lucide="${subObj ? subObj.icon : 'award'}" style="width: 13px; height: 13px;"></i>
            ${escapeHtml(m.subject)}
          </span>
        </td>
        <td><strong>${escapeHtml(m.paper_name)}</strong></td>
        <td><strong>${m.marks_obtained}</strong> / ${m.max_marks}</td>
        <td>
          <span class="score-badge ${scoreClass}">${pct}%</span>
        </td>
        <td style="color: var(--text-secondary); font-size: 12px;">${m.time_taken_minutes ? `${m.time_taken_minutes} mins` : '-'}</td>
        <td style="color: #FF85A1; font-size: 12px; max-width: 220px;">
          ${escapeHtml(m.weak_areas || '-')}
        </td>
        <td style="color: var(--cn-green); font-size: 12px; max-width: 200px;">
          ${escapeHtml(m.strong_areas || '-')}
        </td>
        <td style="text-align: right;">
          <button class="action-btn-del btn-delete-mark" data-id="${m.id}" title="Delete score">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-delete-mark').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm("Delete this sample paper score entry?")) {
        await deleteMockMark(id);
        showToast("Marks entry deleted", true);
        await refreshData();
      }
    });
  });

  lucide.createIcons();
}

// ==============================================================================
// LIVE STUDY STOPWATCH / POMODORO ("Spots On!" Mode)
// ==============================================================================
function setupTimer() {
  const toggleBtn = document.getElementById('timer-toggle-btn');
  const toggleIcon = document.getElementById('timer-toggle-icon');
  const toggleText = document.getElementById('timer-toggle-text');
  const resetBtn = document.getElementById('timer-reset-btn');
  const saveBtn = document.getElementById('timer-save-btn');
  const display = document.getElementById('timer-display');
  const subjectSelect = document.getElementById('timer-subject-select');
  const topicInput = document.getElementById('timer-topic-input');
  const activeLabel = document.getElementById('timer-active-label');
  const yoyoIcon = document.getElementById('yoyo-icon');

  function updateDisplay() {
    const hrs = String(Math.floor(state.timer.seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((state.timer.seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(state.timer.seconds % 60).padStart(2, '0');
    display.textContent = `${hrs}:${mins}:${secs}`;
  }

  toggleBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      // Pause
      clearInterval(state.timer.intervalId);
      state.timer.isRunning = false;
      toggleText.textContent = 'Resume Spots On!';
      toggleIcon.setAttribute('data-lucide', 'play');
      yoyoIcon.classList.remove('active');
      activeLabel.textContent = 'Session Paused';
    } else {
      // Start
      state.timer.isRunning = true;
      toggleText.textContent = 'Pause Timer';
      toggleIcon.setAttribute('data-lucide', 'pause');
      yoyoIcon.classList.add('active');
      saveBtn.removeAttribute('disabled');
      
      const sub = subjectSelect.value;
      activeLabel.textContent = `Studying ${sub}`;

      state.timer.intervalId = setInterval(() => {
        state.timer.seconds++;
        updateDisplay();
      }, 1000);
    }
    lucide.createIcons();
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    state.timer.seconds = 0;
    updateDisplay();
    toggleText.textContent = 'Spots On! (Start)';
    toggleIcon.setAttribute('data-lucide', 'play');
    yoyoIcon.classList.remove('active');
    activeLabel.textContent = 'Ready for Study Session';
    saveBtn.setAttribute('disabled', 'true');
    lucide.createIcons();
  });

  saveBtn.addEventListener('click', () => {
    const elapsedMinutes = Math.max(Math.round(state.timer.seconds / 60), 1);
    
    // Pause timer
    if (state.timer.isRunning) {
      clearInterval(state.timer.intervalId);
      state.timer.isRunning = false;
      toggleText.textContent = 'Spots On! (Start)';
      toggleIcon.setAttribute('data-lucide', 'play');
      yoyoIcon.classList.remove('active');
      lucide.createIcons();
    }

    // Open Manual Time Logging Modal with pre-filled duration, subject, and topic!
    document.getElementById('input-session-subject').value = subjectSelect.value;
    document.getElementById('input-session-topic').value = topicInput.value || '';
    
    const hrs = Math.floor(elapsedMinutes / 60);
    const mins = elapsedMinutes % 60;
    document.getElementById('input-session-hours').value = hrs > 0 ? hrs : '';
    document.getElementById('input-session-minutes').value = mins;

    openModal('modal-log-time');
  });

  subjectSelect.addEventListener('change', () => {
    if (state.timer.isRunning) {
      activeLabel.textContent = `Studying ${subjectSelect.value}`;
    }
  });
}

// ==============================================================================
// EVENT LISTENERS & MODALS
// ==============================================================================
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      state.activeTab = tabId;

      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) targetContent.style.display = 'block';

      renderActiveTabContent();
      lucide.createIcons();
    });
  });

  // Modal Open Triggers
  document.getElementById('btn-quick-log-session')?.addEventListener('click', () => openModal('modal-log-time'));
  document.getElementById('btn-add-session-from-tab')?.addEventListener('click', () => openModal('modal-log-time'));
  document.getElementById('btn-quick-log-marks')?.addEventListener('click', () => openModal('modal-log-marks'));
  document.getElementById('btn-add-mark-from-tab')?.addEventListener('click', () => openModal('modal-log-marks'));
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    loadSettingsModalValues();
    openModal('modal-settings');
  });
  document.getElementById('avatar-trigger')?.addEventListener('click', () => {
    displayRandomQuote();
    showToast("Ladybug Lucky Charm Activated! 🐞✨", true);
  });
  document.getElementById('btn-view-all-sessions')?.addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="time-analytics"]')?.click();
  });

  // Modal Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  // Close modals clicking outside
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Quick Duration Pills in Modal
  document.querySelectorAll('.duration-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const totalMins = Number(pill.getAttribute('data-mins'));
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      document.getElementById('input-session-hours').value = hrs > 0 ? hrs : '';
      document.getElementById('input-session-minutes').value = mins;

      document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Daily Study Days Toggle Pills (7d / 14d / 30d)
  document.querySelectorAll('.pill-btn[data-days]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn[data-days]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.dailyChartDays = Number(pill.getAttribute('data-days'));
      renderDailyStudyChart('chart-daily-study', state.sessions, state.dailyChartDays);
    });
  });

  // Filter Study Sessions
  document.getElementById('filter-session-subject')?.addEventListener('change', renderFullSessionsTable);
  document.getElementById('search-sessions-input')?.addEventListener('input', renderFullSessionsTable);

  // Filter Mock Marks
  document.getElementById('filter-marks-subject')?.addEventListener('change', renderFullMarksTable);
  document.getElementById('search-marks-input')?.addEventListener('input', renderFullMarksTable);
  document.getElementById('filter-marks-chart-subject')?.addEventListener('change', (e) => {
    state.marksChartSubject = e.target.value;
    renderMockMarksProgressChart('chart-mock-progress', state.mockMarks, state.marksChartSubject);
  });

  // Score % preview calculation in Mock Marks modal
  const calcScorePreview = () => {
    const obt = Number(document.getElementById('input-mark-obtained')?.value) || 0;
    const tot = Number(document.getElementById('input-mark-total')?.value) || 80;
    const preview = document.getElementById('mark-percentage-preview');
    if (preview && tot > 0) {
      const pct = ((obt / tot) * 100).toFixed(1);
      preview.textContent = `${pct}% ${pct >= 90 ? '🌟 Distinction' : ''}`;
    }
  };
  document.getElementById('input-mark-obtained')?.addEventListener('input', calcScorePreview);
  document.getElementById('input-mark-total')?.addEventListener('input', calcScorePreview);

  // FORM SUBMISSION: Log Study Session
  document.getElementById('form-log-session')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hrs = Number(document.getElementById('input-session-hours').value) || 0;
    const mins = Number(document.getElementById('input-session-minutes').value) || 0;
    const totalMinutes = (hrs * 60) + mins;

    if (totalMinutes <= 0) {
      alert("Please enter a valid study duration in hours or minutes!");
      return;
    }

    const sessionData = {
      student_name: 'Pragnya',
      subject: document.getElementById('input-session-subject').value,
      chapter_topic: document.getElementById('input-session-topic').value,
      duration_minutes: totalMinutes,
      study_date: document.getElementById('input-session-date').value,
      study_type: document.getElementById('input-session-type').value,
      efficiency_rating: Number(document.getElementById('input-session-efficiency').value),
      notes: document.getElementById('input-session-notes').value
    };

    await addStudySession(sessionData);
    closeModal('modal-log-time');
    e.target.reset();
    document.getElementById('input-session-date').value = new Date().toISOString().split('T')[0];

    // Reset live stopwatch if saved from timer
    const saveBtn = document.getElementById('timer-save-btn');
    saveBtn.setAttribute('disabled', 'true');
    state.timer.seconds = 0;
    document.getElementById('timer-display').textContent = '00:00:00';

    showToast("Pound it! 👊 Study session logged successfully!", true);
    await refreshData();
  });

  // FORM SUBMISSION: Log Mock Test Marks
  document.getElementById('form-log-marks')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const marksData = {
      student_name: 'Pragnya',
      subject: document.getElementById('input-mark-subject').value,
      paper_name: document.getElementById('input-mark-paper').value,
      test_date: document.getElementById('input-mark-date').value,
      marks_obtained: Number(document.getElementById('input-mark-obtained').value),
      max_marks: Number(document.getElementById('input-mark-total').value) || 80,
      time_taken_minutes: document.getElementById('input-mark-time').value ? Number(document.getElementById('input-mark-time').value) : null,
      weak_areas: document.getElementById('input-mark-weak').value,
      strong_areas: document.getElementById('input-mark-strong').value
    };

    await addMockMark(marksData);
    closeModal('modal-log-marks');
    e.target.reset();
    document.getElementById('input-mark-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('input-mark-total').value = 80;

    showToast("Pound it! 👊 Paper marks recorded!", true);
    await refreshData();
  });

  // SUPABASE SETTINGS HANDLERS
  document.getElementById('btn-save-supabase')?.addEventListener('click', async () => {
    const url = document.getElementById('setting-supabase-url').value.trim();
    const key = document.getElementById('setting-supabase-key').value.trim();
    const statusMsg = document.getElementById('settings-status-msg');

    if (!url || !key) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = 'rgba(229, 26, 76, 0.2)';
      statusMsg.style.color = '#FF85A1';
      statusMsg.textContent = 'Please enter both Supabase URL and API Key.';
      return;
    }

    statusMsg.style.display = 'block';
    statusMsg.style.background = 'rgba(255, 209, 102, 0.15)';
    statusMsg.style.color = 'var(--lucky-gold)';
    statusMsg.textContent = 'Testing connection to Supabase project...';

    const testRes = await testConnection(url, key);
    if (testRes.success) {
      saveSupabaseConfig(url, key);
      statusMsg.style.background = 'rgba(0, 245, 155, 0.2)';
      statusMsg.style.color = 'var(--cn-green)';
      statusMsg.textContent = 'Connected successfully to Supabase! Syncing live data...';
      updateSyncStatusIndicator();
      showToast("Supabase Connected! 🐞✨", true);
      setTimeout(async () => {
        closeModal('modal-settings');
        await refreshData();
      }, 1200);
    } else {
      statusMsg.style.background = 'rgba(229, 26, 76, 0.2)';
      statusMsg.style.color = '#FF85A1';
      statusMsg.textContent = `Connection failed: ${testRes.error}`;
    }
  });

  document.getElementById('btn-disconnect-supabase')?.addEventListener('click', async () => {
    if (confirm("Disconnect Supabase and switch back to local storage?")) {
      clearSupabaseConfig();
      updateSyncStatusIndicator();
      loadSettingsModalValues();
      showToast("Switched to Local Storage Mode", false);
      await refreshData();
    }
  });

  document.getElementById('btn-reset-demo-data')?.addEventListener('click', async () => {
    if (confirm("Reset to initial ICSE sample data? (This restores default sample sessions & marks).")) {
      resetToSampleData();
      showToast("Reset to sample ICSE data!", true);
      await refreshData();
    }
  });

  document.getElementById('btn-copy-sql')?.addEventListener('click', () => {
    const code = document.getElementById('sql-display-box')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code);
      showToast("SQL Schema copied to clipboard!", true);
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function updateSyncStatusIndicator() {
  const dot = document.getElementById('sync-dot');
  const label = document.getElementById('sync-status-label');
  const connected = isSupabaseConnected();

  if (connected) {
    if (dot) {
      dot.className = 'status-dot connected';
    }
    if (label) label.textContent = 'Supabase Connected';
  } else {
    if (dot) {
      dot.className = 'status-dot demo';
    }
    if (label) label.textContent = 'Local / Demo Mode';
  }
}

function loadSettingsModalValues() {
  const config = getSupabaseConfig();
  const urlInp = document.getElementById('setting-supabase-url');
  const keyInp = document.getElementById('setting-supabase-key');
  const statusMsg = document.getElementById('settings-status-msg');

  if (urlInp) urlInp.value = config.url || '';
  if (keyInp) keyInp.value = config.key || '';
  if (statusMsg) statusMsg.style.display = 'none';
}

async function loadSqlSchemaDisplay() {
  try {
    const res = await fetch('./supabase_schema.sql');
    if (res.ok) {
      const sql = await res.text();
      const codeBox = document.getElementById('sql-display-box');
      if (codeBox) codeBox.textContent = sql;
    }
  } catch (e) {
    console.warn("Could not load supabase_schema.sql into UI", e);
  }
}

// Toast Notification
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.className = `toast show ${isSuccess ? 'success' : ''}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Format date into "Oct 25, 2026" or "Today"
function formatDisplayDate(dateStr) {
  if (!dateStr) return '-';
  const today = new Date().toISOString().split('T')[0];
  if (dateStr === today) return 'Today';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
