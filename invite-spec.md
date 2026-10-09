# New Feature: Invite

A new feature will be added that lets digram authors to invite anyone to start a journey using their diagram.

## The invite button

A new button is added to the edit mode and to a diagram's list item in the menu.
Clicking this button opens a popup that presents users with the invite link.
The link format is `{host}/invite?code={inviteCode}`.

When Invite is clicked, an invite record is created with a guid "code" and a foreign key linking it to a new registration ticket record that is generated at the same time. Invites older than 2 weeks should be considered as expired and should be regularly cleaned out (including the associated registration ticket).

The invite popup has a button to copy the link into the clipboard.

## A new page

A new `/invite?code={inviteCode}` route should be added to the app.

If the user is not logged in, they must choose to either log in or register. If they choose to register, the registration ticket associated with the invite should be used to let them register. Once the user registers or logs in, they should return to the invite page as a logged in user.

If the user is logged in, they are shown a "You have been invited on a journey!" message and a buttont to "Accept" the invitation. When the accept button is clicked, the journey is created, the invite (and registration ticket) are consumed and the user is navigated to their new journey.

Note: users are able to start a journey for a diagram they cannot edit by using this feature.

## Fail scenarios

I'll specifically call out these extra fail scenarios to take note of:

* Invalid or expired invite codes should show an error.
* If a user registers using an invite code but then does not accept the journey, an error should be shown if the invite code is used again and the new users selects Register (since the registration ticket has been consumed).
* Invites should only be consumed once the accept button is clicked
