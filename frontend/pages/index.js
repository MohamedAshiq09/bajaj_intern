import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setResponse(null)

    try {
      const dataArray = input.split(',').map(item => item.trim()).filter(item => item !== '')
      
      const res = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataArray }),
      })

      if (!res.ok) {
        throw new Error('API request failed')
      }

      const json = await res.json()
      setResponse(json)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const renderTree = (tree, level = 0, isLast = true) => {
    const keys = Object.keys(tree)
    return (
      <>
        {keys.map((key, index) => {
          const isLastChild = index === keys.length - 1
          const hasChildren = tree[key] && Object.keys(tree[key]).length > 0
          
          return (
            <div key={key}>
              <div className={styles.treeNode}>
                {level > 0 && (
                  <span className={styles.treeLine}>
                    {isLastChild ? '└─ ' : '├─ '}
                  </span>
                )}
                <span className={styles.nodeLabel}>{key}</span>
              </div>
              {hasChildren && (
                <div style={{ marginLeft: level > 0 ? '20px' : '0' }}>
                  {renderTree(tree[key], level + 1, isLastChild)}
                </div>
              )}
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>BFHL Hierarchy Analyzer</h1>
        
        <div className={styles.inputSection}>
          <label className={styles.label}>Enter node relationships (comma separated)</label>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="A->B, A->C, B->D"
            rows={5}
          />
          <button 
            className={styles.button} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        )}

        {response && (
          <div className={styles.results}>
            <div className={styles.section}>
              <h2>User Information</h2>
              <div className={styles.infoGrid}>
                <div><strong>User ID:</strong> {response.user_id}</div>
                <div><strong>Email:</strong> {response.email_id}</div>
                <div><strong>Roll Number:</strong> {response.college_roll_number}</div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{response.summary.total_trees}</div>
                  <div className={styles.summaryLabel}>Total Trees</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{response.summary.total_cycles}</div>
                  <div className={styles.summaryLabel}>Total Cycles</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{response.summary.largest_tree_root || 'N/A'}</div>
                  <div className={styles.summaryLabel}>Largest Tree Root</div>
                </div>
              </div>
            </div>

            {response.hierarchies && response.hierarchies.length > 0 && (
              <div className={styles.section}>
                <h2>Hierarchies</h2>
                {response.hierarchies.map((hierarchy, index) => (
                  <div key={index} className={styles.hierarchyCard}>
                    <div className={styles.hierarchyHeader}>
                      <span><strong>Root:</strong> {hierarchy.root}</span>
                      {hierarchy.has_cycle && <span className={styles.cycleBadge}>Cycle Detected</span>}
                      {hierarchy.depth && <span><strong>Depth:</strong> {hierarchy.depth}</span>}
                    </div>
                    {!hierarchy.has_cycle && hierarchy.tree && (
                      <div className={styles.treeView}>
                        {renderTree(hierarchy.tree)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {response.invalid_entries && response.invalid_entries.length > 0 && (
              <div className={styles.section}>
                <h2>Invalid Entries</h2>
                <div className={styles.badgeContainer}>
                  {response.invalid_entries.map((entry, index) => (
                    <span key={index} className={styles.invalidBadge}>{entry}</span>
                  ))}
                </div>
              </div>
            )}

            {response.duplicate_edges && response.duplicate_edges.length > 0 && (
              <div className={styles.section}>
                <h2>Duplicate Edges</h2>
                <div className={styles.badgeContainer}>
                  {response.duplicate_edges.map((edge, index) => (
                    <span key={index} className={styles.duplicateBadge}>{edge}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
