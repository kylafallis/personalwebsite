// ============================================================
// render.js — Dynamic content from SITE_DATA (data.js)
// Load order: data.js → render.js → main.js
// All functions run at parse time (scripts at bottom of body),
// so .reveal elements exist before main.js sets up the observer.
// ============================================================

(function () {
  'use strict';

  // ── HELPERS ──────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fill(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function has(id) {
    return !!document.getElementById(id);
  }

  function tagList(arr) {
    return (arr || []).map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('');
  }

  function badgeClass(badge) {
    return badge === 'published' ? 'badge-published' : 'badge-press';
  }


  // ══════════════════════════════════════════════════════════════
  // HOME PAGE
  // ══════════════════════════════════════════════════════════════

  // Highlights bar  ───────────────────────────────────────────
  function renderHighlights() {
    if (!has('highlights-grid')) return;
    fill('highlights-grid',
      (SITE_DATA.highlights || []).map(function (h) {
        return '<div class="highlight-item">' +
          '<div class="highlight-number">' + esc(h.number) + '</div>' +
          '<div class="highlight-label">' + esc(h.label) + '</div>' +
          '<p>' + esc(h.text) + '</p>' +
          '</div>';
      }).join('')
    );
  }

  // Research preview cards  ───────────────────────────────────
  function renderResearchPreview() {
    if (!has('research-preview-grid')) return;
    var featured = (SITE_DATA.research || [])
      .filter(function (r) { return !r.secondary; })
      .slice(0, 2);

    fill('research-preview-grid',
      featured.map(function (r, i) {
        return '<div class="research-card-home reveal reveal-delay-' + (i + 1) + '">' +
          '<div class="journal">' + esc(r.card_label) + '</div>' +
          '<span class="badge ' + badgeClass(r.badge) + '">' + esc(r.badge_text) + '</span>' +
          '<h3>' + esc(r.title) + '</h3>' +
          '<p>' + esc(r.summary) + '</p>' +
          '<div class="tag-list">' + tagList(r.tags) + '</div>' +
          '<a href="research.html#' + esc(r.id) + '" class="btn btn-ghost" style="margin-top:1rem;">Read More <span class="arrow">\u2192</span></a>' +
          '</div>';
      }).join('')
    );
  }

  // FairGame stats grid  ──────────────────────────────────────
  function renderFairGameStats() {
    if (!has('fairgame-stats')) return;
    fill('fairgame-stats',
      (SITE_DATA.fairgame.stats || []).map(function (s) {
        return '<div class="fg-stat">' +
          '<div class="num">' + esc(s.num) + '</div>' +
          '<div class="lbl">' + esc(s.lbl) + '</div>' +
          '</div>';
      }).join('')
    );
  }

  // Speaking teaser (first 3 entries)  ───────────────────────
  function renderSpeakingTeaser() {
    if (!has('speaking-list')) return;
    fill('speaking-list',
      (SITE_DATA.speaking || []).slice(0, 3).map(function (s, i) {
        return '<div class="speaking-item reveal reveal-delay-' + (i + 1) + '">' +
          '<div class="event-org">' + esc(s.org) + '</div>' +
          '<div class="event-name">' + esc(s.event) + '</div>' +
          '</div>';
      }).join('')
    );
  }

  // As Seen In grid  ──────────────────────────────────────────
  function renderSeenIn() {
    if (!has('seen-in-grid')) return;
    fill('seen-in-grid',
      (SITE_DATA.as_seen_in || []).map(function (item) {
        var inner =
          '<span class="seen-in-type">'   + esc(item.type)   + '</span>' +
          '<span class="seen-in-source">' + esc(item.source) + '</span>' +
          '<span class="seen-in-title">'  + esc(item.title)  + '</span>';
        if (item.url) {
          return '<div class="seen-in-item">' +
            '<a href="' + esc(item.url) + '" target="_blank" rel="noopener">' +
            inner + '<span class="seen-in-arrow">\u2197</span>' +
            '</a></div>';
        }
        return '<div class="seen-in-item no-link">' + inner + '</div>';
      }).join('')
    );
  }


  // ══════════════════════════════════════════════════════════════
  // RESEARCH PAGE
  // ══════════════════════════════════════════════════════════════

  function renderResearchEntries() {
    if (!has('research-entries')) return;

    var primary   = (SITE_DATA.research || []).filter(function (r) { return !r.secondary; });
    var secondary = (SITE_DATA.research || []).filter(function (r) { return  r.secondary; });

    var primaryHtml = primary.map(function (r) {
      var bodyHtml = (r.body || []).map(function (p, i) {
        return '<p' + (i > 0 ? ' style="margin-top:1rem;"' : '') + '>' + esc(p) + '</p>';
      }).join('');

      var metaHtml =
        '<div class="meta-block"><div class="meta-label">Journal / Conference</div>' +
          '<div class="meta-value">' + esc(r.journal) + '</div></div>' +
        '<div class="meta-block"><div class="meta-label">Status</div>' +
          '<div class="meta-value">' + esc(r.status) + '</div></div>' +
        '<div class="meta-block"><div class="meta-label">Domain</div>' +
          '<div class="meta-value">' + esc(r.domain) + '</div></div>' +
        (r.recognition ?
          '<div class="meta-block"><div class="meta-label">Recognition</div>' +
          '<div class="meta-value">' + esc(r.recognition) + '</div></div>' : '') +
        (r.awards ?
          '<div class="meta-block"><div class="meta-label">Awards</div>' +
          '<div class="meta-value">' + esc(r.awards) + '</div></div>' : '') +
        (r.duration ?
          '<div class="meta-block"><div class="meta-label">Duration</div>' +
          '<div class="meta-value">' + esc(r.duration) + '</div></div>' : '') +
        (r.pdf ?
          '<a href="' + esc(r.pdf) + '" class="btn btn-primary" target="_blank" style="margin-top:auto;">Download PDF \u2193</a>' :
          '<div class="meta-pdf-placeholder">PDF available upon publication</div>');

      return '<div class="research-entry reveal" id="' + esc(r.id) + '">' +
        '<div class="research-entry-inner">' +
          '<div class="research-body">' +
            '<div class="research-journal">' + esc(r.journal_label) + '</div>' +
            '<span class="badge ' + badgeClass(r.badge) + '">' + esc(r.badge_text) + '</span>' +
            '<h2>' + esc(r.title) + '</h2>' +
            bodyHtml +
            '<div class="tag-list" style="margin-top:1.2rem;">' + tagList(r.tags) + '</div>' +
            (r.coauthors ?
              '<p class="research-coauthors">Co-authors: ' + esc(r.coauthors) + '</p>' : '') +
          '</div>' +
          '<div class="research-meta">' + metaHtml + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var secondaryHtml = secondary.length ? (
      '<div class="reveal" style="margin-top:2.5rem;">' +
        '<h3 style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:1.2rem;">Additional Independent Research</h3>' +
        secondary.map(function (r) {
          return '<div class="secondary-research" id="' + esc(r.id) + '">' +
            '<div class="research-journal">' + esc(r.journal_label) + '</div>' +
            '<h3>' + esc(r.title) + '</h3>' +
            (r.body || []).map(function (p) {
              return '<p style="margin-top:0.6rem;font-size:0.95rem;">' + esc(p) + '</p>';
            }).join('') +
            '<div class="tag-list">' + tagList(r.tags) + '</div>' +
            '<p style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-light);margin-top:0.8rem;">' +
              esc(r.awards || '') + (r.awards && r.duration ? ' · ' : '') + esc(r.duration || '') +
            '</p>' +
          '</div>';
        }).join('') +
      '</div>'
    ) : '';

    fill('research-entries', primaryHtml + secondaryHtml);
  }


  // ══════════════════════════════════════════════════════════════
  // PROJECTS PAGE
  // ══════════════════════════════════════════════════════════════

  function projectCard(p) {
    var statusBadge = p.status ?
      '<span class="badge badge-' + (p.status === 'In Development' ? 'dev' : 'press') +
      '" style="margin-top:1rem;">' + esc(p.status) + '</span>' : '';
    var awardFlag = p.award ?
      '<div class="award-flag">' + esc(p.award) + '</div>' : '';

    return '<div class="project-card">' +
      '<div class="project-card-top">' +
        '<div class="project-category">' + esc(p.label) + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.description) + '</p>' +
        awardFlag +
        statusBadge +
        '<div class="tag-list">' + tagList(p.tech) + '</div>' +
      '</div>' +
      '<div class="project-card-bottom">' +
        '<span class="project-role">' + esc(p.role) + '</span>' +
        '<span class="project-date">' + esc(p.date) + '</span>' +
      '</div>' +
    '</div>';
  }

  function renderSoftwareProjects() {
    if (!has('projects-software-grid')) return;
    var items = (SITE_DATA.projects || []).filter(function (p) { return p.category === 'Software'; });
    fill('projects-software-grid', items.map(projectCard).join(''));
  }

  function renderEngineeringProjects() {
    if (!has('projects-engineering-grid')) return;
    var items = (SITE_DATA.projects || []).filter(function (p) { return p.category === 'Engineering'; });
    fill('projects-engineering-grid', items.map(projectCard).join(''));
  }

  function renderFairGameHighlights() {
    if (!has('fg-highlights-list')) return;
    fill('fg-highlights-list',
      (SITE_DATA.fairgame.highlights || []).map(function (h) {
        return '<li>' + esc(h) + '</li>';
      }).join('')
    );
  }


  // ══════════════════════════════════════════════════════════════
  // SPEAKING PAGE
  // ══════════════════════════════════════════════════════════════

  var MIC_ICON = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" ' +
    'd="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 014 4v4a4 4 0 01-8 0V7a4 4 0 014-4z"/>' +
    '</svg>';

  function renderSpeakingEntries() {
    if (!has('speaking-entries')) return;
    fill('speaking-entries',
      (SITE_DATA.speaking || []).map(function (s, i) {
        return '<div class="speaking-entry reveal' + (i > 0 ? '' : '') + '">' +
          '<div class="speaking-icon">' + MIC_ICON + '</div>' +
          '<div class="speaking-content">' +
            '<div class="speaking-org">' + esc(s.org) + '</div>' +
            '<h3>' + esc(s.event) + '</h3>' +
            '<p>' + esc(s.description) + '</p>' +
            '<div class="speaking-meta">' +
              '<span>' + esc(s.location) + '</span>' +
              '<span>\u00b7</span>' +
              '<span>' + esc(s.badge) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('')
    );
  }

  function renderSpeakingTimeline() {
    if (!has('speaking-timeline')) return;
    fill('speaking-timeline',
      (SITE_DATA.speaking_timeline || []).map(function (group) {
        var eventsHtml = (group.events || []).map(function (ev) {
          return '<div class="timeline-event">' +
            '<div>' +
              '<div class="timeline-event-name">' + esc(ev.name) + '</div>' +
              '<div class="timeline-event-org">'  + esc(ev.org)  + '</div>' +
            '</div>' +
            '<span class="timeline-event-badge">' + esc(ev.badge) + '</span>' +
          '</div>';
        }).join('');

        return '<div class="timeline-year-group">' +
          '<div class="timeline-year">' + esc(group.year) + '</div>' +
          eventsHtml +
        '</div>';
      }).join('')
    );
  }


  // ══════════════════════════════════════════════════════════════
  // ABOUT PAGE
  // ══════════════════════════════════════════════════════════════

  function renderInvolvement() {
    if (!has('involvement-grid')) return;
    fill('involvement-grid',
      (SITE_DATA.involvement || []).map(function (item) {
        return '<div class="involvement-item">' +
          '<div class="inv-role">' + esc(item.role) + '</div>' +
          '<h3>' + esc(item.org) + '</h3>' +
          '<p>' + esc(item.description) + '</p>' +
        '</div>';
      }).join('')
    );
  }

  function renderAwards() {
    if (!has('awards-columns')) return;
    var aw = SITE_DATA.awards || {};

    function awardList(items) {
      return (items || []).map(function (a) {
        return '<div class="award-item">' +
          '<div class="award-title">' + esc(a.title) + '</div>' +
          '<div class="award-org">'   + esc(a.org)   + '</div>' +
        '</div>';
      }).join('');
    }

    // Column 1: International + National
    var col1 =
      '<div>' +
        '<div class="awards-column-title">International &amp; National</div>' +
        '<div class="awards-list">' +
          awardList((aw.international || []).concat(aw.national || [])) +
        '</div>' +
      '</div>';

    // Column 2: State
    var col2 =
      '<div>' +
        '<div class="awards-column-title">State</div>' +
        '<div class="awards-list">' + awardList(aw.state) + '</div>' +
      '</div>';

    // Column 3: Regional + Academic
    var col3 =
      '<div>' +
        '<div class="awards-column-title">Regional &amp; Academic</div>' +
        '<div class="awards-list">' +
          awardList((aw.regional || []).concat(aw.academic || [])) +
        '</div>' +
      '</div>';

    fill('awards-columns', col1 + col2 + col3);
  }


  // ══════════════════════════════════════════════════════════════
  // RUN ALL — each function self-checks for its container
  // ══════════════════════════════════════════════════════════════
  renderHighlights();
  renderResearchPreview();
  renderFairGameStats();
  renderSpeakingTeaser();
  renderSeenIn();
  renderResearchEntries();
  renderSoftwareProjects();
  renderEngineeringProjects();
  renderFairGameHighlights();
  renderSpeakingEntries();
  renderSpeakingTimeline();
  renderInvolvement();
  renderAwards();

})();
