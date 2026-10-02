import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceApp as App } from './WorkspaceApp'
import type { Canvas } from '../Canvas/Canvas'
import { STORAGE_KEY } from '../model/constants/STORAGE_KEY'
import { createInstance } from '../model/createInstance'
import { exportData } from '../model/exportData'
import { starterLibrary } from '../storage/starterLibrary'
import { saved } from './testing/saved'

vi.mock('../Canvas/Canvas', () => ({
  Canvas: (props: ComponentProps<typeof Canvas>) => (
    <ReactFlowProvider>
      <div>
        {props.diagram.nodes.map((node) => (
          <button
            key={node.id}
            data-testid={`mock-${node.id}`}
            onClick={() => props.onSelect({ kind: 'node', id: node.id })}
          >
            {node.title}
          </button>
        ))}
        <button onClick={() => props.onSelect(null)}>Clear selection</button>
        <button onClick={() => props.onAdd({ x: 100, y: 100 })}>
          Canvas add
        </button>
        <button onClick={() => props.onConnect('start', 'series')}>
          Canvas connect
        </button>
        <button onClick={() => props.onConnect('start', 'seeing')}>
          Canvas duplicate
        </button>
        <button
          onClick={() =>
            props.onMove([{ id: 'seeing', position: { x: 300, y: 300 } }])
          }
        >
          Canvas move
        </button>
        {props.children}
      </div>
    </ReactFlowProvider>
  ),
}))

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
  localStorage.clear()
  history.replaceState(null, '', '/#/')
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

function openEditor(library = starterLibrary()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  history.replaceState(null, '', `/#/edit/${library.diagrams[0].id}`)
  return render(<App />)
}

describe('workspace orchestration', () => {
  it('undoes and redoes edits with buttons and shortcuts inside settings', () => {
    openEditor()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Canvas add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(screen.queryByText('Untitled skill')).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].nodes).toHaveLength(9)
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true })
    fireEvent.keyDown(window, { key: 'Z', ctrlKey: true, shiftKey: true })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].nodes).toHaveLength(9)
    const name = screen.getByLabelText('Diagram name')
    fireEvent.change(name, { target: { value: 'Typed title' } })
    fireEvent.keyDown(name, { key: 'z', ctrlKey: true })
    expect(name).toHaveValue('Creative foundations')
    fireEvent.click(screen.getByRole('button', { name: 'Redo' }))
    expect(name).toHaveValue('Typed title')
  })
  it('adds nodes to an existing category after the original default is removed', () => {
    const library = starterLibrary()
    const diagram = library.diagrams[0]
    diagram.categories = diagram.categories.filter(
      (category) => category.id !== 'category-green',
    )
    diagram.nodes.forEach((node) => {
      if (node.categoryId === 'category-green')
        node.categoryId = 'category-teal'
    })
    openEditor(library)

    fireEvent.click(screen.getByRole('button', { name: 'Canvas add' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].nodes.at(-1)?.categoryId).toBe('category-teal')
  })
  it('saves diagram defaults and connection overrides with a manual curve', () => {
    openEditor()
    expect(screen.getByRole('checkbox', { name: 'Unlocked' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'In Progress' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Completed' })).toBeChecked()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Unlocked' }))
    fireEvent.click(screen.getByRole('button', { name: 'Canvas connect' }))
    expect(screen.getByRole('checkbox', { name: 'Completed' })).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: 'Manual curve' }))
    fireEvent.change(screen.getByRole('slider', { name: /Curve angle/ }), {
      target: { value: '60' },
    })
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Use diagram defaults' }),
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'In Progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].activeStatuses).toEqual([
      'in-progress',
      'completed',
      'unlocked',
    ])
    expect(saved().diagrams[0].connections.at(-1)).toMatchObject({
      curveAngle: 60,
      activeStatuses: ['completed', 'unlocked'],
    })
    fireEvent.click(screen.getByRole('radio', { name: 'Automatic curve' }))
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Use diagram defaults' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].connections.at(-1)!.curveAngle).toBeUndefined()
    expect(
      saved().diagrams[0].connections.at(-1)!.activeStatuses,
    ).toBeUndefined()
  })
  it('opens journeys first and places tab-specific import beside New in the title bar', () => {
    render(<App />)
    expect(screen.getAllByRole('tab')[0]).toHaveTextContent('My journeys')
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    )
    const importButton = screen.getByRole('button', { name: 'Import journey' })
    expect(importButton.closest('header')).toBeInTheDocument()
    expect(importButton.nextElementSibling).toHaveTextContent('New journey')
    fireEvent.click(screen.getByRole('tab', { name: /Skill trees/ }))
    expect(
      screen.getByRole('button', { name: 'Import tree' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('STARTER TREE')).not.toBeInTheDocument()
    const deletion = screen.getByRole('button', {
      name: 'Delete Creative foundations',
    })
    expect(deletion.parentElement).toContainElement(
      screen.getByRole('button', { name: 'Export Creative foundations' }),
    )
  })
  it('rejects a tree imported through the journeys tab without changing the library', async () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Import JSON file'), {
      target: {
        files: [
          {
            size: 100,
            text: async () => exportData(starterLibrary().diagrams[0]),
          },
        ],
      },
    })
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Choose an instance export',
      ),
    )
    expect(window.confirm).not.toHaveBeenCalled()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
  it('creates a named diagram and restores its editor route', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: /Skill trees/ }))
    fireEvent.click(screen.getByRole('button', { name: 'New tree' }))
    fireEvent.change(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'My new tree' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create tree' }))
    await waitFor(() =>
      expect(screen.getByLabelText('Diagram name')).toHaveValue('My new tree'),
    )
    expect(saved().diagrams).toHaveLength(2)
    expect(location.hash).toContain('/edit/')
  })
  it('saves canvas creation, movement, connections, metadata and name changes', () => {
    openEditor()
    fireEvent.click(screen.getByRole('button', { name: 'Canvas add' }))
    fireEvent.change(screen.getByLabelText('Node text'), {
      target: { value: 'New practice' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Canvas move' }))
    fireEvent.click(screen.getByRole('button', { name: 'Canvas connect' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Counterclockwise curve' }),
    )
    fireEvent.change(screen.getByLabelText('Diagram name'), {
      target: { value: 'Edited tree' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    const diagram = saved().diagrams[0]
    expect(diagram.name).toBe('Edited tree')
    expect(diagram.nodes).toHaveLength(9)
    expect(
      diagram.nodes.find((node) => node.id === 'seeing')!.position,
    ).toEqual({ x: 300, y: 300 })
    expect(diagram.connections.at(-1)!.clockwise).toBe(true)
  })
  it('surfaces invalid connections and invalid fields without replacing saved data', () => {
    openEditor()
    fireEvent.click(screen.getByRole('button', { name: 'Canvas duplicate' }))
    expect(screen.getByRole('alert')).toHaveTextContent('already connected')
    fireEvent.click(screen.getByTestId('mock-seeing'))
    fireEvent.change(screen.getByLabelText('YouTube tutorial'), {
      target: { value: 'bad' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('alert')).toHaveTextContent('invalid fields')
    expect(saved().diagrams[0].nodes[1].youtube).toBe('')
  })
  it('leaves the edited draft open on quota failure', () => {
    openEditor()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded')
    })
    fireEvent.change(screen.getByLabelText('Diagram name'), {
      target: { value: 'Unsaved draft' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save')
    expect(screen.getByLabelText('Diagram name')).toHaveValue('Unsaved draft')
    expect(saved().diagrams[0].name).toBe('Creative foundations')
  })
  it('confirms node and connection deletion and protects cancellation', () => {
    openEditor()
    fireEvent.click(screen.getByTestId('mock-color'))
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole('button', { name: 'Delete node' }))
    expect(screen.getByTestId('mock-color')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete node' }))
    expect(screen.queryByTestId('mock-color')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Canvas connect' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete connection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(saved().diagrams[0].connections).toHaveLength(6)
  })
  it('only creates journeys from the menu after saving and returning', async () => {
    openEditor()
    expect(
      screen.queryByRole('button', { name: 'Start journey' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByLabelText('Diagram name').closest('header'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Export' }),
    ).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Diagram name'), {
      target: { value: 'Ready tree' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save & return' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'New journey' }),
      ).toBeInTheDocument(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'New journey' }))
    fireEvent.change(screen.getByLabelText('Name', { exact: true }), {
      target: { value: 'My progress' },
    })
    fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'My progress' }),
      ).toBeInTheDocument(),
    )
    expect(saved().diagrams[0].name).toBe('Ready tree')
    expect(saved().instances[0].statuses.seeing).toBe('unlocked')
  })
  it('warns before revoking completion, saves progress immediately and closes the overlay', () => {
    const library = starterLibrary()
    const instance = createInstance(library.diagrams[0], 'Existing journey')
    Object.assign(instance.statuses, {
      seeing: 'completed',
      color: 'in-progress',
    })
    library.instances.push(instance)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
    history.replaceState(null, '', `/#/run/${instance.id}`)
    render(<App />)
    fireEvent.click(screen.getByTestId('mock-seeing'))
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    fireEvent.click(screen.getByRole('button', { name: 'Unlocked' }))
    expect(saved().instances[0].statuses.seeing).toBe('completed')
    fireEvent.click(screen.getByRole('button', { name: 'Unlocked' }))
    expect(saved().instances[0].statuses.color).toBe('locked')
    expect(screen.queryByLabelText('Node details')).not.toBeInTheDocument()
  })
  it('persists the Show All Skills preference on the active journey', () => {
    const library = starterLibrary()
    const instance = createInstance(library.diagrams[0], 'Existing journey')
    library.instances.push(instance)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
    history.replaceState(null, '', `/#/run/${instance.id}`)
    render(<App />)

    const showAllSkills = screen.getByRole('checkbox', {
      name: 'Show All Skills',
    })
    expect(showAllSkills).toBeChecked()
    fireEvent.click(showAllSkills)
    expect(saved().instances[0].showAllSkills).toBe(false)
  })
  it('imports portable data and handles bad/oversized files', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: /Skill trees/ }))
    const diagram = starterLibrary().diagrams[0]
    diagram.name = 'Imported title'
    const input = screen.getByLabelText('Import JSON file')
    fireEvent.change(input, {
      target: { files: [{ size: 100, text: async () => exportData(diagram) }] },
    })
    await waitFor(() =>
      expect(screen.getByLabelText('Diagram name')).toHaveValue(
        'Imported title',
      ),
    )
    fireEvent.change(input, {
      target: { files: [{ size: 100, text: async () => 'not json' }] },
    })
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('not valid JSON'),
    )
    fireEvent.change(input, { target: { files: [{ size: 10000001 }] } })
    expect(screen.getByRole('alert')).toHaveTextContent('10 MB')
  })
  it('searches the library and confirms cascading deletion', () => {
    const library = starterLibrary()
    library.instances.push(
      createInstance(library.diagrams[0], 'Practice journey'),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: /Skill trees/ }))
    fireEvent.change(screen.getByLabelText('Search workspace'), {
      target: { value: 'missing' },
    })
    expect(
      screen.queryByRole('heading', { name: 'Creative foundations' }),
    ).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Search workspace'), {
      target: { value: '' },
    })
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Creative foundations' }),
    )
    expect(saved().diagrams).toHaveLength(1)
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Creative foundations' }),
    )
    expect(saved().diagrams).toHaveLength(0)
    expect(saved().instances).toHaveLength(0)
  })
  it('persists theme choice and renders missing routes gracefully', () => {
    history.replaceState(null, '', '/#/edit/missing')
    render(<App />)
    expect(screen.getByText("That tree isn't here.")).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Theme'), {
      target: { value: 'dark' },
    })
    expect(localStorage.getItem('branch.theme')).toBe('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })
})
