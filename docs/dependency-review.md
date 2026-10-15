# Dependency review — 2026-10-15

This is a scoped review of the installed dependency tree and its use in LearnHub, not a claim that the project is vulnerability-free. The raw npm results are retained in `audit-before.json` and `audit-after.json`.

## Evidence and changes

The environment's default/offline npm audit initially returned an empty advisory result. That result was discarded. The review explicitly queried the public registry with:

```sh
npm audit --json --offline=false --prefer-online --registry=https://registry.npmjs.org
```

The live baseline reported **19 affected package entries**: 1 critical, 14 high, 3 moderate, and 1 low. Entries include transitive dependencies and propagated findings, so this is not a count of 19 independent exploitable defects in the application.

The final live audit reports **2 moderate package entries**, `react-router` and `react-router-dom`, representing the router findings discussed below. No high or critical entries remain in that audit snapshot. These are reported findings, not proof of complete security. Registry findings can change after this review.

| Scope                    | Before                              | After                                                 | Reason                                                                                                  |
| ------------------------ | ----------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Build/dev server         | Vite 4.4.9                          | Vite 7.3.7                                            | Vite 4 is unsupported and had multiple file-access, development-server, and generated-output advisories |
| React build plugin       | 4.0.4                               | 5.2.0                                                 | Declared peer compatibility with Vite 7; current compatible Babel dependencies                          |
| Browser router           | React Router DOM 6.16.0             | 6.30.6                                                | Compatible 6.x fixes without changing routing mode or adopting a framework                              |
| Lint transitive packages | Old locked versions                 | Compatible updated versions in lockfile               | Targeted updates to ajv, brace-expansion, cross-spawn, flatted, js-yaml, and minimatch                  |
| React / React DOM        | 18.2.0                              | 18.2.0                                                | No React migration needed for the requested work                                                        |
| Browser tests            | Playwright 1.56.1 using system Edge | Playwright 1.56.1 using explicitly installed Chromium | Reproducible browser version selected by the locked Playwright package                                  |

Commands used for dependency changes:

```sh
npm install --save-dev --save-exact vite@7.3.7 @vitejs/plugin-react@5.2.0 --offline=false --registry=https://registry.npmjs.org --no-audit --no-fund
npm install --save-exact react-router-dom@6.30.6 --offline=false --registry=https://registry.npmjs.org --no-audit --no-fund
npm update ajv brace-expansion cross-spawn flatted js-yaml minimatch --offline=false --registry=https://registry.npmjs.org --ignore-scripts --no-audit --no-fund
```

No forced audit fix or blanket dependency upgrade was used. The application refinements do not rely on new framework features.

## Separate Vite migration assessment

The toolchain change is isolated to package files, the documented Node requirement, and verification setup. Vite 7.3 was chosen as a supported line receiving important fixes and security patches, without moving this refinement to Vite 8's different bundler. See the [official support policy](https://vite.dev/releases).

The [Vite 5 migration](https://v5.vite.dev/guide/migration.html), [Vite 6 migration](https://v6.vite.dev/guide/migration.html), and [Vite 7 migration](https://v7.vite.dev/guide/migration) were reviewed:

- The config already uses ESM and the standard React plugin. There are no custom Rollup plugins, CJS Vite API calls, import assertions, SSR, Sass, or experimental runtime APIs to migrate.
- Rollup changes are handled by the standard Vite build; no custom bundling hooks are present.
- Vite 7 requires Node 20.19+ or 22.12+. LearnHub requires **Node 22.12+** and CI selects Node 22. Local checks used Node 24.18.0.
- Vite 7's default output targets newer browsers (Chrome/Edge 107, Firefox 104, Safari 16). This project accepts that modern-browser baseline. Only bundled Chromium was exercised automatically; other engines are not claimed as verified.
- The React plugin's published peer range includes Vite 7. React 18 remains compatible with the selected router version.

Build, unit, browser, and lint results belong in the README. A build passing alone is not evidence that advisories are resolved.

## Runtime versus development exposure

**Build and development tools:** Babel, Vite, Rollup, esbuild, PostCSS, and lint parsers primarily run on the developer or CI machine. Crafted source, source maps, patterns, or access to a development server can matter there. Some original bundler advisories concerned generated output as well, so development dependencies were not dismissed as harmless. The targeted updates remove their reported entries from the final audit. Publish only `dist`; the development server and lint tools are not deployed as services.

**Browser runtime:** React Router is bundled with the application. Two moderate advisories remain on the installed 6.x version:

1. [GHSA-wrjc-x8rr-h8h6: open redirect via attacker-controlled navigation paths](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6). LearnHub's destinations are fixed local routes or IDs from the local course dataset. Query text is used only for filtering and is encoded as URL search parameters; it is not passed as a destination to Link or navigate. **Assessment:** the reported attacker-controlled destination path is not exposed by the current implementation. Reassess before adding return URLs, externally supplied links, or remote course IDs.
2. [GHSA-337j-9hxr-rhxg: constructor injection through SSR error hydration](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg). The maintainer states that declarative routing is unaffected. LearnHub uses BrowserRouter and createRoot with no SSR or hydration. **Assessment:** this advisory's execution path is absent here.

npm propagates these to the `react-router-dom` entry. They are not suppressed. Patches are available in React Router 7.18+; moving from 6.x is a separate application dependency migration. Before publication, schedule that upgrade, review [the official v6-to-v7 migration](https://reactrouter.com/7.18.4/upgrading/v6), check future flags and navigation semantics, and rerun the URL/history/focus suite. The current code-specific assessment is not a guarantee for future features.

ESLint 8 is also an older toolchain line. Its configuration migration can be handled separately; it is not shipped in the static application. Continue routine dependency and browser-test updates rather than treating this dated audit snapshot as permanent clearance.
