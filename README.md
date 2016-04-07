# babel-plugin-import-noop

A [babel](https://babeljs.io/) plugin to turn certain types of `import`
statements into noops that declare empty objects.

## Why?

If you're using CSS Modules via a build tool like Webpack's
[css-loader](https://github.com/webpack/css-loader), then when you build your
app bundle webpack will magically transform imports like:

```javascript
import style from './some-style.scss';
```

— into JavaScript that injects this style into your pages.

However, if you want to run tests, you'll hit a syntax error if you try to run
the JavaScript files as-is, since the CSS they're importing isn't valid
JavaScript.
You could compile an entire "test bundle" with webpack before running the tests,
but that adds a substantial boot time to every run. Instead, you can use the
[babel require hook](https://babeljs.io/docs/usage/require/), and use this
plugin to replace all instances of:

```javascript
import style from './some-style.scss';
```
with
```javascript
const style = {};
```
— during compilation.

## Usage

```bash
$ npm install --save-dev babel-plugin-import-noop
```

Then, in your `.babelrc`:
```json
{
  "plugins": ["import-noop"]
}
```

Or, to only load this plugin during tests (i.e. not in your actual bundle):
```json
{
  "env": {
    "test": {
      "plugins": ["import-noop"]
    }
  }
}
```
```bash
NODE_ENV=test mocha ....
```

To specify a list of file extensions which should be transformed, you can add
additional options to the plugin declaration:
```json
{
  "plugins": [
    ["import-noop", {
      "extensions": ["scss", "css"]
    }]
  ]
}
```

## Limitations

Since the newly defined object won't have any properties, anything you're
reading from it in your code (e.g. `style.className`) will resolve to
`undefined`. A pull request to allow defining properties using the plugin
configuration would be very useful!

## License

MIT
