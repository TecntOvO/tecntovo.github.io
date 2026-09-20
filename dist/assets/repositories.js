(() => {
  "use strict";

  const config = window.PERSONAL_SITE;
  const grid = document.querySelector("#repository-grid");
  const status = document.querySelector("#repository-status");

  if (!config || !grid || !status) return;

  const apiHeaders = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  const escapeHTML = (value = "") =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        })[character]
    );

  const nameSizeClass = (name) => {
    const length = [...name].length;
    if (length <= 12) return "repo-name--xl";
    if (length <= 22) return "repo-name--lg";
    if (length <= 34) return "repo-name--md";
    return "repo-name--sm";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "日期未知" : date.toISOString().slice(0, 10);
  };

  const safeGitHubUrl = (url, repositoryName) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" && parsed.hostname === "github.com") return parsed.href;
    } catch {
      // Fall through to the known GitHub repository URL.
    }
    return `https://github.com/${encodeURIComponent(config.githubUser)}/${encodeURIComponent(repositoryName)}`;
  };

  const fetchBranchCount = async (repository) => {
    const owner = encodeURIComponent(repository.owner.login);
    const name = encodeURIComponent(repository.name);
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/branches?per_page=1`, {
      headers: apiHeaders
    });

    if (!response.ok) throw new Error(`Unable to load branches for ${repository.name}`);

    const branches = await response.json();
    const linkHeader = response.headers.get("Link") || "";
    const lastPage = linkHeader.match(/[?&]page=(\d+)>;\s*rel="last"/);
    return lastPage ? Number(lastPage[1]) : branches.length;
  };

  const branchIcon = `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="6" cy="5" r="2"></circle>
      <circle cx="18" cy="6" r="2"></circle>
      <circle cx="6" cy="19" r="2"></circle>
      <path d="M6 7v10M8 11h4a6 6 0 0 0 6-3"></path>
    </svg>`;

  const renderRepository = (repository) => {
    const description = repository.description?.trim() || "";
    const branchLabel = Number.isInteger(repository.branchCount)
      ? `${repository.branchCount} 个分支`
      : "分支数暂不可用";
    const cardClass = description ? "repo-card" : "repo-card repo-card--empty";

    return `
      <a class="${cardClass}" href="${safeGitHubUrl(repository.html_url, repository.name)}" target="_blank" rel="noopener noreferrer" aria-label="打开 GitHub 仓库 ${escapeHTML(repository.name)}">
        <time class="repo-created" datetime="${escapeHTML(repository.created_at)}">创建于 ${formatDate(repository.created_at)}</time>
        <div class="repo-card-body">
          <h2 class="repo-name ${nameSizeClass(repository.name)}">${escapeHTML(repository.name)}</h2>
          ${description ? `<p class="repo-description">${escapeHTML(description)}</p>` : ""}
        </div>
        <span class="repo-branches">${branchIcon}<span>${branchLabel}</span></span>
      </a>`;
  };

  const loadRepositories = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(config.githubUser)}/repos?per_page=100&sort=updated&type=owner`,
        { headers: apiHeaders }
      );

      if (!response.ok) throw new Error("Unable to load GitHub repositories");

      const repositories = await response.json();
      const repositoriesWithBranches = await Promise.all(
        repositories.map(async (repository) => {
          try {
            return { ...repository, branchCount: await fetchBranchCount(repository) };
          } catch {
            return { ...repository, branchCount: null };
          }
        })
      );

      if (repositoriesWithBranches.length === 0) {
        grid.innerHTML = `<div class="repo-empty">当前还没有公开仓库。</div>`;
      } else {
        grid.innerHTML = repositoriesWithBranches.map(renderRepository).join("");
      }

      grid.setAttribute("aria-busy", "false");
      status.hidden = true;
    } catch {
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = `
        <div class="repo-empty">
          <strong>暂时无法读取 GitHub 仓库</strong>
          <span>可以稍后刷新，或直接访问 <a href="https://github.com/${encodeURIComponent(config.githubUser)}" target="_blank" rel="noopener noreferrer">GitHub 主页</a>。</span>
        </div>`;
      status.hidden = true;
    }
  };

  loadRepositories();
})();
