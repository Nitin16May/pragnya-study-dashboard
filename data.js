// ==============================================================================
// PRAGNYA ICSE 10TH - MIRACULOUS LADYBUG DATA CONFIG & SAMPLE DATA
// ==============================================================================

export const ICSE_SUBJECTS = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    group: 'Group II',
    color: '#E51A4C', // Ladybug Crimson
    badgeBg: 'rgba(229, 26, 76, 0.15)',
    icon: 'calculator',
    defaultMaxMarks: 80,
    chapters: ['GST & Banking', 'Quadratic Equations', 'Matrices', 'Arithmetic Progression', 'Similarity', 'Circles', 'Trigonometry', 'Mensuration', 'Statistics & Ogives', 'Probability']
  },
  {
    id: 'physics',
    name: 'Physics',
    group: 'Science (Paper 1)',
    color: '#00D2D3', // Miraculous Cyan
    badgeBg: 'rgba(0, 210, 211, 0.15)',
    icon: 'zap',
    defaultMaxMarks: 80,
    chapters: ['Force, Work, Power & Energy', 'Light: Refraction at Plane Surfaces', 'Refraction through Lenses', 'Spectrum', 'Sound & Echoes', 'Current Electricity & Household Circuits', 'Electromagnetism', 'Calorimetry', 'Radioactivity']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    group: 'Science (Paper 2)',
    color: '#FF9F43', // Miraculous Orange
    badgeBg: 'rgba(255, 159, 67, 0.15)',
    icon: 'flask-conical',
    defaultMaxMarks: 80,
    chapters: ['Periodic Properties', 'Chemical Bonding', 'Acids, Bases & Salts', 'Analytical Chemistry', 'Mole Concept & Stoichiometry', 'Electrolysis', 'Metallurgy', 'Study of Compounds (HCl, NH3, HNO3, H2SO4)', 'Organic Chemistry']
  },
  {
    id: 'biology',
    name: 'Biology',
    group: 'Science (Paper 3)',
    color: '#10AC84', // Plagg Emerald
    badgeBg: 'rgba(16, 172, 132, 0.15)',
    icon: 'dna',
    defaultMaxMarks: 80,
    chapters: ['Cell Cycle & Cell Division', 'Genetics & Mendel Laws', 'Absorption by Roots', 'Transpiration', 'Photosynthesis', 'Circulatory System', 'Excretory System', 'Nervous System & Sense Organs', 'Endocrine System', 'Reproductive System', 'Pollution']
  },
  {
    id: 'english-language',
    name: 'English Language',
    group: 'Group I (Paper 1)',
    color: '#5F27CD', // Master Fu Violet
    badgeBg: 'rgba(95, 39, 205, 0.15)',
    icon: 'file-text',
    defaultMaxMarks: 80,
    chapters: ['Essay / Composition Writing', 'Letter Writing (Formal & Informal)', 'Notice & Email Writing', 'Unseen Comprehension & Summary', 'Grammar & Transformations']
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    group: 'Group I (Paper 2)',
    color: '#9B59B6', // Rose Amethyst
    badgeBg: 'rgba(155, 89, 182, 0.15)',
    icon: 'book-open',
    defaultMaxMarks: 80,
    chapters: ['Julius Caesar - Act III', 'Julius Caesar - Act IV', 'Julius Caesar - Act V', 'Treasure Trove - Poems', 'Treasure Trove - Short Stories']
  },
  {
    id: 'hindi',
    name: 'Hindi',
    group: 'Group I (Second Language)',
    color: '#FF6B6B', // Coral Pink
    badgeBg: 'rgba(255, 107, 107, 0.15)',
    icon: 'languages',
    defaultMaxMarks: 80,
    chapters: ['Sahitya Sagar - Gadya Sankalan', 'Sahitya Sagar - Kavya Sankalan', 'Ekanki Sanchay', 'Vyakaran (Grammar)', 'Prabandh & Patra Lekhan']
  },
  {
    id: 'history-civics',
    name: 'History & Civics',
    group: 'H.C.G. (Paper 1)',
    color: '#EE5253', // Scarlet Red
    badgeBg: 'rgba(238, 82, 83, 0.15)',
    icon: 'landmark',
    defaultMaxMarks: 80,
    chapters: ['First War of Independence (1857)', 'Early Nationalists & Assertives', 'Muslim League & Gandhian Era', 'Quit India & Independence', 'First & Second World Wars', 'United Nations & NAM', 'Union Parliament', 'President & Prime Minister', 'Supreme Court & High Courts']
  },
  {
    id: 'geography',
    name: 'Geography',
    group: 'H.C.G. (Paper 2)',
    color: '#0ABDE3', // Marine Blue
    badgeBg: 'rgba(10, 189, 227, 0.15)',
    icon: 'globe',
    defaultMaxMarks: 80,
    chapters: ['Topographical Maps (Survey of India)', 'Map of India Location Work', 'Climate of India', 'Soils of India', 'Natural Vegetation', 'Water Resources & Irrigation', 'Mineral & Energy Resources', 'Agriculture in India', 'Manufacturing Industries', 'Transport', 'Waste Management']
  },
  {
    id: 'computer-applications',
    name: 'Computer Applications',
    group: 'Group III (Elective)',
    color: '#00F59B', // Cat Noir Neon Green
    badgeBg: 'rgba(0, 245, 155, 0.15)',
    icon: 'terminal',
    defaultMaxMarks: 100,
    chapters: ['OOP Principles & Java Basics', 'Class as Basis of Computation', 'User-Defined Methods', 'Constructors', 'Library Classes & Wrapper Classes', 'Encapsulation & Arrays (1D & 2D)', 'String Handling & Algorithms']
  }
];

export const STUDY_TYPES = [
  { id: 'Self Study', label: '📖 Self Study / Textbook Reading' },
  { id: 'Problem Solving', label: '✏️ Numerical / Exercise Solving' },
  { id: 'Revision', label: '🔄 Quick Revision & Formula Recall' },
  { id: 'Sample Paper', label: '⏱️ Sample Paper / Specimen Solving' },
  { id: 'Doubts Clearing', label: '❓ Doubt Clearing & Video Lessons' },
  { id: 'School Homework', label: '📝 School Assignments / Project' }
];

export const LADYBUG_QUOTES = [
  { quote: "Spots on, Pragnya! Every hour studied is a superpower unlocked!", author: "Ladybug (Marinette)" },
  { quote: "No Akuma (stress) allowed! Focus on one concept at a time and you'll ace ICSE!", author: "Tikki" },
  { quote: "Pound it! 👊 Hard work today turns into 95%+ on board results day!", author: "Cat Noir & Ladybug" },
  { quote: "Lucky Charm! Your secret weapon is consistency and revision!", author: "Ladybug" },
  { quote: "Claws out! Solve those sample papers with lightning speed and precision!", author: "Cat Noir" },
  { quote: "There's always a way when you keep calm and believe in your prep!", author: "Master Fu" }
];

// Helper to get past date string (YYYY-MM-DD)
function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Realistic initial demo study sessions for Pragnya
export const SAMPLE_STUDY_SESSIONS = [
  {
    id: 'sample-1',
    student_name: 'Pragnya',
    subject: 'Mathematics',
    chapter_topic: 'Circles - Theorems & Tangents',
    duration_minutes: 90,
    study_date: getPastDate(0),
    study_type: 'Problem Solving',
    efficiency_rating: 5,
    notes: 'Solved 15 board questions from ML Aggarwal. Perfect grasp on alternate segment theorem!'
  },
  {
    id: 'sample-2',
    student_name: 'Pragnya',
    subject: 'Physics',
    chapter_topic: 'Light - Refraction through Lenses',
    duration_minutes: 75,
    study_date: getPastDate(0),
    study_type: 'Revision',
    efficiency_rating: 4,
    notes: 'Drew ray diagrams for convex lens; revised sign conventions and lens formula.'
  },
  {
    id: 'sample-3',
    student_name: 'Pragnya',
    subject: 'Computer Applications',
    chapter_topic: 'String Handling Algorithms',
    duration_minutes: 60,
    study_date: getPastDate(1),
    study_type: 'Self Study',
    efficiency_rating: 5,
    notes: 'Practiced palindrome, word count, and frequency array programs in Java.'
  },
  {
    id: 'sample-4',
    student_name: 'Pragnya',
    subject: 'Chemistry',
    chapter_topic: 'Organic Chemistry - Alkanes & Alkenes',
    duration_minutes: 80,
    study_date: getPastDate(1),
    study_type: 'Problem Solving',
    efficiency_rating: 4,
    notes: 'Wrote all IUPAC nomenclatures and addition reactions for ethylene and acetylene.'
  },
  {
    id: 'sample-5',
    student_name: 'Pragnya',
    subject: 'History & Civics',
    chapter_topic: 'Union Parliament & President',
    duration_minutes: 70,
    study_date: getPastDate(2),
    study_type: 'Revision',
    efficiency_rating: 5,
    notes: 'Memorized powers of Lok Sabha vs Rajya Sabha, electoral college for President.'
  },
  {
    id: 'sample-6',
    student_name: 'Pragnya',
    subject: 'Biology',
    chapter_topic: 'Circulatory System & Blood Vessels',
    duration_minutes: 90,
    study_date: getPastDate(2),
    study_type: 'Self Study',
    efficiency_rating: 4,
    notes: 'Drew structure of heart, double circulation diagram, and memorized blood groups.'
  },
  {
    id: 'sample-7',
    student_name: 'Pragnya',
    subject: 'Mathematics',
    chapter_topic: 'Quadratic Equations & Word Problems',
    duration_minutes: 105,
    study_date: getPastDate(3),
    study_type: 'Problem Solving',
    efficiency_rating: 5,
    notes: 'Speed-distance and pipe-cistern problems solved accurately!'
  },
  {
    id: 'sample-8',
    student_name: 'Pragnya',
    subject: 'Geography',
    chapter_topic: 'Topographical Maps & Contours',
    duration_minutes: 60,
    study_date: getPastDate(3),
    study_type: 'Sample Paper',
    efficiency_rating: 4,
    notes: 'Solved 2 topo sheets; 4-figure and 6-figure grid references 100% accurate.'
  },
  {
    id: 'sample-9',
    student_name: 'Pragnya',
    subject: 'English Literature',
    chapter_topic: 'Julius Caesar - Act III Scene 2 (Antony Speech)',
    duration_minutes: 75,
    study_date: getPastDate(4),
    study_type: 'Self Study',
    efficiency_rating: 5,
    notes: 'Analyzed rhetorical questions in Antony speech; noted key quote keywords.'
  },
  {
    id: 'sample-10',
    student_name: 'Pragnya',
    subject: 'Physics',
    chapter_topic: 'Calorimetry & Principle of Mixtures',
    duration_minutes: 85,
    study_date: getPastDate(4),
    study_type: 'Problem Solving',
    efficiency_rating: 4,
    notes: 'Heat capacity problems; paid special attention to heat loss to surroundings.'
  },
  {
    id: 'sample-11',
    student_name: 'Pragnya',
    subject: 'Chemistry',
    chapter_topic: 'Electrolysis & Metallurgy',
    duration_minutes: 90,
    study_date: getPastDate(5),
    study_type: 'Revision',
    efficiency_rating: 5,
    notes: "Hall-Heroult process and electroplating equations memorized."
  },
  {
    id: 'sample-12',
    student_name: 'Pragnya',
    subject: 'English Language',
    chapter_topic: 'Prepositions & Sentence Transformations',
    duration_minutes: 50,
    study_date: getPastDate(5),
    study_type: 'Problem Solving',
    efficiency_rating: 4,
    notes: 'Attempted 40 transformation exercises (Total English Grade 10).'
  },
  {
    id: 'sample-13',
    student_name: 'Pragnya',
    subject: 'Mathematics',
    chapter_topic: 'Trigonometric Identities & Heights & Distances',
    duration_minutes: 110,
    study_date: getPastDate(6),
    study_type: 'Problem Solving',
    efficiency_rating: 5,
    notes: 'Double angle-of-elevation problems; simplified algebraic proofs.'
  },
  {
    id: 'sample-14',
    student_name: 'Pragnya',
    subject: 'Hindi',
    chapter_topic: 'Sahitya Sagar - Baat Athanni Ki & Vyakaran',
    duration_minutes: 60,
    study_date: getPastDate(6),
    study_type: 'Revision',
    efficiency_rating: 4,
    notes: 'Character sketch of Rasila and Babu Jagat Singh + Muhavare practice.'
  }
];

// Realistic initial demo mock test marks for Pragnya
export const SAMPLE_MOCK_MARKS = [
  {
    id: 'mock-1',
    student_name: 'Pragnya',
    subject: 'Mathematics',
    paper_name: 'Oswaal Specimen Mock Paper 1',
    test_date: getPastDate(1),
    marks_obtained: 74,
    max_marks: 80,
    percentage: 92.5,
    time_taken_minutes: 140,
    weak_areas: 'Calculation slip in Ogive median estimation (lost 2 marks).',
    strong_areas: 'Circles tangents theorem and Quadratic word problems 100% correct!',
    notes: 'Excellent speed. Finished 10 minutes early with thorough re-checking.'
  },
  {
    id: 'mock-2',
    student_name: 'Pragnya',
    subject: 'Physics',
    paper_name: 'Educart ICSE 2026 Sample Paper 1',
    test_date: getPastDate(3),
    marks_obtained: 71,
    max_marks: 80,
    percentage: 88.75,
    time_taken_minutes: 115,
    weak_areas: 'Radioactivity decay equations and nuclear reaction balance.',
    strong_areas: 'Refraction through prisms and work-energy power numericals.',
    notes: 'Review Alpha/Beta decay rules before next test.'
  },
  {
    id: 'mock-3',
    student_name: 'Pragnya',
    subject: 'Computer Applications',
    paper_name: 'School Pre-board Practice Paper',
    test_date: getPastDate(5),
    marks_obtained: 96,
    max_marks: 100,
    percentage: 96.0,
    time_taken_minutes: 110,
    weak_areas: 'Minor variable scope question in Section A.',
    strong_areas: 'Section B Java programs: String manipulation & 2D array matrix transpose.',
    notes: 'Phenomenal result! Plagg & Ladybug would be proud!'
  },
  {
    id: 'mock-4',
    student_name: 'Pragnya',
    subject: 'Chemistry',
    paper_name: 'CISCE Specimen Paper 2026',
    test_date: getPastDate(7),
    marks_obtained: 72,
    max_marks: 80,
    percentage: 90.0,
    time_taken_minutes: 120,
    weak_areas: 'Observations in analytical chemistry test tube reactions.',
    strong_areas: 'Mole concept calculations and Organic Chemistry isomerism.',
    notes: 'Remember precipitate colors: Fe2+ dirty green, Fe3+ reddish brown.'
  },
  {
    id: 'mock-5',
    student_name: 'Pragnya',
    subject: 'History & Civics',
    paper_name: 'Educart Mock Test 2',
    test_date: getPastDate(9),
    marks_obtained: 75,
    max_marks: 80,
    percentage: 93.75,
    time_taken_minutes: 115,
    weak_areas: 'Treaty of Versailles specific territorial loss clauses.',
    strong_areas: 'Judiciary (Supreme Court original & appellate jurisdiction).',
    notes: 'Structured point-wise answers were awarded full marks.'
  },
  {
    id: 'mock-6',
    student_name: 'Pragnya',
    subject: 'Biology',
    paper_name: 'School Unit Assessment Mock',
    test_date: getPastDate(11),
    marks_obtained: 73,
    max_marks: 80,
    percentage: 91.25,
    time_taken_minutes: 120,
    weak_areas: 'Endocrine hormones target organ matching.',
    strong_areas: 'Photosynthesis light & dark phase flowcharts.',
    notes: 'Neat labeled diagrams earned all diagrammatic marks.'
  }
];
