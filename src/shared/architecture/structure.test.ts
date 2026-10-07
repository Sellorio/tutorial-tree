import { readFileSync } from 'node:fs'
import { dirname, basename, relative } from 'node:path'
import ts from 'typescript'
import { expect, it } from 'vitest'

it('keeps production units individual and UI components small and colocated', () => {
  const root = process.cwd()
  const files = ts.sys.readDirectory(root, ['.ts', '.tsx'], [], ['src/**/*'])
  const violations: string[] = []
  for (const file of files) {
    const local = relative(root, file).replaceAll('\\', '/')
    if (/\.test\.|\/testing\/|src\/(main\.tsx|routeTree\.gen\.ts)$/.test(local))
      continue
    const text = readFileSync(file, 'utf8')
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    )
    const units = source.statements.filter(
      (statement) =>
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement),
    )
    if (units.length > 1) violations.push(`${local}: multiple declarations`)
    if (
      !/^src\/(pages\/(menu|edit|run|auth)|routes|shared)\//.test(local) &&
      local !== 'src/router.tsx'
    )
      violations.push(`${local}: missing UI ownership folder`)
    if (
      file.endsWith('.tsx') &&
      !/^src\/routes\//.test(local) &&
      local !== 'src/router.tsx'
    ) {
      const name = basename(file, '.tsx')
      if (basename(dirname(file)) !== name)
        violations.push(`${local}: missing component folder`)
      if (text.trimEnd().split(/\r?\n/).length > 100)
        violations.push(`${local}: exceeds 100 lines`)
      for (const statement of source.statements.filter(
        ts.isImportDeclaration,
      )) {
        const target = (statement.moduleSpecifier as ts.StringLiteral).text
        if (target.endsWith('.module.css') && target !== `./${name}.module.css`)
          violations.push(`${local}: stylesheet not colocated`)
      }
    }
  }
  expect(violations).toEqual([])
})
