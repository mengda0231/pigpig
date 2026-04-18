(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function truncateText(value, limit) {
    var clean = String(value || "").replace(/\s+/g, " ").trim();
    if (!clean) {
      return "";
    }
    return clean.length > limit ? clean.slice(0, limit - 1) + "…" : clean;
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function renderExcerptDetails(label, text, expandedText, options) {
    var summary = normalizeText(text);
    var fullText = normalizeText(expandedText || text);
    if (!fullText) {
      return "";
    }
    var prompt =
      (options && options.collapsedNote) || "点击查看完整原句";
    var preview = summary ? truncateText(summary, 84) : prompt;
    return (
      '<details class="intelligence-excerpt-details">' +
      '<summary class="intelligence-excerpt-summary">' +
      '<span class="intelligence-excerpt-label">' +
      escapeHtml(label) +
      "</span>" +
      '<span class="intelligence-excerpt-preview">' +
      escapeHtml(preview) +
      "</span>" +
      "</summary>" +
      '<div class="intelligence-excerpt-body">' +
      escapeHtml(fullText || summary) +
      "</div>" +
      "</details>"
    );
  }

  function renderListMeta(theme) {
    var cleanTheme = normalizeText(theme);
    if (!cleanTheme) {
      return "";
    }
    return (
      '<div class="intelligence-list-meta-row">' +
      '<span class="intelligence-mini-chip">' +
      escapeHtml(cleanTheme) +
      "</span>" +
      "</div>"
    );
  }

  function renderEvidenceCards(items, limit) {
    var rows = (items || []).slice(0, limit);
    if (!rows.length) {
      return '<p class="intelligence-empty">当日没有新增硬证据。</p>';
    }
    return rows
      .map(function (item) {
        var tone = item.tone || "neutral";
        return (
          '<article class="intelligence-card tone-' +
          tone +
          '">' +
          '<div class="intelligence-card-top">' +
          '<span class="intelligence-pill tone-' +
          tone +
          '">' +
          escapeHtml(item.source_label || "最新证据") +
          "</span>" +
          '<span class="intelligence-date">' +
          escapeHtml(item.date || "") +
          "</span>" +
          "</div>" +
          '<h4 class="intelligence-card-title">' +
          escapeHtml(item.headline || "") +
          "</h4>" +
          '<p class="intelligence-card-value">' +
          escapeHtml(item.value || "") +
          "</p>" +
          (item.delta
            ? '<p class="intelligence-card-delta">' + escapeHtml(item.delta) + "</p>"
            : "") +
          '<p class="intelligence-card-body"><strong>当前读法：</strong>' +
          escapeHtml(item.takeaway || "") +
          "</p>" +
          '<p class="intelligence-card-body muted"><strong>为什么重要：</strong>' +
          escapeHtml(item.why_it_matters || "") +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderMaterialList(items, limit, emptyText) {
    var rows = (items || []).slice(0, limit);
    if (!rows.length) {
      return '<p class="intelligence-empty">' + escapeHtml(emptyText) + "</p>";
    }
    return (
      '<div class="intelligence-list-rail">' +
      rows
      .map(function (item) {
        var link = item.url || item.requested_url || item.landed_url || "";
        var summaryText = truncateText(
          item.summary || item.excerpt || item.visible_body || "",
          120
        );
        return (
          '<article class="intelligence-list-item">' +
          '<div class="intelligence-list-top">' +
          '<span class="intelligence-date">' +
          escapeHtml(item.date || item.published_date || "") +
          "</span>" +
          '<span class="intelligence-pill muted">' +
          escapeHtml(item.source_label || item.account_name || "高质量公众号") +
          "</span>" +
          "</div>" +
          '<h4 class="intelligence-list-title">' +
          escapeHtml(item.title || "") +
          "</h4>" +
          renderListMeta(item.theme || item.source_tier_label || "") +
          (summaryText
            ? '<p class="intelligence-list-body intelligence-list-body-lead"><strong>研究摘要：</strong>' +
              escapeHtml(summaryText) +
              "</p>"
            : "") +
          renderExcerptDetails(
            "事件摘录",
            "",
            item.visible_body || item.excerpt || item.summary || "",
            { collapsedNote: "点击查看完整原句" }
          ) +
          '<p class="intelligence-list-body muted"><strong>当前采用方式：</strong>' +
          escapeHtml(item.proposed_use || "") +
          "</p>" +
          '<p class="intelligence-list-body muted"><strong>边界：</strong>' +
          escapeHtml(item.blind_spot || "") +
          "</p>" +
          (link
            ? '<p class="intelligence-list-link"><a href="' +
              escapeHtml(link) +
              '" target="_blank" rel="noreferrer">查看原文</a></p>'
            : "") +
          "</article>"
        );
      })
      .join("") +
      "</div>"
    );
  }

  function renderViewList(items, tone, emptyText, limit) {
    var rows = (items || []).slice(0, limit || items.length);
    if (!rows.length) {
      return '<p class="intelligence-empty">' + escapeHtml(emptyText) + "</p>";
    }
    return (
      '<div class="intelligence-list-rail">' +
      rows
      .map(function (item) {
        var link = item.url || "";
        var summaryText = truncateText(item.summary || "", 110);
        return (
          '<article class="intelligence-list-item tone-' +
          tone +
          '">' +
          '<div class="intelligence-list-top">' +
          '<span class="intelligence-date">' +
          escapeHtml(item.date || "") +
          "</span>" +
          '<span class="intelligence-pill tone-' +
          tone +
          '">' +
          escapeHtml(item.source_label || "公开观点") +
          "</span>" +
          "</div>" +
          '<h4 class="intelligence-list-title">' +
          escapeHtml(item.title || "") +
          "</h4>" +
          renderListMeta(item.theme || "") +
          (summaryText
            ? '<p class="intelligence-list-body intelligence-list-body-lead"><strong>观点摘要：</strong>' +
              escapeHtml(summaryText) +
              "</p>"
            : "") +
          renderExcerptDetails(
            "观点摘录",
            "",
            item.full_quote || item.summary || "",
            { collapsedNote: "点击查看完整原句" }
          ) +
          '<p class="intelligence-list-body muted"><strong>不能直接升级的地方：</strong>' +
          escapeHtml(item.blind_spot || "") +
          "</p>" +
          (link
            ? '<p class="intelligence-list-link"><a href="' +
              escapeHtml(link) +
              '" target="_blank" rel="noreferrer">查看原文</a></p>'
            : "") +
          "</article>"
        );
      })
      .join("") +
      "</div>"
    );
  }

  function renderHouseNote(note, houseView) {
    var card = note || {};
    var summary = card.summary || (houseView || {}).summary || "";
    var difference = card.difference || (houseView || {}).core_difference || "";
    var nextChecks = card.next_checks || (houseView || {}).next_checks || [];
    return (
      '<article class="intelligence-house-note">' +
      '<div class="intelligence-panel-top">' +
      "<h3>我们的判断</h3>" +
      '<span class="intelligence-pill muted">最新日判断</span>' +
      "</div>" +
      '<h4 class="intelligence-house-title">' +
      escapeHtml(card.headline || (houseView || {}).headline || "") +
      "</h4>" +
      '<p class="intelligence-list-body">' +
      escapeHtml(summary) +
      "</p>" +
      '<p class="intelligence-list-body muted"><strong>我们和公开观点的分歧：</strong>' +
      escapeHtml(difference) +
      "</p>" +
      '<div class="intelligence-chip-row">' +
      (nextChecks || [])
        .slice(0, 3)
        .map(function (item) {
          return '<span class="intelligence-chip">' + escapeHtml(item) + "</span>";
        })
        .join("") +
      "</div>" +
      "</article>"
    );
  }

  function renderSourceCoverageNote(payload) {
    var primary = (payload.quality_source_whitelist || [])
      .slice(0, 5)
      .join(" / ");
    var watchlist = (payload.quality_source_watchlist || [])
      .slice(0, 3)
      .join(" / ");
    if (!primary && !watchlist) {
      return "";
    }
    return (
      '<p class="intelligence-source-note muted"><strong>当前主池：</strong>' +
      escapeHtml(primary || "待补") +
      (watchlist
        ? ' <strong>扩展观察池：</strong>' + escapeHtml(watchlist)
        : "") +
      "</p>"
    );
  }

  function renderDayMeta(day, override) {
    var evidenceCount =
      override && override.evidenceCount != null
        ? override.evidenceCount
        : (day.evidence_items || []).length;
    var articleCount =
      override && override.articleCount != null
        ? override.articleCount
        : (day.article_items || []).length;
    var bullishCount =
      override && override.bullishCount != null
        ? override.bullishCount
        : ((day.public_views || {}).bullish || []).length;
    var bearishCount =
      override && override.bearishCount != null
        ? override.bearishCount
        : ((day.public_views || {}).bearish || []).length;
    return (
      '<div class="intelligence-day-meta">' +
      '<span class="intelligence-chip">硬证据 ' +
      evidenceCount +
      "</span>" +
      '<span class="intelligence-chip">公众号 ' +
      articleCount +
      "</span>" +
      '<span class="intelligence-chip">偏多 ' +
      bullishCount +
      "</span>" +
      '<span class="intelligence-chip">偏谨慎 ' +
      bearishCount +
      "</span>" +
      "</div>"
    );
  }

  function pickLatestArticles(payload, latestDay) {
    var dayArticles = (latestDay && latestDay.article_items) || [];
    if (dayArticles.length) {
      return dayArticles;
    }
    return payload.featured_articles || payload.article_materials || [];
  }

  function pickLatestViews(payload, latestDay, tone) {
    var key = tone === "bullish" ? "bullish" : "bearish";
    var dayViews = (((latestDay || {}).public_views || {})[key]) || [];
    if (dayViews.length) {
      return dayViews;
    }
    return (((payload.market_views || {})[key]) || []).slice(0, 2);
  }

  function renderLatestDay(payload, options) {
    var compact = !!(options && options.compact);
    var latestDay = payload.latest_day || ((payload.rolling_days || [])[0] || {});
    var articleItems = pickLatestArticles(payload, latestDay);
    var bullishViews = pickLatestViews(payload, latestDay, "bullish");
    var bearishViews = pickLatestViews(payload, latestDay, "bearish");
    var evidenceItems = latestDay.evidence_items || payload.latest_evidence || [];
    return (
      '<section class="intelligence-day-sheet intelligence-day-sheet-latest">' +
      '<div class="intelligence-day-header">' +
      '<div><span class="eyebrow">Daily Update</span><h3>' +
      escapeHtml(latestDay.day_label || payload.as_of_date || "") +
      "</h3></div>" +
      '<div class="intelligence-day-header-side">' +
      '<span class="intelligence-pill tone-bullish">最新日优先展开</span>' +
      '<span class="intelligence-date">' +
      escapeHtml(payload.phase || "") +
      "</span>" +
      "</div></div>" +
      '<p class="intelligence-day-summary">' +
      escapeHtml(latestDay.summary || payload.summary_line || "") +
      "</p>" +
      renderDayMeta(latestDay, {
        evidenceCount: evidenceItems.length,
        articleCount: articleItems.length,
        bullishCount: bullishViews.length,
        bearishCount: bearishViews.length,
      }) +
      '<div class="intelligence-day-grid">' +
      '<article class="intelligence-day-block intelligence-day-band">' +
      '<div class="intelligence-panel-top intelligence-panel-side-head"><h3>当日硬证据</h3><span class="intelligence-date">先看数据锚</span></div>' +
      '<div class="intelligence-day-block-body"><div class="intelligence-evidence-grid intelligence-evidence-grid-band">' +
      renderEvidenceCards(evidenceItems, compact ? 2 : 3) +
      "</div></div></article>" +
      '<article class="intelligence-day-block intelligence-day-band">' +
      '<div class="intelligence-panel-top intelligence-panel-side-head"><h3>最近高质量公众号</h3><span class="intelligence-date">优先纳入公众号，不用雪球情绪帖</span></div>' +
      '<div class="intelligence-day-block-body">' +
      renderSourceCoverageNote(payload) +
      renderMaterialList(articleItems, compact ? 3 : 5, "最近 7 天没有新的高质量公众号正文。") +
      "</div></article>" +
      '<article class="intelligence-day-block intelligence-day-band">' +
      '<div class="intelligence-panel-top intelligence-panel-side-head"><h3>公开分歧</h3><span class="intelligence-date">最近 7 天可见观点</span></div>' +
      '<div class="intelligence-day-block-body"><div class="intelligence-view-rail">' +
      '<div class="intelligence-view-lane"><p class="intelligence-mini-title">偏多 / 偏修复</p>' +
      renderViewList(bullishViews, "bullish", "最近没有稳定的偏多公开说法。", compact ? 2 : 3) +
      "</div>" +
      '<div class="intelligence-view-lane"><p class="intelligence-mini-title">偏谨慎 / 偏承压</p>' +
      renderViewList(bearishViews, "bearish", "最近没有稳定的偏谨慎公开说法。", compact ? 2 : 3) +
      "</div>" +
      "</div></div></article>" +
      "</div>" +
      renderHouseNote(latestDay.house_note, payload.house_view || {}) +
      "</section>"
    );
  }

  function renderHistoryDay(day, compact) {
    return (
      '<article class="intelligence-day-archive-card">' +
      '<div class="intelligence-list-top">' +
      '<span class="intelligence-day-archive-title">' +
      escapeHtml(day.day_label || day.date || "") +
      "</span>" +
      (day.has_updates
        ? '<span class="intelligence-pill muted">有更新</span>'
        : '<span class="intelligence-pill muted">无新增</span>') +
      "</div>" +
      '<p class="intelligence-list-body">' +
      escapeHtml(day.summary || "") +
      "</p>" +
      renderDayMeta(day) +
      '<div class="intelligence-day-archive-grid">' +
      '<div class="intelligence-day-archive-section intelligence-day-band">' +
      '<div class="intelligence-day-archive-head"><p class="intelligence-mini-title">硬证据</p></div>' +
      '<div class="intelligence-day-archive-body"><div class="intelligence-evidence-grid intelligence-evidence-grid-band">' +
      renderEvidenceCards(day.evidence_items || [], compact ? 1 : 2) +
      "</div></div>" +
      "</div>" +
      '<div class="intelligence-day-archive-section intelligence-day-band">' +
      '<div class="intelligence-day-archive-head"><p class="intelligence-mini-title">公众号</p></div>' +
      '<div class="intelligence-day-archive-body">' +
      renderMaterialList(day.article_items || [], compact ? 1 : 2, "当日没有新增高质量公众号正文。") +
      "</div>" +
      "</div>" +
      '<div class="intelligence-day-archive-section intelligence-day-band">' +
      '<div class="intelligence-day-archive-head"><p class="intelligence-mini-title">公开分歧</p></div>' +
      '<div class="intelligence-day-archive-body">' +
      renderViewList((((day.public_views || {}).bullish || []).concat(((day.public_views || {}).bearish || []))), "neutral", "当日没有新增公开分歧。", compact ? 1 : 2) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderHistoryDays(payload, options) {
    var compact = !!(options && options.compact);
    var days = (payload.rolling_days || []).slice(1, 7);
    if (!days.length) {
      return "";
    }
    return (
      '<details class="intelligence-history">' +
      '<summary class="intelligence-history-summary">' +
      '<span>近 6 天回看</span>' +
      '<span class="intelligence-date">折叠旧消息，只保留最近 7 天</span>' +
      "</summary>" +
      '<div class="intelligence-history-stack">' +
      days
        .map(function (day) {
          return renderHistoryDay(day, compact);
        })
        .join("") +
      "</div></details>"
    );
  }

  function renderCompact(target, payload, options) {
    var fullPageHref = (options && options.fullPageHref) || "./data-lab/current-state-dashboard.html";
    target.innerHTML =
      '<div class="section-header">' +
      '<div><span class="eyebrow">Latest Intelligence</span><h2>最近 7 天证据流</h2></div>' +
      '<p>首页只把最新日展开，旧 6 天折叠回看；高质量公众号进入主可见层，雪球情绪帖不作为这一块的主输入。</p>' +
      "</div>" +
      '<div class="intelligence-shell intelligence-shell-compact">' +
      '<div class="intelligence-summary-band intelligence-summary-band-compact">' +
      '<div class="intelligence-summary-card strong"><span>As Of</span><strong>' +
      escapeHtml(payload.as_of_date || "") +
      '</strong><p>' +
      escapeHtml(payload.summary_line || "") +
      "</p></div>" +
      '<div class="intelligence-summary-card"><span>当前阶段</span><strong>' +
      escapeHtml(payload.phase || "") +
      '</strong><p>' +
      escapeHtml(((payload.house_view || {}).headline || "").replace("我们当前仍把行业写成", "").replace("。", "")) +
      "</p></div>" +
      '<div class="intelligence-summary-card"><span>来源白名单</span><strong>' +
      escapeHtml((payload.quality_source_whitelist || []).join(" / ")) +
      '</strong><p>' +
      escapeHtml(payload.guardrail || "") +
      "</p></div>" +
      "</div>" +
      renderLatestDay(payload, { compact: true }) +
      renderHistoryDays(payload, { compact: true }) +
      '<div class="intelligence-panel-top intelligence-latest-footer-link"><a href="' +
      escapeHtml(fullPageHref) +
      '">进入完整版当前状态页</a></div>' +
      "</div>";
  }

  function renderFull(target, payload, options) {
    target.innerHTML =
      '<div class="section-header">' +
      '<div><span class="eyebrow">Latest Intelligence</span><h2>最新证据、文章素材与每日判断</h2></div>' +
      '<p>按最近 7 天滚动展示，最新日展开、旧 6 天折叠。公开分歧优先吸收高质量公众号，雪球情绪帖不作为这一块的主输入。</p>' +
      "</div>" +
      '<div class="intelligence-shell intelligence-shell-full">' +
      '<div class="intelligence-summary-band">' +
      '<div class="intelligence-summary-card strong"><span>As Of</span><strong>' +
      escapeHtml(payload.as_of_date || "") +
      '</strong><p>' +
      escapeHtml(payload.summary_line || "") +
      "</p></div>" +
      '<div class="intelligence-summary-card"><span>当前阶段</span><strong>' +
      escapeHtml(payload.phase || "") +
      '</strong><p>' +
      escapeHtml((payload.house_view || {}).summary || "") +
      "</p></div>" +
      '<div class="intelligence-summary-card"><span>更新合同</span><strong>最新日展开，旧 6 日折叠</strong><p>过期信息自动剔除；默认把日更锚、公众号和我们的判断挂在同一入口。</p></div>' +
      '<div class="intelligence-summary-card"><span>来源纪律</span><strong>' +
      escapeHtml((payload.quality_source_whitelist || []).join(" / ")) +
      '</strong><p>' +
      escapeHtml(payload.guardrail || "") +
      "</p></div>" +
      "</div>" +
      renderLatestDay(payload, { compact: false }) +
      renderHistoryDays(payload, { compact: false }) +
      "</div>";
  }

  window.renderPigLatestIntelligence = function (target, payload, options) {
    if (!target || !payload) {
      return;
    }
    var variant = (options && options.variant) || "full";
    if (variant === "compact") {
      renderCompact(target, payload, options || {});
      return;
    }
    renderFull(target, payload, options || {});
  };
})();
