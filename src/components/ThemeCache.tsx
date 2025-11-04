/**
 * Theme Cache Script - Loads cached theme immediately
 * Prevents flash by applying cached colors before hydration
 */
export function ThemeCache() {
  const cacheScript = `
    (function() {
      try {
        // Try to load cached theme from localStorage
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
    <script
      dangerouslySetInnerHTML={{ __html: cacheScript }}
    />
  );
}
