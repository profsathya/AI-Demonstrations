import { useState, useMemo, useRef, useEffect } from 'react'
import { RESOURCES, CATEGORIES, AUDIENCES, NEEDS, DEADLINES } from './data'
import {
  searchResources,
  answerQuestion,
  recommendResources,
  getCategory,
  getResource,
  getAudienceLabel,
  nextOccurrence,
  formatDeadlineDate
} from './search'
import './CampusCompass.css'

/*
 * Campus Compass
 * ---------------------------------------------------------------------------
 * A student-facing directory that answers "where do I go for this?" in plain
 * language. Built from the capstone proposal by Arlene Resendiz Lopez: one
 * organized place for campus resources, a search that understands how students
 * actually describe a problem, recommendations based on their situation, and
 * the deadlines that quietly cost students money when missed.
 *
 * Scope follows the proposal's initial vision — find resources first. Accounts,
 * notifications, and club listings are deliberately out of scope; saves are
 * kept in localStorage so the prototype needs no backend.
 */

const TABS = [
  { id: 'ask', label: 'Ask', icon: '🧭' },
  { id: 'browse', label: 'Browse', icon: '🗂️' },
  { id: 'foryou', label: 'For You', icon: '✨' },
  { id: 'deadlines', label: 'Deadlines', icon: '📅' },
  { id: 'saved', label: 'Saved', icon: '🔖' },
  { id: 'about', label: 'About', icon: 'ℹ️' }
]

const STARTER_QUESTIONS = [
  'I can\'t afford my tuition this semester',
  'Where do I get help with my resume?',
  'I have nowhere to sleep tonight',
  'What scholarships can I apply for?',
  'I\'m failing my math class',
  'I need food this week',
  'How do I transfer to a UC?',
  'I don\'t have a laptop for class'
]

function storageKey(key) {
  return `campus-compass-${key}`
}

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(storageKey(key))
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value))
  } catch {
    /* storage unavailable — the prototype still works, saves just don't persist */
  }
}

export default function CampusCompass() {
  const [tab, setTab] = useState('ask')
  const [detailId, setDetailId] = useState(null)
  const [saved, setSaved] = useState(() => loadData('saved', []))

  useEffect(() => saveData('saved', saved), [saved])

  const toggleSaved = (id) => {
    setSaved(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]))
  }

  const openResource = (id) => {
    setDetailId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goTab = (next) => {
    setDetailId(null)
    setTab(next)
  }

  const shared = { openResource, toggleSaved, saved, goTab }

  return (
    <div className="campus-compass">
      <header className="cc-header">
        <div className="cc-brand">
          <span className="cc-logo" aria-hidden="true">🧭</span>
          <div>
            <h1>Campus Compass</h1>
            <p className="cc-tagline">Every campus resource, in one place.</p>
          </div>
        </div>
        <nav className="cc-tabs" aria-label="Campus Compass sections">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`cc-tab ${tab === t.id && !detailId ? 'active' : ''}`}
              onClick={() => goTab(t.id)}
              aria-current={tab === t.id && !detailId ? 'page' : undefined}
            >
              <span aria-hidden="true">{t.icon}</span>
              <span className="cc-tab-label">{t.label}</span>
              {t.id === 'saved' && saved.length > 0 && (
                <span className="cc-badge">{saved.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {detailId ? (
        <ResourceDetail
          resource={getResource(detailId)}
          onBack={() => setDetailId(null)}
          {...shared}
        />
      ) : (
        <>
          {tab === 'ask' && <AskTab {...shared} />}
          {tab === 'browse' && <BrowseTab {...shared} />}
          {tab === 'foryou' && <ForYouTab {...shared} />}
          {tab === 'deadlines' && <DeadlinesTab {...shared} />}
          {tab === 'saved' && <SavedTab {...shared} />}
          {tab === 'about' && <AboutTab />}
        </>
      )}

      <p className="cc-disclaimer">
        Prototype with sample data for a fictional campus. Contact details are not real.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ Ask tab */

function AskTab({ openResource, toggleSaved, saved }) {
  const [input, setInput] = useState('')
  const [thread, setThread] = useState([])
  const endRef = useRef(null)

  useEffect(() => {
    if (thread.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [thread])

  const ask = (question) => {
    const q = question.trim()
    if (!q) return
    const answer = answerQuestion(q)
    setThread(prev => [...prev, { question: q, answer }])
    setInput('')
  }

  return (
    <section className="cc-panel">
      {thread.length === 0 && (
        <div className="cc-intro">
          <h2>Describe what you need</h2>
          <p>
            You don&apos;t have to know the name of the office. Ask the way you would ask a
            friend, and Compass points you at the right place and the first step to take.
          </p>
          <div className="cc-starters">
            {STARTER_QUESTIONS.map(q => (
              <button key={q} className="cc-chip" onClick={() => ask(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      <div className="cc-thread">
        {thread.map((entry, i) => (
          <div key={i} className="cc-exchange">
            <p className="cc-question">{entry.question}</p>

            <div className={`cc-answer ${entry.answer.urgent ? 'urgent' : ''}`}>
              {entry.answer.urgent && (
                <p className="cc-urgent-note">
                  <strong>This looks urgent.</strong> These offices help same-day, and you do not
                  need paperwork to start. If you are in immediate danger, call 988 or Campus
                  Safety at (831) 555-0911.
                </p>
              )}
              <p className="cc-lead">{entry.answer.lead}</p>

              <div className="cc-results">
                {entry.answer.results.map(({ resource, matched }) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    matched={matched}
                    onOpen={openResource}
                    onSave={toggleSaved}
                    isSaved={saved.includes(resource.id)}
                  />
                ))}
              </div>

              <p className="cc-source">
                Answered from {entry.answer.results.length} official campus{' '}
                {entry.answer.results.length === 1 ? 'listing' : 'listings'} · always shown with
                the source
              </p>

              {entry.answer.followUps.length > 0 && (
                <div className="cc-followups">
                  <span>Also ask:</span>
                  {entry.answer.followUps.map(f => (
                    <button key={f} className="cc-chip small" onClick={() => ask(f)}>{f}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="cc-askbar"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need help with?"
          aria-label="Ask Campus Compass a question"
        />
        <button type="submit" disabled={!input.trim()}>Ask</button>
      </form>
    </section>
  )
}

/* --------------------------------------------------------------- Browse tab */

function BrowseTab({ openResource, toggleSaved, saved }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)

  const results = useMemo(() => {
    if (query.trim().length > 1) {
      // Browsing tolerates a longer tail than an answer does.
      return searchResources(query, { limit: 20, minScore: 1, relativeFloor: 0.08 }).map(r => r.resource)
    }
    if (category) return RESOURCES.filter(r => r.category === category)
    return []
  }, [query, category])

  const activeCategory = category ? getCategory(category) : null

  return (
    <section className="cc-panel">
      <div className="cc-searchbar">
        <span aria-hidden="true">🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all resources"
          aria-label="Search all resources"
        />
        {query && <button className="cc-clear" onClick={() => setQuery('')}>Clear</button>}
      </div>

      {!query && !category && (
        <>
          <h2 className="cc-section-title">Browse by category</h2>
          <div className="cc-category-grid">
            {CATEGORIES.map(c => {
              const count = RESOURCES.filter(r => r.category === c.id).length
              return (
                <button
                  key={c.id}
                  className="cc-category-card"
                  style={{ '--accent': c.color }}
                  onClick={() => setCategory(c.id)}
                >
                  <span className="cc-category-icon" aria-hidden="true">{c.icon}</span>
                  <strong>{c.name}</strong>
                  <span className="cc-category-blurb">{c.blurb}</span>
                  <span className="cc-count">{count} {count === 1 ? 'resource' : 'resources'}</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {(query || category) && (
        <>
          <div className="cc-results-header">
            <h2 className="cc-section-title">
              {query
                ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} for “${query}”`
                : `${activeCategory.icon} ${activeCategory.name}`}
            </h2>
            {category && !query && (
              <button className="cc-textbtn" onClick={() => setCategory(null)}>All categories</button>
            )}
          </div>

          {results.length === 0 ? (
            <p className="cc-empty">
              Nothing matched that. Try describing the problem instead of the office name —
              the Ask tab is built for that.
            </p>
          ) : (
            <div className="cc-results">
              {results.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onOpen={openResource}
                  onSave={toggleSaved}
                  isSaved={saved.includes(resource.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

/* -------------------------------------------------------------- For You tab */

function ForYouTab({ openResource, toggleSaved, saved }) {
  const [profile, setProfile] = useState(() => loadData('profile', { audiences: [], needs: [] }))

  useEffect(() => saveData('profile', profile), [profile])

  const toggle = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const recommendations = useMemo(() => recommendResources(profile), [profile])
  const hasProfile = profile.audiences.length > 0 || profile.needs.length > 0

  return (
    <section className="cc-panel">
      <div className="cc-intro tight">
        <h2>Tell Compass about you</h2>
        <p>
          Nothing is sent anywhere — selections stay in this browser. They are only used to
          rank the directory for your situation.
        </p>
      </div>

      <fieldset className="cc-fieldset">
        <legend>Which describes you?</legend>
        <div className="cc-chip-row">
          {AUDIENCES.map(a => (
            <button
              key={a.id}
              className={`cc-chip toggle ${profile.audiences.includes(a.id) ? 'on' : ''}`}
              onClick={() => toggle('audiences', a.id)}
              aria-pressed={profile.audiences.includes(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="cc-fieldset">
        <legend>What do you need right now?</legend>
        <div className="cc-chip-row">
          {NEEDS.map(n => (
            <button
              key={n.id}
              className={`cc-chip toggle ${profile.needs.includes(n.id) ? 'on' : ''}`}
              onClick={() => toggle('needs', n.id)}
              aria-pressed={profile.needs.includes(n.id)}
            >
              <span aria-hidden="true">{n.icon}</span> {n.label}
            </button>
          ))}
        </div>
      </fieldset>

      {hasProfile && (
        <div className="cc-results-header">
          <h2 className="cc-section-title">
            {recommendations.length} recommended for you
          </h2>
          <button
            className="cc-textbtn"
            onClick={() => setProfile({ audiences: [], needs: [] })}
          >
            Reset
          </button>
        </div>
      )}

      {hasProfile && recommendations.length === 0 && (
        <p className="cc-empty">Pick at least one need to see recommendations.</p>
      )}

      <div className="cc-results">
        {recommendations.map(({ resource, reasons }) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            reasons={reasons}
            onOpen={openResource}
            onSave={toggleSaved}
            isSaved={saved.includes(resource.id)}
          />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Deadlines tab */

function DeadlinesTab({ openResource }) {
  const upcoming = useMemo(() => {
    return DEADLINES
      .map(d => ({ ...d, ...nextOccurrence(d) }))
      .sort((a, b) => a.daysAway - b.daysAway)
  }, [])

  return (
    <section className="cc-panel">
      <div className="cc-intro tight">
        <h2>Dates that cost money when missed</h2>
        <p>
          Ordered by how soon they are. Each one links to the office that handles it, so the
          next step is one tap away.
        </p>
      </div>

      <ol className="cc-deadlines">
        {upcoming.map(d => {
          const category = getCategory(d.category)
          const soon = d.daysAway <= 30
          return (
            <li key={d.id} className={`cc-deadline ${soon ? 'soon' : ''}`}>
              <div className="cc-countdown" style={{ '--accent': category.color }}>
                <strong>{d.daysAway}</strong>
                <span>{d.daysAway === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="cc-deadline-body">
                <h3>{d.title}</h3>
                <p className="cc-deadline-date">
                  {formatDeadlineDate(d.date)} · {category.icon} {category.name}
                </p>
                <p className="cc-deadline-note">{d.note}</p>
                <button className="cc-textbtn" onClick={() => openResource(d.resourceId)}>
                  {getResource(d.resourceId).name} →
                </button>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ---------------------------------------------------------------- Saved tab */

function SavedTab({ openResource, toggleSaved, saved, goTab }) {
  const resources = saved.map(getResource).filter(Boolean)

  if (resources.length === 0) {
    return (
      <section className="cc-panel">
        <div className="cc-empty-state">
          <span aria-hidden="true">🔖</span>
          <h2>Nothing saved yet</h2>
          <p>Tap the bookmark on any resource to keep it here for later.</p>
          <button className="cc-primary" onClick={() => goTab('browse')}>Browse resources</button>
        </div>
      </section>
    )
  }

  return (
    <section className="cc-panel">
      <h2 className="cc-section-title">{resources.length} saved</h2>
      <div className="cc-results">
        {resources.map(resource => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onOpen={openResource}
            onSave={toggleSaved}
            isSaved
          />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Resource UI */

function ResourceCard({ resource, matched = [], reasons = [], onOpen, onSave, isSaved }) {
  const category = getCategory(resource.category)
  // The category is already on its own pill — don't say it twice.
  const shownReasons = reasons.filter(r => r !== category.name)
  return (
    <article className="cc-card" style={{ '--accent': category.color }}>
      <button className="cc-card-main" onClick={() => onOpen(resource.id)}>
        <span className="cc-card-icon" aria-hidden="true">{resource.icon}</span>
        <span className="cc-card-text">
          <strong>{resource.name}</strong>
          <span className="cc-card-blurb">{resource.blurb}</span>
          <span className="cc-card-meta">
            <span className="cc-pill">{category.name}</span>
            {resource.urgent && <span className="cc-pill urgent">Same-day help</span>}
            {shownReasons.map(r => <span key={r} className="cc-pill soft">{r}</span>)}
            {matched.slice(0, 3).map(m => (
              <span key={m} className="cc-pill soft">matched “{m}”</span>
            ))}
          </span>
        </span>
      </button>
      <button
        className={`cc-save ${isSaved ? 'on' : ''}`}
        onClick={() => onSave(resource.id)}
        aria-label={isSaved ? `Remove ${resource.name} from saved` : `Save ${resource.name}`}
        aria-pressed={isSaved}
      >
        {isSaved ? '🔖' : '🏷️'}
      </button>
    </article>
  )
}

function ResourceDetail({ resource, onBack, onSave, saved, openResource }) {
  const category = getCategory(resource.category)
  const isSaved = saved.includes(resource.id)

  const related = useMemo(
    () => RESOURCES.filter(r => r.category === resource.category && r.id !== resource.id).slice(0, 3),
    [resource.id, resource.category]
  )

  const deadlines = useMemo(
    () =>
      DEADLINES.filter(d => d.resourceId === resource.id)
        .map(d => ({ ...d, ...nextOccurrence(d) }))
        .sort((a, b) => a.daysAway - b.daysAway),
    [resource.id]
  )

  return (
    <section className="cc-panel cc-detail" style={{ '--accent': category.color }}>
      <div className="cc-detail-top">
        <button className="cc-textbtn" onClick={onBack}>← Back</button>
        <button
          className={`cc-save ${isSaved ? 'on' : ''}`}
          onClick={() => onSave(resource.id)}
          aria-pressed={isSaved}
        >
          {isSaved ? '🔖 Saved' : '🏷️ Save'}
        </button>
      </div>

      <header className="cc-detail-header">
        <span className="cc-detail-icon" aria-hidden="true">{resource.icon}</span>
        <div>
          <span className="cc-pill">{category.icon} {category.name}</span>
          <h2>{resource.name}</h2>
          <p className="cc-detail-blurb">{resource.blurb}</p>
        </div>
      </header>

      <div className="cc-firststep">
        <strong>Start here</strong>
        <p>{resource.firstStep}</p>
      </div>

      <p className="cc-detail-description">{resource.description}</p>

      <dl className="cc-facts">
        <div><dt>Where</dt><dd>{resource.location}</dd></div>
        <div><dt>When</dt><dd>{resource.hours}</dd></div>
        <div><dt>Cost</dt><dd>{resource.cost}</dd></div>
        <div><dt>How to access</dt><dd>{resource.access}</dd></div>
        <div><dt>Phone</dt><dd>{resource.phone}</dd></div>
        <div><dt>Email</dt><dd>{resource.email}</dd></div>
        <div><dt>Website</dt><dd>{resource.website}</dd></div>
      </dl>

      <h3 className="cc-detail-subhead">Who it&apos;s for</h3>
      <div className="cc-chip-row">
        {resource.audiences.map(a => (
          <span key={a} className="cc-pill soft">{getAudienceLabel(a)}</span>
        ))}
      </div>

      {deadlines.length > 0 && (
        <>
          <h3 className="cc-detail-subhead">Deadlines handled here</h3>
          <ul className="cc-detail-deadlines">
            {deadlines.map(d => (
              <li key={d.id}>
                <strong>{d.title}</strong>
                <span>{formatDeadlineDate(d.date)} · in {d.daysAway} days</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {related.length > 0 && (
        <>
          <h3 className="cc-detail-subhead">Also under {category.name}</h3>
          <div className="cc-related">
            {related.map(r => (
              <button key={r.id} className="cc-related-btn" onClick={() => openResource(r.id)}>
                <span aria-hidden="true">{r.icon}</span> {r.name}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

/* ---------------------------------------------------------------- About tab */

function AboutTab() {
  return (
    <section className="cc-panel cc-about">
      <h2>About this prototype</h2>
      <p>
        Campus Compass comes from a Computer Science capstone proposal by Arlene Resendiz Lopez.
        The premise: colleges already run dozens of useful programs, but students cannot find
        them, because the information is scattered across emails, portals, flyers, and word of
        mouth. This build is the proposal&apos;s initial scope — help students find resources —
        implemented end to end.
      </p>

      <h3>What the student research found</h3>
      <p>A survey of 22 students in June 2026:</p>
      <ul className="cc-stats">
        <li><strong>90.9%</strong> learned about a campus resource from someone else and had no idea it existed</li>
        <li><strong>81.8%</strong> said a student-friendly resource platform would help</li>
        <li><strong>68.2%</strong> hear about resources through friends and classmates; <strong>63.6%</strong> through social media</li>
        <li>Hardest to find: Career Services <strong>50%</strong>, Scholarships <strong>45.5%</strong>, Financial Aid and Housing <strong>40.9%</strong></li>
      </ul>
      <p>
        Those four categories are the ones this prototype leads with, and the reason search is
        built around plain-language description rather than office names — a student who does
        not know a resource exists cannot search for it by name.
      </p>

      <h3>What is built here</h3>
      <ul>
        <li><strong>Ask:</strong> describe a problem in your own words and get the right office, the first step to take, and the listings the answer came from</li>
        <li><strong>Browse:</strong> the full directory organized into 10 categories</li>
        <li><strong>Resource pages:</strong> hours, location, cost, who it is for, how to access it, and what to do first</li>
        <li><strong>For You:</strong> recommendations ranked by your situation and current needs</li>
        <li><strong>Deadlines:</strong> the dates that cost students money, counted down and linked to the responsible office</li>
        <li><strong>Saved:</strong> a personal shortlist kept in your browser</li>
      </ul>

      <h3>How the search works</h3>
      <p>
        The query is normalized, stripped of filler words, and expanded through a synonym map
        of the phrasing students actually use — &ldquo;nowhere to sleep&rdquo; reaches emergency
        housing, &ldquo;broke&rdquo; reaches the emergency fund and the food pantry. Every
        resource is then scored field by field, with a student&apos;s literal words weighted
        above expansions so a synonym can break a tie but never outrank a real match. Crisis
        phrasing promotes the same-day offices to the top and adds a safety note.
      </p>
      <p>
        It runs fully in the browser: no API key, no server, no cost per query, and answers stay
        traceable to the listings shown underneath them.
      </p>

      <h3>Where the AI feature fits</h3>
      <p>
        The proposal lists an AI chat feature as a stretch goal. The right shape is
        retrieval-augmented generation over this same directory: the matcher here selects the
        candidate resources, and a model writes the reply strictly from those records, citing
        each one. Keeping retrieval separate from generation is what stops the assistant from
        inventing an office or an application deadline — a failure mode that would be worse for
        a student than no answer at all. The retrieval half is done; the generation half is a
        drop-in swap of the answer composer in <code>search.js</code>.
      </p>

      <h3>Deliberately out of scope</h3>
      <p>
        Per the proposal&apos;s initial scope: student accounts, push notifications, club
        listings, and personalization beyond the local profile. Saves live in localStorage so
        there is no backend and no student data to protect.
      </p>

      <h3>To take this to a real campus</h3>
      <ul>
        <li>Replace the sample dataset with a feed from the campus directory, with an owner per record so hours and contacts stay current</li>
        <li>Add an editor view so each office maintains its own listing</li>
        <li>Log searches that return nothing — those are the gaps in either the directory or the synonym map</li>
        <li>Spanish-language content, screen-reader testing, and offline caching</li>
        <li>Usability testing with the survey group, measuring whether students find a resource they did not know existed</li>
      </ul>
    </section>
  )
}
