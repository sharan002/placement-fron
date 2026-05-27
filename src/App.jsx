import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import SourceBar from './components/SourceBar'
import FilterBar from './components/FilterBar'
import JobList from './components/JobList'

const CATEGORY_LABELS = {
  python: 'Python',
  java: 'Java Full Stack',
  mern: 'MERN Stack',
}

export default function App() {
  const [category, setCategory] = useState('python')
  const [source, setSource] = useState('indeed')
  const [filters, setFilters] = useState({ fromDays: '7', jobType: '' })
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ fromDays: filters.fromDays, maxItems: 20 })
    if (filters.jobType) params.set('jobType', filters.jobType)

    const apiPath = source === 'linkedin'
      ? `/api/jobs/linkedin/${category}`
      : `/api/jobs/${category}`

    try {
      const res = await fetch(`${apiPath}?${params}`)
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.details || data.error || 'Unknown error')
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err.message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [category, source, filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleCategoryChange = (cat) => { setCategory(cat) }
  const handleSourceChange = (src) => { setSource(src) }
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const sourceLabel = source === 'linkedin' ? 'LinkedIn' : 'Indeed'

  return (
    <>
      <Header />
      <TabBar category={category} onCategoryChange={handleCategoryChange} />
      <SourceBar source={source} onSourceChange={handleSourceChange} />
      <FilterBar filters={filters} onChange={handleFilterChange} onSearch={fetchJobs} />
      <main>
        <div id="result-info">
          {!loading && !error && jobs.length > 0 &&
            `Showing ${jobs.length} ${CATEGORY_LABELS[category]} jobs from ${sourceLabel} · Updated daily at 9 AM`}
        </div>
        <JobList jobs={jobs} loading={loading} error={error} />
      </main>
    </>
  )
}
