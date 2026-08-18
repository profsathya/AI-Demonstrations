/**
 * Campus Compass — matching engine.
 *
 * Students in the survey said they could not find resources because they did
 * not know the official name of the office they needed. So search here works on
 * plain language ("I have nowhere to sleep", "how do I pay for books") rather
 * than on office names: the query is normalized, expanded through a synonym map
 * of the words students actually use, and scored against every field of every
 * resource.
 *
 * This runs entirely in the browser with no model call, which keeps the demo
 * free, instant, and offline-capable. The About tab describes how a production
 * build would layer a retrieval-augmented LLM on top of the same index.
 */

import { RESOURCES, CATEGORIES, AUDIENCES, NEEDS } from './data'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'i', 'im', 'i\'m', 'me', 'my', 'we', 'you', 'is', 'are', 'am', 'do', 'does',
  'did', 'to', 'of', 'for', 'on', 'in', 'at', 'it', 'and', 'or', 'but', 'be', 'been', 'can',
  'cant', 'can\'t', 'how', 'what', 'where', 'when', 'who', 'why', 'need', 'needs', 'want',
  'get', 'getting', 'got', 'have', 'has', 'help', 'with', 'any', 'some', 'there', 'this',
  'that', 'about', 'if', 'so', 'up', 'out', 'from', 'as', 'not', 'no', 'find', 'looking',
  'look', 'campus', 'school', 'college', 'student', 'students', 'please', 'would', 'should'
])

/**
 * Everyday phrasing mapped onto the vocabulary the directory actually uses.
 * Keys are matched against the whole query first (so multi-word phrases win),
 * then against individual tokens.
 */
const SYNONYMS = {
  'nowhere to sleep': ['homeless', 'emergency housing', 'shelter'],
  'sleeping in my car': ['homeless', 'emergency housing', 'shelter'],
  'kicked out': ['homeless', 'emergency housing', 'shelter'],
  'about to be evicted': ['eviction', 'emergency housing', 'rent'],
  'cant afford': ['financial aid', 'emergency', 'grant'],
  'cant pay': ['financial aid', 'payment plan', 'emergency'],
  'out of money': ['emergency', 'financial aid', 'food'],
  'no money': ['emergency', 'financial aid', 'food'],
  'pay for school': ['financial aid', 'fafsa', 'scholarship', 'tuition'],
  'pay for books': ['textbook', 'reserves', 'grant', 'financial aid'],
  'free money': ['scholarship', 'grant', 'financial aid'],
  'dont know where to start': ['case manager', 'basic needs', 'advisor'],
  'first day': ['advisor', 'education plan', 'student life'],
  'talk to someone': ['counseling', 'mental health'],
  'kill myself': ['crisis', 'counseling', 'mental health'],
  'want to die': ['crisis', 'counseling', 'mental health'],
  'failing my class': ['tutoring', 'advisor', 'probation'],
  'behind in class': ['tutoring', 'advisor'],
  'dropping out': ['advisor', 'case manager', 'counseling'],
  'meet people': ['clubs', 'student life', 'intramural'],
  'no internet': ['hotspot', 'laptop', 'device'],
  'no computer': ['laptop', 'device', 'hotspot'],
  'four year': ['transfer', 'uc', 'csu'],
  'grad school': ['graduate school', 'masters', 'phd'],

  // single words
  broke: ['emergency', 'financial aid', 'food'],
  money: ['financial aid', 'grant', 'scholarship', 'tuition'],
  cash: ['financial aid', 'emergency', 'grant'],
  afford: ['financial aid', 'emergency', 'grant'],
  expensive: ['financial aid', 'scholarship', 'payment plan'],
  bill: ['payment plan', 'tuition', 'cashier'],
  tuition: ['financial aid', 'payment plan', 'fee waiver'],
  loans: ['loan', 'financial aid'],
  hungry: ['food', 'pantry', 'calfresh'],
  starving: ['food', 'pantry', 'calfresh'],
  eat: ['food', 'pantry', 'meal'],
  groceries: ['food', 'pantry', 'calfresh'],
  homeless: ['emergency housing', 'shelter', 'housing crisis'],
  unhoused: ['emergency housing', 'shelter'],
  evicted: ['eviction', 'emergency housing', 'legal'],
  eviction: ['emergency housing', 'legal', 'rent'],
  rent: ['housing', 'lease', 'emergency'],
  apartment: ['off campus', 'lease', 'rental'],
  dorm: ['housing', 'residence hall'],
  roommate: ['housing', 'off campus'],
  job: ['career', 'employment', 'job board'],
  jobs: ['career', 'employment', 'job board'],
  hire: ['career', 'job board', 'resume'],
  hiring: ['career', 'job board', 'resume'],
  work: ['employment', 'job', 'work study'],
  career: ['resume', 'interview', 'job'],
  resume: ['career', 'cover letter'],
  interview: ['career', 'mock interview'],
  internship: ['internship', 'experience', 'career'],
  tutor: ['tutoring', 'learning center'],
  tutoring: ['tutoring', 'learning center'],
  struggling: ['tutoring', 'counseling', 'case manager'],
  failing: ['tutoring', 'advisor', 'probation'],
  grades: ['tutoring', 'advisor', 'probation'],
  homework: ['tutoring', 'learning center'],
  essay: ['writing', 'writing center'],
  writing: ['writing center', 'essay'],
  classes: ['advisor', 'education plan', 'registration'],
  schedule: ['advisor', 'registration', 'education plan'],
  major: ['advisor', 'education plan'],
  counselor: ['advising', 'counseling'],
  stressed: ['counseling', 'mental health', 'wellness'],
  stress: ['counseling', 'mental health'],
  anxiety: ['counseling', 'mental health'],
  anxious: ['counseling', 'mental health'],
  depressed: ['counseling', 'mental health'],
  depression: ['counseling', 'mental health'],
  overwhelmed: ['counseling', 'case manager', 'mental health'],
  burnout: ['counseling', 'mental health'],
  suicidal: ['crisis', 'counseling'],
  lonely: ['clubs', 'counseling', 'student life'],
  friends: ['clubs', 'student life', 'events'],
  sick: ['health center', 'clinic', 'medical'],
  doctor: ['health center', 'clinic'],
  medicine: ['prescription', 'health center'],
  therapy: ['counseling', 'mental health'],
  daycare: ['childcare', 'children'],
  kids: ['childcare', 'student parent'],
  baby: ['childcare', 'student parent'],
  bus: ['transportation', 'transit'],
  parking: ['transportation', 'permit'],
  commute: ['transportation', 'transit', 'carpool'],
  laptop: ['device loan', 'technology'],
  wifi: ['hotspot', 'technology', 'it'],
  password: ['it', 'login', 'account'],
  canvas: ['it', 'portal', 'login'],
  textbook: ['library', 'reserves', 'financial aid'],
  books: ['textbook', 'library', 'reserves'],
  transfer: ['transfer center', 'uc', 'csu', 'articulation'],
  graduate: ['graduation', 'petition', 'records'],
  graduation: ['petition', 'records', 'commencement'],
  transcript: ['records', 'graduation'],
  veteran: ['veterans', 'gi bill', 'va'],
  military: ['veterans', 'gi bill'],
  undocumented: ['dream center', 'ab 540', 'daca'],
  daca: ['dream center', 'ab 540', 'immigration'],
  visa: ['international', 'f-1', 'immigration'],
  international: ['international', 'f-1', 'visa'],
  disability: ['accessibility', 'accommodation'],
  adhd: ['accessibility', 'accommodation'],
  accommodation: ['accessibility', 'disability'],
  gym: ['recreation', 'fitness'],
  club: ['student life', 'clubs'],
  clubs: ['student life', 'events'],
  scholarship: ['scholarships', 'award', 'essay'],
  fafsa: ['financial aid', 'grant'],
  legal: ['legal clinic', 'attorney'],
  lawyer: ['legal clinic', 'attorney']
}

/** Words that signal a student may be in crisis right now. */
const URGENT_SIGNALS = [
  'emergency', 'urgent', 'tonight', 'today', 'right now', 'homeless', 'evicted',
  'eviction', 'nowhere to sleep', 'sleeping in my car', 'kicked out', 'hungry',
  'starving', 'no food', 'suicidal', 'kill myself', 'want to die', 'crisis',
  'unsafe', 'assault', 'panic', 'broke', 'no money'
]

const FIELD_WEIGHTS = {
  name: 10,
  keywords: 7,
  tags: 5,
  category: 4,
  blurb: 3,
  audiences: 3,
  description: 1.5
}

const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))
const AUDIENCE_BY_ID = Object.fromEntries(AUDIENCES.map(a => [a.id, a]))

export function getCategory(id) {
  return CATEGORY_BY_ID[id]
}

export function getAudienceLabel(id) {
  return AUDIENCE_BY_ID[id]?.label || id
}

export function getResource(id) {
  return RESOURCES.find(r => r.id === id)
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  return normalize(text)
    .split(' ')
    .filter(t => t.length > 2 && !STOPWORDS.has(t))
    .map(t => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t))
}

/**
 * Turns a plain-language query into weighted search terms: the student's own
 * words at full weight, synonym expansions at a discount so they can break ties
 * but never outrank a literal match.
 */
function buildTerms(query) {
  const normalized = normalize(query)
  const terms = new Map()

  const add = (term, weight) => {
    const key = term.toLowerCase()
    terms.set(key, Math.max(terms.get(key) || 0, weight))
  }

  tokenize(query).forEach(t => add(t, 1))

  // Multi-word phrases from the synonym map, matched against the whole query.
  Object.entries(SYNONYMS).forEach(([phrase, expansions]) => {
    const isPhrase = phrase.includes(' ')
    const hit = isPhrase
      ? normalized.includes(phrase)
      : terms.has(phrase) || terms.has(phrase.replace(/s$/, ''))
    if (hit) {
      if (isPhrase) add(phrase, 1.2)
      expansions.forEach(e => add(e, 0.65))
    }
  })

  return [...terms.entries()].map(([term, weight]) => ({ term, weight }))
}

function fieldText(resource) {
  return {
    name: resource.name.toLowerCase(),
    keywords: resource.keywords.join(' · ').toLowerCase(),
    tags: resource.tags.join(' · ').toLowerCase(),
    category: `${CATEGORY_BY_ID[resource.category].name} ${CATEGORY_BY_ID[resource.category].blurb}`.toLowerCase(),
    blurb: resource.blurb.toLowerCase(),
    audiences: resource.audiences.map(getAudienceLabel).join(' · ').toLowerCase(),
    description: resource.description.toLowerCase()
  }
}

const INDEX = RESOURCES.map(resource => ({ resource, fields: fieldText(resource) }))

const URGENT_PHRASES = URGENT_SIGNALS.filter(s => s.includes(' '))
const URGENT_WORDS = new Set(URGENT_SIGNALS.filter(s => !s.includes(' ')))

/**
 * Whether the query reads like a crisis. Single words match whole words only —
 * substring matching would read "panic" inside "Hispanic" and show a student
 * searching for scholarships a crisis warning.
 */
export function isUrgentQuery(query) {
  const normalized = normalize(query)
  if (URGENT_PHRASES.some(phrase => normalized.includes(phrase))) return true
  return normalized.split(' ').some(word => URGENT_WORDS.has(word))
}

/**
 * Ranks every resource against a plain-language query.
 * Returns `{ resource, score, matched }` sorted best-first.
 */
export function searchResources(query, { limit = 8, minScore = 1.5, relativeFloor = 0.18 } = {}) {
  const terms = buildTerms(query)
  if (terms.length === 0) return []

  const urgent = isUrgentQuery(query)

  const scored = INDEX.map(({ resource, fields }) => {
    let score = 0
    const matched = new Set()

    terms.forEach(({ term, weight }) => {
      Object.entries(FIELD_WEIGHTS).forEach(([field, fieldWeight]) => {
        const haystack = fields[field]
        if (!haystack.includes(term)) return
        // Whole-word hits count fully; hits inside a longer word count less.
        const wholeWord = new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(haystack)
        score += fieldWeight * weight * (wholeWord ? 1 : 0.4)
        if (weight >= 1 && (field === 'name' || field === 'keywords' || field === 'tags')) {
          matched.add(term)
        }
      })
    })

    // A crisis phrasing promotes same-day offices, but only ones the query
    // already touched — it must not drag in unrelated resources.
    if (urgent && resource.urgent && score > 0) score += 6

    return { resource, score, matched: [...matched] }
  })

  const ranked = scored
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name))

  // Drop the long tail of weak matches: a resource that scores a fraction of
  // the best hit is noise, and a wrong office is worse than a shorter list.
  const best = ranked[0]?.score || 0
  return ranked.filter(r => r.score >= best * relativeFloor).slice(0, limit)
}

/**
 * Composes the answer shown in the Ask tab: a short lead written from the top
 * match, the resources it is based on, and follow-up questions to keep going.
 * Every claim in the lead comes from the resource records, so answers stay
 * traceable to official campus info.
 */
export function answerQuestion(query) {
  const results = searchResources(query, { limit: 4 })

  if (results.length === 0) {
    return {
      urgent: false,
      lead: 'I could not match that to a specific office. Basic Needs case management is the right first stop when you are not sure where to start — they triage and make the referrals for you.',
      results: [{ resource: getResource('basic-needs-center'), score: 0, matched: [] }],
      followUps: ['I need help paying for school', 'I am struggling in my classes', 'Where do I find a job on campus?'],
      noMatch: true
    }
  }

  const top = results[0].resource
  const category = CATEGORY_BY_ID[top.category]

  // The crisis response promises same-day help with no paperwork. Only the
  // records marked `urgent` support that claim, so the banner and the lead are
  // gated on the office actually being one of them — crisis phrasing alone is
  // not enough.
  const urgent = isUrgentQuery(query) && Boolean(top.urgent)

  let lead
  if (urgent) {
    lead = `Start with ${top.name} — it handles this same-day and does not require documentation to begin. ${top.firstStep}`
  } else if (results.length > 1) {
    lead = `${top.name} is the closest match under ${category.name}. ${top.blurb} ${top.firstStep} ${results.length - 1} other ${results.length - 1 === 1 ? 'office' : 'offices'} below can also help.`
  } else {
    lead = `${top.name} is the office for this. ${top.blurb} ${top.firstStep}`
  }

  const followUps = buildFollowUps(results.map(r => r.resource))

  return { urgent, lead, results, followUps, noMatch: false }
}

function buildFollowUps(resources) {
  const seen = new Set(resources.map(r => r.category))
  const pool = [
    { category: 'financial-aid', q: 'How do I get help paying tuition?' },
    { category: 'scholarships', q: 'What scholarships can I apply for?' },
    { category: 'career', q: 'Can someone review my resume?' },
    { category: 'housing', q: 'I need somewhere to live' },
    { category: 'academic', q: 'I am failing a class' },
    { category: 'basic-needs', q: 'I cannot afford groceries' },
    { category: 'wellness', q: 'I need to talk to someone' },
    { category: 'transfer-grad', q: 'How do I transfer to a university?' },
    { category: 'tech', q: 'I do not have a laptop' }
  ]
  const fresh = pool.filter(p => !seen.has(p.category)).map(p => p.q)
  return fresh.slice(0, 3)
}

/**
 * Recommendation pass for the "For You" tab: scores resources against the
 * student's selected situation and needs rather than a text query.
 */
export function recommendResources({ audiences = [], needs = [] }) {
  if (audiences.length === 0 && needs.length === 0) return []

  // Category -> the needs that pulled it in, so a recommendation can name the
  // answer it came from. Two needs can land on the same category (food and
  // childcare are both basic needs); naming just one of them would mislabel
  // the other's resources, so those fall back to the category name.
  const needsByCategory = new Map()
  needs.forEach(id => {
    const need = NEEDS.find(x => x.id === id)
    need?.categories.forEach(c => {
      needsByCategory.set(c, [...(needsByCategory.get(c) || []), need.label])
    })
  })

  const scored = RESOURCES.map(resource => {
    let score = 0
    const reasons = []

    const matchingNeeds = needsByCategory.get(resource.category)
    if (matchingNeeds) {
      score += 10
      reasons.push(
        matchingNeeds.length === 1 ? matchingNeeds[0] : CATEGORY_BY_ID[resource.category].name
      )
    }

    // A program built for a specific community outranks a general office for
    // the students it exists to serve, even outside their selected needs.
    const audienceHits = audiences.filter(a => resource.audiences.includes(a))
    const targeted = audiences.filter(a => (resource.serves || []).includes(a))
    score += audienceHits.length * 2 + targeted.length * 7
    targeted.forEach(a => reasons.push(`Built for ${getAudienceLabel(a).toLowerCase()}`))

    if (needs.includes('childcare') && resource.id === 'childcare') score += 8
    if (needs.includes('money') && resource.urgent) score += 2

    return { resource, score, reasons: [...new Set(reasons)].slice(0, 2) }
  })

  return scored
    .filter(r => r.score >= 8)
    .sort((a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name))
    .slice(0, 12)
}

/** Resolves a recurring deadline to its next occurrence from `from`. */
export function nextOccurrence(deadline, from = new Date()) {
  const year = from.getFullYear()
  let date = new Date(year, deadline.month - 1, deadline.day)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  if (date < today) date = new Date(year + 1, deadline.month - 1, deadline.day)
  const daysAway = Math.round((date - today) / 86400000)
  return { date, daysAway }
}

export function formatDeadlineDate(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
