# Task Workflow

1. Investigate the code
2. Implement the change
3. Ensure changes are backwards compatible with persisted and exported data formats
4. Ensure the mobile user experience is good for all UI changes - even if the prompt doesn't explicitly mention it
5. Update unit tests and e2e tests
6. Verify change using `npm run verify`. If verification breaks due to changes caused by me, fix the verification issues. This includes fixing any bugs that tests may uncover.
7. Test the change using the built-in browser (if you can).
8. Always shut down any instances of that app that you started (including any leftover instances from playwright test runs).

# Implementation Guidelines

* Ensure code is consistently formatted with related code
* Ensure naming conventions in similar code is adhered to
* Group related files into folders
* Do not overload a file/function/class with too many lines of code - instead break down large blocks of code into smaller parts
* Fix any code that violates the coding guidelines/conventions in this document as you encounter them.

## TypeScript/TSX

* Do not omit semi-colons
* Do not use non-erasable syntax
* Prefer `type` over `class` or `interface`
* Prefer maximum of one type per file
* Prefer maximum of one React component per file
* Avoid `any` or `unknown` in favor of explicit typing where possible

## CSS

* Have a blank line between property blocks
* When naming keyframes, keep names unique by including the component's name

# Communication Guidelines

* Do not hesitate to ask questions if something is unclear
* Do not claim to have successfully verified a change if you were unable to verify or verification has failed
