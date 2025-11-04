/**
 * Initial Theme Script - Prevents FOUC (Flash of Unstyled Content)
 * This component injects theme colors before page render
 */
export function InitialTheme({ settings }: {
  settings: {
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
    quaternaryColor: string
    quinaryColor: string
    fontFamily?: string
    fontSize?: string
    borderRadius?: string
    boxShadow?: string
  }
}) {
  // Create inline script that runs immediately before any rendering
  const themeScript = `
    (function() {
      var root = document.documentElement;
      root.style.setProperty('--color-primary', '${settings.primaryColor}');
      root.style.setProperty('--color-secondary', '${settings.secondaryColor}');
      root.style.setProperty('--color-tertiary', '${settings.tertiaryColor}');
      root.style.setProperty('--color-quaternary', '${settings.quaternaryColor}');
      root.style.setProperty('--color-quinary', '${settings.quinaryColor}');
      ${settings.fontFamily ? `root.style.setProperty('--font-family-base', '${settings.fontFamily}');` : ''}
      ${settings.fontSize ? `root.style.setProperty('--font-size-base', '${settings.fontSize}');` : ''}
      ${settings.borderRadius ? `root.style.setProperty('--border-radius', '${settings.borderRadius}');` : ''}
      ${settings.boxShadow ? `root.style.setProperty('--box-shadow', '${settings.boxShadow}');` : ''}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
