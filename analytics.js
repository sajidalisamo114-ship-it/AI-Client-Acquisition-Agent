/**
 * ACAA — AI Client Acquisition Agent
 * Analytics & Reports — Chart.js initializations
 */

(function () {
  'use strict';

  // ── Shared defaults ──────────────────────────────────────────
  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.color = '#667085';

  const COLORS = {
    primary:  '#2563EB',
    accent:   '#06B6D4',
    success:  '#12B76A',
    warning:  '#F79009',
    danger:   '#D92D20',
    purple:   '#7C3AED',
    muted:    '#98A2B3',
    surface:  '#FFFFFF',
    bg:       '#F5F7FB',
    border:   '#DCE3ED',
  };

  function rgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── 1. Lead Funnel Chart (Horizontal Bar) ───────────────────
  const funnelCtx = document.getElementById('funnelChart');
  if (funnelCtx) {
    const funnelLabels = [
      'Discovered',
      'Verified',
      'Qualified',
      'Draft Ready',
      'Approved',
      'Sent',
      'Demo Generated',
      'Deployed'
    ];
    const funnelValues = [1284, 847, 312, 89, 61, 54, 31, 23];

    // Build gradient-like colors: darker blue as funnel narrows
    const funnelColors = [
      rgba(COLORS.primary, 0.9),
      rgba(COLORS.primary, 0.78),
      rgba(COLORS.accent, 0.85),
      rgba(COLORS.purple, 0.8),
      rgba(COLORS.purple, 0.65),
      rgba(COLORS.success, 0.85),
      rgba(COLORS.success, 0.72),
      rgba(COLORS.success, 0.9),
    ];

    new Chart(funnelCtx, {
      type: 'bar',
      data: {
        labels: funnelLabels,
        datasets: [{
          label: 'Count',
          data: funnelValues,
          backgroundColor: funnelColors,
          borderColor: funnelColors.map(c => c.replace(/[\d.]+\)$/, '1)')),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const val = ctx.parsed.x;
                const pct = ((val / 1284) * 100).toFixed(1);
                return ` ${val.toLocaleString()} leads  (${pct}% of total)`;
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            formatter: (val) => val.toLocaleString(),
            font: { weight: '700', size: 12 },
            color: COLORS.primary,
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: rgba(COLORS.border, 0.6) },
            ticks: {
              callback: (val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val,
              font: { size: 11 }
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12.5, weight: '500' } }
          }
        },
        layout: { padding: { right: 30 } }
      }
    });
  }

  // ── 2. Source Performance Chart (Vertical Bar) ──────────────
  const sourceCtx = document.getElementById('sourceChart');
  if (sourceCtx) {
    new Chart(sourceCtx, {
      type: 'bar',
      data: {
        labels: ['Google Places', 'LinkedIn', 'Yelp', 'Manual'],
        datasets: [{
          label: 'Leads Discovered',
          data: [480, 312, 198, 294],
          backgroundColor: [
            rgba(COLORS.primary, 0.85),
            rgba(COLORS.accent, 0.85),
            rgba(COLORS.warning, 0.85),
            rgba(COLORS.purple, 0.85),
          ],
          borderColor: [COLORS.primary, COLORS.accent, COLORS.warning, COLORS.purple],
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const val = ctx.parsed.y;
                const total = 480 + 312 + 198 + 294;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${val} leads (${pct}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: rgba(COLORS.border, 0.5) },
            ticks: { font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11.5, weight: '500' } }
          }
        }
      }
    });
  }

  // ── 3. Qualification by Category (Doughnut) ─────────────────
  const categoryCtx = document.getElementById('categoryChart');
  if (categoryCtx) {
    new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['E-commerce', 'Real Estate', 'Healthcare', 'Finance', 'Other'],
        datasets: [{
          data: [32, 24, 19, 15, 10],
          backgroundColor: [
            COLORS.primary,
            COLORS.accent,
            COLORS.success,
            COLORS.warning,
            COLORS.muted,
          ],
          borderColor: COLORS.surface,
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                return ` ${ctx.label}: ${ctx.parsed}%`;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart) {
          const { width, height, ctx } = chart;
          ctx.save();
          const text = '312';
          const sub  = 'Qualified';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const cx = width / 2;
          const cy = height / 2;
          ctx.font = `700 22px Inter, sans-serif`;
          ctx.fillStyle = '#101828';
          ctx.fillText(text, cx, cy - 10);
          ctx.font = `500 11px Inter, sans-serif`;
          ctx.fillStyle = '#667085';
          ctx.fillText(sub, cx, cy + 12);
          ctx.restore();
        }
      }]
    });
  }

  // ── 4. Demo Funnel Chart (Vertical Bar) ─────────────────────
  const demoFunnelCtx = document.getElementById('demoFunnelChart');
  if (demoFunnelCtx) {
    new Chart(demoFunnelCtx, {
      type: 'bar',
      data: {
        labels: ['Generated', 'Reviewed', 'Approved', 'Deployed'],
        datasets: [{
          label: 'Count',
          data: [43, 38, 31, 23],
          backgroundColor: [
            rgba(COLORS.primary, 0.85),
            rgba(COLORS.accent, 0.85),
            rgba(COLORS.success, 0.85),
            rgba(COLORS.purple, 0.85),
          ],
          borderColor: [COLORS.primary, COLORS.accent, COLORS.success, COLORS.purple],
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const val = ctx.parsed.y;
                const pct = ((val / 43) * 100).toFixed(0);
                return ` ${val} demos (${pct}% of generated)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            grid: { color: rgba(COLORS.border, 0.5) },
            ticks: { stepSize: 10, font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11.5, weight: '500' } }
          }
        }
      }
    });
  }

})();
