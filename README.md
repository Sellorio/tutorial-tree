# Tutorial Tree

A skill-tree editor and learning-progress tracker, built with React, TypeScript, TanStack Start, and React Flow. Accounts and per-user libraries are stored in SQLite on the server.

## Run

Install Bun 1.4.2 or later and Docker Desktop. `bun run dev` builds and runs the development Docker container directly, mounting the source for hot reload. SQLite data is stored in the ignored `appdata/` directory.

```sh
bun install
bun run dev
```

The first startup seeds the admin account (`admin`) with the password `password`. Sign in and change it when prompted. From the administration portal, create registration tickets and share their `/register?ticket=...` links. The production container stores its SQLite database in `/data`.

Build and export the production image as a Docker tar archive with `bun run publish`; this creates `tutorial-tree.tar`. Load it with `docker load --input tutorial-tree.tar` and run the image with a persistent volume mounted at `/data`.

## Workspace

- **My journeys** (the default tab): create, continue, export, or delete independent instances. **New journey** lets you choose its source tree.
- **Skill trees**: create, edit, export, or delete diagrams. Start a named journey from any diagram's menu card.
- Deletion requires confirmation. Deleting a diagram also deletes every journey linked to it.
- The compact title bar contains the current title and actions. On the menu, **Import** sits next to **New** and accepts the selected tab's export type. Export and delete actions live alongside each tree or journey.
- Theme defaults to **System**, follows OS changes, and supports persistent **Light** and **Dark** overrides.
- Clean URLs such as `/edit/{id}` and `/run/{id}` identify the open diagram or journey. Refresh restores it; unknown IDs show a recoverable empty state.

## Editor

- Right-click the canvas and choose **Add Node**, or use the circular-node button in the canvas toolbar.
- Drag a node to move it. Drag from one of its four edge handles onto another node to connect them.
- Hold Shift and drag on empty canvas to box-select multiple nodes, including nodes partially intersecting the selection area, then drag the group to move them together. Shift-click adds or removes individual nodes. The canvas cursor becomes a crosshair while Shift is held.
- Undo or redo diagram edits with the title-bar arrow buttons, Ctrl+Z, and Ctrl+Y or Ctrl+Shift+Z, including while editing settings fields. The selected node or connection stays selected. Node/group drags count as one edit. History lasts for the current editor session and is cleared when opening another tree.
- Left-drag empty canvas or middle-drag to pan. Scroll/pinch or use the zoom and fit controls.
- Select a node to edit its text, description, Small/Medium/Large size (default Medium), one of ten accent colors, all/any prerequisite rule, YouTube video, and tips. Size is shared by Edit and Run modes.
- Choose **Icon** and a Lucide icon, or **Image** and a URL/upload. With no node selected, the overview offers the diagram's cover image instead of a color palette.
- Images accept HTTP(S) URLs or PNG/JPEG/WebP/GIF uploads under 1.5 MB. Uploaded images are embedded in exports.
- Select a connection to switch clockwise/counterclockwise curvature or delete it. Curves run center-to-center, masked beneath the nodes; subtle arrows repeat every 64 canvas units instead of appearing at endpoints. Nearby connections curve more steeply, up to 60 degrees.
- Choose **Manual** curve size to set a connection's angle from 0 to 60 degrees with the slider or numeric field. **Automatic** restores distance-based curvature and displays the calculated angle.
- In Tree overview, choose which source statuses activate connections: Unlocked, In Progress, and Completed are independent checkboxes, with In Progress and Completed checked by default. Uncheck **Use diagram defaults** on a selected connection to customize these statuses; no checked statuses means it is never active.
- Right-click a node or connection to delete it with confirmation. Selected nodes use a glow instead of extra border rings.
- Drag the **Properties** header to undock or move the inspector. Drop near either window edge or use its dock buttons to redock. On small screens, the docked inspector sits below the canvas.
- Start is always completed, cannot be deleted, and cannot receive a connection. Duplicate, self-referencing, and cyclic connections are rejected.
- **Save** writes the diagram to your account and reconciles existing journeys. **Save & return** saves and opens the menu. Journeys can only be started from the menu. Navigation and refresh warn about unsaved edits.

## Run Mode

- States are Locked, Unlocked, In Progress, and Completed. Locked nodes cannot be selected.
- Selecting an available node opens separate status, description, tutorial, and prerequisite sections. Expandable tips have an opaque theme-aware background and no count. Desktop tips appear to the left; the separate detail sections appear to the right. Mobile stacks the sections below the selected node.
- Changing status saves immediately and closes the overlay. Clicking the canvas, pressing Escape, or panning also closes it.
- Reverting a completed node requires confirmation because dependent unfinished nodes may become locked.
- A node unlocks when every incoming connection is active (**all**) or at least one incoming connection is active (**any**), using each connection's allowed source statuses or the diagram defaults. Unlocks and relocking propagate through the tree. Nodes without inputs stay locked, except Start.
- Completed nodes stay completed through prerequisite changes. In-progress nodes keep that status only while their prerequisites remain satisfied. Removed node IDs are discarded.
- Inactive connections are dimmed. Each journey keeps separate progress against the same diagram.

## Portable Data

Exports are versioned JSON with stable diagram, node, connection, and instance IDs. Imports associate data with the signed-in account; users can only access their own diagrams and journeys.

- A **diagram export** contains the diagram. Importing it replaces the diagram with the same ID and reconciles every linked instance.
- An **instance export** includes both its diagram and progress. Importing into an account without that diagram restores both. When that diagram already exists in the account, its current structure takes precedence; imported statuses are merged by node ID and reconciled against it.
- Imports require confirmation and reject malformed JSON, invalid graphs, unsupported versions, unsafe media values, and mismatched instance ownership. Maximum import size is 10 MB.
- Library data is stored in the server's SQLite database. Theme preference remains in browser storage under `branch.theme`. Export important work before deleting an account or its server data.
- YouTube embeds and remote images need network access. Uploaded images, the included starter photo, and saved progress are persisted with the account. Typography has a local fallback when Google Fonts is unavailable.

## Verification

```sh
bun run test
bun run test:coverage
bun run lint
bun run format:check
bun run build
bun --bun run playwright install chromium
bun run test:e2e
```

`bun run format` applies the repository's Prettier configuration. Playwright starts an isolated Bun/Vite server and SQLite database; its users and state do not alter application data.

| Area                                                                    | Tests                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Validation, migrations, transfers, Start protection, progression        | [shared model tests](src/shared/model/model.test.ts)                                                                |
| Persistence and corrupt-storage recovery                                | [storage tests](src/shared/storage/storage.test.ts)                                                                 |
| Metadata, images, tips, prerequisites                                   | [inspector tests](src/edit/Inspector/Inspector.test.tsx)                                                            |
| Status controls, tips, videos                                           | [run overlay tests](src/run/RunOverlay/RunOverlay.test.tsx)                                                         |
| Docking and naming dialogs                                              | [panel tests](src/edit/MovablePanel/MovablePanel.test.tsx), [dialog tests](src/menu/NameDialog/NameDialog.test.tsx) |
| Canvas callbacks, selection, context menus, viewport                    | [canvas tests](src/shared/Canvas/Canvas.test.tsx)                                                                   |
| Routing, save/return, confirmations, imports, independent progress      | [application tests](src/shared/WorkspaceApp/WorkspaceApp.test.tsx)                                                  |
| File ownership, individual declarations, component size, CSS colocation | [structural guard](src/shared/architecture/structure.test.ts)                                                       |
| Pointer gestures, downloads, refresh, desktop/mobile themes             | [browser tests](e2e/workspace.spec.ts)                                                                              |

Coverage reports are generated in `coverage/`; the shared model is gated at 100% line and function coverage. Browser screenshots and failure traces are written to `test-results/`. CI runs formatting, lint, unit coverage, the production build, and Chromium workflows.

## Structure

UI is organized under `src/pages`, `src/shared`, and TanStack Start's `src/routes`. Components have their own folder, matching CSS module when needed, separate props type, and colocated tests or component-specific helpers. Tests of a composed screen also exercise its smaller child components.

```text
src/
	main.tsx
	routes/     file-based workspace, auth, and admin routes
	pages/      menu, edit, run, auth
	shared/
		WorkspaceApp/    composition, state, routing effects, shared actions
		Canvas/          adapter, node/edge components, geometry, flow types
		ThemePicker/     theme control, preference hook and constants
		server/          SQLite, authentication, and per-user data operations
		model/           one operation per file; types, schemas and constants
		storage/         library validation and starter data
		styles/          global design tokens and resets
		testing/         shared test setup
		architecture/    source-structure regression guard
```

### Finding The Right File

- Start at [WorkspaceApp](src/shared/WorkspaceApp/WorkspaceApp.tsx) for screen composition. Its [store](src/shared/WorkspaceApp/useWorkspaceStore.ts), [derived view](src/shared/WorkspaceApp/getWorkspaceView.ts), [effects](src/shared/WorkspaceApp/useWorkspaceEffects.ts), and [action wiring](src/shared/WorkspaceApp/useWorkspace.ts) are separate.
- Change editor fields in their folders under `edit`, for example [NodeVisualField](src/edit/NodeVisualField/NodeVisualField.tsx). Workflow operations shared by editor controls live under `edit/actions`; progress operations live under `run/actions`.
- Change node appearance in [TalentCircle](src/shared/Canvas/TalentCircle/TalentCircle.tsx), paths in [CurvedConnection](src/shared/Canvas/CurvedConnection/CurvedConnection.tsx), and pointer behavior in [createFlowProps](src/shared/Canvas/CanvasContent/createFlowProps.ts).
- Change default node sizes, colors, or icon choices in `shared/model/constants`. Starter content lives in [STARTER_SKILLS](src/shared/storage/STARTER_SKILLS.ts) and [STARTER_CONNECTIONS](src/shared/storage/STARTER_CONNECTIONS.ts).
- Change palette and global typography in [Global.module.css](src/shared/styles/Global.module.css). Component styling lives beside the component, including its responsive rules.

Production files contain one named function, component, class, or type declaration. Component files stay below 100 lines; the structural test enforces this. Event callbacks remain beside the interaction they handle, while named reusable helpers live in separate files. Prefer direct imports over aggregation barrels so dependencies remain visible.

Keep React Flow's explicit `measured` dimensions in [createFlowNodes](src/shared/Canvas/CanvasContent/createFlowNodes.ts). Omitting them makes React Flow clear handle bounds and temporarily remove edges during dragging. The browser suite samples rendered connection geometry across drag frames to guard against this regression.

The starter photograph is bundled from [Unsplash](https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85). Icons are provided by Lucide. React Flow attribution remains visible on the canvas.
