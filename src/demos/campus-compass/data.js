/**
 * Campus Compass — sample resource data.
 *
 * Every record mirrors what a real campus directory entry needs: who it serves,
 * where it is, when it is open, how to reach it, and what to do first. The data
 * here is realistic sample data for a California community college / CSU-style
 * campus, not a live feed. A production build would sync this from the
 * university's directory API (see the About tab).
 */

export const CATEGORIES = [
  {
    id: 'financial-aid',
    name: 'Financial Aid',
    icon: '💰',
    color: '#22c55e',
    blurb: 'Grants, loans, fee waivers, and emergency money'
  },
  {
    id: 'scholarships',
    name: 'Scholarships',
    icon: '🏅',
    color: '#f59e0b',
    blurb: 'One application, hundreds of awards'
  },
  {
    id: 'career',
    name: 'Career Services',
    icon: '💼',
    color: '#6366f1',
    blurb: 'Resumes, internships, jobs, and interviews'
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    color: '#8b5cf6',
    blurb: 'On-campus housing, off-campus listings, and emergency shelter'
  },
  {
    id: 'academic',
    name: 'Academic Support',
    icon: '📚',
    color: '#0ea5e9',
    blurb: 'Tutoring, advising, and study space'
  },
  {
    id: 'basic-needs',
    name: 'Basic Needs',
    icon: '🥫',
    color: '#ef4444',
    blurb: 'Food, transportation, childcare, and crisis funds'
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    icon: '💚',
    color: '#14b8a6',
    blurb: 'Medical care, counseling, and recovery support'
  },
  {
    id: 'belonging',
    name: 'Student Programs',
    icon: '🤝',
    color: '#ec4899',
    blurb: 'Programs built for specific student communities'
  },
  {
    id: 'transfer-grad',
    name: 'Transfer & Grad',
    icon: '🎓',
    color: '#a855f7',
    blurb: 'Transferring out, graduating, and applying to grad school'
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    color: '#64748b',
    blurb: 'Laptops, Wi-Fi, software, and accounts'
  }
]

/** Audience labels used by the "who it's for" field and the recommender. */
export const AUDIENCES = [
  { id: 'new', label: 'New / first-year student' },
  { id: 'continuing', label: 'Continuing student' },
  { id: 'transfer', label: 'Transfer student' },
  { id: 'grad', label: 'Graduate student' },
  { id: 'part-time', label: 'Part-time or evening student' },
  { id: 'online', label: 'Online / distance student' },
  { id: 'first-gen', label: 'First-generation student' },
  { id: 'international', label: 'International student' },
  { id: 'veteran', label: 'Veteran or service member' },
  { id: 'parenting', label: 'Student parent' },
  { id: 'disability', label: 'Student with a disability' },
  { id: 'undocumented', label: 'Undocumented / AB 540 student' }
]

/** Needs used by the recommendation quiz. */
export const NEEDS = [
  { id: 'money', label: 'Paying for school', icon: '💵', categories: ['financial-aid', 'scholarships'] },
  { id: 'job', label: 'Finding a job or internship', icon: '💼', categories: ['career'] },
  { id: 'housing', label: 'A place to live', icon: '🏠', categories: ['housing'] },
  { id: 'grades', label: 'Help with my classes', icon: '📚', categories: ['academic'] },
  { id: 'food', label: 'Food or daily essentials', icon: '🥫', categories: ['basic-needs'] },
  { id: 'health', label: 'Health or mental health support', icon: '💚', categories: ['wellness'] },
  { id: 'belonging', label: 'Community and belonging', icon: '🤝', categories: ['belonging'] },
  { id: 'next-step', label: 'Transferring or graduating', icon: '🎓', categories: ['transfer-grad'] },
  { id: 'tech', label: 'A laptop, Wi-Fi, or software', icon: '💻', categories: ['tech'] },
  { id: 'childcare', label: 'Childcare while I study', icon: '🧸', categories: ['basic-needs'] }
]

export const RESOURCES = [
  // ---------------------------------------------------------------- financial
  {
    id: 'financial-aid-office',
    name: 'Financial Aid Office',
    category: 'financial-aid',
    icon: '💰',
    blurb: 'FAFSA and CADAA help, award letters, and fee waivers.',
    description:
      'The starting point for almost every kind of money on campus. Staff walk you through the FAFSA or California Dream Act Application, explain your award letter line by line, fix verification holds, and screen you for the College Promise fee waiver.',
    audiences: ['new', 'continuing', 'transfer', 'part-time', 'first-gen', 'undocumented', 'veteran', 'parenting'],
    location: 'Student Services Building, Room 120',
    hours: 'Mon–Thu 8:30am–5pm · Fri 8:30am–12pm · Virtual drop-in Wed 5–7pm',
    phone: '(831) 555-0120',
    email: 'financialaid@campus.edu',
    website: 'campus.edu/financial-aid',
    cost: 'Free',
    access: 'Drop-in or appointment',
    firstStep: 'Bring your student ID number and last year\'s tax info to a drop-in session.',
    keywords: ['fafsa', 'cadaa', 'dream act', 'grant', 'pell', 'loan', 'award letter', 'sap appeal', 'verification', 'fee waiver', 'tuition', 'money', 'afford', 'cost', 'promise grant', 'work study', 'disbursement', 'refund'],
    tags: ['grants', 'loans', 'fee waiver', 'FAFSA']
  },
  {
    id: 'emergency-grant',
    name: 'Emergency Student Fund',
    category: 'financial-aid',
    icon: '🆘',
    blurb: 'Small same-week grants for an unexpected crisis.',
    description:
      'Grants of $100–$750 for emergencies that could push you out of school: a car repair you need to get to class, a rent shortfall, a medical bill, a stolen laptop. Most decisions come back within three business days and the money does not have to be repaid.',
    audiences: ['continuing', 'new', 'transfer', 'grad', 'parenting', 'first-gen', 'undocumented'],
    location: 'Dean of Students, Student Services Building Room 210',
    hours: 'Mon–Fri 9am–4pm · Online application open 24/7',
    phone: '(831) 555-0210',
    email: 'emergencyfund@campus.edu',
    website: 'campus.edu/emergency-fund',
    cost: 'Free · funds do not need to be repaid',
    access: 'Online application, reviewed within 3 business days',
    firstStep: 'Submit the one-page online request — you do not need documentation to start.',
    keywords: ['emergency', 'crisis', 'urgent', 'car repair', 'rent', 'evicted', 'behind on rent', 'utility', 'unexpected', 'broke', 'help now', 'hardship', 'stolen', 'medical bill'],
    tags: ['emergency', 'grant', 'urgent'],
    urgent: true
  },
  {
    id: 'cashier',
    name: 'Cashier & Student Accounts',
    category: 'financial-aid',
    icon: '🧾',
    blurb: 'Pay tuition, set up a payment plan, or clear a hold.',
    description:
      'Handles balances, payment plans that split tuition across the term, refunds, and registration holds. If you cannot pay a balance by the deadline, a payment plan set up here keeps you enrolled.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'international'],
    location: 'Administration Building, Room 105',
    hours: 'Mon–Fri 9am–4pm',
    phone: '(831) 555-0105',
    email: 'studentaccounts@campus.edu',
    website: 'campus.edu/student-accounts',
    cost: 'Free · payment plans have a $25 setup fee',
    access: 'Walk-in or online portal',
    firstStep: 'Check your balance in the student portal before the payment deadline.',
    keywords: ['payment plan', 'tuition bill', 'balance', 'hold', 'registration hold', 'refund', 'pay', 'installment', 'owe', 'past due'],
    tags: ['billing', 'payment plan', 'holds']
  },

  // ------------------------------------------------------------- scholarships
  {
    id: 'scholarship-office',
    name: 'Scholarship Office',
    category: 'scholarships',
    icon: '🏅',
    blurb: 'One application matches you to 200+ campus awards.',
    description:
      'A single general application matches you to every campus scholarship you qualify for — no separate forms. Awards range from $250 to full tuition, and many go unclaimed each year because too few students apply. Staff read drafts of your personal statement if you bring one in.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'first-gen', 'undocumented', 'international', 'veteran', 'parenting'],
    location: 'Student Services Building, Room 130',
    hours: 'Mon–Fri 9am–5pm · Extended hours in January',
    phone: '(831) 555-0130',
    email: 'scholarships@campus.edu',
    website: 'campus.edu/scholarships',
    cost: 'Free',
    access: 'Online application + optional essay review appointment',
    firstStep: 'Start the general application early — it saves as you go and takes about an hour.',
    keywords: ['scholarship', 'award', 'essay', 'personal statement', 'merit', 'free money', 'apply', 'stipend', 'foundation', 'donor'],
    tags: ['scholarships', 'essays', 'awards']
  },
  {
    id: 'external-scholarships',
    name: 'Outside Scholarship Search Lab',
    category: 'scholarships',
    icon: '🔎',
    blurb: 'Vetted off-campus scholarships, plus help applying.',
    description:
      'A curated list of regional, statewide, and national scholarships that campus staff have already screened for scams. Weekly one-hour lab sessions where you search, shortlist, and start applications with someone sitting next to you.',
    audiences: ['continuing', 'transfer', 'grad', 'first-gen', 'undocumented'],
    location: 'Library, Room 210 (Thursdays) · Online list always available',
    hours: 'Lab: Thu 3–4pm · List updated monthly',
    phone: '(831) 555-0131',
    email: 'scholarships@campus.edu',
    website: 'campus.edu/scholarships/outside',
    cost: 'Free',
    access: 'Drop-in lab',
    firstStep: 'Sort the list by deadline and pick the three closest ones you qualify for.',
    keywords: ['outside scholarship', 'external scholarship', 'national scholarship', 'private scholarship', 'scholarship search', 'scam', 'deadline'],
    tags: ['scholarships', 'search', 'workshops']
  },

  // ------------------------------------------------------------------- career
  {
    id: 'career-center',
    name: 'Career Center',
    category: 'career',
    icon: '💼',
    blurb: 'Resume reviews, mock interviews, and the job board.',
    description:
      'Same-day resume and cover letter reviews, mock interviews recorded so you can watch them back, LinkedIn and portfolio help, and the campus job board with on-campus, part-time, and full-time listings. Appointments are 30 minutes and can be virtual.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'first-gen', 'veteran', 'international'],
    location: 'Student Union, 2nd Floor',
    hours: 'Mon–Thu 9am–6pm · Fri 9am–3pm · Virtual appointments daily',
    phone: '(831) 555-0140',
    email: 'careers@campus.edu',
    website: 'campus.edu/careers',
    cost: 'Free · includes free professional headshots',
    access: 'Appointment online, 15-min drop-in reviews Tue/Thu 1–3pm',
    firstStep: 'Upload any version of your resume — a rough one is enough to book a review.',
    keywords: ['resume', 'cv', 'cover letter', 'interview', 'job', 'career', 'linkedin', 'portfolio', 'hiring', 'employment', 'work', 'salary', 'negotiate', 'headshot', 'job board'],
    tags: ['resume', 'interviews', 'jobs']
  },
  {
    id: 'internships',
    name: 'Internship & Work-Based Learning',
    category: 'career',
    icon: '🧭',
    blurb: 'Paid internships, co-ops, and academic credit for work.',
    description:
      'Connects students with paid internships at regional employers and helps you turn an existing job into academic credit. Also runs the paid summer research program for students planning to transfer to a four-year school.',
    audiences: ['continuing', 'transfer', 'grad', 'international', 'first-gen'],
    location: 'Student Union, 2nd Floor (inside the Career Center)',
    hours: 'Mon–Fri 10am–4pm',
    phone: '(831) 555-0141',
    email: 'internships@campus.edu',
    website: 'campus.edu/internships',
    cost: 'Free',
    access: 'Appointment',
    firstStep: 'Ask about the internship interest form — placements are matched twice a year.',
    keywords: ['internship', 'intern', 'co-op', 'experience', 'research', 'apprenticeship', 'credit for work', 'summer program', 'paid internship'],
    tags: ['internships', 'experience', 'research']
  },
  {
    id: 'student-employment',
    name: 'Student Employment & Work-Study',
    category: 'career',
    icon: '🕐',
    blurb: 'On-campus jobs that schedule around your classes.',
    description:
      'On-campus positions from lab assistant to front desk, most capped at 20 hours a week and required to work around your class schedule. Work-study eligibility comes from your financial aid award, but many positions do not require it.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'international', 'undocumented'],
    location: 'Student Union, 2nd Floor',
    hours: 'Mon–Fri 9am–5pm',
    phone: '(831) 555-0142',
    email: 'studentjobs@campus.edu',
    website: 'campus.edu/student-jobs',
    cost: 'Free',
    access: 'Apply through the campus job board',
    firstStep: 'Check whether your award letter lists work-study — it widens what you can apply to.',
    keywords: ['on campus job', 'work study', 'part time job', 'student worker', 'hourly', 'paycheck', 'employment', 'hiring on campus'],
    tags: ['jobs', 'work-study', 'on-campus']
  },

  // ------------------------------------------------------------------ housing
  {
    id: 'housing-office',
    name: 'Housing & Residential Life',
    category: 'housing',
    icon: '🏠',
    blurb: 'On-campus housing applications, contracts, and roommates.',
    description:
      'Runs the residence halls and apartment-style housing: applications, contracts, room assignments, roommate changes, and maintenance requests. Priority assignment follows the application date, so applying early matters more than anything else.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'international'],
    location: 'Residential Life Center, Building H',
    hours: 'Mon–Fri 8am–5pm · On-call RA staff 24/7',
    phone: '(831) 555-0150',
    email: 'housing@campus.edu',
    website: 'campus.edu/housing',
    cost: 'Varies by hall · $50 application fee, waivable with a fee waiver',
    access: 'Online application',
    firstStep: 'Apply as soon as the application opens — assignments go in date order.',
    keywords: ['dorm', 'housing', 'residence hall', 'roommate', 'on campus housing', 'apartment', 'move in', 'contract', 'meal plan', 'ra'],
    tags: ['on-campus housing', 'roommates', 'contracts']
  },
  {
    id: 'off-campus-housing',
    name: 'Off-Campus Housing Help',
    category: 'housing',
    icon: '🔑',
    blurb: 'Verified rental listings and lease review.',
    description:
      'A listings board of local rentals and rooms posted by landlords who have been verified by the campus, plus free lease review before you sign and a roommate-matching board for students. Staff also explain tenant rights and how to get a deposit back.',
    audiences: ['continuing', 'transfer', 'grad', 'international', 'part-time'],
    location: 'Student Union, Room 118',
    hours: 'Mon–Fri 10am–4pm',
    phone: '(831) 555-0151',
    email: 'offcampus@campus.edu',
    website: 'campus.edu/off-campus-housing',
    cost: 'Free',
    access: 'Drop-in or online listings',
    firstStep: 'Have a lease reviewed before you sign it — it takes about 20 minutes.',
    keywords: ['rent', 'apartment', 'lease', 'landlord', 'off campus', 'roommate', 'deposit', 'tenant rights', 'sublet', 'rental'],
    tags: ['rentals', 'leases', 'roommates']
  },
  {
    id: 'housing-crisis',
    name: 'Housing Crisis & Rapid Rehousing',
    category: 'housing',
    icon: '🛏️',
    blurb: 'Same-day help if you have nowhere to sleep tonight.',
    description:
      'Confidential support for students who are homeless, couch surfing, or about to lose housing: emergency hotel vouchers, short-term shelter placement, deposit and first-month assistance, and a case manager who stays with you until you are stable.',
    audiences: ['continuing', 'new', 'transfer', 'grad', 'parenting', 'first-gen', 'undocumented'],
    location: 'Basic Needs Center, Student Union Room 105',
    hours: 'Mon–Fri 9am–5pm · After hours: call Campus Safety at (831) 555-0911',
    phone: '(831) 555-0155',
    email: 'basicneeds@campus.edu',
    website: 'campus.edu/housing-crisis',
    cost: 'Free · confidential',
    access: 'Walk in or call — no documentation required to start',
    firstStep: 'Walk into the Basic Needs Center and say you need housing help. That is enough.',
    keywords: ['homeless', 'nowhere to sleep', 'couch surfing', 'evicted', 'eviction', 'shelter', 'unhoused', 'kicked out', 'car', 'sleeping in my car', 'emergency housing', 'unsafe at home'],
    tags: ['emergency', 'shelter', 'case management'],
    urgent: true
  },

  // ----------------------------------------------------------------- academic
  {
    id: 'tutoring-center',
    name: 'Tutoring & Learning Center',
    category: 'academic',
    icon: '📖',
    blurb: 'Free drop-in tutoring for most courses, plus online.',
    description:
      'Drop-in and scheduled tutoring for math, science, writing, languages, and most general education courses, staffed by students who recently passed the same classes. Online tutoring runs until midnight during the week.',
    audiences: ['new', 'continuing', 'transfer', 'online', 'part-time', 'first-gen', 'international'],
    location: 'Library, 1st Floor Learning Commons',
    hours: 'Mon–Thu 9am–8pm · Fri 9am–3pm · Sun 2–6pm · Online until midnight Sun–Thu',
    phone: '(831) 555-0160',
    email: 'tutoring@campus.edu',
    website: 'campus.edu/tutoring',
    cost: 'Free · unlimited sessions',
    access: 'Drop-in, no appointment needed',
    firstStep: 'Bring the assignment you are stuck on, even if you have not started it.',
    keywords: ['tutor', 'tutoring', 'homework', 'failing', 'struggling', 'math', 'chemistry', 'statistics', 'study help', 'grades', 'behind in class', 'exam', 'midterm', 'final'],
    tags: ['tutoring', 'study', 'drop-in']
  },
  {
    id: 'writing-center',
    name: 'Writing Center',
    category: 'academic',
    icon: '✍️',
    blurb: 'Essay feedback at any stage, including applications.',
    description:
      'Forty-five minute sessions on any writing: class essays, lab reports, scholarship personal statements, transfer applications, and resumes. Tutors work on structure and argument, not just grammar, and will read drafts from a blank page onward.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'international', 'first-gen'],
    location: 'Library, Room 140',
    hours: 'Mon–Thu 10am–7pm · Fri 10am–2pm · Async draft feedback within 48 hours',
    phone: '(831) 555-0161',
    email: 'writingcenter@campus.edu',
    website: 'campus.edu/writing-center',
    cost: 'Free',
    access: 'Appointment or drop-in when open',
    firstStep: 'Book a 45-minute session and bring the prompt, not just the draft.',
    keywords: ['essay', 'writing', 'paper', 'draft', 'grammar', 'citation', 'apa', 'mla', 'personal statement', 'thesis', 'proofread', 'english'],
    tags: ['writing', 'essays', 'feedback']
  },
  {
    id: 'academic-advising',
    name: 'Academic Advising & Counseling',
    category: 'academic',
    icon: '🗺️',
    blurb: 'Build an education plan that actually gets you out.',
    description:
      'Counselors help you pick classes, build a term-by-term education plan, change majors, understand prerequisites, and recover from academic probation. Students with a completed education plan register earlier than everyone else.',
    audiences: ['new', 'continuing', 'transfer', 'part-time', 'online', 'first-gen', 'undocumented', 'veteran'],
    location: 'Student Services Building, Room 220',
    hours: 'Mon–Thu 8am–6pm · Fri 8am–12pm · Express 15-min drop-ins Mon/Wed 1–4pm',
    phone: '(831) 555-0220',
    email: 'advising@campus.edu',
    website: 'campus.edu/advising',
    cost: 'Free',
    access: 'Appointment or express drop-in',
    firstStep: 'Book before registration opens — appointments fill two weeks out.',
    keywords: ['advisor', 'counselor', 'education plan', 'ed plan', 'classes', 'schedule', 'major', 'change major', 'prerequisite', 'probation', 'units', 'degree audit', 'what classes', 'register'],
    tags: ['advising', 'planning', 'registration']
  },
  {
    id: 'disability-services',
    name: 'Accessibility & Disability Services',
    category: 'academic',
    icon: '♿',
    blurb: 'Accommodations, testing support, and assistive tech.',
    description:
      'Sets up accommodations such as extended test time, note-taking support, captioning, accessible furniture, and assistive software. Covers documented disabilities including ADHD, learning disabilities, chronic illness, and mental health conditions. Temporary accommodations are available after an injury or surgery.',
    serves: ['disability'],
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'disability', 'veteran'],
    location: 'Student Services Building, Room 145',
    hours: 'Mon–Fri 8:30am–5pm',
    phone: '(831) 555-0145',
    email: 'accessibility@campus.edu',
    website: 'campus.edu/accessibility',
    cost: 'Free',
    access: 'Intake appointment · documentation helpful but not required to start',
    firstStep: 'Book an intake appointment before the term starts if you can — accommodations are not retroactive.',
    keywords: ['disability', 'accommodation', 'adhd', 'extended time', 'testing', 'note taker', 'assistive', 'dyslexia', 'wheelchair', 'captioning', 'chronic illness', 'accessible'],
    tags: ['accommodations', 'accessibility', 'testing']
  },
  {
    id: 'library',
    name: 'Library & Research Help',
    category: 'academic',
    icon: '📚',
    blurb: 'Databases, librarians, study rooms, and course reserves.',
    description:
      'Librarians help you find sources and cite them properly. Course reserves let you borrow required textbooks for two hours at a time for free, and reservable group study rooms open two weeks ahead.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'part-time'],
    location: 'Main Library',
    hours: 'Mon–Thu 7:30am–10pm · Fri 7:30am–5pm · Sat–Sun 11am–6pm · 24/7 during finals',
    phone: '(831) 555-0170',
    email: 'library@campus.edu',
    website: 'campus.edu/library',
    cost: 'Free',
    access: 'Walk in · chat with a librarian online',
    firstStep: 'Check course reserves before buying a textbook.',
    keywords: ['library', 'books', 'textbook', 'research', 'database', 'study room', 'quiet', 'citation', 'reserves', 'printing', 'journal'],
    tags: ['research', 'study space', 'textbooks']
  },

  // --------------------------------------------------------------- basic needs
  {
    id: 'food-pantry',
    name: 'Campus Food Pantry',
    category: 'basic-needs',
    icon: '🥫',
    blurb: 'Free groceries every week, no questions asked.',
    description:
      'A student-run pantry with fresh produce, shelf-stable groceries, and hygiene supplies. No income check, no paperwork, no limit on how often you come. Staff also screen you for CalFresh, which is worth up to $292 a month for one person.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'parenting', 'international', 'undocumented'],
    location: 'Student Union, Room 105 (Basic Needs Center)',
    hours: 'Mon–Fri 10am–4pm · Fresh produce drop Wednesdays 11am',
    phone: '(831) 555-0105',
    email: 'basicneeds@campus.edu',
    website: 'campus.edu/basic-needs',
    cost: 'Free · student ID only',
    access: 'Walk in',
    firstStep: 'Just walk in during open hours. Bring a bag if you have one.',
    keywords: ['food', 'hungry', 'groceries', 'pantry', 'meal', 'calfresh', 'snap', 'ebt', 'eat', 'food insecure', 'diapers', 'hygiene', 'toiletries', 'cant afford food'],
    tags: ['food', 'CalFresh', 'walk-in'],
    urgent: true
  },
  {
    id: 'childcare',
    name: 'Children\'s Center & Childcare Grants',
    category: 'basic-needs',
    icon: '🧸',
    blurb: 'Subsidized childcare while you are in class.',
    description:
      'A licensed center on campus for children ages 2–5 with priority enrollment and subsidized rates for student parents, plus grants that help cover off-campus childcare for other age groups. There is a waitlist, so applying early in the term matters.',
    serves: ['parenting'],
    audiences: ['parenting', 'continuing', 'new', 'transfer', 'grad', 'part-time'],
    location: 'Children\'s Center, Building C',
    hours: 'Mon–Fri 7:30am–5:30pm',
    phone: '(831) 555-0180',
    email: 'childrenscenter@campus.edu',
    website: 'campus.edu/childrens-center',
    cost: 'Sliding scale · free for many aid-eligible students',
    access: 'Application + waitlist',
    firstStep: 'Get on the waitlist even if you are unsure — spots open every term.',
    keywords: ['childcare', 'daycare', 'kids', 'children', 'parent', 'babysitting', 'toddler', 'preschool', 'student parent', 'baby'],
    tags: ['childcare', 'student parents', 'subsidies']
  },
  {
    id: 'transportation',
    name: 'Transportation & Bus Pass',
    category: 'basic-needs',
    icon: '🚌',
    blurb: 'Free local transit pass and emergency gas cards.',
    description:
      'Your student ID works as a free pass on every local bus route. The office also issues emergency gas and rideshare cards for students at risk of missing class, runs a carpool board, and sells discounted parking permits.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'parenting'],
    location: 'Student Union, Room 110',
    hours: 'Mon–Fri 9am–4pm',
    phone: '(831) 555-0110',
    email: 'transit@campus.edu',
    website: 'campus.edu/transportation',
    cost: 'Bus pass free with student ID · parking permits discounted',
    access: 'Walk in',
    firstStep: 'Activate the bus pass on your student ID — it takes two minutes.',
    keywords: ['bus', 'transit', 'transportation', 'parking', 'gas', 'ride', 'commute', 'car', 'bike', 'no ride', 'get to campus', 'carpool'],
    tags: ['transit', 'parking', 'commuting']
  },
  {
    id: 'legal-clinic',
    name: 'Student Legal & Immigration Clinic',
    category: 'basic-needs',
    icon: '⚖️',
    blurb: 'Free confidential legal consultations for students.',
    description:
      'Free 30-minute consultations with an attorney on landlord disputes, employment issues, traffic and criminal matters, and immigration questions including DACA renewals and AB 540 status. Conversations are confidential and are not shared with the campus.',
    serves: ['undocumented', 'international'],
    audiences: ['continuing', 'transfer', 'grad', 'international', 'undocumented', 'parenting'],
    location: 'Student Union, Room 122 (Tuesdays and Thursdays)',
    hours: 'Tue & Thu 10am–4pm · By appointment',
    phone: '(831) 555-0122',
    email: 'legalclinic@campus.edu',
    website: 'campus.edu/legal-clinic',
    cost: 'Free · confidential',
    access: 'Appointment',
    firstStep: 'Book a consultation before signing or responding to anything legal.',
    keywords: ['legal', 'lawyer', 'attorney', 'immigration', 'daca', 'ab 540', 'visa', 'landlord dispute', 'rights', 'ticket', 'court', 'undocumented'],
    tags: ['legal', 'immigration', 'confidential']
  },

  // ------------------------------------------------------------------ wellness
  {
    id: 'health-center',
    name: 'Student Health Center',
    category: 'wellness',
    icon: '🏥',
    blurb: 'Clinic visits, vaccines, and low-cost prescriptions.',
    description:
      'Primary care for illness and injury, sexual health services, immunizations, TB tests, and low-cost prescriptions. Most visits are free or under $20 for enrolled students, and you do not need insurance to be seen.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'international', 'part-time'],
    location: 'Health & Wellness Building, 1st Floor',
    hours: 'Mon–Fri 8am–5pm · Nurse line 24/7 at (831) 555-0199',
    phone: '(831) 555-0190',
    email: 'health@campus.edu',
    website: 'campus.edu/health',
    cost: 'Most visits free · prescriptions at cost',
    access: 'Same-day appointments, some walk-in slots',
    firstStep: 'Call for a same-day slot in the morning — they open at 8am.',
    keywords: ['sick', 'doctor', 'clinic', 'health', 'vaccine', 'immunization', 'prescription', 'birth control', 'std', 'flu', 'injury', 'insurance', 'medical'],
    tags: ['medical', 'clinic', 'low-cost']
  },
  {
    id: 'counseling',
    name: 'Counseling & Psychological Services',
    category: 'wellness',
    icon: '💬',
    blurb: 'Free therapy sessions and 24/7 crisis support.',
    description:
      'Free individual counseling (up to 12 sessions a year), group therapy, and drop-in "let\'s talk" hours with no intake paperwork. A licensed counselor answers the crisis line any hour of the day. Everything is confidential and never appears on your academic record.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'international', 'veteran', 'first-gen'],
    location: 'Health & Wellness Building, 3rd Floor',
    hours: 'Mon–Fri 8am–6pm · Drop-in hours Tue/Thu 2–4pm · Crisis line 24/7',
    phone: '(831) 555-0193 · Crisis: 988',
    email: 'counseling@campus.edu',
    website: 'campus.edu/counseling',
    cost: 'Free · confidential',
    access: 'Appointment, drop-in hours, or crisis line',
    firstStep: 'Use a drop-in hour first if booking feels like too much — no forms needed.',
    keywords: ['counseling', 'therapy', 'mental health', 'anxiety', 'depressed', 'depression', 'stress', 'stressed', 'overwhelmed', 'panic', 'crisis', 'suicidal', 'grief', 'burnout', 'lonely', 'talk to someone'],
    tags: ['mental health', 'counseling', 'crisis'],
    urgent: true
  },
  {
    id: 'basic-needs-center',
    name: 'Basic Needs & Case Management',
    category: 'wellness',
    icon: '🧡',
    blurb: 'One case manager who helps you sort everything out.',
    description:
      'If you are dealing with several problems at once — money, housing, food, health, a family crisis — a case manager helps you triage, makes the referrals, and follows up so nothing gets dropped. This is the single best first stop when you are not sure where to start.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'parenting', 'first-gen', 'undocumented', 'veteran'],
    location: 'Student Union, Room 105',
    hours: 'Mon–Fri 9am–5pm',
    phone: '(831) 555-0105',
    email: 'basicneeds@campus.edu',
    website: 'campus.edu/basic-needs',
    cost: 'Free · confidential',
    access: 'Walk in or request a case manager online',
    firstStep: 'Walk in and describe what is going on — they will map out the rest.',
    keywords: ['help', 'dont know where to start', 'case manager', 'support', 'struggling', 'everything', 'referral', 'overwhelmed', 'basic needs'],
    tags: ['case management', 'referrals', 'walk-in']
  },
  {
    id: 'recreation',
    name: 'Recreation & Wellness Center',
    category: 'wellness',
    icon: '🏋️',
    blurb: 'Gym, classes, and intramurals included in your fees.',
    description:
      'Weight room, courts, pool, and free fitness classes, all covered by the student activity fee you already pay. Intramural leagues run each term and are a low-pressure way to meet people.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time'],
    location: 'Recreation Center, Building R',
    hours: 'Mon–Fri 6am–11pm · Sat–Sun 8am–8pm',
    phone: '(831) 555-0195',
    email: 'rec@campus.edu',
    website: 'campus.edu/recreation',
    cost: 'Included in student fees',
    access: 'Walk in with student ID',
    firstStep: 'Swipe in with your student ID — no signup required.',
    keywords: ['gym', 'fitness', 'exercise', 'sports', 'intramural', 'pool', 'workout', 'yoga', 'basketball', 'recreation'],
    tags: ['fitness', 'intramurals', 'wellness']
  },

  // ----------------------------------------------------------------- belonging
  {
    id: 'first-gen-program',
    name: 'First-Generation Student Program',
    category: 'belonging',
    icon: '🌱',
    blurb: 'Coaching and community for first-in-family students.',
    description:
      'A dedicated coach who knows how confusing college systems are when nobody at home has been through them, plus a peer cohort, textbook grants, and workshops on the things nobody tells you — office hours, financial aid appeals, asking for help.',
    serves: ['first-gen'],
    audiences: ['first-gen', 'new', 'continuing', 'transfer'],
    location: 'Student Success Center, Room 250',
    hours: 'Mon–Fri 9am–5pm',
    phone: '(831) 555-0250',
    email: 'firstgen@campus.edu',
    website: 'campus.edu/first-gen',
    cost: 'Free',
    access: 'Sign up any time during the term',
    firstStep: 'Join the cohort — membership also unlocks textbook grants.',
    keywords: ['first generation', 'first gen', 'parents didnt go to college', 'mentor', 'coach', 'cohort', 'guidance', 'new to college'],
    tags: ['first-gen', 'mentoring', 'community']
  },
  {
    id: 'veterans-center',
    name: 'Veterans Resource Center',
    category: 'belonging',
    icon: '🎖️',
    blurb: 'GI Bill certification and a space of your own.',
    description:
      'Certifies your VA education benefits every term, helps with the transition from service to school, connects you to VA health care, and provides a lounge and study space for veterans, active duty, and dependents.',
    serves: ['veteran'],
    audiences: ['veteran', 'new', 'continuing', 'transfer', 'grad'],
    location: 'Student Union, Room 210',
    hours: 'Mon–Fri 8am–5pm',
    phone: '(831) 555-0211',
    email: 'veterans@campus.edu',
    website: 'campus.edu/veterans',
    cost: 'Free',
    access: 'Walk in',
    firstStep: 'Submit your certificate of eligibility so benefits are certified before fees are due.',
    keywords: ['veteran', 'va', 'gi bill', 'military', 'active duty', 'dependent', 'benefits', 'service member', 'chapter 33'],
    tags: ['veterans', 'benefits', 'community']
  },
  {
    id: 'dream-center',
    name: 'Dream Center (Undocumented Student Services)',
    category: 'belonging',
    icon: '🦋',
    blurb: 'AB 540, Dream Act aid, and confidential support.',
    description:
      'Support for undocumented, DACA, and mixed-status students: AB 540 tuition exemption paperwork, California Dream Act aid, DACA renewal fee assistance, immigration legal referrals, and scholarships that do not require citizenship. Staff do not share student status with anyone.',
    serves: ['undocumented'],
    audiences: ['undocumented', 'new', 'continuing', 'transfer', 'grad'],
    location: 'Student Success Center, Room 260',
    hours: 'Mon–Fri 9am–5pm',
    phone: '(831) 555-0260',
    email: 'dreamcenter@campus.edu',
    website: 'campus.edu/dream-center',
    cost: 'Free · confidential',
    access: 'Walk in or appointment',
    firstStep: 'Ask about AB 540 — it can drop your tuition to in-state rates.',
    keywords: ['undocumented', 'daca', 'ab 540', 'dream act', 'dreamer', 'immigration', 'mixed status', 'cadaa', 'no ssn'],
    tags: ['undocumented', 'AB 540', 'confidential']
  },
  {
    id: 'international-office',
    name: 'International Student Services',
    category: 'belonging',
    icon: '🌏',
    blurb: 'F-1 advising, CPT/OPT, and settling in.',
    description:
      'Immigration advising for F-1 and J-1 students including visa status, CPT and OPT work authorization, travel signatures, and reduced course load requests, plus orientation, host families, and conversation partners.',
    serves: ['international'],
    audiences: ['international', 'new', 'continuing', 'transfer', 'grad'],
    location: 'Administration Building, Room 310',
    hours: 'Mon–Fri 9am–5pm',
    phone: '(831) 555-0310',
    email: 'international@campus.edu',
    website: 'campus.edu/international',
    cost: 'Free',
    access: 'Appointment',
    firstStep: 'Talk to an advisor before dropping below full-time — it can affect your visa.',
    keywords: ['international', 'f-1', 'j-1', 'visa', 'opt', 'cpt', 'i-20', 'sevis', 'travel signature', 'work authorization', 'study abroad'],
    tags: ['international', 'visas', 'advising']
  },
  {
    id: 'student-life',
    name: 'Student Life & Clubs',
    category: 'belonging',
    icon: '🎉',
    blurb: 'Clubs, events, and student government.',
    description:
      'Over 90 student clubs, campus events, leadership programs, and student government. Club Rush at the start of each term is the fastest way to find people who share your interests; starting your own club takes five members and a short form.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'part-time', 'international'],
    location: 'Student Union, 1st Floor',
    hours: 'Mon–Fri 9am–6pm',
    phone: '(831) 555-0100',
    email: 'studentlife@campus.edu',
    website: 'campus.edu/student-life',
    cost: 'Free',
    access: 'Walk in · club list online',
    firstStep: 'Go to Club Rush in the first two weeks of the term.',
    keywords: ['club', 'clubs', 'friends', 'events', 'lonely', 'meet people', 'student government', 'activities', 'organization', 'social', 'belonging', 'community'],
    tags: ['clubs', 'events', 'community']
  },

  // -------------------------------------------------------------- transfer-grad
  {
    id: 'transfer-center',
    name: 'Transfer Center',
    category: 'transfer-grad',
    icon: '🎓',
    blurb: 'Transfer agreements, applications, and campus tours.',
    description:
      'Helps you pick transfer targets, understand articulation and ADT guarantees, complete UC and CSU applications, and meet with visiting university representatives on campus. Guaranteed admission agreements are available for several universities if you plan early enough.',
    audiences: ['continuing', 'transfer', 'new', 'first-gen', 'undocumented', 'veteran'],
    location: 'Student Services Building, Room 230',
    hours: 'Mon–Thu 9am–5pm · Fri 9am–1pm · Application labs in October',
    phone: '(831) 555-0230',
    email: 'transfer@campus.edu',
    website: 'campus.edu/transfer',
    cost: 'Free · application fee waivers available',
    access: 'Appointment · drop-in during application season',
    firstStep: 'Meet a transfer counselor a full year before you plan to transfer.',
    keywords: ['transfer', 'uc', 'csu', 'four year', 'articulation', 'adt', 'assist', 'application', 'tag', 'university', 'transfer out'],
    tags: ['transfer', 'applications', 'articulation']
  },
  {
    id: 'graduation-office',
    name: 'Graduation & Records',
    category: 'transfer-grad',
    icon: '📜',
    blurb: 'Petition to graduate, transcripts, and degree audits.',
    description:
      'Handles the graduation petition (required — degrees are not awarded automatically), degree audits that show exactly what you still owe, transcripts, and enrollment verification letters for jobs, insurance, and scholarships.',
    audiences: ['continuing', 'transfer', 'grad', 'part-time', 'online'],
    location: 'Administration Building, Room 110',
    hours: 'Mon–Fri 8am–5pm',
    phone: '(831) 555-0111',
    email: 'records@campus.edu',
    website: 'campus.edu/records',
    cost: 'Free · $10 per official transcript',
    access: 'Online forms or walk in',
    firstStep: 'File the graduation petition the term before you finish, not after.',
    keywords: ['graduate', 'graduation', 'petition', 'transcript', 'diploma', 'degree audit', 'commencement', 'enrollment verification', 'records'],
    tags: ['graduation', 'transcripts', 'records']
  },
  {
    id: 'grad-school-prep',
    name: 'Graduate School Advising',
    category: 'transfer-grad',
    icon: '🔬',
    blurb: 'Applications, statements of purpose, and funding.',
    description:
      'For students heading to a master\'s or doctoral program: choosing programs, requesting letters of recommendation, drafting a statement of purpose, preparing for entrance exams, and finding assistantships and fellowships that cover tuition.',
    audiences: ['grad', 'continuing', 'transfer', 'first-gen'],
    location: 'Student Services Building, Room 235',
    hours: 'Tue–Thu 10am–4pm',
    phone: '(831) 555-0235',
    email: 'gradprep@campus.edu',
    website: 'campus.edu/grad-prep',
    cost: 'Free · fee waiver guidance available',
    access: 'Appointment',
    firstStep: 'Ask for recommendation letters at least six weeks before the deadline.',
    keywords: ['grad school', 'graduate school', 'masters', 'phd', 'gre', 'statement of purpose', 'recommendation letter', 'assistantship', 'fellowship', 'thesis', 'research'],
    tags: ['grad school', 'applications', 'funding']
  },

  // --------------------------------------------------------------------- tech
  {
    id: 'it-help',
    name: 'IT Help Desk',
    category: 'tech',
    icon: '💻',
    blurb: 'Logins, Wi-Fi, email, and free software.',
    description:
      'Password resets, campus Wi-Fi setup, student email, the learning management system, and free licenses for office software and creative tools. Support is available in person, by phone, and over chat.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'part-time', 'international'],
    location: 'Library, 1st Floor Tech Bar',
    hours: 'Mon–Thu 8am–8pm · Fri 8am–5pm · Sat 10am–2pm',
    phone: '(831) 555-0199',
    email: 'helpdesk@campus.edu',
    website: 'campus.edu/it',
    cost: 'Free',
    access: 'Walk in, phone, or chat',
    firstStep: 'Have your student ID number ready — it speeds up every request.',
    keywords: ['password', 'login', 'wifi', 'email', 'canvas', 'portal', 'software', 'office', 'account locked', 'tech support', 'printing', 'vpn'],
    tags: ['IT', 'accounts', 'software']
  },
  {
    id: 'device-loan',
    name: 'Laptop & Hotspot Loan Program',
    category: 'tech',
    icon: '🔌',
    blurb: 'Borrow a laptop or Wi-Fi hotspot for the whole term.',
    description:
      'Semester-long loans of laptops, Wi-Fi hotspots, calculators, and webcams at no cost. Priority goes to students receiving financial aid, but everyone can request and short-term loans are usually available same-day.',
    audiences: ['new', 'continuing', 'transfer', 'grad', 'online', 'part-time', 'first-gen', 'undocumented'],
    location: 'Library, Circulation Desk',
    hours: 'Mon–Thu 8am–8pm · Fri 8am–5pm',
    phone: '(831) 555-0172',
    email: 'deviceloan@campus.edu',
    website: 'campus.edu/device-loans',
    cost: 'Free · no deposit',
    access: 'Request form, pick up in person',
    firstStep: 'Submit the loan request at the start of the term — inventory goes fast.',
    keywords: ['laptop', 'computer', 'hotspot', 'wifi at home', 'no internet', 'borrow', 'chromebook', 'calculator', 'webcam', 'device', 'no computer'],
    tags: ['laptops', 'hotspots', 'loans']
  }
]

/**
 * Recurring campus deadlines. Stored as month/day so the demo stays accurate
 * over time — the app resolves each one to its next occurrence.
 */
export const DEADLINES = [
  { id: 'fafsa', title: 'FAFSA / CA Dream Act priority deadline', month: 3, day: 2, category: 'financial-aid', resourceId: 'financial-aid-office', note: 'The single most important date for aid. Filing late can cost you thousands in state grants.' },
  { id: 'scholarship-general', title: 'General scholarship application closes', month: 2, day: 1, category: 'scholarships', resourceId: 'scholarship-office', note: 'One application, 200+ awards. Most students who apply receive something.' },
  { id: 'fall-fees', title: 'Fall tuition and fees due', month: 8, day: 28, category: 'financial-aid', resourceId: 'cashier', note: 'Set up a payment plan before this date to avoid being dropped from classes.' },
  { id: 'add-drop', title: 'Last day to add or drop without a W', month: 9, day: 4, category: 'academic', resourceId: 'academic-advising', note: 'Talk to an advisor first — dropping below full-time affects aid and visas.' },
  { id: 'housing-priority', title: 'Priority housing application opens', month: 10, day: 1, category: 'housing', resourceId: 'housing-office', note: 'Assignments go in application-date order, so apply the day it opens.' },
  { id: 'grad-petition', title: 'Graduation petition deadline', month: 10, day: 15, category: 'transfer-grad', resourceId: 'graduation-office', note: 'Degrees are not awarded automatically. Missing this pushes you a full term.' },
  { id: 'uc-csu-apply', title: 'UC and CSU transfer applications close', month: 11, day: 30, category: 'transfer-grad', resourceId: 'transfer-center', note: 'Fee waivers are available — ask the Transfer Center before you pay.' },
  { id: 'spring-registration', title: 'Spring registration opens by appointment', month: 11, day: 3, category: 'academic', resourceId: 'academic-advising', note: 'Students with a completed education plan register first.' },
  { id: 'career-fair', title: 'Fall Career & Internship Fair', month: 9, day: 24, category: 'career', resourceId: 'career-center', note: 'Get a resume reviewed the week before — employers keep them.' },
  { id: 'sap-appeal', title: 'Financial aid appeal deadline (SAP)', month: 12, day: 12, category: 'financial-aid', resourceId: 'financial-aid-office', note: 'If your aid was suspended for grades or units, this is how you get it back.' }
]
