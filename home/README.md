# HackBU Home

Maybe coming soon.

Dev:

```
pnpm run dev
```

Build for prod:

```
pnpm run build
```

## Contributing

Recommended development environment:

- Use [Visual Studio Code](https://code.visualstudio.com/) as your code editor.
  - Install the [offiial Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for HTML/CSS/JS formatting.
  - Install the [official Svelte extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) for Svelte formatting and IntelliSense.
  - Install the [official Tailwind CSS extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for Tailwind autocomplete and hovering.

Within VS Code, it's also helpful to enable the _Format on Save_ option, at least in the workspace settings. You also need to configure the ESLint extension to pick up on `.svelte` files. Finally, you should also configure the Tailwind extension to detect Flowbite's custom class attributes. Example `.vscode/settings.json`:

```json
{
	"editor.formatOnSave": true,
	"eslint.validate": ["javascript", "javascriptreact", "svelte"],
	"tailwindCSS.classAttributes": [
		// Copy from `tailwindAttributes` in /.prettierrc.
	]
}
```
