import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlacementStepper } from '../components/PlacementStepper';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Building2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  HelpCircle,
  Briefcase,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Globe,
  Award,
  Zap
} from 'lucide-react';

export const top100CompaniesDataset = [
  // 1-10: IT Service Giants
  {
    name: 'TCS (Tata Consultancy Services)',
    shortName: 'TCS',
    category: 'IT Services & Consulting',
    headquarters: 'Mumbai, Maharashtra, India',
    employees: '600,000+ Worldwide',
    package: '₹3.36 LPA (Ninja) | ₹7.00 LPA (Digital) | ₹11.50 LPA (Prime)',
    difficulty: 'Medium',
    about: [
      'India’s largest IT exporter and flagship software services company of Tata Group.',
      'Operates across 55+ countries serving 1,000+ global enterprise clients.',
      'Primary campus hiring tracks: TCS Ninja, TCS Digital, and TCS Prime.'
    ],
    productsServices: [
      'TCS BaNCS (Core Banking Solution used by 450+ financial institutions).',
      'Ignio (AI-driven autonomous IT operations platform).',
      'Enterprise Cloud Migration, Cybersecurity & Application Modernization.'
    ],
    techStack: [
      'Java & Spring Boot',
      'SQL / Oracle / PostgreSQL',
      'Python & Machine Learning',
      'React & Angular Frontend',
      'AWS / Azure Cloud Systems'
    ],
    roles: [
      'Associate Software Engineer (Ninja Band)',
      'Digital Systems Engineer (Digital Band)',
      'Prime R&D Architect (Prime Band)'
    ],
    recruitmentProcess: [
      'Round 1: TCS NQT Online Test (120 mins - Quant, Verbal, Logic, Pseudocode & Coding)',
      'Round 2: Technical Interview (35 mins - Projects, SQL Joins, OOPs, Data Structures)',
      'Round 3: Managerial & HR Interview (20 mins - Behavioral & Relocation Check)'
    ],
    interviewTopics: [
      'SQL Joins, Indexing & Group By aggregations',
      'OOPs 4 Pillars (Encapsulation, Inheritance, Polymorphism, Abstraction)',
      'Array manipulation & String reversal algorithms'
    ]
  },
  {
    name: 'Infosys',
    shortName: 'Infosys',
    category: 'IT & Digital Services',
    headquarters: 'Bengaluru, Karnataka, India',
    employees: '320,000+ Worldwide',
    package: '₹3.60 LPA (SE) | ₹6.50 LPA (DSE) | ₹9.50 LPA (Power Programmer)',
    difficulty: 'Medium-Hard',
    about: [
      'Global leader in next-generation digital services and consulting.',
      'Offers specialized hiring tracks: Systems Engineer (SE), Digital Specialist Engineer (DSE), and Specialist Programmer (SP).',
      'State-of-the-art Mysore Global Education Center for graduate onboarding.'
    ],
    productsServices: [
      'Finacle (Core Banking Solution for global financial systems).',
      'Infosys Topaz (AI-first suite leveraging generative AI).',
      'Infosys Cobalt (Enterprise cloud suite).'
    ],
    techStack: [
      'Python 3',
      'C++ / C Core',
      'Java Microservices',
      'Pseudocode & Bitwise Logic',
      'Relational DBMS'
    ],
    roles: [
      'Systems Engineer (SE)',
      'Digital Specialist Engineer (DSE)',
      'Specialist Programmer (Power Programmer)'
    ],
    recruitmentProcess: [
      'Round 1: Online Assessment (100 mins - Quant, Reasoning, Verbal, Pseudocode & Puzzles)',
      'Round 2: Technical + HR Interview (40 mins - Project architecture & Pseudocode tracing)'
    ],
    interviewTopics: [
      'Pseudocode loop counter outputs & pointer bitwise XOR operations',
      'Binary Search Tree (BST) traversals & recursion',
      'Normalizing database schemas to 3NF'
    ]
  },
  {
    name: 'Accenture',
    shortName: 'Accenture',
    category: 'Global Tech Consulting',
    headquarters: 'Dublin, Ireland / Bengaluru, India',
    employees: '730,000+ Worldwide',
    package: '₹4.50 LPA (ASE) | ₹6.50 LPA (FSE)',
    difficulty: 'Medium',
    about: [
      'Fortune Global 500 professional services company in strategy, consulting, and cloud.',
      'Massive campus recruitment for Associate Software Engineer (ASE) and Full Stack Engineer (FSE).',
      'Special emphasis on cognitive agility and English communication skills.'
    ],
    productsServices: [
      'Accenture Cloud First Solutions.',
      'Enterprise Technology Strategy & SAP S/4HANA Implementations.',
      'Applied Intelligence & Generative AI Practice.'
    ],
    techStack: [
      'Python',
      'Java Frameworks',
      'Cloud Fundamentals (AWS/Azure)',
      'HTML5/CSS3/JavaScript',
      'SQL Querying'
    ],
    roles: [
      'Associate Software Engineer (ASE)',
      'Advanced Application Engineering Analyst (FSE)'
    ],
    recruitmentProcess: [
      'Round 1: Cognitive & Technical Test (90 mins - Reasoning, MS Office, Pseudocode & Cloud)',
      'Round 2: Hands-On Coding Test (45 mins - 2 Coding Problems)',
      'Round 3: Communication Test (20 mins - Automated Reading/Speaking Evaluation)',
      'Round 4: Technical & HR Interview (25 mins - Resume projects & situational scenarios)'
    ],
    interviewTopics: [
      'Cloud computing service models (IaaS, PaaS, SaaS)',
      'Basic array sorting & string anagram problems',
      'Situation-based STAR behavioral stories'
    ]
  },
  {
    name: 'Wipro',
    shortName: 'Wipro',
    category: 'IT Services & Consulting',
    headquarters: 'Bengaluru, Karnataka, India',
    employees: '240,000+ Worldwide',
    package: '₹3.50 LPA (NLTH Project Engineer) | ₹6.50 LPA (Turbo)',
    difficulty: 'Medium',
    about: [
      'Leading global information technology, consulting, and business process services company.',
      'Recruits through Elite National Talent Hunt (NLTH) and Wipro Turbo hiring tracks.'
    ],
    productsServices: [
      'Wipro HOLMES (Artificial Intelligence Platform).',
      'Cybersecurity & Risk Services.',
      'Digital Transformation & Engineering Services.'
    ],
    techStack: [
      'C / C++',
      'Java Core',
      'Python',
      'Data Structures & Algorithms',
      'MySQL'
    ],
    roles: [
      'Project Engineer (Elite NLTH)',
      'Turbo Senior Engineer (Turbo Track)'
    ],
    recruitmentProcess: [
      'Round 1: Wipro Elite NLTH Test (120 mins - Aptitude, Essay Writing & 2 Coding Questions)',
      'Round 2: Technical Interview (30 mins - Data structures, C/Java concepts, SQL)',
      'Round 3: HR Interview (15 mins - Communication & flexibility verification)'
    ],
    interviewTopics: [
      'Essay writing grammar & concise argument structure',
      'Pointer arithmetic & memory management in C',
      'Primary key vs Unique key vs Candidate key differences'
    ]
  },
  {
    name: 'Cognizant (CTS)',
    shortName: 'Cognizant',
    category: 'IT Services & Digital Engineering',
    headquarters: 'Teaneck, New Jersey, USA / Chennai, India',
    employees: '340,000+ Worldwide',
    package: '₹4.00 LPA (GenC) | ₹6.75 LPA (GenC Elevate) | ₹12.00 LPA (GenC Next)',
    difficulty: 'Medium-Hard',
    about: [
      'Leading provider of IT, consulting, and business process services.',
      'Offers GenC, GenC Elevate, and GenC Next hiring tiers for engineering graduates.'
    ],
    productsServices: [
      'Cognizant Neuro (Automated IT operations).',
      'Healthcare & Life Sciences Digital Platforms.',
      'Cloud Data Modernization & DevOps Solutions.'
    ],
    techStack: [
      'Java & Spring Boot',
      'Python',
      'SQL / DBMS',
      'Data Structures (Trees, Graphs)',
      'React.js'
    ],
    roles: [
      'GenC Programmer Analyst Trainee',
      'GenC Elevate Full Stack Developer',
      'GenC Next R&D Specialist'
    ],
    recruitmentProcess: [
      'Round 1: Skill Based Assessment (100 mins - Aptitude & Coding)',
      'Round 2: Technical Interview (45 mins - Live coding, OOPs, DBMS)',
      'Round 3: HR Interview (20 mins)'
    ],
    interviewTopics: [
      'Linked List reversal & cycle detection',
      'Spring Boot REST API annotations (@RestController, @Autowired)',
      'SQL GROUP BY and HAVING clause filtering'
    ]
  },
  {
    name: 'Google',
    shortName: 'Google',
    category: 'Product & Big Tech (FAANG)',
    headquarters: 'Mountain View, California, USA / Bengaluru & Hyderabad, India',
    employees: '180,000+ Worldwide',
    package: '₹18.00 LPA - ₹35.00 LPA (Software Engineer L3)',
    difficulty: 'Hard',
    about: [
      'Global technology leader in search, cloud computing, AI, hardware, and advertising.',
      'Recruits fresh graduates via Google Girl Hackathon, Kick Start, and University On-Campus Drives.'
    ],
    productsServices: [
      'Google Search, Android OS, YouTube, Google Cloud Platform (GCP).',
      'Gemini AI & DeepMind Research.',
      'Google Workspace & Hardware (Pixel devices).'
    ],
    techStack: [
      'C++',
      'Python',
      'Java',
      'Go (Golang)',
      'Distributed Systems & Algorithms'
    ],
    roles: [
      'Software Engineer (L3 Entry Level)',
      'Associate Product Manager (APM)',
      'Site Reliability Engineer (SRE)'
    ],
    recruitmentProcess: [
      'Round 1: Online Coding Challenge (2 Problems - 90 mins)',
      'Round 2-4: Technical Telephonic / Onsite Interviews (45 mins each - DS/Algo focus)',
      'Round 5: Googleyness & Leadership Behavioral Interview'
    ],
    interviewTopics: [
      'Dynamic Programming & Graph algorithms (Dijkstra, BFS/DFS)',
      'Time & Space Complexity analysis',
      'System Design scalability & distributed caching'
    ]
  },
  {
    name: 'Microsoft',
    shortName: 'Microsoft',
    category: 'Product & Big Tech (FAANG)',
    headquarters: 'Redmond, Washington, USA / Bengaluru & Hyderabad, India',
    employees: '220,000+ Worldwide',
    package: '₹16.00 LPA - ₹28.00 LPA (Software Development Engineer 1)',
    difficulty: 'Hard',
    about: [
      'Leading developer of software, consumer electronics, personal computers, and cloud services.',
      'Recruits through Microsoft Engage, Codess, and University Campus Hiring.'
    ],
    productsServices: [
      'Microsoft Azure Cloud Platform.',
      'Windows OS, Microsoft 365, GitHub, LinkedIn, Xbox.',
      'Copilot AI & OpenAI Strategic Partnership.'
    ],
    techStack: [
      'C# / .NET',
      'C++',
      'TypeScript / React',
      'Python',
      'Azure Cloud & Microservices'
    ],
    roles: [
      'Software Development Engineer 1 (SDE-1)',
      'Data Scientist',
      'Support Engineer'
    ],
    recruitmentProcess: [
      'Round 1: Online Coding Test (3 Problems - 90 mins on Codility/HackerRank)',
      'Round 2-3: Technical Interviews (DS, Algo, System Design basics)',
      'Round 4: AA (As Appropriate) Senior Director Behavioral Interview'
    ],
    interviewTopics: [
      'Trees, Tries, and Binary Search Algorithms',
      'Memory management, garbage collection, and thread safety',
      'Low-Level System Design (Object Oriented Design Patterns)'
    ]
  },
  {
    name: 'Amazon',
    shortName: 'Amazon',
    category: 'Product & E-Commerce / Cloud (FAANG)',
    headquarters: 'Seattle, Washington, USA / Bengaluru & Hyderabad, India',
    employees: '1,500,000+ Worldwide',
    package: '₹16.00 LPA - ₹30.00 LPA (SDE-1)',
    difficulty: 'Hard',
    about: [
      'Global leader in e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
      'Famous for strict evaluation against 16 Leadership Principles.'
    ],
    productsServices: [
      'Amazon Web Services (AWS - 32% global cloud market share).',
      'Amazon E-Commerce Marketplace & Prime.',
      'Alexa Voice Assistant & Kuiper Satellite Network.'
    ],
    techStack: [
      'Java Core & Spring',
      'C++',
      'Python',
      'AWS (DynamoDB, S3, Lambda, EC2)',
      'Distributed Systems'
    ],
    roles: [
      'Software Development Engineer I (SDE-1)',
      'Quality Assurance Engineer (QAE)',
      'Cloud Support Engineer'
    ],
    recruitmentProcess: [
      'Round 1: Online Assessment (OA1 Debugging, OA2 2 Coding Qs, OA3 Work Simulation)',
      'Round 2-4: Virtual Onsite Technical Interviews (Coding + Leadership Principles)',
      'Round 5: Bar Raiser Interview'
    ],
    interviewTopics: [
      'Arrays, HashMaps, Sliding Window & Heap Priority Queues',
      'STAR Method answers mapped to 16 Leadership Principles (Customer Obsession, Ownership)',
      'Object Oriented Design (Design Parking Lot, Elevator System)'
    ]
  },
  {
    name: 'Capgemini',
    shortName: 'Capgemini',
    category: 'IT Services & Consulting',
    headquarters: 'Paris, France / Mumbai & Bengaluru, India',
    employees: '350,000+ Worldwide',
    package: '₹4.00 LPA (Analyst) | ₹7.50 LPA (Senior Analyst)',
    difficulty: 'Medium',
    about: [
      'French multinational information technology services and consulting company.',
      'Major recruiter for Analyst and Senior Analyst campus roles.'
    ],
    productsServices: [
      'Capgemini Digital Engineering & Cloud.',
      'Enterprise Asset Management & SAP Consulting.',
      'Cybersecurity & Data Analytics.'
    ],
    techStack: ['Java', 'Python', 'C++', 'SQL', 'Web Development'],
    roles: ['Software Analyst', 'Senior Software Analyst'],
    recruitmentProcess: [
      'Round 1: Technical & Pseudocode Test',
      'Round 2: English Communication Test',
      'Round 3: Game-based Aptitude Test (4 Games)',
      'Round 4: Technical & HR Interview'
    ],
    interviewTopics: [
      'Game-based spatial reasoning & memory games',
      'Core Java collection framework (ArrayList vs LinkedList)',
      'Database joins & foreign key constraints'
    ]
  },
  {
    name: 'HCLTech',
    shortName: 'HCLTech',
    category: 'IT Services & Supercharging Progress',
    headquarters: 'Noida, Uttar Pradesh, India',
    employees: '225,000+ Worldwide',
    package: '₹3.60 LPA (Software Engineer) | ₹6.00 LPA (Senior Developer)',
    difficulty: 'Medium',
    about: [
      'Leading Indian multinational IT services and consulting enterprise.',
      'Known for its First Careers graduate onboarding initiative.'
    ],
    productsServices: ['DRYiCE (AI-driven Automation).', 'HCL Software Suite.', 'Cloud Native Services.'],
    techStack: ['Java', 'C# / .NET', 'Python', 'SQL', 'C++'],
    roles: ['Software Engineer Trainee', 'Senior Developer'],
    recruitmentProcess: [
      'Round 1: Online Aptitude & Coding Test',
      'Round 2: Technical Interview',
      'Round 3: HR Interview'
    ],
    interviewTopics: ['Arrays & Strings', 'DBMS Joins', 'OOPs concepts']
  }
];

export const CompanyDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCompany, setActiveCompany] = useState(top100CompaniesDataset[0]);
  const [savedCompanies, setSavedCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('prep_ai_saved_companies');
      return saved ? JSON.parse(saved) : ['TCS', 'Infosys', 'Google'];
    } catch (e) {
      return ['TCS', 'Infosys', 'Google'];
    }
  });

  const navigate = useNavigate();
  const { addToast } = useToast();

  // Filtered dataset
  const filteredList = top100CompaniesDataset.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSaveCompany = (shortName) => {
    let updated;
    if (savedCompanies.includes(shortName)) {
      updated = savedCompanies.filter(c => c !== shortName);
      addToast(`Removed ${shortName} from saved list.`, 'info');
    } else {
      updated = [...savedCompanies, shortName];
      addToast(`Saved ${shortName} to your Career Favorites! 🌟`, 'success');
    }
    setSavedCompanies(updated);
    localStorage.setItem('prep_ai_saved_companies', JSON.stringify(updated));
  };

  const handleLaunchPrep = () => {
    addToast(`Launching Interview Prep for ${activeCompany.name}...`, 'success');
    navigate(`/company-prep?company=${encodeURIComponent(activeCompany.shortName)}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 min-w-0">
      
      {/* Step-by-Step Placement Stepper */}
      <PlacementStepper currentStep={3} />

      {/* Header Banner */}
      <div className="glass-card p-5 sm:p-7 md:p-8 text-center space-y-3">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-brand-purple/10 text-brand-purple mx-auto flex items-center justify-center shadow-inner">
          <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>IT COMPANIES CAREER DIRECTORY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Top Companies Hiring & Placement Intelligence
        </h1>
        <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
          Search top 50 - 100 IT giants & product firms. Click any company to inspect structured bullet points covering company overview, primary products, tech stack, salary packages, and selection rounds.
        </p>
      </div>

      {/* Search Bar & Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Search Bar & Company List Selector (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company (e.g. TCS, Google, Amazon, Java)..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-extrabold px-1">
              <span>FOUND {filteredList.length} RECRUITERS</span>
              <span>CLICK TO VIEW DETAILS</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredList.map((comp) => {
              const isSelected = activeCompany.shortName === comp.shortName;
              const isSaved = savedCompanies.includes(comp.shortName);
              return (
                <button
                  key={comp.shortName}
                  onClick={() => setActiveCompany(comp)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-lg border-transparent scale-[1.01]'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-border/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-xs flex items-center gap-2">
                      <span>{comp.name}</span>
                      {isSaved && <BookmarkCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-amber-500'} fill-amber-300`} />}
                    </div>
                    <div className={`text-[11px] font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {comp.category}
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Structured Bullet Points Detail Card (8 cols) */}
        <div className="lg:col-span-8 min-w-0">
          <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6">
            
            {/* Title & Package Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-dark-border pb-6">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{activeCompany.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple font-extrabold text-[10px] uppercase shrink-0">
                    {activeCompany.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium flex flex-wrap items-center gap-2">
                  <span>📍 {activeCompany.headquarters}</span> •
                  <span>👥 {activeCompany.employees}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => toggleSaveCompany(activeCompany.shortName)}
                  className={`flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                    savedCompanies.includes(activeCompany.shortName)
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                      : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{savedCompanies.includes(activeCompany.shortName) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleLaunchPrep}
                  className="btn-gradient flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Launch Prep 🚀</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bullet Points Section 1: About Company */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-purple flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <Building2 className="w-4 h-4" /> 🏢 About Company & Business Operations
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 dark:text-gray-300 pl-1 leading-relaxed">
                {activeCompany.about.map((pt, idx) => (
                  <li key={idx}><strong className="text-gray-900 dark:text-white">{pt.split(' ')[0]}</strong> {pt.substring(pt.indexOf(' ') + 1)}</li>
                ))}
              </ul>
            </div>

            {/* Bullet Points Section 2: Primary Products & Services */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-purple flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <Briefcase className="w-4 h-4" /> 💼 Primary Products & Enterprise Solutions
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 dark:text-gray-300 pl-1 leading-relaxed">
                {activeCompany.productsServices.map((pt, idx) => (
                  <li key={idx}><strong className="text-gray-900 dark:text-white">{pt.split(' ')[0]}</strong> {pt.substring(pt.indexOf(' ') + 1)}</li>
                ))}
              </ul>
            </div>

            {/* Bullet Points Section 3: Technology Stack */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-purple flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <Code2 className="w-4 h-4" /> 🛠️ Core Technology Stack Evaluated
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCompany.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-brand-purple/10 text-brand-purple font-extrabold text-xs border border-brand-purple/20">
                    ⚡ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bullet Points Section 4: CTC Salary Packages & Roles */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <DollarSign className="w-4 h-4" /> 🎯 CTC Salary Packages & Entry Roles
              </h3>
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 text-xs">
                <div><strong className="text-gray-900 dark:text-white">CTC Package Tiers: </strong> <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{activeCompany.package}</span></div>
                <div><strong className="text-gray-900 dark:text-white">Hiring Bands & Roles: </strong> {activeCompany.roles.join(' • ')}</div>
              </div>
            </div>

            {/* Bullet Points Section 5: Selection Process & Rounds */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-purple flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <Layers className="w-4 h-4" /> 📋 Recruitment Process & Selection Rounds
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 dark:text-gray-300 pl-1 leading-relaxed">
                {activeCompany.recruitmentProcess.map((round, idx) => (
                  <li key={idx}>{round}</li>
                ))}
              </ul>
            </div>

            {/* Bullet Points Section 6: Key Technical Topics */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-2 border-b border-gray-100 dark:border-dark-border pb-1">
                <HelpCircle className="w-4 h-4" /> 💡 Key Technical Focus Topics
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 dark:text-gray-300 pl-1 leading-relaxed">
                {activeCompany.interviewTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
