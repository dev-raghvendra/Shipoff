export function getGithubIssueLink(location: "Dashboard" | "Project" | "Deployment") {
    const title = `Issue in ${location} page`;
  
    // Markdown body with your "design system" styles in mind
    const body = `
  <div style="
    background-color: var(--card);
    color: var(--card-foreground);
    border-radius: var(--radius);
    padding: 16px;
    box-shadow: var(--shadow);
    font-family: var(--font-sans);
  ">
  <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">📌 Issue Report - ${location} Page</h2>
  
  <p style="color: var(--muted-foreground); margin-bottom: 1rem;">
  Please provide as much detail as possible to help reproduce and fix the issue.
  </p>
  
  <h3 style="margin-bottom: 0.25rem;">📝 Steps to Reproduce</h3>
  1. <em>Step 1</em><br>
  2. <em>Step 2</em><br>
  3. <em>Step 3</em><br>
  
  <h3 style="margin-bottom: 0.25rem;">⚠️ Expected Behavior</h3>
  Describe what you expected to happen.
  
  <h3 style="margin-bottom: 0.25rem;">💥 Actual Behavior</h3>
  Describe what actually happened.
  
  <h3 style="margin-bottom: 0.25rem;">💻 Environment</h3>
  - Browser / OS: ${navigator.userAgent}<br>
  - Version: ${navigator.appVersion}<br>
  - Additional info: ${navigator.platform}<br>
  
  <p style="margin-top: rem; font-size: 0.875rem; color: var(--muted-foreground);">
  Generated via Shipoff internal reporter.
  </p>
  </div>
  `;
  
    // URL encode for GitHub
    const url = `https://github.com/dev-raghvendra/Shipoff/issues/new?title=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(body)}`;
  
    return url;
  }
  