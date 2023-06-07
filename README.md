# material-color-scheme

Generate a color scheme based on material design v3

## Demo

https://shockerqt.github.io/material-color-scheme/

## Usage

### Install

```
npm i material-color-scheme
```

### Generate a scheme from a color (named or hex)

```ts
const { dark, light, cssDark, cssLight } = schemesFromColor('red');
```

### Set the scheme on the DOM

```ts
setCSSRules(cssDark);
```

### Want a prefix for your css variables?

```ts
// generates variables with `--a-prefix-color` format
const scheme = schemesFromColor('#0000ff', 'a-prefix');
```

### Add colors to the scheme

```ts
const customColors: CustomColor[] = [
  {
    name: 'red alert',
    value: 'red',
    blend: true,
  },
];
const scheme = schemesFromColor('#0000ff', null, customColors);
```

### Add _fixed_ colors to the scheme

```ts
const rawColors: RawColors = {
  red: '#ff0000',
  blue: '#0000ff',
};
const scheme = schemesFromColor('#0000ff', null, null, rawColors);
```
