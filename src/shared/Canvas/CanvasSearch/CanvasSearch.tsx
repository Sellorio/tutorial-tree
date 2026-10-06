import type { FlowNode } from '../types/FlowNode'
import type { TalentFlowNode } from '../types/TalentFlowNode'
import { filterSearchNodes } from './filterSearchNodes'
import { memo } from 'react'
import { useEffect, useState } from 'react'
import styles from './CanvasSearch.module.css'

export const CanvasSearch = memo(function CanvasSearch({
  nodes,
  onSelectNode,
}: {
  nodes: FlowNode[]
  onSelectNode: (node: TalentFlowNode) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        (!event.ctrlKey && !event.metaKey) ||
        event.key.toLowerCase() !== 'f'
      )
        return
      event.preventDefault()
      setQuery('')
      setOpen(true)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!open) return null

  const results = filterSearchNodes(nodes, query)

  return (
    <div
      className={styles.search}
      role="dialog"
      aria-label="Search visible nodes"
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        setQuery('')
      }}
    >
      <div className={styles.header}>
        <input
          autoFocus
          type="search"
          role="searchbox"
          aria-label="Search visible nodes"
          placeholder="Search nodes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          aria-label="Close search"
          onClick={() => {
            setOpen(false)
            setQuery('')
          }}
        >
          Close
        </button>
      </div>
      {query.trim() ? (
        <div className={styles.results} role="group" aria-label="Results">
          {results.length ? (
            results.map((node) => (
              <button
                className={styles.result}
                type="button"
                key={node.id}
                onClick={() => {
                  onSelectNode(node)
                  setOpen(false)
                  setQuery('')
                }}
              >
                <span>{node.data.talent.title}</span>
                {node.data.talent.description && (
                  <small>{node.data.talent.description}</small>
                )}
              </button>
            ))
          ) : (
            <p className={styles.empty}>No visible nodes found</p>
          )}
        </div>
      ) : null}
    </div>
  )
})
