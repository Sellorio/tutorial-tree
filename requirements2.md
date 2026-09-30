* Move the heading and heading actions to the title bar to reduce vertical space usage. Remove the current import/export buttons from the title bar.
* In Edit Mode, nodes can be set to Small, Medium or Large size. Default to Medium. The size setting affects the node's appearance in both Edit and Run modes.
* Connections between nodes should not have arrows at the ends, instead have subtle arrows along the path at consistent intervals.
* Connections should not be attached to anchor points and should always be a direct path from the center of each node. Make sure the connection doens't render weird despite it's origin being the center of the node.
* Don't show color palette if a node isn't selected.
* Nodes can have either an image or an icon. Let the user choose which and then let the user choose which icon to use.
* Fix connections flickering when dragging a node.
* In edit mode, add context menus to nodes and connections that lets users delete the node or connection.
* In edit mode, nodes have too many border layers. A selected node has it's background, then a white border, then a colored outline, then another white border gap and then another outline. That's too visually messy. Simplify the nodes to not be like that and, when selected, the node should have a glow effect (shadow) instead of an extra border.
* In run mode, when showing the node overlay, don't have a single popup for everything on the right and instead have the status update separate to the description separate to the other information.
* In run mode, the tips panel needs a more visible background since currently it has the same color as the canvas. E.g. white in light theme and dark grey in dark theme.
* The UI in general is too spaced out/padded out.
* The site should default to following system theme.
* Remove the "count" for Tips in both Run and Edit modes.
* Don't let users start a Journey from the Edit mode. Only save and return to menu.
* My Journeys should be the first tab on the menu.
* Let users change the image for the overall diagram in edit mode.
* Remove the "Starter Tree" tag.
* Move the delete button to be along side other actions in the diagrams tab of the menu.
* Move the import button to be next to the new button on the menu screen and have it context sensitive based on the selected tab.