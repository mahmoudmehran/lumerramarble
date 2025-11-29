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
  // Use style tag instead of script for better iOS Safari compatibility
  const themeStyles = `
    :root {
      --color-primary: ${settings.primaryColor};
      --color-primary-50: ${settings.primaryColor}0D;
      --color-primary-100: ${settings.primaryColor}1A;
      --color-primary-200: ${settings.primaryColor}33;
      --color-primary-300: ${settings.primaryColor}4D;
      --color-primary-400: ${settings.primaryColor}66;
      --color-primary-500: ${settings.primaryColor}80;
      --color-primary-600: ${settings.primaryColor}99;
      --color-primary-700: ${settings.primaryColor}B3;
      --color-primary-800: ${settings.primaryColor}CC;
      --color-primary-900: ${settings.primaryColor}E6;
      
      --color-secondary: ${settings.secondaryColor};
      --color-secondary-50: ${settings.secondaryColor}0D;
      --color-secondary-100: ${settings.secondaryColor}1A;
      --color-secondary-200: ${settings.secondaryColor}33;
      --color-secondary-300: ${settings.secondaryColor}4D;
      --color-secondary-400: ${settings.secondaryColor}66;
      --color-secondary-500: ${settings.secondaryColor}80;
      --color-secondary-600: ${settings.secondaryColor}99;
      --color-secondary-700: ${settings.secondaryColor}B3;
      --color-secondary-800: ${settings.secondaryColor}CC;
      --color-secondary-900: ${settings.secondaryColor}E6;
      
      --color-tertiary: ${settings.tertiaryColor};
      --color-tertiary-50: ${settings.tertiaryColor}0D;
      --color-tertiary-100: ${settings.tertiaryColor}1A;
      --color-tertiary-200: ${settings.tertiaryColor}33;
      --color-tertiary-300: ${settings.tertiaryColor}4D;
      --color-tertiary-400: ${settings.tertiaryColor}66;
      --color-tertiary-500: ${settings.tertiaryColor}80;
      --color-tertiary-600: ${settings.tertiaryColor}99;
      --color-tertiary-700: ${settings.tertiaryColor}B3;
      --color-tertiary-800: ${settings.tertiaryColor}CC;
      --color-tertiary-900: ${settings.tertiaryColor}E6;
      
      --color-quaternary: ${settings.quaternaryColor};
      --color-quaternary-50: ${settings.quaternaryColor}0D;
      --color-quaternary-100: ${settings.quaternaryColor}1A;
      --color-quaternary-200: ${settings.quaternaryColor}33;
      --color-quaternary-300: ${settings.quaternaryColor}4D;
      --color-quaternary-400: ${settings.quaternaryColor}66;
      --color-quaternary-500: ${settings.quaternaryColor}80;
      --color-quaternary-600: ${settings.quaternaryColor}99;
      --color-quaternary-700: ${settings.quaternaryColor}B3;
      --color-quaternary-800: ${settings.quaternaryColor}CC;
      --color-quaternary-900: ${settings.quaternaryColor}E6;
      
      --color-quinary: ${settings.quinaryColor};
      --color-quinary-50: ${settings.quinaryColor}0D;
      --color-quinary-100: ${settings.quinaryColor}1A;
      --color-quinary-200: ${settings.quinaryColor}33;
      --color-quinary-300: ${settings.quinaryColor}4D;
      --color-quinary-400: ${settings.quinaryColor}66;
      --color-quinary-500: ${settings.quinaryColor}80;
      --color-quinary-600: ${settings.quinaryColor}99;
      --color-quinary-700: ${settings.quinaryColor}B3;
      --color-quinary-800: ${settings.quinaryColor}CC;
      --color-quinary-900: ${settings.quinaryColor}E6;
      ${settings.fontFamily ? `--font-family-base: ${settings.fontFamily};` : ''}
      ${settings.fontSize ? `--font-size-base: ${settings.fontSize};` : ''}
      ${settings.borderRadius ? `--border-radius: ${settings.borderRadius};` : ''}
      ${settings.boxShadow ? `--box-shadow: ${settings.boxShadow};` : ''}
    }
  `;

  return (
    <style
      dangerouslySetInnerHTML={{ __html: themeStyles }}
    />
  );
}
