Here we have a brand new react vite template. We'll be making a new app from this. The app will be used to create a talent tree style diagram and then interact with it. The app will feature an editor mode and a run mode.

## Visual Requirements

* Each node should be circular with a wrapper element for styling borders and such.
* Connections are lines that are curved. The curvature changes from 0 to 60 degrees based on how close the two nodes are. Nearby nodes have a steeper connection angle.
* Light and dark theme should be available.

## Requirements applicable to both Edit and Run modes

* Left or middle mouse button click and drag can be used to pan the canvas. Left click and drag only works when clicking on the canvas directly.
* The selected diagram or instance is preserved in the URL and refreshing the page loads back into the same diagram/instance.
* A menu bar should exist at the top which has the options to go back to the main menu, import and export.
* In the main menu, users can choose to create/edit/delete diagrams or create/open/delete instances. Deleting should require confirmation. Deleting a diagram should also delete all the instances using that diagram.
* Node size is set based on the configured node size.

## Editing requirements

* The design starts with a "Start" node that cannot be removed and cannot have its status set (it is always completed)
* Nodes can be created by right clicking on the design surface and selecting "Add Node" from the context menu.
* Each node can be connected to another node by clicking and dragging from the edge of one node onto another node.
* Nodes and connections can be selected to modify options in an options panel. This options panel defaults to the right side of the screen but can be moved or undocked by dragging the panel's header.
* Start nodes cannot be the target of a new connection - only the origin.
* Connections can be toggled between a clockwise curve and a counter clockwise curve
* Connections have a direction (from source to destination) which is used for determining whether or not a node is unlocked when in Run Mode.
* Nodes can be moved by dragging them.
* Nodes can have an image set which displays as the node's background.
* Nodes can have an accent color set based on 10 hard coded colors.
* Nodes can be set to require all nodes connected as inputs to be completed in order to unlock or just one (all vs any).
* Nodes can have text set which is displayed in the node.
* Nodes have a unique id generated which is used for preserving state in Run mode.
* When saving, data is saved to the user's browser.
* Users can import and export diagrams.
* Nodes can have a description.
* Nodes can have a YouTube tutorial url link added.
* Nodes can have zero or more "Tips" which have a short description and a long description.
* Nodes can be set to one of 3 sizes (Small, Medium, Large). Defaults to Medium.

## Run requirements

* Every diagram should have a unique id that is used to link instances to diagrams (especially during import/export operations).
* Nodes have the following states: Locked, Unlocked, In Progress and Completed.
* Node statuses are saved to the user's browser in real time.
* When changes to nodes and connections are saved, existing node statuses are merged in. If a node should be locked in the new version of the diagram, update to Locked unless the node is in Completed status.
* Users can "start" a new instance of a diagram. Each instance saves its own node states.
* When a user clicks a node in Run mode, an overlay surrounds the node. To the right of the node, buttons appear that let the user select the status of the node to Unlocked, In Progress or Completed. Below the status buttons, the description of the node and (if set) the embedded youtube player should be shown. On the left side of the node, the tips should be listed using their short description.
* When a tip is clicked, it should expand to show the long description instead. Clicking the tip again will collapse it back.
* When changing from Completed to another status, the user should be warned that this can cause other nodes to become locked.
* When updating a node from Completed status, lock any dependent nodes that are not in Completed status.
* When updating a node to Completed status, unlock any dependent nodes that are locked based on the dependent node's "all" vs "any" condition switch and the status of its other parent nodes.
* Node overlay closes when clicking off or when changing a node's status.
* Locked nodes are not interactable and appear partially desaturated and darkened (or lightened in light mode).
* Inactive connections (connections where the origin node is not completed) should have their opacity reduced.
* Users should be able to export and import their instance data so they can transfer their progress between browsers. When importing instance data, perform a merge to ensure that any diagram changes remain compatible with the data.

## Code Quality

* Ensure code is not duplicated or redundant, always reuse common logic.
* Ensure all logic is covered by unit tests to prevent future regression.
* Ensure code is consistently formatted based on standard TypeScript coding conventions and that blank lines are inserted as needed to visually split up blocks of code.
* Ensure only eraseable syntax is used and only `type` not `class` or `interface` except if absolutely necessary.
* Make sure css is well structured and using scoped css `*.module.css`. Never have inline styles except for styles that have to be set by TypeScript/JavaScript.
* Make sure code is clean and readable.
* Make sure code is consistent in structure and naming within the codebase.

## Final Nodes

If there are obvious gaps in the requirements, fill them in with your best judgement.

Verify all features with unit tests and by running and using the app. This incldues visual verification to make sure styles are all correct and the site appears as intended at runtime.
