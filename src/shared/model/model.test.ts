import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_CATEGORIES, LEGACY_CATEGORY_IDS } from './constants/CATEGORIES'
import { connectionCurve } from './connectionCurve'
import { connectionError } from './connectionError'
import { createDiagram } from './createDiagram'
import { createInstance } from './createInstance'
import { createNode } from './createNode'
import { deleteDiagram } from './deleteDiagram'
import { ensureStatusTimestamps } from './ensureStatusTimestamps'
import { diagramSchema } from './schemas/diagramSchema'
import { nodeSchema } from './schemas/nodeSchema'
import { exportData } from './exportData'
import { importData } from './importData'
import { librarySchema } from './schemas/librarySchema'
import { NodeSizeConstants } from './constants/NodeSizeConstants'
import { openPosition } from './openPosition'
import { parseRoute } from './parseRoute'
import { reconcileStatuses } from './reconcileStatuses'
import { removeNode } from './removeNode'
import { saveDiagram } from './saveDiagram'
import { setStatus } from './setStatus'
import { youtubeEmbed } from './youtubeEmbed'
import type { Diagram } from './types/Diagram'
import type { Library } from './types/Library'
import type { TalentNode } from './types/TalentNode'

function fixture() {
  const diagram = createDiagram('Test tree')
  const start = diagram.nodes.find(
    (node): node is TalentNode => node.kind === 'start',
  )!
  const first = createNode({ x: 200, y: 100 })
  const second = createNode({ x: 200, y: 300 })
  const final = createNode({ x: 400, y: 200 })
  diagram.nodes.push(first, second, final)
  diagram.connections = [
    [start, first],
    [start, second],
    [first, final],
    [second, final],
  ].map(([source, target]) => ({
    id: crypto.randomUUID(),
    source: source.id,
    target: target.id,
    clockwise: true,
  }))
  const instance = createInstance(diagram, 'My journey')
  const library: Library = {
    version: 1,
    diagrams: [diagram],
    instances: [instance],
  }
  return { diagram, start, first, second, final, instance, library }
}

describe('progress rules', () => {
  it('records progress and completion timestamps for status changes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-02T10:00:00.000Z'))
    try {
      const { diagram, instance, first, second } = fixture()
      const inProgress = setStatus(diagram, instance, first.id, 'in-progress')
      expect(inProgress.statusTimestamps?.[first.id]?.inProgressAt).toBe(
        inProgress.updatedAt,
      )

      vi.setSystemTime(new Date('2026-10-02T11:00:00.000Z'))
      const completed = setStatus(diagram, inProgress, first.id, 'completed')
      expect(completed.statusTimestamps?.[first.id]).toEqual({
        inProgressAt: inProgress.updatedAt,
        completedAt: completed.updatedAt,
      })

      vi.setSystemTime(new Date('2026-10-02T12:00:00.000Z'))
      const completedDirectly = setStatus(
        diagram,
        instance,
        second.id,
        'completed',
      )
      expect(completedDirectly.statusTimestamps?.[second.id]).toEqual({
        inProgressAt: completedDirectly.updatedAt,
        completedAt: completedDirectly.updatedAt,
      })
    } finally {
      vi.useRealTimers()
    }
  })
  it('keeps dot statuses and timestamps derived instead of persisting them', () => {
    const { diagram, start, first } = fixture()
    const dot = nodeSchema.parse({
      id: crypto.randomUUID(),
      kind: 'dot',
      position: { x: 120, y: 120 },
      requirement: 'all',
    })
    diagram.nodes.push(dot)
    diagram.connections = [
      {
        id: crypto.randomUUID(),
        source: start.id,
        target: dot.id,
        clockwise: true,
      },
      {
        id: crypto.randomUUID(),
        source: dot.id,
        target: first.id,
        clockwise: true,
      },
    ]

    const instance = createInstance(diagram, 'Dot journey')
    const timestamps = ensureStatusTimestamps(diagram, {
      ...instance,
      statuses: { ...instance.statuses, [dot.id]: 'completed' },
      statusTimestamps: {
        [dot.id]: { inProgressAt: '2026-10-02T10:00:00.000Z' },
      },
    })

    expect(instance.statuses[dot.id]).toBeUndefined()
    expect(reconcileStatuses(diagram)[dot.id]).toBe('completed')
    expect(timestamps.statusTimestamps?.[dot.id]).toBeUndefined()
    expect(
      setStatus(diagram, instance, first.id, 'completed').statuses[dot.id],
    ).toBeUndefined()
  })
  it('preserves historical timestamps when a node is unlocked again', () => {
    const { diagram, instance, first } = fixture()
    const timestamps = { inProgressAt: '2026-10-02T10:00:00.000Z' }
    const normalized = ensureStatusTimestamps(diagram, {
      ...instance,
      statusTimestamps: { [first.id]: timestamps },
    })
    expect(normalized.statusTimestamps?.[first.id]).toEqual(timestamps)
  })
  it('uses in-progress and completed inputs by default for ALL and ANY', () => {
    const { diagram, instance, first, second, final } = fixture()
    const partial = setStatus(diagram, instance, first.id, 'in-progress')
    expect(partial.statuses[final.id]).toBe('locked')
    const active = setStatus(diagram, partial, second.id, 'in-progress')
    expect(active.statuses[final.id]).toBe('unlocked')
    expect(
      setStatus(diagram, active, first.id, 'unlocked').statuses[final.id],
    ).toBe('locked')
    final.requirement = 'any'
    expect(reconcileStatuses(diagram, partial.statuses)[final.id]).toBe(
      'unlocked',
    )
  })
  it('recursively completes chained dots using their ALL and ANY inputs', () => {
    const { diagram, start, first, second, final } = fixture()
    const firstDot = nodeSchema.parse({
      id: crypto.randomUUID(),
      kind: 'dot',
      position: { x: 300, y: 150 },
      requirement: 'all',
      title: 'Ignored text',
    })
    const secondDot = nodeSchema.parse({
      id: crypto.randomUUID(),
      kind: 'dot',
      position: { x: 400, y: 150 },
      requirement: 'any',
    })
    diagram.nodes = [start, first, second, final, firstDot, secondDot].reverse()
    diagram.connections = [
      [start, firstDot],
      [first, firstDot],
      [firstDot, secondDot],
      [second, secondDot],
      [secondDot, final],
    ].map(([source, target]) => ({
      id: crypto.randomUUID(),
      source: source.id,
      target: target.id,
      clockwise: true,
    }))

    const statuses = reconcileStatuses(diagram, { [first.id]: 'completed' })

    expect(firstDot).not.toHaveProperty('title')
    expect(statuses[firstDot.id]).toBe('completed')
    expect(statuses[secondDot.id]).toBe('completed')
    expect(statuses[final.id]).toBe('unlocked')
  })
  it('resolves unlocked chains regardless of node order and relocks active descendants', () => {
    const { diagram, first, second, final } = fixture()
    diagram.activeStatuses = ['unlocked', 'in-progress', 'completed']
    diagram.nodes.reverse()
    const statuses = reconcileStatuses(diagram)
    expect(statuses[first.id]).toBe('unlocked')
    expect(statuses[second.id]).toBe('unlocked')
    expect(statuses[final.id]).toBe('unlocked')
    diagram.connections = diagram.connections.filter(
      (edge) => edge.target !== first.id,
    )
    expect(
      reconcileStatuses(diagram, { ...statuses, [final.id]: 'in-progress' })[
        final.id
      ],
    ).toBe('locked')
  })
  it('honors connection overrides, empty sets, and mixed ALL/ANY requirements', () => {
    const { diagram, first, second, final } = fixture()
    diagram.activeStatuses = ['completed']
    diagram.connections.find(
      (edge) => edge.source === first.id,
    )!.activeStatuses = ['unlocked']
    expect(reconcileStatuses(diagram)[final.id]).toBe('locked')
    expect(
      reconcileStatuses(diagram, { [second.id]: 'completed' })[final.id],
    ).toBe('unlocked')
    final.requirement = 'any'
    expect(reconcileStatuses(diagram)[final.id]).toBe('unlocked')
    diagram.connections.find(
      (edge) => edge.source === first.id,
    )!.activeStatuses = []
    expect(reconcileStatuses(diagram)[final.id]).toBe('locked')
    expect(
      reconcileStatuses(diagram, { [final.id]: 'completed' })[final.id],
    ).toBe('completed')
  })
  it('always completes Start, unlocks its children, and locks unmet all requirements', () => {
    const { start, first, final, instance } = fixture()
    expect(instance.statuses).toMatchObject({
      [start.id]: 'completed',
      [first.id]: 'unlocked',
      [final.id]: 'locked',
    })
  })
  it('unlocks ALL inputs only when every parent is completed', () => {
    const { diagram, instance, first, second, final } = fixture()
    const partial = setStatus(diagram, instance, first.id, 'completed')
    expect(partial.statuses[final.id]).toBe('locked')
    expect(
      setStatus(diagram, partial, second.id, 'completed').statuses[final.id],
    ).toBe('unlocked')
  })
  it('unlocks ANY inputs when one parent is completed', () => {
    const { diagram, instance, first, final } = fixture()
    final.requirement = 'any'
    expect(
      setStatus(diagram, instance, first.id, 'completed').statuses[final.id],
    ).toBe('unlocked')
  })
  it('relocks in-progress dependents but preserves completed nodes', () => {
    const { diagram, instance, first, second, final } = fixture()
    const completed = setStatus(
      diagram,
      setStatus(diagram, instance, first.id, 'completed'),
      second.id,
      'completed',
    )
    const active = setStatus(diagram, completed, final.id, 'in-progress')
    expect(
      setStatus(diagram, active, first.id, 'unlocked').statuses[final.id],
    ).toBe('locked')
    const finished = setStatus(diagram, active, final.id, 'completed')
    expect(
      setStatus(diagram, finished, first.id, 'unlocked').statuses[final.id],
    ).toBe('completed')
  })
  it('keeps ANY dependent unlocked while another input is completed', () => {
    const { diagram, instance, first, second, final } = fixture()
    final.requirement = 'any'
    const complete = setStatus(
      diagram,
      setStatus(diagram, instance, first.id, 'completed'),
      second.id,
      'completed',
    )
    expect(
      setStatus(diagram, complete, first.id, 'in-progress').statuses[final.id],
    ).toBe('unlocked')
  })
  it('prevents changes to Start, locked nodes and unknown nodes', () => {
    const { diagram, instance, start, final } = fixture()
    expect(
      setStatus(diagram, instance, start.id, 'unlocked').statuses[start.id],
    ).toBe('completed')
    expect(
      setStatus(diagram, instance, final.id, 'completed').statuses[final.id],
    ).toBe('locked')
    expect(
      setStatus(diagram, instance, 'missing', 'completed').statuses,
    ).toEqual(instance.statuses)
  })
  it('merges graph edits, removes stale IDs and preserves only compatible active states', () => {
    const { diagram, library, instance, first, second } = fixture()
    instance.statuses[first.id] = 'completed'
    instance.statuses[second.id] = 'in-progress'
    instance.statuses.deleted = 'completed'
    diagram.connections = []
    const merged = saveDiagram(library, diagram).instances[0]
    expect(merged.statuses[first.id]).toBe('completed')
    expect(merged.statuses[second.id]).toBe('locked')
    expect(merged.statuses.deleted).toBeUndefined()
    expect(reconcileStatuses(diagram, merged.statuses)).toEqual(merged.statuses)
  })
  it('instances have independent, unique state', () => {
    const { diagram, instance, first } = fixture()
    const other = createInstance(diagram, 'Other')
    expect(other.id).not.toBe(instance.id)
    expect(
      setStatus(diagram, instance, first.id, 'completed').statuses[first.id],
    ).toBe('completed')
    expect(other.statuses[first.id]).toBe('unlocked')
  })
})

describe('editing and validation', () => {
  it('round-trips connection settings and accepts legacy defaults', () => {
    const { diagram } = fixture()
    diagram.activeStatuses = ['unlocked']
    diagram.connections[0].activeStatuses = []
    diagram.connections[0].curveAngle = 60
    expect(diagramSchema.parse(diagram)).toEqual(diagram)
    const legacy = { ...diagram, activeStatuses: undefined }
    expect(reconcileStatuses(legacy)).toEqual(
      reconcileStatuses({
        ...legacy,
        activeStatuses: ['in-progress', 'completed'],
      }),
    )
    for (const curveAngle of [-1, 61]) {
      expect(
        diagramSchema.safeParse({
          ...diagram,
          connections: [{ ...diagram.connections[0], curveAngle }],
        }).success,
      ).toBe(false)
    }
    expect(
      connectionCurve({ x: 0, y: 0 }, { x: 100, y: 0 }, true, 0).angle,
    ).toBe(0)
    expect(
      connectionCurve({ x: 0, y: 0 }, { x: 100, y: 0 }, true, 60).angle,
    ).toBe(60)
  })
  it('migrates old diagrams to medium nodes while preserving image backgrounds', () => {
    const original = fixture().diagram
    const legacy = JSON.parse(JSON.stringify(original))
    delete legacy.image
    for (const node of legacy.nodes) {
      delete node.name
      delete node.size
      delete node.media
      delete node.icon
    }
    legacy.nodes[1].image = '/studio.jpg'
    const migrated = diagramSchema.parse(legacy)
    expect(migrated.image).toBe('')
    expect(migrated.nodes[1]).toMatchObject({
      name: '',
      size: 'medium',
      media: 'image',
      icon: 'sparkles',
    })
    expect((migrated.nodes[0] as TalentNode).media).toBe('icon')
    expect(NodeSizeConstants).toMatchObject({
      small: { nodeSize: 50, iconSize: 24, fontSize: '0.6rem' },
      medium: { nodeSize: 80, iconSize: 36, fontSize: '1.0rem' },
      large: { nodeSize: 110, iconSize: 48, fontSize: '1.4rem' },
    })
  })
  it('round-trips node names, sizes, icon choices, and diagram cover images', () => {
    const { diagram, first } = fixture()
    first.name = 'Observation'
    first.size = 'large'
    first.media = 'icon'
    first.icon = 'camera'
    diagram.image = '/studio.jpg'
    const imported = importData(
      { version: 1, diagrams: [], instances: [] },
      exportData(diagram),
      'diagram',
    )
    expect(imported.library.diagrams[0].nodes).toEqual(diagram.nodes)
    expect(imported.library.diagrams[0].image).toBe('/studio.jpg')
    expect(() =>
      importData(imported.library, exportData(diagram), 'instance'),
    ).toThrow('Choose an instance export')
  })
  it('rejects duplicate connection, diagram, and instance IDs', () => {
    const { diagram, instance, library } = fixture()
    const duplicateConnections = {
      ...diagram,
      connections: diagram.connections.map((edge) => ({
        ...edge,
        id: 'duplicate',
      })),
    }
    expect(diagramSchema.safeParse(duplicateConnections).success).toBe(false)
    expect(
      librarySchema.safeParse({ ...library, diagrams: [diagram, diagram] })
        .success,
    ).toBe(false)
    expect(
      librarySchema.safeParse({ ...library, instances: [instance, instance] })
        .success,
    ).toBe(false)
  })
  it('places added nodes without covering existing nodes', () => {
    const { diagram, start } = fixture()
    const position = openPosition(diagram, start.position)
    expect(
      diagram.nodes.every(
        (node) =>
          Math.hypot(
            node.position.x - position.x,
            node.position.y - position.y,
          ) >= 160,
      ),
    ).toBe(true)
    expect(openPosition(diagram, { x: 2000, y: 2000 })).toEqual({
      x: 2000,
      y: 2000,
    })
  })
  it('creates nodes with a default category and an immutable Start', () => {
    const { diagram, start, first } = fixture()
    expect(DEFAULT_CATEGORIES).toHaveLength(8)
    expect(start.size).toBe('small')
    expect(first.size).toBe('medium')
    expect(createNode({ x: 0, y: 0 }).id).not.toBe(first.id)
    expect(removeNode(diagram, start.id)).toBe(diagram)
    const removed = removeNode(diagram, first.id)
    expect(
      removed.connections.some(
        (edge) => edge.source === first.id || edge.target === first.id,
      ),
    ).toBe(false)
  })
  it('normalizes legacy accent colors to category IDs', () => {
    const node = createNode({ x: 0, y: 0 })
    const legacyAccents = [
      ['#19877d', 'teal'],
      ['#3478c6', 'teal'],
      ['#7758b8', 'purple'],
      ['#be5684', 'pink'],
      ['#cf5e46', 'orange'],
      ['#bc8623', 'brown'],
      ['#789640', 'green'],
      ['#429ca8', 'teal'],
      ['#8d7765', 'brown'],
      ['#6e7c8d', 'gray'],
      ['#0c9400', 'green'],
      ['#0093ad', 'teal'],
      ['#5100ff', 'purple'],
      ['#db0079', 'pink'],
      ['#d10000', 'red'],
      ['#9e6700', 'brown'],
      ['#ff7300', 'orange'],
      ['rgb(109, 109, 109)', 'gray'],
    ] as const
    for (const [legacyAccent] of legacyAccents)
      expect(
        (
          nodeSchema.parse({
            ...node,
            categoryId: undefined,
            accent: legacyAccent,
          }) as TalentNode
        ).categoryId,
      ).toBe(LEGACY_CATEGORY_IDS[legacyAccent])
  })
  it('rejects missing nodes, self links, incoming Start links, duplicates and cycles', () => {
    const { diagram, start, first, final } = fixture()
    for (const [source, target] of [
      ['missing', first.id],
      [first.id, first.id],
      [first.id, start.id],
      [start.id, first.id],
      [final.id, first.id],
    ])
      expect(connectionError(diagram, source, target)).toBeTruthy()
    expect(connectionError(diagram, start.id, final.id)).toBeNull()
  })
  it('rejects malformed graphs and unsafe media', () => {
    const { diagram, start } = fixture()
    const invalid: Diagram[] = [
      { ...diagram, nodes: [] },
      { ...diagram, nodes: [...diagram.nodes, start] },
      {
        ...diagram,
        categories: [...diagram.categories, { ...diagram.categories[0] }],
      },
      {
        ...diagram,
        nodes: diagram.nodes.map((node) =>
          node.id === start.id
            ? { ...node, categoryId: 'missing-category' }
            : node,
        ),
      },
      {
        ...diagram,
        nodes: diagram.nodes.map((node) => ({
          ...node,
          image: 'javascript:alert(1)',
        })),
      },
      {
        ...diagram,
        connections: [
          ...diagram.connections,
          { id: 'bad', source: 'missing', target: start.id, clockwise: false },
        ],
      },
    ]
    invalid.forEach((value) =>
      expect(diagramSchema.safeParse(value).success).toBe(false),
    )
  })
  it('deleting a diagram cascades only its instances', () => {
    const { library, diagram } = fixture()
    const other = createDiagram('Other')
    library.diagrams.push(other)
    library.instances.push(createInstance(other, 'Other'))
    const result = deleteDiagram(library, diagram.id)
    expect(result.diagrams).toEqual([other])
    expect(result.instances).toHaveLength(1)
    expect(result.instances[0].diagramId).toBe(other.id)
  })
})

describe('portable data', () => {
  it('rejects instance IDs that are already owned by another diagram', () => {
    const { diagram, instance, library } = fixture()
    const other = createDiagram('Other')
    library.diagrams.push(other)
    library.instances[0] = { ...instance, diagramId: other.id }
    expect(() => importData(library, exportData(diagram, instance))).toThrow(
      'different diagram',
    )
  })
  it('round-trips a diagram including node metadata and stable IDs', () => {
    const { diagram, first } = fixture()
    first.description = 'Description'
    first.tips = [{ id: 'tip', short: 'Short', long: 'Long' }]
    first.userTips = [{ id: 'user-tip', text: 'Personal note' }]
    first.youtube = 'https://youtu.be/dQw4w9WgXcQ'
    const result = importData(
      { version: 1, diagrams: [], instances: [] },
      exportData(diagram),
    )
    expect(result.library.diagrams[0].nodes).toEqual(diagram.nodes)
    expect(result.route).toContain(diagram.id)
  })
  it('defaults user tips when importing diagrams created before user tips', () => {
    const { diagram } = fixture()
    const legacyExport = JSON.parse(exportData(diagram))
    legacyExport.diagram.nodes.forEach((node: Record<string, unknown>) => {
      delete node.userTips
    })

    const result = importData(
      { version: 1, diagrams: [], instances: [] },
      JSON.stringify(legacyExport),
    )
    expect(
      result.library.diagrams[0].nodes
        .filter((node): node is TalentNode => node.kind !== 'dot')
        .every((node) => node.userTips.length === 0),
    ).toBe(true)
  })
  it('imports old accent colors and instances without the Show All Skills field', () => {
    const { diagram, instance, first, second } = fixture()
    const legacyExport = JSON.parse(exportData(diagram, instance))
    delete legacyExport.instance.showAllSkills
    const firstLegacyNode = legacyExport.diagram.nodes.find(
      (node: { id: string }) => node.id === first.id,
    )
    delete firstLegacyNode.categoryId
    firstLegacyNode.accent = '#19877d'
    const secondLegacyNode = legacyExport.diagram.nodes.find(
      (node: { id: string }) => node.id === second.id,
    )
    delete secondLegacyNode.categoryId
    secondLegacyNode.accent = '#cf5e46'

    const result = importData(
      { version: 1, diagrams: [], instances: [] },
      JSON.stringify(legacyExport),
    )
    const importedFirst = result.library.diagrams[0].nodes.find(
      (node) => node.id === first.id,
    ) as TalentNode
    const importedSecond = result.library.diagrams[0].nodes.find(
      (node) => node.id === second.id,
    ) as TalentNode
    expect(importedFirst.categoryId).toBe('category-teal')
    expect(importedSecond.categoryId).toBe('category-orange')
    expect(result.library.instances[0].showAllSkills).toBe(true)
  })
  it('backfills timestamps when importing a legacy instance export', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-02T10:00:00.000Z'))
    try {
      const { diagram, instance, first, second } = fixture()
      instance.statuses[first.id] = 'in-progress'
      instance.statuses[second.id] = 'completed'
      const legacyExport = JSON.parse(exportData(diagram, instance))
      delete legacyExport.instance.statusTimestamps

      const imported = importData(
        { version: 1, diagrams: [], instances: [] },
        JSON.stringify(legacyExport),
      ).library.instances[0]
      const timestamp = '2026-10-02T10:00:00.000Z'
      expect(imported.statusTimestamps?.[first.id]).toEqual({
        inProgressAt: timestamp,
      })
      expect(imported.statusTimestamps?.[second.id]).toEqual({
        inProgressAt: timestamp,
        completedAt: timestamp,
      })
    } finally {
      vi.useRealTimers()
    }
  })
  it('transfers an instance to an empty browser including its diagram', () => {
    const { diagram, instance, first } = fixture()
    const progress = setStatus(diagram, instance, first.id, 'completed')
    const result = importData(
      { version: 1, diagrams: [], instances: [] },
      exportData(diagram, progress),
    )
    expect(result.library.diagrams[0].id).toBe(diagram.id)
    expect(result.library.instances[0].statuses).toEqual(progress.statuses)
  })
  it('uses local diagram changes when importing older instance data', () => {
    const { library, diagram, instance, first, second } = fixture()
    const text = exportData(diagram, {
      ...instance,
      statuses: {
        ...instance.statuses,
        [first.id]: 'completed',
        [second.id]: 'in-progress',
        stale: 'completed',
      },
    })
    library.diagrams[0] = {
      ...diagram,
      name: 'New local name',
      connections: [],
    }
    const result = importData(library, text).library
    expect(result.diagrams[0].name).toBe('New local name')
    expect(result.instances[0].statuses[first.id]).toBe('completed')
    expect(result.instances[0].statuses[second.id]).toBe('locked')
    expect(result.instances[0].statuses.stale).toBeUndefined()
    expect(result.instances).toHaveLength(1)
  })
  it('rejects invalid JSON, unsupported versions and mismatched instance ownership', () => {
    const { library, diagram, instance } = fixture()
    for (const text of [
      'bad',
      '{}',
      '{"version":99}',
      JSON.stringify({
        version: 1,
        kind: 'instance',
        diagram,
        instance: { ...instance, diagramId: 'wrong' },
      }),
    ])
      expect(() => importData(library, text)).toThrow()
  })
})

describe('view helpers', () => {
  it('caps automatic curves at 45 degrees and weights distance by the larger node', () => {
    const source = { x: 0, y: 0 }
    const target = { x: 450, y: 0 }
    expect(connectionCurve(source, source, true).angle).toBe(45)
    const small = connectionCurve(source, target, true, undefined, 25, 25)
    const medium = connectionCurve(source, target, true, undefined, 40, 40)
    const large = connectionCurve(source, target, true, undefined, 55, 55)
    expect(small.angle).toBeCloseTo(9)
    expect(medium.angle).toBe(22.5)
    expect(large.angle).toBeCloseTo(28.63636)
    expect(connectionCurve(source, target, true, undefined, 25, 55)).toEqual(
      large,
    )
    expect(connectionCurve(source, target, true, undefined, 55, 25)).toEqual(
      large,
    )
    expect(connectionCurve(source, target, true, undefined, 40, 25)).toEqual(
      medium,
    )
    for (const radius of [25, 40, 55]) {
      expect(
        connectionCurve(source, target, true, 60, radius, radius).angle,
      ).toBe(60)
      expect(
        connectionCurve(source, target, true, 90, radius, radius).angle,
      ).toBe(60)
    }
  })
  it('curves nearby edges more steeply, reverses direction, and flattens distant edges', () => {
    const close = connectionCurve({ x: 0, y: 0 }, { x: 90, y: 0 }, true)
    expect(close.angle).toBe(40.5)
    expect(connectionCurve({ x: 0, y: 0 }, { x: 900, y: 0 }, true).angle).toBe(
      0,
    )
    expect(
      connectionCurve({ x: 0, y: 0 }, { x: 90, y: 0 }, false).path,
    ).not.toBe(close.path)
    expect(
      connectionCurve({ x: 1, y: 1 }, { x: 1, y: 1 }, true).path,
    ).not.toContain('NaN')
  })
  it('parses persistent edit/run routes and safely rejects malformed URLs', () => {
    expect(parseRoute('#/edit/a%20b')).toEqual({ mode: 'edit', id: 'a b' })
    expect(parseRoute('#/run/abc')).toEqual({ mode: 'run', id: 'abc' })
    expect(parseRoute('#/edit/%')).toBeNull()
    expect(parseRoute('#/else/abc')).toBeNull()
  })
  it('embeds only recognized YouTube video URLs', () => {
    for (const url of [
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'https://youtube.com/embed/dQw4w9WgXcQ',
    ])
      expect(youtubeEmbed(url)).toBe(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      )
    for (const url of [
      '',
      'bad',
      'https://evil.com/watch?v=dQw4w9WgXcQ',
      'javascript:alert(1)',
      'https://youtube.com/watch?v=short',
    ])
      expect(youtubeEmbed(url)).toBeNull()
  })
})
