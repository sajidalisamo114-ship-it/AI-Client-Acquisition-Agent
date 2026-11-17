/**
 * ACAA — AI Client Acquisition Agent
 * Dashboard Analytics & Interactive Behaviors
 */

(function () {
  'use strict';

  // Format today's date dynamically for the header chip
  function initHeaderDate() {
    const dateEl = document.getElementById('header-date');
    if (dateEl) {
      const now = new Date();
      const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  // Lead Funnel Chart (Chart.js v4)
  let funnelChartInstance = null;
  function initLeadFunnelChart() {
    const canvas = document.getElementById('leadFunnelChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const funnelStages = [
      'Discovered',
      'Verified',
      'Qualified',
      'Draft Ready',
      'Approved',
      'Sent',
      'Demo Generated',
      'Deployed'
    ];

    const funnelData = [1284, 847, 312, 89, 61, 54, 31, 23];

    // Palette with progressive gradient effect
    const barColors = [
      '#2563EB', // Discovered - Primary blue
      '#06B6D4', // Verified - Cyan
      '#10B981', // Qualified - Emerald
      '#8B5CF6', // Draft Ready - Violet
      '#12B76A', // Approved - Green
      '#3B82F6', // Sent - Blue
      '#0EA5E9', // Demo Generated - Sky
      '#7C3AED'  // Deployed - Deep Purple
    ];

    funnelChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: funnelStages,
        datasets: [{
          label: 'Leads',
          data: funnelData,
          backgroundColor: barColors,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.85
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 0, right: 24, top: 8, bottom: 8 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#101828',
            titleFont: { family: 'Inter', size: 13, weight: '600' },
            bodyFont: { family: 'Inter', size: 12.5 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: function (context) {
                const count = context.raw;
                const total = funnelData[0];
                const pctOfTotal = ((count / total) * 100).toFixed(1);
                
                let stepRate = '';
                if (context.dataIndex > 0) {
                  const prev = funnelData[context.dataIndex - 1];
                  const conversion = ((count / prev) * 100).toFixed(1);
                  stepRate = ` (${conversion}% step conversion)`;
                }
                return ` ${count.toLocaleString()} leads (${pctOfTotal}% of total)${stepRate}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(220, 227, 237, 0.6)',
              drawBorder: false
            },
            ticks: {
              color: '#667085',
              font: { family: 'Inter', size: 11.5 }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#101828',
              font: { family: 'Inter', size: 12.5, weight: '600' }
            }
          }
        }
      }
    });
  }

  // Leads by Industry Doughnut Chart (Chart.js v4)
  let industryChartInstance = null;
  function initIndustryChart() {
    const canvas = document.getElementById('industryDoughnutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const industryLabels = ['E-commerce', 'Real Estate', 'Healthcare', 'Finance', 'Education', 'Other'];
    const industryData = [28, 22, 18, 15, 10, 7];
    const industryColors = [
      '#2563EB', // E-commerce
      '#06B6D4', // Real Estate
      '#12B76A', // Healthcare
      '#7C3AED', // Finance
      '#F79009', // Education
      '#98A2B3'  // Other
    ];

    industryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: industryLabels,
        datasets: [{
          data: industryData,
          backgroundColor: industryColors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        layout: {
          padding: 8
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#101828',
            titleFont: { family: 'Inter', size: 13, weight: '600' },
            bodyFont: { family: 'Inter', size: 12.5 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: function (context) {
                const totalLeads = 1284;
                const leadsCount = Math.round((context.raw / 100) * totalLeads);
                return ` ${context.label}: ${context.raw}% (~${leadsCount} leads)`;
              }
            }
          }
        }
      }
    });
  }

  // Approval preview details data store
  const approvalItemsData = {
    'app-1': {
      type: 'Outreach Email',
      badgeClass: 'badge-draft-ready',
      title: 'TechBuild Solutions — Expansion Outreach',
      business: 'TechBuild Solutions',
      location: 'Dubai, UAE',
      industry: 'PropTech / Real Estate SaaS',
      score: 87,
      submittedBy: 'AI Outreach Agent (GPT-4o)',
      submittedTime: '12 minutes ago',
      channel: 'Email Sequence + WhatsApp Backup',
      recipient: 'Tariq Al-Maktoum (Head of Partnerships)',
      recipientEmail: 'tariq.m@techbuild.ae',
      aiConfidence: '94%',
      tone: 'Professional, Value-Driven, Solution-Oriented',
      subject: 'Streamlining contractor lead verification for TechBuild Dubai',
      body: `Hi Tariq,\n\nI noticed TechBuild Solutions recently launched the Dubai contractor registry expansion. While scaling vendor operations, most PropTech platforms lose up to 34% of high-intent leads to delayed qualification and manual phone verification.\n\nWe deployed an automated client acquisition engine for similar platforms in EMEA that verifies license authenticity, filters spam inquiries in under 12 seconds, and hands off sales-ready deals directly to account managers.\n\nI prepared a 90-second sandbox preview tailored specifically for TechBuild: https://preview.acaa.ai/techbuild-dubai\n\nWould you be open to a 10-minute walk-through this Thursday afternoon?`
    },
    'app-2': {
      type: 'WhatsApp Pitch',
      badgeClass: 'badge-verified',
      title: 'Metro Digital Agency — Growth Partner Pitch',
      business: 'Metro Digital Agency',
      location: 'London, UK',
      industry: 'Healthcare / Digital Marketing',
      score: 72,
      submittedBy: 'WhatsApp Agent v2.4',
      submittedTime: '34 minutes ago',
      channel: 'WhatsApp Business API (+44 20 7946 0912)',
      recipient: 'Oliver Vance (Managing Director)',
      recipientEmail: 'oliver@metrodigital.co.uk',
      aiConfidence: '91%',
      tone: 'Conversational, Direct, ROI-focused',
      subject: 'WhatsApp direct message pitch',
      body: `Hello Oliver! Sarah from ACAA here.\n\nSaw Metro Digital's recent case study with private dental clinics in London. Impressive patient acquisition numbers.\n\nQuick observation: our automated audit noticed your client intake form on mobile lacks instant WhatsApp routing, which typically drops consultation bookings by 22%.\n\nWe built a rapid AI qualification flow that engages prospects in under 30 seconds via WhatsApp and synchronizes with your agency CRM.\n\nHere's an interactive demo we generated for your team: https://preview.acaa.ai/metro-london\n\nWorth a 5-minute chat next week?`
    },
    'app-3': {
      type: 'Interactive Demo',
      badgeClass: 'badge-ai',
      title: 'Sunrise E-commerce Ltd — Automated Demo Staging',
      business: 'Sunrise E-commerce Ltd',
      location: 'Singapore',
      industry: 'E-commerce / DTC Retail',
      score: 91,
      submittedBy: 'Demo Studio AI',
      submittedTime: '1 hour ago',
      channel: 'Edge Deployed Interactive Sandbox',
      recipient: 'Evelyn Tan (VP E-Commerce)',
      recipientEmail: 'evelyn.tan@sunrise-ecom.sg',
      aiConfidence: '97%',
      tone: 'Show-don\'t-tell, High Technical Fidelity',
      subject: 'Interactive client acquisition agent preview for Sunrise DTC',
      body: `Dear Evelyn,\n\nCongratulations on expanding Sunrise's Southeast Asian logistics hub.\n\nWe constructed a personalized, live AI client acquisition agent modeled directly on Sunrise E-commerce's catalog navigation and customer checkout flows.\n\nKey sandbox capabilities initialized:\n1. 24/7 autonomous cart recovery and qualification\n2. Real-time localized WhatsApp conversational checkout\n3. CRM lead tagging for high-AOV orders\n\nSandbox Preview URL: https://demos.acaa.ai/view/sunrise-sg-v1\nDeployment status: Live on Global Edge CDN\n\nReview the configuration and authorize live delivery to Evelyn Tan.`
    },
    'app-4': {
      type: 'High-Value Pitch',
      badgeClass: 'badge-needs-review',
      title: 'Pacific Web Designs — Multi-Channel Pitch',
      business: 'Pacific Web Designs',
      location: 'Sydney, Australia',
      industry: 'Education / Web LMS',
      score: 65,
      submittedBy: 'Strategic Outbound Engine',
      submittedTime: '2 hours ago',
      channel: 'Executive Email + Voice Briefing',
      recipient: 'Liam Campbell (Founder & CEO)',
      recipientEmail: 'liam@pacificwebdesigns.com.au',
      aiConfidence: '86%',
      tone: 'Strategic, Consultative, Authoritative',
      subject: 'Automating high-ticket student enrollment pipelines for Pacific LMS',
      body: `Hi Liam,\n\nLoved the recent design revamp Pacific Web Designs delivered for Melbourne Institute of Tech.\n\nWith high-ticket education portals, qualification latency kills conversion. We developed an AI acquisition agent specifically tailored for higher education web applications that pre-qualifies student applicant inquiries before they reach your sales team.\n\nWe've modeled a custom demo for Pacific Web: https://preview.acaa.ai/pacific-aus\n\nLet me know if you'd like us to enable this for your upcoming Q1 cohort campaign.`
    }
  };

  // Open Approval Modal with populated data
  window.viewApprovalDetails = function (approvalId) {
    const data = approvalItemsData[approvalId];
    if (!data) return;

    const modal = document.getElementById('approval-preview-modal');
    if (!modal) return;

    document.getElementById('modal-app-type').className = `badge ${data.badgeClass}`;
    document.getElementById('modal-app-type').textContent = data.type;
    document.getElementById('modal-app-title').textContent = data.title;
    document.getElementById('modal-app-business').textContent = `${data.business} (${data.location})`;
    document.getElementById('modal-app-meta').textContent = `Submitted by ${data.submittedBy} · ${data.submittedTime}`;
    document.getElementById('modal-app-recipient').textContent = `${data.recipient} <${data.recipientEmail}>`;
    document.getElementById('modal-app-channel').textContent = data.channel;
    document.getElementById('modal-app-confidence').textContent = data.aiConfidence;
    document.getElementById('modal-app-score').textContent = `${data.score}/100`;
    document.getElementById('modal-app-subject').textContent = data.subject;
    document.getElementById('modal-app-body').textContent = data.body;

    const approveBtn = document.getElementById('modal-approve-action-btn');
    if (approveBtn) {
      approveBtn.onclick = function () {
        window.closeModal('approval-preview-modal');
        approveItemDirect(approvalId, data.business);
      };
    }

    window.openModal('approval-preview-modal');
  };

  // Direct quick approve from list or modal
  window.quickApprove = function (btn, approvalId, businessName) {
    if (window.confirmAction) {
      window.confirmAction({
        title: `Approve Sequence for ${businessName}?`,
        message: `This will dispatch the AI-generated outreach sequence immediately via the configured channel and log it in the audit trail.`,
        confirmText: 'Yes, Approve & Dispatch',
        type: 'success',
        onConfirm: () => {
          approveItemDirect(approvalId, businessName);
        }
      });
    } else {
      approveItemDirect(approvalId, businessName);
    }
  };

  function approveItemDirect(approvalId, businessName) {
    const card = document.getElementById(`approval-card-${approvalId}`);
    if (card) {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '0.4';
      card.style.background = 'var(--clr-success-light)';
      const actions = card.querySelector('.approval-actions');
      if (actions) {
        actions.innerHTML = `
          <span class="badge badge-approved" style="padding: 6px 12px;">
            <i class="bi bi-check-circle-fill"></i> Approved & Queued
          </span>
        `;
      }
    }

    if (window.showToast) {
      window.showToast({
        title: 'Campaign Approved',
        message: `Outreach for ${businessName} scheduled for immediate dispatch.`,
        type: 'success'
      });
    }

    // Update pending approvals counter
    const kpiEl = document.getElementById('kpi-pending-approvals');
    if (kpiEl) {
      const current = parseInt(kpiEl.textContent, 10);
      if (!isNaN(current) && current > 0) {
        kpiEl.textContent = current - 1;
      }
    }

    const badgeEl = document.getElementById('top-pending-badge');
    if (badgeEl) {
      const currentBadge = parseInt(badgeEl.textContent, 10);
      if (!isNaN(currentBadge) && currentBadge > 0) {
        badgeEl.textContent = currentBadge - 1;
      }
    }
  }

  // Retry Background Job
  window.retryJob = function (jobId) {
    const badge = document.getElementById(`job-${jobId}-badge`);
    const progressFill = document.getElementById(`job-${jobId}-progress`);
    const retryBtn = document.getElementById(`job-${jobId}-retry-btn`);
    const meta = document.getElementById(`job-${jobId}-meta`);

    if (retryBtn) {
      retryBtn.disabled = true;
      retryBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Retrying...';
      retryBtn.classList.add('btn-loading');
    }

    if (badge) {
      badge.className = 'badge badge-processing';
      badge.textContent = 'Re-queued';
    }

    if (meta) {
      meta.textContent = 'Restarting Apollo sync with exponential backoff delay...';
    }

    if (window.showToast) {
      window.showToast({
        title: 'Job Re-queued',
        message: `Batch #${jobId} has been submitted to the automation worker pool.`,
        type: 'default'
      });
    }

    // Simulate progress restart
    setTimeout(() => {
      if (progressFill) {
        progressFill.style.background = 'var(--clr-primary)';
        progressFill.style.width = '62%';
      }
      if (badge) {
        badge.textContent = 'Processing 62%';
      }
      if (meta) {
        meta.textContent = 'Worker node #3 assigned · Resumed from checkpoint #28 · Rate limit backoff resolved';
      }
      if (retryBtn) {
        retryBtn.style.display = 'none';
      }
      if (window.showToast) {
        window.showToast({
          title: 'Job In Progress',
          message: `Batch #${jobId} resumed execution successfully.`,
          type: 'success'
        });
      }
    }, 1800);
  };

  // Refresh Jobs list simulation
  window.refreshJobs = function () {
    const refreshBtn = document.getElementById('refresh-jobs-btn');
    if (refreshBtn) {
      const icon = refreshBtn.querySelector('i');
      if (icon) icon.classList.add('spin-icon');
      setTimeout(() => {
        if (icon) icon.classList.remove('spin-icon');
        if (window.showToast) {
          window.showToast({
            title: 'Jobs Synchronized',
            message: 'Background worker queues and execution states are up to date.',
            type: 'default'
          });
        }
      }, 700);
    }
  };

  // Quick filter for Funnel
  window.filterFunnel = function (range, btn) {
    const btns = document.querySelectorAll('.funnel-filter-btn');
    btns.forEach(b => b.classList.remove('btn-primary', 'active'));
    btns.forEach(b => b.classList.add('btn-secondary'));
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary', 'active');

    if (!funnelChartInstance) return;

    let updatedData;
    if (range === '7d') {
      updatedData = [340, 235, 96, 32, 24, 21, 14, 9];
    } else if (range === '30d') {
      updatedData = [1284, 847, 312, 89, 61, 54, 31, 23];
    } else { // 'quarter'
      updatedData = [3890, 2610, 940, 280, 195, 172, 102, 74];
    }

    funnelChartInstance.data.datasets[0].data = updatedData;
    funnelChartInstance.update();

    if (window.showToast) {
      window.showToast({
        title: 'Funnel Updated',
        message: `Showing pipeline funnel data for ${range === '7d' ? 'last 7 days' : range === '30d' ? 'last 30 days' : 'this quarter'}.`,
        type: 'default'
      });
    }
  };

  // Initialize once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderDate();
    initLeadFunnelChart();
    initIndustryChart();
  });

})();
