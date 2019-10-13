const fs = require('fs');
const yaml = require('js-yaml');

// Source files that should be combined to create theme. Note that load order
// matters here because variables must be declared on above any references.
const src = [
  { key: 'variables', path: './src/theme.yaml' },
  { key: 'colors', path: './src/colors.yaml' },
  { key: 'tokenColors', path: './src/tokens.yaml' }
];

// Combine source contents into a single Yaml string. Because values
// are wrapped by an object key all new lines are indented two spaces.
const str = src.reduce((acc, { key, path }) => {
  const values = fs.readFileSync(path, 'utf8');

  acc += `${key}:\n  ${values.replace(/\n/g, '\n  ')}\n`;

  return acc;
}, '');

// Parse Yaml string into a JavaScript object.
const obj = yaml.safeLoad(str);

// Filter null key values from colors object.
const colors = Object.keys(obj.colors).reduce((acc, key) => {
  if (obj.colors[key] !== null) {
    acc[key] = obj.colors[key];
  }

  return acc;
}, {});

// Ensure theme directory exists
if (!fs.existsSync('./theme')) {
  fs.mkdirSync('./theme');
}

// Construct final theme object.
const theme = {
  name: 'Duskwood',
  author: 'Gabriel Toll Stålbom',
  type: 'dark',
  colors,
  tokenColors: obj.tokenColors
};

// Write theme Json distribution file.
fs.writeFileSync(
  './theme/duskwood.json',
  `${JSON.stringify(theme, null, 2)}\n`
);
