import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { schemesFromColor, setCSSRules } from '../../dist';
import './App.css';

const customColorsInitialValue = [
  {
    name: 'quaternary',
    value: '#00ff00',
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
  const [color, setColor] = useState('#0000ff');
  const [darkMode, setDarkMode] = useState(true);
  const [customColors, setCustomColors] = useState(customColorsInitialValue);
  const [customColorsNumber, setCustomColorsNumber] = useState(0);

  const deferredColor = useDeferredValue(color);
  const deferredCustomColors = useDeferredValue(customColors);

  const schemes = useMemo(() => {
    return schemesFromColor(
      deferredColor,
      null,
      customColors?.slice(0, customColorsNumber)
    );
  }, [deferredColor, deferredCustomColors, customColorsNumber]);

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

  useEffect(
    () => setCSSRules(darkMode ? schemes.cssDark : schemes.cssLight),
    [schemes, darkMode]
  );

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
              <label htmlFor="">{name}</label>
            </div>
          ))}
        </div>
        <h2>Options</h2>
        <div className="input-container">
          <label htmlFor="darkMode">Dark mode</label>
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((current) => !current)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="customColorsNumber">Custom Colors</label>
          <div className="form-inline">
            <button
              onClick={() => setCustomColorsNumber((n) => (n < 1 ? n : n - 1))}
            >
              
            </button>
            <input
              type="number"
              id="customColorsNumber"
              value={customColorsNumber}
              onChange={onChangeCustomColorsNumber}
              min={0}
              max={3}
            />
            <button
              onClick={() => setCustomColorsNumber((n) => (n > 2 ? n : n + 1))}
            >
              
            </button>
          </div>
        </div>
        <div className="copy-to-clipboard-container">
          <button
            className="copy-to-clipboard-button"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(schemes, null, 2));
            }}
          >
            Copy scheme to clipboard as JSON
          </button>
        </div>
      </section>
      <section className="palette">
        <div className="container primary">Primary Container</div>
        <div className="container secondary">Secondary Container</div>
        <div className="container tertiary">Tertiary Container</div>
        {customColors?.slice(0, customColorsNumber).map(({ name }) => (
          <div className={`container ${name}`} key={name}>
            {name.replace(/./, (c) => c.toUpperCase())} Container
          </div>
        ))}
      </section>
    </>
  );
}

export default App;
