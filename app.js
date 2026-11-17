/**
 * ACAA — AI Client Acquisition Agent
 * Core application JS: sidebar, topbar, modals, drawers, toasts, tabs, pagination
 */

(function () {
  'use strict';

  /* ── Sidebar ── */
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = collapseBtn.querySelector('i');
      if (sidebar.classList.contains('collapsed')) {
        if (icon) { icon.className = 'bi bi-layout-sidebar-inset'; }
      } else {
        if (icon) { icon.className = 'bi bi-layout-sidebar'; }
      }
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
      const icon = collapseBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-layout-sidebar-inset';
    }
  }

  if (mobileMenuBtn && sidebar && sidebarOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('show');
    });
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
  }

  // Active nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
      item.classList.add('active');
    }
  });

  /* ── Tabs ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('[data-tab-group]') || btn.closest('.tabs')?.parentElement;
      const target = btn.dataset.tab;

      btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tabGroup) {
        tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = tabGroup.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      }
    });
  });

  /* ── Modals ── */
  window.openModal = function (id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.style.display = 'flex';
    requestAnimationFrame(() => backdrop.classList.add('open'));
    trapFocus(backdrop);
  };

  window.closeModal = function (id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.classList.remove('open');
    setTimeout(() => { backdrop.style.display = 'none'; }, 220);
  };

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose || btn.closest('.modal-backdrop')?.id));
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeModal(backdrop.id);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(b => closeModal(b.id));
      document.querySelectorAll('.drawer.open').forEach(d => closeDrawer(d.id));
    }
  });

  /* ── Drawers ── */
  window.openDrawer = function (id) {
    const drawer = document.getElementById(id);
    const backdrop = document.querySelector(`[data-drawer-backdrop="${id}"]`);
    if (drawer) { drawer.classList.add('open'); }
    if (backdrop) { backdrop.classList.add('open'); }
    trapFocus(drawer);
  };

  window.closeDrawer = function (id) {
    const drawer = document.getElementById(id);
    const backdrop = document.querySelector(`[data-drawer-backdrop="${id}"]`);
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  };

  document.querySelectorAll('[data-drawer-open]').forEach(btn => {
    btn.addEventListener('click', () => openDrawer(btn.dataset.drawerOpen));
  });

  document.querySelectorAll('[data-drawer-close]').forEach(btn => {
    btn.addEventListener('click', () => closeDrawer(btn.dataset.drawerClose || btn.closest('.drawer')?.id));
  });

  document.querySelectorAll('.drawer-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) {
        const drawerId = backdrop.dataset.drawerBackdrop;
        if (drawerId) closeDrawer(drawerId);
      }
    });
  });

  /* ── Focus Trap ── */
  function trapFocus(element) {
    if (!element) return;
    const focusable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  /* ── Toast Notifications ── */
  window.showToast = function ({ title, message, type = 'default', duration = 4000 }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: 'bi-check-circle-fill',
      error:   'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      default: 'bi-info-circle-fill',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="bi ${icons[type] || icons.default} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()"><i class="bi bi-x"></i></button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut .2s ease forwards';
      setTimeout(() => toast.remove(), 220);
    }, duration);
  };

  /* ── Confirm Action Helper ── */
  window.confirmAction = function ({ title, message, confirmText = 'Confirm', type = 'danger', onConfirm }) {
    const modalId = 'confirm-action-modal';
    let modal = document.getElementById(modalId);

    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal-backdrop';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="modal" style="max-width:420px;">
          <div class="modal-body" style="text-align:center;padding:var(--sp-8);">
            <div class="confirm-icon danger" id="confirm-icon-el"><i class="bi bi-exclamation-triangle"></i></div>
            <div class="modal-title mb-3" id="confirm-title-el" style="font-size:18px;"></div>
            <p id="confirm-msg-el" style="font-size:13.5px;color:var(--clr-muted);margin-bottom:var(--sp-6);"></p>
            <div style="display:flex;gap:var(--sp-3);justify-content:center;">
              <button class="btn btn-secondary" onclick="closeModal('${modalId}')">Cancel</button>
              <button class="btn btn-danger" id="confirm-action-btn"></button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById('confirm-title-el').textContent = title;
    document.getElementById('confirm-msg-el').textContent = message;
    document.getElementById('confirm-action-btn').textContent = confirmText;

    const iconEl = document.getElementById('confirm-icon-el');
    iconEl.className = `confirm-icon ${type}`;
    iconEl.innerHTML = type === 'danger' ? '<i class="bi bi-exclamation-triangle"></i>'
                     : type === 'warning' ? '<i class="bi bi-exclamation-circle"></i>'
                     : '<i class="bi bi-check-circle"></i>';

    const confirmBtn = document.getElementById('confirm-action-btn');
    confirmBtn.className = `btn btn-${type === 'danger' ? 'danger' : type === 'warning' ? 'secondary' : 'success'}`;

    confirmBtn.onclick = () => {
      closeModal(modalId);
      if (typeof onConfirm === 'function') onConfirm();
    };

    openModal(modalId);
  };

  /* ── Global Search ── */
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter' && globalSearch.value.trim()) {
        // Stub: could navigate to leads?q=...
        window.location.href = `../leads/index.html?q=${encodeURIComponent(globalSearch.value.trim())}`;
      }
    });
  }

  /* ── Password Show/Hide ── */
  document.querySelectorAll('[data-pw-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.pwToggle);
      if (!target) return;
      const isText = target.type === 'text';
      target.type = isText ? 'password' : 'text';
      const icon = btn.querySelector('i');
      if (icon) icon.className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
  });

  /* ── Sortable Table Columns ── */
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const table = th.closest('table');
      const col = Array.from(th.parentElement.children).indexOf(th);
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const asc = !th.classList.contains('sorted-asc');

      table.querySelectorAll('th.sortable').forEach(t => t.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');
      const icon = th.querySelector('.sort-icon');
      if (icon) icon.className = `bi ${asc ? 'bi-arrow-up' : 'bi-arrow-down'} sort-icon`;

      rows.sort((a, b) => {
        const aVal = a.children[col]?.textContent.trim() || '';
        const bVal = b.children[col]?.textContent.trim() || '';
        return asc ? aVal.localeCompare(bVal, undefined, { numeric: true })
                   : bVal.localeCompare(aVal, undefined, { numeric: true });
      });

      rows.forEach(r => tbody.appendChild(r));
    });
  });

  /* ── Select All Checkbox ── */
  const selectAll = document.getElementById('select-all');
  if (selectAll) {
    selectAll.addEventListener('change', () => {
      document.querySelectorAll('.row-select').forEach(cb => { cb.checked = selectAll.checked; });
      updateBulkActions();
    });
    document.querySelectorAll('.row-select').forEach(cb => {
      cb.addEventListener('change', updateBulkActions);
    });
  }

  function updateBulkActions() {
    const checked = document.querySelectorAll('.row-select:checked').length;
    const bulkBar = document.getElementById('bulk-action-bar');
    if (bulkBar) {
      bulkBar.style.display = checked > 0 ? 'flex' : 'none';
      const count = bulkBar.querySelector('.bulk-count');
      if (count) count.textContent = `${checked} selected`;
    }
  }

  /* ── Filter Toggles ── */
  document.querySelectorAll('[data-filter-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.filterToggle);
      if (panel) {
        const isOpen = panel.style.display !== 'none';
        panel.style.display = isOpen ? 'none' : 'block';
        btn.classList.toggle('active', !isOpen);
      }
    });
  });

  /* ── Auto-dismiss Alerts ── */
  document.querySelectorAll('[data-auto-dismiss]').forEach(el => {
    setTimeout(() => el.remove(), parseInt(el.dataset.autoDismiss, 10) || 5000);
  });

  /* ── Notification Bell ── */
  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast({ title: 'Notifications', message: '3 items need your review', type: 'default' });
    });
  }

})();
