// ============================================================
// render.js: Dynamic content from SITE_DATA (data.js)
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

  // Returns data attributes for counter animation if the string is numeric (optionally with + suffix)
  function countAttrs(str) {
    var s = String(str || '').trim();
    var hasSuffix = s.slice(-1) === '+';
    var num = parseFloat(hasSuffix ? s.slice(0, -1) : s);
    if (!isNaN(num) && isFinite(num)) {
      return ' data-count-to="' + num + '"' + (hasSuffix ? ' data-count-suffix="+"' : '');
    }
    return '';
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
          '<div class="highlight-number"' + countAttrs(h.number) + '>' + esc(h.number) + '</div>' +
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
          '<div class="num"' + countAttrs(s.num) + '>' + esc(s.num) + '</div>' +
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

      var doiUrl = r.doi ? 'https://doi.org/' + String(r.doi).replace(/^https?:\/\/doi\.org\//, '') : null;

      // Actions stack at the bottom of the meta rail: PDF, DOI, Cite.
      var actions = '';
      if (r.pdf)   actions += '<a href="' + esc(r.pdf) + '" class="btn btn-primary" target="_blank" rel="noopener">Download PDF \u2193</a>';
      if (doiUrl)  actions += '<a href="' + esc(doiUrl) + '" class="btn btn-outline" target="_blank" rel="noopener">View via DOI \u2197</a>';
      if (r.citation) actions += '<button type="button" class="btn btn-outline js-cite" data-citation="' + esc(r.citation) + '">Cite</button>';
      actions = actions ?
        '<div class="research-actions">' + actions + '</div>' :
        '<div class="meta-pdf-placeholder">Full text and DOI coming soon</div>';

      var metaHtml =
        '<div class="meta-block"><div class="meta-label">Journal / Conference</div>' +
          '<div class="meta-value">' + esc(r.venue_full || r.journal) + '</div></div>' +
        '<div class="meta-block"><div class="meta-label">Status</div>' +
          '<div class="meta-value">' + esc(r.status) + '</div></div>' +
        '<div class="meta-block"><div class="meta-label">Domain</div>' +
          '<div class="meta-value">' + esc(r.domain) + '</div></div>' +
        (r.authors ?
          '<div class="meta-block"><div class="meta-label">Authors</div>' +
          '<div class="meta-value">' + esc(r.authors) + '</div></div>' : '') +
        (r.recognition ?
          '<div class="meta-block"><div class="meta-label">Recognition</div>' +
          '<div class="meta-value">' + esc(r.recognition) + '</div></div>' : '') +
        (r.awards ?
          '<div class="meta-block"><div class="meta-label">Awards</div>' +
          '<div class="meta-value">' + esc(r.awards) + '</div></div>' : '') +
        (r.duration ?
          '<div class="meta-block"><div class="meta-label">Duration</div>' +
          '<div class="meta-value">' + esc(r.duration) + '</div></div>' : '') +
        actions;

      return '<div class="research-entry reveal" id="' + esc(r.id) + '">' +
        '<div class="research-entry-inner">' +
          '<div class="research-body">' +
            '<div class="research-journal">' + esc(r.journal_label) + '</div>' +
            '<span class="badge ' + badgeClass(r.badge) + '">' + esc(r.badge_text) + '</span>' +
            '<h2>' + esc(r.title) + '</h2>' +
            (r.figure ?
              '<figure class="research-figure">' +
                '<img src="' + esc(r.figure) + '" alt="' + esc(r.figure_alt || r.title) + '" loading="lazy" decoding="async">' +
                (r.figure_alt ? '<figcaption>' + esc(r.figure_alt) + '</figcaption>' : '') +
              '</figure>' : '') +
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

    // Optional visual. Falls back to nothing, so a card without art still reads fine.
    var media = p.image ?
      '<div class="project-media">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.image_alt || p.title) + '" loading="lazy" decoding="async">' +
      '</div>' : '';

    // One-line result, called out under the description.
    var outcome = p.outcome ?
      '<p class="project-outcome">' + esc(p.outcome) + '</p>' : '';

    var repo = p.repo ?
      '<a class="project-repo" href="' + esc(p.repo) + '" target="_blank" rel="noopener" ' +
        'aria-label="' + esc(p.title) + ' source code on GitHub">Code \u2197</a>' : '';

    return '<div class="project-card' + (p.featured ? ' project-card-featured' : '') + '">' +
      media +
      '<div class="project-card-top">' +
        '<div class="project-category">' + esc(p.label) + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.description) + '</p>' +
        outcome +
        awardFlag +
        statusBadge +
        '<div class="tag-list">' + tagList(p.tech) + '</div>' +
      '</div>' +
      '<div class="project-card-bottom">' +
        '<span class="project-role">' + esc(p.role) + '</span>' +
        '<span class="project-meta-right">' + repo +
          '<span class="project-date">' + esc(p.date) + '</span>' +
        '</span>' +
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

  // EvE Waste gets the same treatment as FairGame: a stats row on the
  // homepage and a highlights list in the Projects feature block.
  function renderEveStats() {
    if (!has('eve-stats') || !SITE_DATA.eve) return;
    fill('eve-stats',
      (SITE_DATA.eve.stats || []).map(function (s) {
        return '<div class="fg-stat">' +
          '<div class="num"' + countAttrs(s.num) + '>' + esc(s.num) + '</div>' +
          '<div class="lbl">' + esc(s.lbl) + '</div>' +
        '</div>';
      }).join('')
    );
  }

  function renderEveHighlights() {
    if (!has('eve-highlights-list') || !SITE_DATA.eve) return;
    fill('eve-highlights-list',
      (SITE_DATA.eve.highlights || []).map(function (h) {
        return '<li>' + esc(h) + '</li>';
      }).join('')
    );
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
              (s.year ? '<span class="speaking-year">' + esc(s.year) + '</span><span>\u00b7</span>' : '') +
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

  function renderSkills() {
    if (!has('skills-grid')) return;
    fill('skills-grid',
      (SITE_DATA.skills || []).map(function (domain, i) {
        var tags = (domain.items || []).map(function (skill) {
          return '<span class="tag">' + esc(skill) + '</span>';
        }).join('');
        return '<div class="skill-domain reveal reveal-delay-' + (i % 2 + 1) + '">' +
          '<div class="skill-domain-label">' + esc(domain.label) + '</div>' +
          '<div class="skill-tag-list">' + tags + '</div>' +
        '</div>';
      }).join('')
    );
  }


  // ══════════════════════════════════════════════════════════════
  // NOW PAGE
  // ══════════════════════════════════════════════════════════════

  function renderNow() {
    if (!has('now-sections')) return;
    var now = SITE_DATA.now || {};
    fill('now-sections',
      (now.sections || []).map(function (section, i) {
        var items = (section.items || []).map(function (item) {
          return '<li>' + esc(item) + '</li>';
        }).join('');
        return '<div class="now-section reveal reveal-delay-' + (i % 3 + 1) + '">' +
          '<div class="now-section-label">' + esc(section.label) + '</div>' +
          '<ul class="now-list">' + items + '</ul>' +
        '</div>';
      }).join('')
    );
  }

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
  // SIGNATURE TALKS  (speaking page / media kit)
  // ══════════════════════════════════════════════════════════════

  function renderTalks() {
    if (!has('talks-grid')) return;
    fill('talks-grid',
      (SITE_DATA.talks || []).map(function (t, i) {
        return '<div class="talk-card reveal' + (i ? ' reveal-delay-' + Math.min(i, 3) : '') + '">' +
          '<div class="talk-audience">' + esc(t.audience) + '</div>' +
          '<h3>' + esc(t.title) + '</h3>' +
          '<p>' + esc(t.summary) + '</p>' +
        '</div>';
      }).join('')
    );
  }


  // ══════════════════════════════════════════════════════════════
  // FOOTER: injected into every page's .footer-inner
  // ══════════════════════════════════════════════════════════════

  var ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z"/></svg>',
    github:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.26.8-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0C18.26 4.3 19.26 4.62 19.26 4.62c.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.42.37.81 1.1.81 2.22v3.29c0 .31.2.68.81.57A12 12 0 0012 .5z"/></svg>',
    mail:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/></svg>',
    fairgame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v18M12 3l7 3-7 3"/><path d="M5 21h14"/></svg>'
  };

  function renderFooter() {
    var nodes = document.querySelectorAll('.footer-inner');
    if (!nodes.length) return;

    var links = [];
    if (SITE_DATA.linkedin)     links.push({ href: SITE_DATA.linkedin, icon: 'linkedin', label: 'LinkedIn', ext: true });
    if (SITE_DATA.github)       links.push({ href: SITE_DATA.github,   icon: 'github',   label: 'GitHub',   ext: true });
    if (SITE_DATA.fairgame_url) links.push({ href: SITE_DATA.fairgame_url, icon: 'fairgame', label: 'FairGame Initiative', ext: true });
    if (SITE_DATA.email)        links.push({ href: 'mailto:' + SITE_DATA.email, icon: 'mail', label: SITE_DATA.email, ext: false });

    // A <div role="navigation">, not a <nav>: the global `nav` selector in
    // style.css is position:fixed, which would pin this to the top of the page.
    var html = '<div class="footer-links" role="navigation" aria-label="Elsewhere">' +
      links.map(function (l) {
        return '<a href="' + esc(l.href) + '"' +
          (l.ext ? ' target="_blank" rel="noopener"' : '') +
          ' aria-label="' + esc(l.label) + '" title="' + esc(l.label) + '">' +
          ICONS[l.icon] + '<span>' + esc(l.label) + '</span></a>';
      }).join('') +
    '</div>';

    for (var i = 0; i < nodes.length; i++) {
      var copy = nodes[i].querySelector('.footer-copy');
      var wrap = document.createElement('div');
      wrap.className = 'footer-links-wrap';
      wrap.innerHTML = html;
      if (copy) nodes[i].insertBefore(wrap, copy);
      else nodes[i].appendChild(wrap);
    }
  }


  // ══════════════════════════════════════════════════════════════
  // CV DOWNLOAD: only shown once the PDF actually exists
  // ══════════════════════════════════════════════════════════════
  // SITE_DATA.cv names the file, but the button is only added after a HEAD
  // request confirms it is really there. Drop the PDF into files/ and the
  // button appears on its own; until then visitors never meet a 404.

  function renderCvButtons() {
    var cv = SITE_DATA.cv;
    if (!cv) return;

    var slots = document.querySelectorAll('[data-cv-slot], #download-row');
    if (!slots.length) return;

    var add = function () {
      for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        if (slot.querySelector('[data-cv-link]')) continue;
        var style = slot.getAttribute('data-cv-style') || 'btn btn-outline';
        var a = document.createElement('a');
        a.className = style;
        a.href = cv;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('data-cv-link', '');
        a.setAttribute('data-analytics', 'cv-download');
        a.innerHTML = 'Full CV <span>\u2193</span>';
        slot.appendChild(a);
      }
    };

    if (!window.fetch) return;            // old browsers: stay safe, show nothing
    fetch(cv, { method: 'HEAD' })
      .then(function (res) { if (res && res.ok) add(); })
      .catch(function () { /* missing or offline - leave the button out */ });
  }


  // Cite buttons: copy the full citation to the clipboard.
  function wireCiteButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.js-cite');
      if (!btn) return;
      var text = btn.getAttribute('data-citation') || '';
      var done = function () {
        var prev = btn.textContent;
        btn.textContent = 'Copied \u2713';
        btn.classList.add('is-copied');
        setTimeout(function () { btn.textContent = prev; btn.classList.remove('is-copied'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }


  // ══════════════════════════════════════════════════════════════
  // RUN ALL: each function self-checks for its container
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
  renderEveStats();
  renderEveHighlights();
  renderSpeakingEntries();
  renderSpeakingTimeline();
  renderSkills();
  renderNow();
  renderInvolvement();
  renderAwards();
  renderTalks();
  renderFooter();
  renderCvButtons();
  wireCiteButtons();

})();
