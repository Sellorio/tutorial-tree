import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const projectDirectory = join(import.meta.dir, '..')
const dataDirectory = join(projectDirectory, 'appdata')
const stdio = {
  stdin: 'inherit' as const,
  stdout: 'inherit' as const,
  stderr: 'inherit' as const,
}

mkdirSync(dataDirectory, { recursive: true });

const build = Bun.spawn(
  [
    'docker',
    'build',
    '--target',
    'development',
    '--tag',
    'tutorial-tree-dev:local',
    projectDirectory,
  ],
  { cwd: projectDirectory, ...stdio },
)

const buildExitCode = await build.exited
if (buildExitCode !== 0) {
  process.exitCode = buildExitCode
} else {
  const run = Bun.spawn(
    [
      'docker',
      'run',
      '--rm',
      '--init',
      '--publish',
      '5173:5173',
      '--env',
      'APP_DATA_DIR=/data',
      '--volume',
      `${projectDirectory}:/app`,
      '--volume',
      '/app/node_modules',
      '--volume',
      `${dataDirectory}:/data`,
      'tutorial-tree-dev:local',
    ],
    { cwd: projectDirectory, ...stdio },
  )

  process.exitCode = await run.exited
}
