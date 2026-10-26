// ==============================================================================
// PRAGNYA ICSE 10TH - MIRACULOUS LADYBUG DATA CONFIG
// Exact ICSE Grade 10 Curriculum with Computer Applications as Group III Optional
// ==============================================================================

export const ICSE_SUBJECTS = [
  // GROUP I: COMPULSORY SUBJECTS
  {
    id: 'english-language',
    name: 'English Language',
    boardGroup: 'Group I (Compulsory)',
    paper: 'Paper 1',
    color: '#5F27CD', // Master Fu Violet
    badgeBg: 'rgba(95, 39, 205, 0.15)',
    icon: 'file-text',
    defaultMaxMarks: 80,
    chapters: [
      'Composition / Essay Writing (Narrative, Descriptive, Argumentative, Story)',
      'Letter Writing (Formal & Informal Letters)',
      'Notice & Email Writing',
      'Unseen Comprehension Passage & Summary Writing',
      'Functional Grammar: Prepositions & Phrasal Verbs',
      'Functional Grammar: Tenses & Verb Forms',
      'Functional Grammar: Transformation of Sentences'
    ]
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    boardGroup: 'Group I (Compulsory)',
    paper: 'Paper 2',
    color: '#9B59B6', // Rose Amethyst
    badgeBg: 'rgba(155, 89, 182, 0.15)',
    icon: 'book-open',
    defaultMaxMarks: 80,
    chapters: [
      'Julius Caesar: Act III Scene 1 (Caesar Assassination)',
      'Julius Caesar: Act III Scene 2 (Funeral Speeches - Antony & Brutus)',
      'Julius Caesar: Act III Scene 3 (Cinna the Poet)',
      'Julius Caesar: Act IV (Scenes 1-3: Quarrel Scene)',
      'Julius Caesar: Act V (Scenes 1-5: Battle of Philippi & Resolution)',
      'Treasure Trove Poems: Daffodils, The Patriot, Abou Ben Adhem, Nine Gold Medals',
      'Treasure Trove Stories: An Angel in Disguise, The Little Match Girl, The Blue Bead, My Greatest Olympic Prize'
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi',
    boardGroup: 'Group I (Compulsory)',
    paper: 'Second Language',
    color: '#FF6B6B', // Coral Pink
    badgeBg: 'rgba(255, 107, 107, 0.15)',
    icon: 'languages',
    defaultMaxMarks: 80,
    chapters: [
      'Sahitya Sagar (Gadya): Baat Athanni Ki, Kaki, Mahayagya Ka Puraskar, Netaji Ka Chashma',
      'Sahitya Sagar (Gadya): Apna Apna Bhagya, Bade Ghar Ki Beti, Bhedein Aur Bhediye',
      'Sahitya Sagar (Kavya): Saakhi (Kabir), Vinay Ke Pad (Tulsidas), Megh Aaye',
      'Sahitya Sagar (Kavya): Sur Ke Pad, Vinay Ke Pad, Chalna Hamara Kaam Hai',
      'Ekanki Sanchay: Sanskar Aur Bhavna, Bahu Ki Vida, Sukhi Dali, Deepdan',
      'Vyakaran: Vilom, Paryayvachi, Bhavvachak Sangya, Muhavare, Vakya Shudhi',
      'Rachna: Nibandh Lekhan & Patra Lekhan (Formal/Informal)'
    ]
  },
  {
    id: 'history-civics',
    name: 'History & Civics',
    boardGroup: 'Group I (Compulsory)',
    paper: 'H.C.G. Paper 1',
    color: '#EE5253', // Scarlet Red
    badgeBg: 'rgba(238, 82, 83, 0.15)',
    icon: 'landmark',
    defaultMaxMarks: 80,
    chapters: [
      'Civics: The Union Parliament (Lok Sabha & Rajya Sabha)',
      'Civics: The President & Vice-President',
      'Civics: Prime Minister & Council of Ministers',
      'Civics: The Supreme Court',
      'Civics: The High Courts & Subordinate Courts (Lok Adalats)',
      'History: The First War of Independence (1857)',
      'History: Growth of Nationalism & Early Nationalists',
      'History: Assertive Nationalism & Partition of Bengal',
      'History: Muslim League & Lucknow Pact',
      'History: Gandhian Era & National Movement (Non-Cooperation to Quit India)',
      'History: Forward Bloc, INA, Subhas Chandra Bose & Independence Act 1947',
      'History: First World War & Second World War',
      'History: United Nations, Major Agencies & Non-Aligned Movement (NAM)'
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    boardGroup: 'Group I (Compulsory)',
    paper: 'H.C.G. Paper 2',
    color: '#0ABDE3', // Marine Blue
    badgeBg: 'rgba(10, 189, 227, 0.15)',
    icon: 'globe',
    defaultMaxMarks: 80,
    chapters: [
      'Topographical Maps: Interpretation of Survey Sheets (G43S7/G43S10)',
      'Map of India: Mountains, Rivers, Plains, Latitudes, Mineral Distribution',
      'Climate of India: Monsoon Mechanisms, Seasons & Rainfall Distribution',
      'Soils of India: Alluvial, Black, Red & Laterite Soils + Soil Erosion & Conservation',
      'Natural Vegetation of India: Tropical Evergreen, Deciduous, Desert & Mangrove',
      'Water Resources: Irrigation Methods (Wells, Canals, Tanks, Drip/Sprinkler)',
      'Mineral & Energy Resources: Iron, Bauxite, Manganese + Coal, Petroleum, Solar/Wind',
      'Agriculture in India: Food Crops (Rice, Wheat, Millets, Pulses)',
      'Agriculture in India: Cash & Beverage Crops (Sugarcane, Cotton, Tea, Coffee)',
      'Manufacturing Industries: Agro-Based (Textiles, Sugar) & Mineral-Based (Iron & Steel)',
      'Transport in India: Roadways, Railways, Airways & Waterways (Advantages/Disadvantages)',
      'Waste Management: Impact, Methods of Disposal (Dumping, Composting, Incineration)'
    ]
  },

  // GROUP II: MATHEMATICS & SCIENCES
  {
    id: 'mathematics',
    name: 'Mathematics',
    boardGroup: 'Group II',
    paper: 'Mathematics',
    color: '#E51A4C', // Ladybug Crimson
    badgeBg: 'rgba(229, 26, 76, 0.15)',
    icon: 'calculator',
    defaultMaxMarks: 80,
    chapters: [
      'Commercial Mathematics: Goods and Services Tax (GST)',
      'Commercial Mathematics: Banking (Recurring Deposit Accounts)',
      'Commercial Mathematics: Shares and Dividends',
      'Algebra: Linear Inequations in One Variable',
      'Algebra: Quadratic Equations (Factorisation & Formula)',
      'Algebra: Quadratic Word Problems (Speed, Time, Geometry)',
      'Algebra: Ratio and Proportion (Componendo & Dividendo)',
      'Algebra: Remainder and Factor Theorems',
      'Algebra: Matrices (Addition, Subtraction, Multiplication)',
      'Algebra: Arithmetic Progression (nth term & Sum of n terms)',
      'Coordinate Geometry: Reflection (x-axis, y-axis, origin, invariant points)',
      'Coordinate Geometry: Section and Mid-Point Formula',
      'Coordinate Geometry: Equation of a Straight Line (Slope & Intercepts)',
      'Geometry: Similarity of Triangles (Scale Factor & Maps)',
      'Geometry: Circles (Angle & Tangent Properties, Intersecting Chords)',
      'Mensuration: Cylinder, Cone, Sphere & Combination of Solids',
      'Trigonometry: Trigonometric Identities & Proofs',
      'Trigonometry: Heights and Distances (Angle of Elevation & Depression)',
      'Statistics: Mean, Median, Mode (Histogram, Ogives & Quartiles)',
      'Probability: Single Event Problems (Cards, Coins, Dice)'
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    boardGroup: 'Group II (Science)',
    paper: 'Science Paper 1',
    color: '#00D2D3', // Miraculous Cyan
    badgeBg: 'rgba(0, 210, 211, 0.15)',
    icon: 'zap',
    defaultMaxMarks: 80,
    chapters: [
      'Force, Work, Power & Energy: Turning Effect, Moments & Couples',
      'Force, Work, Power & Energy: Uniform Circular Motion & Centripetal Force',
      'Force, Work, Power & Energy: Work Done, Kinetic & Potential Energy, Conservation',
      'Machines: Technical Terms, Lever Classes, Pulley Systems (VR, MA, Efficiency)',
      'Refraction of Light at Plane Surfaces: Laws, Refractive Index, Real/Apparent Depth',
      'Refraction of Light: Total Internal Reflection & Critical Angle (Prisms)',
      'Refraction through Lenses: Convex & Concave Ray Diagrams, Sign Convention, Lens Formula',
      'Spectrum: Dispersion through Prism, Electromagnetic Spectrum, Ultraviolet & Infrared',
      'Sound: Reflection of Sound Waves, Echoes & Sonar Calculations',
      'Sound: Natural, Damped, Forced Vibrations & Resonance',
      'Current Electricity: Ohm’s Law, Resistance, Factors Affecting Resistance, EMF & Terminal Voltage',
      'Current Electricity: Resistors in Series & Parallel, Internal Resistance',
      'Household Circuits: Live, Neutral, Earth, Fuses, Switches, Miniature Circuit Breakers',
      'Electromagnetism: Oersted’s Experiment, Right Hand Thumb Rule, Solenoids, Fleming’s Left Hand Rule',
      'Calorimetry: Heat Capacity, Specific Heat Capacity, Principle of Mixtures & Calculations',
      'Calorimetry: Latent Heat & Specific Latent Heat of Fusion of Ice',
      'Radioactivity: Atomic Structure, Alpha, Beta & Gamma Radiations (Properties & Hazards)',
      'Radioactivity: Nuclear Fission & Fusion, Background Radiations'
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    boardGroup: 'Group II (Science)',
    paper: 'Science Paper 2',
    color: '#FF9F43', // Miraculous Orange
    badgeBg: 'rgba(255, 159, 67, 0.15)',
    icon: 'flask-conical',
    defaultMaxMarks: 80,
    chapters: [
      'Periodic Properties: Atomic Size, Ionisation Potential, Electron Affinity, Electronegativity',
      'Chemical Bonding: Electrovalent, Covalent & Coordinate Bonding (Lewis Dot Structures)',
      'Acids, Bases and Salts: Definitions, Properties, Preparation of Salts & Action of Heat',
      'Analytical Chemistry: Action of NaOH & NH4OH on Metallic Salt Solutions (Precipitate Colors)',
      'Mole Concept & Stoichiometry: Gay-Lussac’s Law, Avogadro’s Law, Vapor Density & Empirical Formula',
      'Mole Concept: Stoichiometric Calculations from Chemical Equations',
      'Electrolysis: Electrolytes, Electrodes, Mechanism & Preferential Discharge of Ions',
      'Electrolysis: Applications (Electroplating, Electro-refining, Extraction of Aluminium / Hall-Heroult)',
      'Metallurgy: Minerals & Ores, Concentration, Roasting, Calcination, Reduction & Refining',
      'Study of Compounds: Hydrogen Chloride (Preparation, Fountain Experiment, Properties)',
      'Study of Compounds: Ammonia (Haber’s Process, Fountain Experiment, Reducing Properties)',
      'Study of Compounds: Nitric Acid (Ostwald’s Process, Oxidising Agent Reactions)',
      'Study of Compounds: Sulphuric Acid (Contact Process, Dehydrating & Oxidising Properties)',
      'Organic Chemistry: IUPAC Nomenclature (Alkanes, Alkenes, Alkynes, Alcohols, Aldehydes, Acids)',
      'Organic Chemistry: Hydrocarbons (Methane, Ethane, Ethene, Ethyne - Preparation & Reactions)',
      'Organic Chemistry: Alcohols (Ethanol) & Carboxylic Acids (Ethanoic Acid)'
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    boardGroup: 'Group II (Science)',
    paper: 'Science Paper 3',
    color: '#10AC84', // Plagg Emerald
    badgeBg: 'rgba(16, 172, 132, 0.15)',
    icon: 'dna',
    defaultMaxMarks: 80,
    chapters: [
      'Basic Biology: Cell Cycle, Mitosis (Stages & Diagrams) & Meiosis Significance',
      'Basic Biology: Structure of Chromosome, DNA & Genes',
      'Genetics: Mendel’s Laws of Inheritance, Monohybrid & Dihybrid Crosses, Sex Determination',
      'Plant Physiology: Absorption by Roots, Imbibition, Diffusion, Osmosis & Turgidity',
      'Plant Physiology: Transpiration (Mechanism, Factors, Experiments & Guttation)',
      'Plant Physiology: Photosynthesis (Light & Dark Reactions, Factors & Chlorophyll Experiments)',
      'Human Anatomy: Circulatory System (Blood Components, Heart Structure, Cardiac Cycle, Double Circulation)',
      'Human Anatomy: Excretory System (Kidney Anatomy, Nephron Structure, Urine Formation)',
      'Human Anatomy: Nervous System (Neuron, Brain Parts & Functions, Reflex Arc, Spinal Cord)',
      'Human Anatomy: Sense Organs (Eye Defects & Corrections, Ear Structure & Balance)',
      'Human Anatomy: Endocrine System (Pituitary, Thyroid, Adrenal, Pancreas Hormones & Disorders)',
      'Human Anatomy: Reproductive System (Male & Female Anatomy, Menstrual Cycle)',
      'Population & Pollution: Population Explosion & Control, Environmental Pollution Categories'
    ]
  },

  // GROUP III: PRAGNYA'S OPTIONAL / ELECTIVE SUBJECT
  {
    id: 'computer-applications',
    name: 'Computer Applications (Optional)',
    boardGroup: 'Group III (Optional / Elective)',
    paper: 'Elective (Theory 100 + Practical 100)',
    color: '#00F59B', // Cat Noir Neon Green
    badgeBg: 'rgba(0, 245, 155, 0.15)',
    icon: 'terminal',
    defaultMaxMarks: 100, // ICSE Board Theory Paper is 100 marks!
    chapters: [
      'Revision of Class IX Java & Object-Oriented Programming (OOP) Principles',
      'Class as the Basis of all Computation (Objects, State, Behavior & Blueprints)',
      'User-Defined Methods: Definition, Method Signature, Return Types & Calling Mechanisms',
      'User-Defined Methods: Pass by Value vs Pass by Reference (Pure vs Impure Methods)',
      'User-Defined Methods: Method Overloading (Polymorphism in Java)',
      'Constructors: Default, Parameterized, Constructor Overloading & `this` Keyword',
      'Library Classes: Wrapper Classes (`Integer`, `Double`, `Character`, Autoboxing/Unboxing)',
      'Character Functions: `isLetter()`, `isDigit()`, `isLetterOrDigit()`, `isWhitespace()`, `toUpperCase()`, `toLowerCase()`',
      'Encapsulation: Scope of Variables (Local, Instance & Class / Static Variables)',
      'Arrays: Single Dimensional Arrays (Creation, Traversal, Memory Allocation)',
      'Arrays: Linear Search & Binary Search Algorithms',
      'Arrays: Bubble Sort & Selection Sort Algorithms',
      'Arrays: Double Dimensional Arrays (Matrix Addition, Diagonal Elements, Row/Column Sum)',
      'String Handling: String Immutability, `length()`, `charAt()`, `indexOf()`, `substring()`',
      'String Handling: `equals()`, `equalsIgnoreCase()`, `compareTo()`, `trim()`, `replace()`',
      'String Handling: Word Extraction, Palindrome Strings, Piglatin, Tokenizing & Character Frequency',
      'ICSE Section B Java Program Writing Practice (15-mark structured programs)'
    ]
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
  { quote: "Spots on, Pragnya! Every hour studied is a superpower unlocked for 10th ICSE!", author: "Ladybug (Marinette)" },
  { quote: "No Akuma (stress) allowed! Focus on one chapter at a time and you'll conquer the board exams!", author: "Tikki" },
  { quote: "Pound it! 👊 Hard work today turns into 95%+ on ICSE results day!", author: "Cat Noir & Ladybug" },
  { quote: "Lucky Charm! Your greatest weapon is consistency in solving specimen papers!", author: "Ladybug" },
  { quote: "Claws out! Ace those Computer Applications Java programs with zero bugs!", author: "Cat Noir" },
  { quote: "Believe in your preparation. There is always a way to victory!", author: "Master Fu" }
];
