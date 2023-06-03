import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import { namedToHex } from './utils';

export type MaterialColors = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
};

export type CssMaterialColors = {
  [key: string]: string;
};

export interface Schemes {
  dark: MaterialColors;
  light: MaterialColors;
  cssDark: CssMaterialColors;
  cssLight: CssMaterialColors;
}

function snakeToDashed(key: string) {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function schemeToCss(scheme: MaterialColors, prefix = ''): CssMaterialColors {
  return Object.entries(scheme).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [`--${prefix ? `${prefix}-` : ''}${snakeToDashed(key)}`]: value,
    }),
    {}
  ) as CssMaterialColors;
}

export interface CustomColor {
  value: string;
  name: string;
  blend: boolean;
}

export function schemesFromColor(
  color: string,
  customColors?: CustomColor[],
  prefix = ''
): Schemes {
  const hexCustomColors = customColors?.map((hexCustomColor) => ({
    ...hexCustomColor,
    value: argbFromHex(namedToHex(hexCustomColor.value)),
  }));
  const theme = themeFromSourceColor(
    argbFromHex(namedToHex(color)),
    hexCustomColors || []
  );

  const dark = Object.entries(theme.schemes.dark.toJSON()).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: hexFromArgb(value) }),
    {}
  ) as MaterialColors;

  const light = Object.entries(theme.schemes.light.toJSON()).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: hexFromArgb(value) }),
    {}
  ) as MaterialColors;

  const schemes = { dark, light };

  theme.customColors.forEach((customColor) => {
    for (const mode of ['dark', 'light']) {
      const { name } = customColor.color;
      const custom = customColor[mode];
      schemes[mode][name] = hexFromArgb(custom.color);
      schemes[mode][`${name}Container`] = hexFromArgb(custom.colorContainer);
      const capitalizedName = name.replace(/./, (c) => c.toUpperCase());
      schemes[mode][`on${capitalizedName}`] = hexFromArgb(custom.onColor);
      schemes[mode][`on${capitalizedName}Container`] = hexFromArgb(
        custom.onColorContainer
      );
    }
  });

  return {
    ...schemes,
    cssDark: schemeToCss(dark, prefix),
    cssLight: schemeToCss(light, prefix),
  };
}
