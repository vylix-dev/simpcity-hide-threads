// ==UserScript==
// @name         SimpCity Hide Threads
// @namespace    https://github.com/vylix-dev/simpcity-hide-threads
// @version      1.0.0
// @description  Persistently hide SimpCity threads and manage your hidden-thread list.
// @author       vylix-dev
// @license      MIT
// @homepageURL  https://github.com/vylix-dev/simpcity-hide-threads
// @supportURL   https://github.com/vylix-dev/simpcity-hide-threads/issues
// @updateURL    https://raw.githubusercontent.com/vylix-dev/simpcity-hide-threads/main/simpcity-hide-threads.meta.js
// @downloadURL  https://raw.githubusercontent.com/vylix-dev/simpcity-hide-threads/main/simpcity-hide-threads.user.js
// @match        *://simpcity.su/*
// @match        *://www.simpcity.su/*
// @match        *://*.simpcity.su/*
// @match        *://simpcity.cr/*
// @match        *://www.simpcity.cr/*
// @match        *://*.simpcity.cr/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const APP = Object.freeze({
    id: 'sch',
    name: 'SimpCity Hide Threads',
    storageKey: 'simpcity_hidden_threads_v1',
  });

  const THREAD_ROW_SELECTOR = '.structItem--thread, .structItem';
  const UNPROCESSED_THREAD_SELECTOR = '.structItem--thread:not([data-sch-processed]), .structItem:not([data-sch-processed])';
  const THREAD_LINK_SELECTOR = 'a[href*="/threads/"]';

  const CSS = String.raw`
    .sch-hide-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 22px !important;
      margin-left: 8px !important;
      padding: 2px 8px !important;
      border: 1px solid rgba(248, 113, 113, 0.38) !important;
      border-radius: 999px !important;
      background: rgba(248, 113, 113, 0.1) !important;
      color: #fca5a5 !important;
      cursor: pointer !important;
      font: 700 11px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      transition: opacity 140ms ease, transform 140ms ease, background 140ms ease !important;
      vertical-align: middle !important;
    }

    .sch-hide-btn:hover,
    .sch-hide-btn:focus-visible {
      background: rgba(248, 113, 113, 0.2) !important;
      color: #fecaca !important;
      opacity: 1 !important;
      outline: none !important;
      transform: translateY(-1px) !important;
    }

    .sch-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 16px !important;
      background: rgba(2, 6, 23, 0.72) !important;
      backdrop-filter: blur(4px) !important;
    }

    .sch-modal {
      width: min(720px, 96vw) !important;
      max-height: 88vh !important;
      overflow: auto !important;
      border: 1px solid rgba(148, 163, 184, 0.24) !important;
      border-radius: 16px !important;
      background: #111827 !important;
      color: #e5e7eb !important;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7) !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    .sch-modal-header,
    .sch-modal-footer {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      padding: 14px 18px !important;
      border-bottom: 1px solid rgba(148, 163, 184, 0.16) !important;
    }

    .sch-modal-footer {
      justify-content: flex-end !important;
      border-top: 1px solid rgba(148, 163, 184, 0.16) !important;
      border-bottom: none !important;
    }

    .sch-modal-title {
      margin: 0 !important;
      font-size: 16px !important;
      font-weight: 800 !important;
    }

    .sch-modal-body {
      padding: 16px 18px !important;
    }

    .sch-modal-note,
    .sch-empty,
    .sch-thread-meta {
      color: #9ca3af !important;
      font-size: 13px !important;
    }

    .sch-thread-list {
      display: grid !important;
      gap: 10px !important;
      margin: 14px 0 0 !important;
      padding: 0 !important;
      list-style: none !important;
    }

    .sch-thread-row {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) auto !important;
      gap: 12px !important;
      align-items: center !important;
      padding: 10px !important;
      border: 1px solid rgba(148, 163, 184, 0.16) !important;
      border-radius: 12px !important;
      background: rgba(15, 23, 42, 0.72) !important;
    }

    .sch-thread-link {
      color: #93c5fd !important;
      font-weight: 700 !important;
      text-decoration: none !important;
      word-break: break-word !important;
    }

    .sch-thread-link:hover,
    .sch-thread-link:focus-visible {
      color: #bfdbfe !important;
      text-decoration: underline !important;
      outline: none !important;
    }

    .sch-button {
      min-height: 34px !important;
      padding: 0 12px !important;
      border: none !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      font: 700 13px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    .sch-button-primary {
      background: #60a5fa !important;
      color: #07111f !important;
    }

    .sch-button-danger {
      background: #dc2626 !important;
      color: #fff !important;
    }

    .sch-button-ghost {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #e5e7eb !important;
    }

    .sch-button:hover,
    .sch-button:focus-visible {
      filter: brightness(1.08) !important;
      outline: none !important;
    }

    @media (max-width: 620px) {
      .sch-thread-row {
        grid-template-columns: 1fr !important;
      }

      .sch-modal-footer {
        align-items: stretch !important;
        flex-direction: column !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sch-hide-btn {
        transition: none !important;
      }

      .sch-hide-btn:hover,
      .sch-hide-btn:focus-visible {
        transform: none !important;
      }
    }
  `;

  let initialized = false;
  let scanQueued = false;

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  function toThreadId(value) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return null;
    return numeric;
  }

  function normalizeHiddenItem(item) {
    if (!isPlainObject(item)) return null;

    const id = toThreadId(item.id);
    if (!id) return null;

    const title = typeof item.title === 'string' && item.title.trim() ? item.title.trim() : `Thread #${id}`;
    const url = normalizeThreadUrl(typeof item.url === 'string' && item.url.trim() ? item.url.trim() : `/threads/${id}/`);

    return { id, title, url };
  }

  function normalizeHiddenList(input) {
    if (!Array.isArray(input)) return [];

    const seen = new Set();
    const list = [];

    input.forEach((item) => {
      const normalized = normalizeHiddenItem(item);
      if (!normalized || seen.has(normalized.id)) return;
      seen.add(normalized.id);
      list.push(normalized);
    });

    return list;
  }

  function parseStoredValue(value) {
    if (value == null || value === '') return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function storageGet(key) {
    try {
      if (typeof GM_getValue === 'function') return GM_getValue(key, '[]');
    } catch (_error) {
      // Fall through to localStorage.
    }

    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return '[]';
    }
  }

  function storageSet(key, value) {
    const payload = JSON.stringify(value);
    let saved = false;

    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, payload);
        saved = true;
      }
    } catch (_error) {
      saved = false;
    }

    if (!saved) {
      try {
        window.localStorage.setItem(key, payload);
      } catch (_error) {
        // Hidden-thread persistence is best-effort if all storage APIs fail.
      }
    }
  }

  function loadHidden() {
    return normalizeHiddenList(parseStoredValue(storageGet(APP.storageKey)));
  }

  function saveHidden(list) {
    storageSet(APP.storageKey, normalizeHiddenList(list));
  }

  function addStyle(css) {
    try {
      if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
        return;
      }
    } catch (_error) {
      // Fall through to a normal style tag.
    }

    const style = document.createElement('style');
    style.setAttribute('data-sch-style', 'true');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function createElement(tagName, props = {}, children = []) {
    const node = document.createElement(tagName);

    Object.entries(props).forEach(([key, value]) => {
      if (value == null || value === false) return;

      if (key === 'className') {
        node.className = String(value);
        return;
      }

      if (key === 'textContent') {
        node.textContent = String(value);
        return;
      }

      if (key === 'dataset' && isPlainObject(value)) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
        return;
      }

      if (key === 'attributes' && isPlainObject(value)) {
        Object.entries(value).forEach(([attrName, attrValue]) => {
          if (attrValue != null && attrValue !== false) node.setAttribute(attrName, String(attrValue));
        });
        return;
      }

      if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
        return;
      }

      if (key in node) {
        try {
          node[key] = value;
          return;
        } catch (_error) {
          // Fall back to setAttribute below.
        }
      }

      node.setAttribute(key, String(value));
    });

    const childList = Array.isArray(children) ? children : [children];
    childList.forEach((child) => {
      if (child == null) return;
      node.append(child && typeof child.nodeType === 'number' ? child : document.createTextNode(String(child)));
    });

    return node;
  }

  function getThreadId(href) {
    const match = String(href || '').match(/\/threads\/(?:[^/]+\.)?(\d+)(?:[/?#]|$)/i);
    return match ? toThreadId(match[1]) : null;
  }

  function normalizeThreadUrl(href) {
    try {
      const url = new URL(href || window.location.href, window.location.href);
      const hostname = url.hostname.toLowerCase();
      const allowedHost = hostname === 'simpcity.su' ||
        hostname.endsWith('.simpcity.su') ||
        hostname === 'simpcity.cr' ||
        hostname.endsWith('.simpcity.cr');

      return url.protocol === 'https:' && allowedHost ? url.href : window.location.href;
    } catch (_error) {
      return window.location.href;
    }
  }

  function getThreadInfo(row) {
    const link = row.querySelector(THREAD_LINK_SELECTOR);
    if (!link) return null;

    const href = link.getAttribute('href') || link.href || '';
    const id = getThreadId(href);
    if (!id) return null;

    const title = link.textContent && link.textContent.trim() ? link.textContent.trim() : `Thread #${id}`;
    return { id, title, url: normalizeThreadUrl(href) };
  }

  function hideRow(row) {
    row.style.setProperty('display', 'none', 'important');
    row.dataset.schHidden = 'true';
  }

  function revealRows(id) {
    document.querySelectorAll(`[data-sch-thread-id="${id}"]`).forEach((row) => {
      row.style.removeProperty('display');
      delete row.dataset.schHidden;
      delete row.dataset.schProcessed;
    });
  }

  function addHidden(info) {
    const list = loadHidden();
    if (list.some((item) => item.id === info.id)) return list;

    const nextList = normalizeHiddenList([...list, info]);
    saveHidden(nextList);
    return nextList;
  }

  function removeHidden(id) {
    const nextList = loadHidden().filter((item) => item.id !== id);
    saveHidden(nextList);
    revealRows(id);
    queueScan();
    return nextList;
  }

  function clearHidden() {
    const previous = loadHidden();
    saveHidden([]);
    previous.forEach((item) => revealRows(item.id));
    queueScan();
    return [];
  }

  function addHideButton(row, info) {
    if (row.querySelector('.sch-hide-btn')) return;

    const target = row.querySelector('.structItem-title') || row.querySelector('h3') || row.querySelector(THREAD_LINK_SELECTOR)?.parentElement;
    if (!target) return;

    const button = createElement('button', {
      type: 'button',
      className: 'sch-hide-btn',
      textContent: 'Hide',
      title: `Hide ${info.title}`,
      attributes: { 'aria-label': `Hide ${info.title}` },
      onclick: (event) => {
        event.preventDefault();
        event.stopPropagation();
        addHidden(info);
        hideRow(row);
      },
    });

    target.appendChild(button);
  }

  function processThreads(root = document) {
    const hidden = loadHidden();
    const hiddenIds = new Set(hidden.map((item) => item.id));
    const scope = root && typeof root.querySelectorAll === 'function' ? root : document;

    scope.querySelectorAll(UNPROCESSED_THREAD_SELECTOR).forEach((row) => {
      const info = getThreadInfo(row);
      if (!info) return;

      row.dataset.schThreadId = String(info.id);

      if (hiddenIds.has(info.id)) {
        hideRow(row);
        row.dataset.schProcessed = 'true';
        return;
      }

      addHideButton(row, info);
      row.dataset.schProcessed = 'true';
    });
  }

  function getFocusableElements(root) {
    return Array.from(root.querySelectorAll([
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','))).filter((node) => node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement);
  }

  function trapFocus(event, modal) {
    const focusable = getFocusableElements(modal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openManagerModal(opener = document.activeElement) {
    if (document.querySelector('.sch-overlay')) return;

    const previousActiveElement = opener && typeof opener.focus === 'function' ? opener : null;
    const titleId = `${APP.id}-manager-title`;
    let list = loadHidden();

    const overlay = createElement('div', { className: 'sch-overlay' });
    const modal = createElement('div', {
      className: 'sch-modal',
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': titleId,
      },
    });

    const title = createElement('h2', { id: titleId, className: 'sch-modal-title', textContent: 'Hidden Threads' });
    const closeButton = createElement('button', {
      type: 'button',
      className: 'sch-button sch-button-ghost',
      textContent: 'Close',
    });
    const body = createElement('div', { className: 'sch-modal-body' });
    const clearButton = createElement('button', {
      type: 'button',
      className: 'sch-button sch-button-danger',
      textContent: 'Clear all',
    });

    function closeModal() {
      document.removeEventListener('keydown', onDocumentKeydown, true);
      overlay.remove();
      if (previousActiveElement) previousActiveElement.focus();
    }

    function renderList() {
      const children = [
        createElement('p', {
          className: 'sch-modal-note',
          textContent: 'Hidden threads are stored locally by Tampermonkey and apply across SimpCity pages.',
        }),
      ];

      if (!list.length) {
        children.push(createElement('p', { className: 'sch-empty', textContent: 'No threads are currently hidden.' }));
      } else {
        const rows = list.map((item) => {
          const link = createElement('a', {
            className: 'sch-thread-link',
            href: item.url,
            textContent: item.title,
            target: '_blank',
            rel: 'noreferrer',
          });
          const meta = createElement('div', { className: 'sch-thread-meta', textContent: `ID: ${item.id}` });
          const unhideButton = createElement('button', {
            type: 'button',
            className: 'sch-button sch-button-primary',
            textContent: 'Unhide',
            onclick: () => {
              list = removeHidden(item.id);
              renderList();
            },
          });

          return createElement('li', { className: 'sch-thread-row' }, [
            createElement('div', {}, [link, meta]),
            unhideButton,
          ]);
        });

        children.push(createElement('ul', { className: 'sch-thread-list' }, rows));
      }

      body.replaceChildren(...children);
      clearButton.disabled = list.length === 0;
    }

    function onDocumentKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else if (event.key === 'Tab') {
        trapFocus(event, modal);
      }
    }

    closeButton.addEventListener('click', closeModal);
    clearButton.addEventListener('click', () => {
      if (!list.length) return;
      if (!window.confirm('Clear all hidden threads? This cannot be undone.')) return;
      list = clearHidden();
      renderList();
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeModal();
    });

    modal.append(
      createElement('div', { className: 'sch-modal-header' }, [title, closeButton]),
      body,
      createElement('div', { className: 'sch-modal-footer' }, [clearButton]),
    );
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onDocumentKeydown, true);

    renderList();

    const firstFocusable = getFocusableElements(modal)[0];
    if (firstFocusable) firstFocusable.focus();
  }

  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;

    window.requestAnimationFrame(() => {
      scanQueued = false;
      processThreads(document);
    });
  }

  function registerMenuCommands() {
    if (typeof GM_registerMenuCommand !== 'function') return;

    try {
      GM_registerMenuCommand('Manage hidden threads', () => openManagerModal());
      GM_registerMenuCommand('Rescan hidden threads', () => processThreads(document));
    } catch (_error) {
      // Menu commands are optional; inline hide buttons remain the primary UI.
    }
  }

  function init() {
    if (initialized || !document.body) return;
    initialized = true;

    addStyle(CSS);
    processThreads(document);
    registerMenuCommands();

    const observer = new MutationObserver((mutationList) => {
      const hasAddedElement = mutationList.some((mutation) => Array.from(mutation.addedNodes || []).some((node) => (
        node.nodeType === Node.ELEMENT_NODE
      )));

      if (hasAddedElement) queueScan();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
