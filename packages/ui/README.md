# ui

This library was generated with [Nx](https://nx.dev).

## Section title

`lib-section-title` accepts optional `primaryTextFontSize` and
`secondaryTextFontSize` inputs as pixel values:

```html
<lib-section-title
  primaryText="Workouts"
  secondaryText="About Us"
  [primaryTextFontSize]="96"
  [secondaryTextFontSize]="24"
/>
```

The component background is transparent by default.

To provide custom icon SVG markup, bind it to `iconSvg`:

```ts
readonly searchIconSvg = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>';
```

```html
<lib-section-title
  primaryText="Workouts"
  [iconSvg]="searchIconSvg"
/>
```

`searchIconSvg` should be a trusted, developer-authored SVG string. Do not use
user-provided markup.

When `iconSvg` is provided, it takes precedence over the `icon` component input.
If neither is provided, the default dumbbell icon is shown.

## Running unit tests

Run `nx test ui` to execute the unit tests.
