# Sandbox
This is my space to screw around with vibecoding... starting with a basic app to play a particular solitaire game.
Nothing fancy here !

## Progressive Web App (PWA) Notes

The game now ships with a small set of files that enable offline support:

- `manifest.webmanifest` – describes the installable experience and references the platform icons.
- `sw.js` – caches the core assets so the game keeps working once it has been loaded online.
- `icon-192.png` / `icon-512.png` – required icons for installation surfaces (e.g., Add to Home Screen).

When opening a pull request, GitHub may display a banner that says **“Binary files are not supported”** because the icon assets are PNG binaries. This message is informational only—the PR can still be created and merged. Mention the icons in the PR description so reviewers understand why the warning appears.

### Offline Testing Checklist

1. Visit the site with a network connection.
2. Wait for the service worker to install, then reload once.
3. Disable the network (Airplane Mode) and reload—gameplay should continue to work.
4. On iOS/iPadOS Safari, use “Add to Home Screen” and repeat the offline test from the installed icon.
