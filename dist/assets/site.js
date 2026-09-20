(() => {
  "use strict";

  const config = window.PERSONAL_SITE;
  const root = document.documentElement;
  const currentPage = root.dataset.page || "home";
  const themeStorageKey = "tecntovo-theme";
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const icons = {
    home: '<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    repo: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8"/>',
    tag: '<path d="M20.6 13.6 13.7 20.5a2 2 0 0 1-2.8 0L3.5 13.1a2 2 0 0 1-.5-1.4V5a2 2 0 0 1 2-2h6.7a2 2 0 0 1 1.4.6l7.5 7.2a2 2 0 0 1 0 2.8Z"/><circle cx="8" cy="8" r="1.25"/>',
    archive: '<path d="M4 7v13h16V7"/><path d="M3 3h18v4H3z"/><path d="M9 11h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="m5.5 9 2 3-2 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.3 15.5A8.5 8.5 0 0 1 8.5 3.7 8.5 8.5 0 1 0 20.3 15.5Z"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    github: '<path d="M12 2.7a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.1-4.7-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1a9.8 9.8 0 0 1 5.2 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.7 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.7Z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };

  const svgIcon = (name, className = "") =>
    `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name] || icons.grid}</svg>`;

  const getThemeMode = () => {
    const stored = window.localStorage.getItem(themeStorageKey);
    return ["light", "dark", "system"].includes(stored) ? stored : "system";
  };

  const applyTheme = (mode, persist = true) => {
    const safeMode = ["light", "dark", "system"].includes(mode) ? mode : "system";
    const resolved = safeMode === "system" ? (darkQuery.matches ? "dark" : "light") : safeMode;
    root.dataset.theme = resolved;
    root.dataset.themeMode = safeMode;
    if (persist) window.localStorage.setItem(themeStorageKey, safeMode);

    const themeButton = document.querySelector("#theme-toggle");
    if (themeButton) {
      const iconName = safeMode === "system" ? "system" : safeMode === "dark" ? "moon" : "sun";
      themeButton.innerHTML = `${svgIcon(iconName)}<span class="control-label">主题</span>`;
      themeButton.setAttribute("aria-label", `页面主题：${safeMode === "system" ? "跟随系统" : safeMode === "dark" ? "深色" : "浅色"}`);
    }

    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      const active = button.dataset.themeChoice === safeMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-checked", String(active));
    });
  };

  const pageTitle = () => {
    if (currentPage === "not-found") return "页面未找到";
    return config.navigation.find((item) => item.id === currentPage)?.label || config.siteTitle;
  };

  const renderSidebar = () => {
    const sidebar = document.querySelector("#sidebar");
    if (!sidebar) return;

    const navItems = config.navigation
      .map(
        (item) => `
          <li>
            <a class="nav-link${item.id === currentPage ? " is-active" : ""}" href="${item.href}" ${
              item.id === currentPage ? 'aria-current="page"' : ""
            }>
              <span class="nav-icon">${svgIcon(item.icon)}</span>
              <span class="nav-label">${item.label}</span>
            </a>
          </li>`
      )
      .join("");

    const socialLinks = config.socialLinks
      .filter((item) => item.href)
      .map((item) => {
        const mark =
          item.icon === "bilibili"
            ? '<span class="bilibili-mark" aria-hidden="true">B</span>'
            : svgIcon(item.icon);
        return `<a class="social-link" href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}" title="${item.label}">${mark}</a>`;
      })
      .join("");

    sidebar.innerHTML = `
      <div class="sidebar-inner">
        <a class="profile-card" href="/" aria-label="返回首页">
          <img id="profile-avatar" class="profile-avatar" src="${config.profile.avatar}" width="112" height="112" alt="${config.profile.displayName} 的 GitHub 头像">
          <span class="profile-copy">
            <strong id="profile-name">${config.profile.displayName}</strong>
            <span id="profile-bio">${config.profile.bio}</span>
          </span>
        </a>

        <nav class="primary-nav" aria-label="主要导航">
          <ul>${navItems}</ul>
        </nav>

        <div class="sidebar-bottom">
          <div class="social-links" aria-label="个人主页链接">${socialLinks}</div>
          <div class="theme-control">
            <button id="theme-toggle" class="sidebar-control" type="button" aria-haspopup="menu" aria-expanded="false"></button>
            <div id="theme-menu" class="theme-menu" role="menu" hidden>
              <button type="button" role="menuitemradio" data-theme-choice="light">${svgIcon("sun")}<span>浅色</span><span class="theme-check">${svgIcon("check")}</span></button>
              <button type="button" role="menuitemradio" data-theme-choice="dark">${svgIcon("moon")}<span>深色</span><span class="theme-check">${svgIcon("check")}</span></button>
              <button type="button" role="menuitemradio" data-theme-choice="system">${svgIcon("system")}<span>跟随系统</span><span class="theme-check">${svgIcon("check")}</span></button>
            </div>
          </div>
        </div>
      </div>`;
  };

  const renderTopbar = () => {
    const topbar = document.querySelector("#topbar");
    if (!topbar) return;

    topbar.innerHTML = `
      <button id="sidebar-toggle" class="icon-button sidebar-toggle" type="button" aria-controls="sidebar" aria-expanded="${
        currentPage === "home"
      }">
        ${svgIcon("panel")}
        <span class="sr-only">切换侧栏</span>
      </button>
      <div class="topbar-title">${pageTitle()}</div>
      <a class="topbar-github" href="https://github.com/${config.githubUser}" target="_blank" rel="noopener noreferrer" aria-label="访问 GitHub 主页">
        ${svgIcon("github")}<span>GitHub</span>
      </a>`;
  };

  const setSidebarState = () => {
    const toggle = document.querySelector("#sidebar-toggle");
    if (!toggle) return;
    const isExpanded = desktopQuery.matches
      ? !root.classList.contains("sidebar-collapsed")
      : root.classList.contains("sidebar-open");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.setAttribute("aria-label", isExpanded ? "收起侧栏" : "展开侧栏");
  };

  const setupInteractions = () => {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    const scrim = document.querySelector("#sidebar-scrim");
    const themeToggle = document.querySelector("#theme-toggle");
    const themeMenu = document.querySelector("#theme-menu");

    sidebarToggle?.addEventListener("click", () => {
      if (desktopQuery.matches) {
        root.classList.toggle("sidebar-collapsed");
      } else {
        root.classList.toggle("sidebar-open");
      }
      setSidebarState();
    });

    scrim?.addEventListener("click", () => {
      root.classList.remove("sidebar-open");
      setSidebarState();
    });

    themeToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = themeMenu.hidden;
      themeMenu.hidden = !willOpen;
      themeToggle.setAttribute("aria-expanded", String(willOpen));
    });

    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(button.dataset.themeChoice);
        themeMenu.hidden = true;
        themeToggle?.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (themeMenu && !themeMenu.hidden && !event.target.closest(".theme-control")) {
        themeMenu.hidden = true;
        themeToggle?.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      root.classList.remove("sidebar-open");
      if (themeMenu) themeMenu.hidden = true;
      themeToggle?.setAttribute("aria-expanded", "false");
      setSidebarState();
    });

    desktopQuery.addEventListener("change", () => {
      root.classList.remove("sidebar-open");
      setSidebarState();
    });

    darkQuery.addEventListener("change", () => {
      if (getThemeMode() === "system") applyTheme("system", false);
    });
  };

  const syncGitHubProfile = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${config.githubUser}`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) return;
      const profile = await response.json();
      const avatar = document.querySelector("#profile-avatar");
      const bio = document.querySelector("#profile-bio");
      if (avatar && profile.avatar_url) avatar.src = profile.avatar_url;
      if (bio && profile.bio) bio.textContent = profile.bio;
    } catch {
      // The local fallback keeps the profile usable if GitHub is unavailable.
    }
  };

  renderSidebar();
  renderTopbar();
  applyTheme(getThemeMode(), false);
  setupInteractions();
  setSidebarState();
  syncGitHubProfile();
})();
