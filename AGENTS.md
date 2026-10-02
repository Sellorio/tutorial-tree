# Task Workflow

1. Investigate the code
2. Implement the change
3. Ensure changes are backwards compatible with persisted and exported data formats
4. Ensure the mobile user experience is good for all UI changes - even if the prompt doens't explicitly mention it
4. Update unit tests and e2e tests
5. Verify change using `npm run verify`
6. Test the change using the built-in browser (if you can)

# Implementation Guidelines

* Ensure code is consistently formatted with related code
* Ensure naming conventions in similar code is adhered to
* Do not overload a file/function/class with too many lines of code - instead break down large blocks of code into smaller parts

# Coding Conventions

* Do not omit semi-colons in TypeScript code
* Do not use non-erasable syntax
* Prefer `type` over `class` or `interface`
* Prefer maximum of one type per file
* Prefer maximum of one React component per file
* Group related files into folders

# Communication Guidelines

* Do not hesitate to ask questions if something is unclear
* Do not claim to have successfully verified a change if you were unable to verify or verification has failed
