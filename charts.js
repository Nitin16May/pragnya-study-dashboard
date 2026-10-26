// ==============================================================================
// CHARTS ENGINE - PRAGNYA ICSE 10TH BOARD STUDY TRACKER
// Miraculous Ladybug Themed Visualizations powered by Chart.js
// ==============================================================================

import { ICSE_SUBJECTS } from './data.js';

// Global chart instances cache to avoid duplicate rendering / memory leaks
let activeCharts = {};

// Color lookup map by subject name
function getSubjectColor(subjectName) {
  const norm = (subjectName || '').toLowerCase();
  const match = ICSE_SUBJECTS.find(s => 
    s.name.toLowerCase() === norm || 
    s.name.toLowerCase().includes(norm) ||
    norm.includes(s.name.toLowerCase()) ||
    norm.includes(s.id)
  );
  return match ? match.color : '#E51A4C';
}

// Chart.js global dark theme defaults with Ladybug accents
export function configureChartDefaults() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#94a3b8'; // Slate 400
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 17, 26, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(229, 26, 76, 0.4)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.boxPadding = 4;
}

// Helper to destroy previous chart on canvas
function safeDestroy(canvasId) {
  if (activeCharts[canvasId]) {
    activeCharts[canvasId].destroy();
    delete activeCharts[canvasId];
  }
}

// ==============================================================================
// 1. DAILY STUDY HOURS BAR CHART (with Daily Target Line)
// ==============================================================================
export function renderDailyStudyChart(canvasId, sessions, daysCount = 7, targetHours = 4.5) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  safeDestroy(canvasId);

  // Generate array of past N days
  const dateLabels = [];
  const dateKeys = [];
  const dailyHoursMap = {};

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dateKeys.push(key);
    
    // Label format: "Wed 22" or "Sun 26"
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    dateLabels.push(`${dayName} ${dayNum}`);
    dailyHoursMap[key] = { totalMinutes: 0, bySubject: {} };
  }

  // Aggregate session minutes into dates
  sessions.forEach(sess => {
    const key = sess.study_date;
    if (dailyHoursMap[key]) {
      const mins = Number(sess.duration_minutes) || 0;
      dailyHoursMap[key].totalMinutes += mins;
      dailyHoursMap[key].bySubject[sess.subject] = (dailyHoursMap[key].bySubject[sess.subject] || 0) + mins;
    }
  });

  const hoursData = dateKeys.map(k => Number((dailyHoursMap[k].totalMinutes / 60).toFixed(1)));
  const targetData = dateKeys.map(() => targetHours);

  // Gradient fill for Ladybug bars
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, '#FF2E63'); // Bright Ladybug Pink/Red
  gradient.addColorStop(1, '#B8002E'); // Deep Crimson

  activeCharts[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dateLabels,
      datasets: [
        {
          label: 'Study Hours',
          data: hoursData,
          backgroundColor: hoursData.map(h => h >= targetHours ? '#00F59B' : gradient), // Neon green if target hit!
          borderRadius: 6,
          borderSkipped: false,
          barThickness: daysCount > 14 ? 12 : 24,
          order: 2
        },
        {
          label: `Target (${targetHours} hrs)`,
          data: targetData,
          type: 'line',
          borderColor: 'rgba(255, 214, 0, 0.85)', // Golden Lucky Charm line
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            color: '#cbd5e1'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.dataset.type === 'line') {
                return ` Daily Goal: ${context.raw} hrs`;
              }
              const hours = context.raw;
              const dateKey = dateKeys[context.dataIndex];
              const info = dailyHoursMap[dateKey];
              let text = ` Total: ${hours} hrs (${info.totalMinutes} mins)`;
              return text;
            },
            afterBody: function(context) {
              const dateKey = dateKeys[context[0].dataIndex];
              const bySubject = dailyHoursMap[dateKey]?.bySubject || {};
              const entries = Object.entries(bySubject);
              if (entries.length === 0) return [' No study logged'];
              return entries.map(([sub, mins]) => ` • ${sub}: ${(mins / 60).toFixed(1)}h`);
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#94a3b8',
            callback: value => `${value}h`
          }
        }
      }
    }
  });
}

// ==============================================================================
// 2. SUBJECT-WISE TIME DISTRIBUTION (Doughnut Chart)
// ==============================================================================
export function renderSubjectDistributionChart(canvasId, sessions) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  safeDestroy(canvasId);

  const subjectTotals = {};
  let grandTotalMinutes = 0;

  sessions.forEach(sess => {
    const mins = Number(sess.duration_minutes) || 0;
    const sub = sess.subject || 'Other';
    subjectTotals[sub] = (subjectTotals[sub] || 0) + mins;
    grandTotalMinutes += mins;
  });

  const sortedSubjects = Object.keys(subjectTotals).sort((a, b) => subjectTotals[b] - subjectTotals[a]);
  const labels = sortedSubjects;
  const data = sortedSubjects.map(s => Number((subjectTotals[s] / 60).toFixed(1)));
  const colors = sortedSubjects.map(s => getSubjectColor(s));

  if (sortedSubjects.length === 0) {
    labels.push('No Sessions Logged Yet');
    data.push(1);
    colors.push('#334155');
  }

  activeCharts[canvasId] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderColor: '#13151f',
          borderWidth: 3,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 12,
            color: '#e2e8f0',
            font: { size: 11 },
            generateLabels: function(chart) {
              const datasets = chart.data.datasets;
              return chart.data.labels.map((label, i) => {
                const val = datasets[0].data[i];
                const pct = grandTotalMinutes > 0 ? Math.round(((val * 60) / grandTotalMinutes) * 100) : 0;
                return {
                  text: `${label} (${val}h • ${pct}%)`,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  hidden: false,
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const pct = grandTotalMinutes > 0 ? Math.round(((val * 60) / grandTotalMinutes) * 100) : 0;
              return ` ${context.label}: ${val} hrs (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// ==============================================================================
// 3. DAY OF WEEK STUDY CONSISTENCY (Bar Chart)
// ==============================================================================
export function renderDayOfWeekChart(canvasId, sessions) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  safeDestroy(canvasId);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMinutes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 }; // JS Day (0 = Sun, 1 = Mon)
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  sessions.forEach(sess => {
    if (!sess.study_date) return;
    const d = new Date(sess.study_date + 'T12:00:00');
    const dayOfWeek = d.getDay();
    dayMinutes[dayOfWeek] = (dayMinutes[dayOfWeek] || 0) + (Number(sess.duration_minutes) || 0);
  });

  const hoursData = dayOrder.map(dIndex => Number((dayMinutes[dIndex] / 60).toFixed(1)));

  activeCharts[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Total Hours Studied',
          data: hoursData,
          backgroundColor: hoursData.map((_, i) => i >= 5 ? '#00F59B' : '#FF2E63'), // Green for weekends
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', callback: v => `${v}h` }
        }
      }
    }
  });
}

// ==============================================================================
// 4. MOCK TEST MARKS PROGRESS TIMELINE (Line Chart)
// ==============================================================================
export function renderMockMarksProgressChart(canvasId, mockMarks, selectedSubject = 'all') {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  safeDestroy(canvasId);

  // Filter marks by subject if selected
  let filtered = [...mockMarks];
  if (selectedSubject !== 'all') {
    filtered = filtered.filter(m => m.subject.toLowerCase() === selectedSubject.toLowerCase());
  }

  // Sort ascending by date
  filtered.sort((a, b) => new Date(a.test_date) - new Date(b.test_date));

  if (filtered.length === 0) {
    activeCharts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['No Tests Logged Yet'],
        datasets: [{
          label: '90% ICSE Distinction Target',
          data: [90],
          borderColor: '#00F59B',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { color: '#cbd5e1' } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', callback: v => `${v}%` } }
        }
      }
    });
    return;
  }

  const labels = filtered.map(m => {
    const d = new Date(m.test_date + 'T12:00:00');
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${m.subject} (${dateStr})`;
  });

  const percentages = filtered.map(m => Number(m.percentage) || Number(((m.marks_obtained / m.max_marks) * 100).toFixed(1)));
  const pointColors = filtered.map(m => getSubjectColor(m.subject));

  activeCharts[canvasId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Marks %',
          data: percentages,
          borderColor: '#E51A4C',
          backgroundColor: 'rgba(229, 26, 76, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: '90% ICSE Distinction Target',
          data: percentages.map(() => 90),
          borderColor: '#00F59B',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#cbd5e1' }
        },
        tooltip: {
          callbacks: {
            title: context => {
              const item = filtered[context[0].dataIndex];
              return `${item.subject} • ${item.paper_name}`;
            },
            label: context => {
              if (context.datasetIndex === 1) return ' Distinction Target: 90%';
              const item = filtered[context.dataIndex];
              return ` Score: ${item.marks_obtained}/${item.max_marks} (${context.raw}%)`;
            },
            afterBody: context => {
              const item = filtered[context[0].dataIndex];
              const notes = [];
              if (item.weak_areas) notes.push(`⚠️ Focus: ${item.weak_areas}`);
              if (item.strong_areas) notes.push(`🌟 Strong: ${item.strong_areas}`);
              return notes;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 0 }
        },
        y: {
          min: 40,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#94a3b8',
            callback: v => `${v}%`
          }
        }
      }
    }
  });
}

// ==============================================================================
// 5. SUBJECT-WISE AVERAGE MOCK TEST SCORES (Horizontal Bar Chart)
// ==============================================================================
export function renderSubjectScoreComparisonChart(canvasId, mockMarks) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  safeDestroy(canvasId);

  const subjectScores = {};

  mockMarks.forEach(m => {
    const sub = m.subject;
    const pct = Number(m.percentage) || ((m.marks_obtained / m.max_marks) * 100);
    if (!subjectScores[sub]) {
      subjectScores[sub] = { total: 0, count: 0 };
    }
    subjectScores[sub].total += pct;
    subjectScores[sub].count += 1;
  });

  const subjects = Object.keys(subjectScores).sort((a, b) => {
    const avgA = subjectScores[a].total / subjectScores[a].count;
    const avgB = subjectScores[b].total / subjectScores[b].count;
    return avgB - avgA;
  });

  const avgPercentages = subjects.map(s => Number((subjectScores[s].total / subjectScores[s].count).toFixed(1)));
  const colors = subjects.map(s => getSubjectColor(s));

  if (subjects.length === 0) {
    activeCharts[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['No Papers Logged Yet'],
        datasets: [{
          label: 'Average Score %',
          data: [0],
          backgroundColor: '#334155',
          borderRadius: 5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', callback: v => `${v}%` } },
          y: { grid: { display: false }, ticks: { color: '#e2e8f0' } }
        }
      }
    });
    return;
  }

  activeCharts[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: subjects,
      datasets: [
        {
          label: 'Average Score %',
          data: avgPercentages,
          backgroundColor: colors,
          borderRadius: 5,
          barThickness: 18
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` Average: ${context.raw}% (${subjectScores[context.label].count} papers tested)`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', callback: v => `${v}%` }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#e2e8f0' }
        }
      }
    }
  });
}
