import {
  CustomColor,
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities';

type StringObject = Record<string, string>;

export interface Schemes {
  css?: {
    dark: StringObject;
    light: StringObject;
  };
  json?: {
    dark: StringObject;
    light: StringObject;
  };
}

function snakeToDashed(key: string) {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function schemeToCss(scheme: StringObject, prefix = '') {
  return Object.entries(scheme).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [`--${prefix ? `${prefix}-` : ''}${snakeToDashed(key)}`]: value,
    }),
    {}
  );
}

interface HexCustomColor extends Omit<CustomColor, 'value'> {
  value: string;
}

export function schemesFromColor(
  hexColor: string,
  hexCustomColors?: HexCustomColor[]
): Schemes {
  const customColors = hexCustomColors?.map((hexCustomColor) => ({
    ...hexCustomColor,
    value: argbFromHex(hexCustomColor.value),
  }));
  const theme = themeFromSourceColor(argbFromHex(hexColor), customColors || []);

  const dark = Object.entries(theme.schemes.dark.toJSON()).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: hexFromArgb(value) }),
    {}
  );

  const light = Object.entries(theme.schemes.light.toJSON()).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: hexFromArgb(value) }),
    {}
  );

  const json = { dark, light };

  theme.customColors.forEach((customColor) => {
    for (const mode of ['dark', 'light']) {
      const { name } = customColor.color;
      const custom = customColor[mode];
      json[mode][name] = hexFromArgb(custom.color);
      json[mode][`${name}Container`] = hexFromArgb(custom.colorContainer);
      const capitalizedName = name.replace(/./, (c) => c.toUpperCase());
      json[mode][`on${capitalizedName}`] = hexFromArgb(custom.onColor);
      json[mode][`on${capitalizedName}Container`] = hexFromArgb(
        custom.onColorContainer
      );
    }
  });

  return {
    json,
    css: { dark: schemeToCss(dark), light: schemeToCss(light) },
  };
}

export function applyScheme(
  colorObject: { [key: string]: string },
  prefix = ''
) {
  return Object.entries(colorObject).reduce(
    (prev, [key, value]) =>
      `${prev}--${prefix ? `${prefix}-` : ''}${snakeToDashed(key)}: ${value}`,
    ''
  );
}
