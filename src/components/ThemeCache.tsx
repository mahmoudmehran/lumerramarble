/**
 * Theme Cache Script - Loads cached theme immediately
 * Prevents flash by applying cached colors before hydration
 * Uses both style tag (for immediate CSS) and script (for localStorage)
 */
export function ThemeCache() {
  // First try to inject a minimal style tag with safe defaults
  // This ensures CSS variables exist even before localStorage loads
  const fallbackStyle = `
    :root {
      --color-primary: #f59000;
      --color-secondary: #2c3e50;
      --color-tertiary: #27ae60;
      --color-quaternary: #34495e;
      --color-quinary: #ecf0f1;
    }
  `;

  const cacheScript = `
    (function() {
      try {
        var cached = localStorage.getItem('theme-colors');
        if (cached) {
          var colors = JSON.parse(cached);
          var root = document.documentElement;
          if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
          if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
          if (colors.tertiary) root.style.setProperty('--color-tertiary', colors.tertiary);
          if (colors.quaternary) root.style.setProperty('--color-quaternary', colors.quaternary);
          if (colors.quinary) root.style.setProperty('--color-quinary', colors.quinary);
        }
      } catch (e) {
        // Silently fail if localStorage is not available
      }
    })();
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fallbackStyle }} />
      <script dangerouslySetInnerHTML={{ __html: cacheScript }} />
    </>
  );
}
