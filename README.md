# SimpCity Hide Threads

Persistently hide SimpCity threads and manage your hidden-thread list.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the raw userscript URL:
   <https://raw.githubusercontent.com/vylix-dev/simpcity-hide-threads/main/simpcity-hide-threads.user.js>
3. Tampermonkey will detect the `.user.js` file and prompt you to install it.

## Updates

Tampermonkey checks the metadata file declared in `@updateURL`:

<https://raw.githubusercontent.com/vylix-dev/simpcity-hide-threads/main/simpcity-hide-threads.meta.js>

Keep `@version` in `simpcity-hide-threads.user.js`, `simpcity-hide-threads.meta.js`, and `CHANGELOG.md` aligned for every release.

## Features

- Adds inline Hide buttons to SimpCity thread rows.
- Stores hidden threads under the existing `simpcity_hidden_threads_v1` key.
- Hides matching threads on current and dynamically inserted thread lists.
- Provides a Tampermonkey menu command for managing hidden threads.
- Rebuilds the manager modal with safe DOM construction, no stored-data `innerHTML`, a duplicate-modal guard, and keyboard close/focus handling.

## Split from infinite scroll

This script no longer fetches or inserts replacement threads; it only handles persistent hiding and hidden-list management.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT © vylix-dev.
