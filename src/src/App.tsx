import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { schemesFromColor } from 'material-color-scheme';
import './App.css';

const customColorsInitialValue = [
  {
    name: 'quaternary',
    value: '#387434',
    blend: true,
  },
  {
    name: 'quinary',
    value: '#57869e',
    blend: true,
  },
  {
    name: 'senary',
    value: '#9e5787',
    blend: true,
  },
];

function App() {
  const [color, setColor] = useState('#fffaaa');
  const [darkMode, setDarkMode] = useState(true);
  const [customColors, setCustomColors] = useState(customColorsInitialValue);
  const [customColorsNumber, setCustomColorsNumber] = useState(0);

  const deferredColor = useDeferredValue(color);
  const deferredCustomColors = useDeferredValue(customColors);

  const schemes = useMemo(() => {
    return schemesFromColor(
      deferredColor,
      customColors?.slice(0, customColorsNumber)
    );
  }, [deferredColor, deferredCustomColors, customColorsNumber]);

  const setCssScheme = () => {
    if (schemes?.css)
      Object.entries(darkMode ? schemes.css.dark : schemes.css.light).forEach(
        ([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        }
      );
  };

  const onChangeCustomColorsNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Math.floor(parseInt(event.target.value) || 0);
    value = Math.max(Math.min(3, value), 0);
    setCustomColorsNumber(value);
  };

  const onColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const onChangeCustomColor = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setCustomColors((oldCustomColors) => {
      const customColors = [...oldCustomColors];
      for (const customColor of customColors) {
        if (customColor.name === name) customColor.value = event.target.value;
      }
      return customColors;
    });
  };

  useEffect(setCssScheme, [schemes, darkMode]);

  return (
    <>
      <h1>Material Colors</h1>
      <section className="surface-variant">
        <h2>Pick colors</h2>
        <div className="color-pickers">
          <div>
            <input type="color" value={color} onChange={onColorChange} />
            <label htmlFor="">Base</label>
          </div>
          {customColors?.slice(0, customColorsNumber).map(({ value, name }) => (
            <div key={name}>
              <input
                type="color"
                value={value}
                onChange={(event) => onChangeCustomColor(event, name)}
              />
              <label htmlFor="">Base</label>
            </div>
          ))}
        </div>
        <h2>Options</h2>
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((current) => !current)}
          />
          <label htmlFor="">Dark mode</label>
        </div>
        <div className="">
          <input
            type="number"
            value={customColorsNumber}
            onChange={onChangeCustomColorsNumber}
            min={0}
            max={3}
          />
          <label htmlFor="">Dark mode</label>
        </div>
      </section>
      <div className="palette">
        <div className="container primary">Primary Container</div>
        <div className="container secondary">Secondary Container</div>
        <div className="container tertiary">Tertiary Container</div>
        {customColors?.slice(0, customColorsNumber).map(({ name }) => (
          <div className={`container ${name}`} key={name}>
            {name.replace(/./, (c) => c.toUpperCase())} Container
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
