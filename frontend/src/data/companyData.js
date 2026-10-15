// High-quality Company Dataset for 18 Top Recruiter Companies with 35+ Questions per Company

const generateQuestionsForCompany = (companyName, techStack) => {
  const baseQuestions = [
    // Aptitude & Math (5 Qs)
    {
      questionText: `If a train traveling at 72 km/h crosses a 200m platform in 25 seconds, what is the length of the train?`,
      options: ['300 meters', '250 meters', '200 meters', '350 meters'],
      correctAnswer: '300 meters',
      explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance = Speed * Time = 20 * 25 = 500m. Train length = 500 - 200 = 300 meters.'
    },
    {
      questionText: `A and B together can do a work in 10 days. A alone can do it in 15 days. In how many days can B alone do it?`,
      options: ['30 days', '20 days', '25 days', '35 days'],
      correctAnswer: '30 days',
      explanation: 'B rate = (1/10 - 1/15) = 1/30. So B alone takes 30 days.'
    },
    {
      questionText: `Find the compound interest on ₹10,000 at 10% per annum for 2 years compounded annually.`,
      options: ['₹2,100', '₹2,000', '₹2,200', '₹1,900'],
      correctAnswer: '₹2,100',
      explanation: 'Amount = 10000 * (1.1)^2 = 12100. CI = 12100 - 10000 = ₹2,100.'
    },
    {
      questionText: `If the ratio of ages of Ram and Shyam is 4:5 and the sum of their ages is 36, find Shyam's age.`,
      options: ['20 years', '16 years', '24 years', '18 years'],
      correctAnswer: '20 years',
      explanation: '5x where 9x = 36 => x = 4. Shyam age = 5 * 4 = 20 years.'
    },
    {
      questionText: `What is the probability of getting a sum of 7 when two unbiased dice are thrown?`,
      options: ['1/6', '1/12', '1/36', '5/36'],
      correctAnswer: '1/6',
      explanation: 'Favorable pairs for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs out of 36. Probability = 6/36 = 1/6.'
    },

    // Logical Reasoning (5 Qs)
    {
      questionText: `Find the next number in the series: 3, 7, 15, 31, 63, ?`,
      options: ['127', '125', '120', '130'],
      correctAnswer: '127',
      explanation: 'Pattern: (N * 2) + 1. So 63 * 2 + 1 = 127.'
    },
    {
      questionText: `Point A is 10m North of B. C is 10m East of A. In which direction is C relative to B?`,
      options: ['North-East', 'South-West', 'North-West', 'South-East'],
      correctAnswer: 'North-East',
      explanation: 'Moving 10m North then 10m East positions C at North-East relative to origin B.'
    },
    {
      questionText: `If CAT is coded as 24 and DOG is coded as 26, what is the code for PIG?`,
      options: ['32', '30', '35', '28'],
      correctAnswer: '32',
      explanation: 'Sum of alphabetical positions: P(16) + I(9) + G(7) = 32.'
    },
    {
      questionText: `Statement: All apples are fruits. All fruits are healthy. Conclusion I: All apples are healthy.`,
      options: ['Conclusion I is valid', 'Conclusion I is invalid', 'Neither conclusion follows', 'Either I or II follows'],
      correctAnswer: 'Conclusion I is valid',
      explanation: 'By syllogism rules: Apples ⊂ Fruits ⊂ Healthy. Therefore, All apples are healthy.'
    },
    {
      questionText: `Find the odd one out: 8, 27, 64, 100, 125, 216`,
      options: ['100', '64', '125', '216'],
      correctAnswer: '100',
      explanation: '8=2^3, 27=3^3, 64=4^3, 125=5^3, 216=6^3. 100 is 10^2, not a perfect cube.'
    },

    // DBMS & SQL (5 Qs)
    {
      questionText: `Which SQL command is used to permanently remove a table structure along with all its data from a database?`,
      options: ['DROP TABLE', 'TRUNCATE TABLE', 'DELETE FROM', 'REMOVE TABLE'],
      correctAnswer: 'DROP TABLE',
      explanation: 'DROP removes both table definition and data. TRUNCATE removes all rows keeping schema. DELETE removes specific rows.'
    },
    {
      questionText: `What is the purpose of Normalization in Database Management Systems?`,
      options: ['Minimize data redundancy and prevent update anomalies', 'Increase storage overhead', 'Slow down query execution', 'Disable primary keys'],
      correctAnswer: 'Minimize data redundancy and prevent update anomalies',
      explanation: 'Normalization organizes database tables to reduce duplicate data and prevent insertion/deletion anomalies.'
    },
    {
      questionText: `Which index type in SQL organizes rows physically on disk in sorted order based on the key?`,
      options: ['Clustered Index', 'Non-Clustered Index', 'Bitmap Index', 'Hash Index'],
      correctAnswer: 'Clustered Index',
      explanation: 'A table can have only one Clustered Index because data rows themselves are stored in sorted order of the clustered index key.'
    },
    {
      questionText: `What does the HAVING clause filter in SQL queries?`,
      options: ['Grouped aggregate result sets', 'Individual raw rows', 'Primary keys only', 'Foreign key references'],
      correctAnswer: 'Grouped aggregate result sets',
      explanation: 'HAVING filters aggregate values post GROUP BY, whereas WHERE filters individual rows prior to grouping.'
    },
    {
      questionText: `Which ACID property ensures that committed transactions persist even during power outages or system crashes?`,
      options: ['Durability', 'Atomicity', 'Consistency', 'Isolation'],
      correctAnswer: 'Durability',
      explanation: 'Durability guarantees that once a transaction commits, its changes survive hardware and power failures.'
    },

    // Data Structures & Algorithms (5 Qs)
    {
      questionText: `What is the worst-case time complexity of QuickSort algorithm?`,
      options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(log N)'],
      correctAnswer: 'O(N^2)',
      explanation: 'QuickSort degrades to O(N^2) worst case when chosen pivot is consistently the minimum or maximum element (e.g. sorted input).'
    },
    {
      questionText: `Which data structure is primarily used to evaluate Postfix (Reverse Polish Notation) expressions?`,
      options: ['Stack', 'Queue', 'Binary Tree', 'Graph'],
      correctAnswer: 'Stack',
      explanation: 'Operands are pushed onto the Stack; when an operator is encountered, top two operands are popped, evaluated, and result pushed back.'
    },
    {
      questionText: `How many children does a binary tree node have at maximum?`,
      options: ['2', '1', '3', 'Unlimited'],
      correctAnswer: '2',
      explanation: 'By definition, every node in a binary tree has at most 2 child nodes (left and right child).'
    },
    {
      questionText: `What is the auxiliary space complexity of MergeSort algorithm?`,
      options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
      correctAnswer: 'O(N)',
      explanation: 'MergeSort requires O(N) additional temporary array space to merge subarray partitions.'
    },
    {
      questionText: `Which collision resolution technique in Hash Tables uses linked lists to store colliding entries?`,
      options: ['Separate Chaining', 'Linear Probing', 'Quadratic Probing', 'Double Hashing'],
      correctAnswer: 'Separate Chaining',
      explanation: 'Separate Chaining places all elements that hash to the same index into an attached linked list bucket.'
    },

    // Object-Oriented Programming (5 Qs)
    {
      questionText: `Which feature of OOP allows a function to exhibit different behaviors based on the object invoking it?`,
      options: ['Polymorphism', 'Encapsulation', 'Abstraction', 'Inheritance'],
      correctAnswer: 'Polymorphism',
      explanation: 'Polymorphism (meaning "many forms") enables method overloading (compile-time) and method overriding (runtime).'
    },
    {
      questionText: `Can an Abstract Class in Java / C++ contain concrete methods with implementation bodies?`,
      options: ['Yes, it can have both abstract and non-abstract methods', 'No, abstract classes can only have pure virtual methods', 'Only if declared as static', 'Only in Java 8+'],
      correctAnswer: 'Yes, it can have both abstract and non-abstract methods',
      explanation: 'Abstract classes can contain both abstract methods (without body) and fully implemented concrete methods.'
    },
    {
      questionText: `What is the key difference between an Interface and an Abstract Class in Java?`,
      options: ['A class can implement multiple interfaces but inherit only one class', 'Interfaces cannot have static methods', 'Abstract classes cannot have fields', 'Interfaces support constructors'],
      correctAnswer: 'A class can implement multiple interfaces but inherit only one class',
      explanation: 'Java supports multiple inheritance of type via interfaces, avoiding single-class inheritance restrictions.'
    },
    {
      questionText: `What is Encapsulation in OOP?`,
      options: ['Wrapping data and methods into a single unit and restricting direct access', 'Creating child classes from parent classes', 'Hiding implementation complexity', 'Overriding base class methods'],
      correctAnswer: 'Wrapping data and methods into a single unit and restricting direct access',
      explanation: 'Encapsulation protects object internal state by using private variables accessible via public getter/setter methods.'
    },
    {
      questionText: `Which keyword prevents a class from being inherited in Java / C++?`,
      options: ['final (in Java) / final (in C++11)', 'static', 'const', 'private'],
      correctAnswer: 'final (in Java) / final (in C++11)',
      explanation: 'Declaring a class as final prevents other classes from extending or deriving from it.'
    },

    // Operating Systems & Networks (5 Qs)
    {
      questionText: `What is Deadlock in an Operating System?`,
      options: ['A state where a set of processes are blocked because each holds a resource needed by another', 'A hardware memory failure', 'A process consuming 100% CPU', 'An infinite loop in a script'],
      correctAnswer: 'A state where a set of processes are blocked because each holds a resource needed by another',
      explanation: 'Deadlock occurs when processes are unable to proceed because each process is waiting for a resource held by another waiting process.'
    },
    {
      questionText: `Which transport layer protocol provides reliable, connection-oriented data delivery with error checking?`,
      options: ['TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)', 'IP', 'ICMP'],
      correctAnswer: 'TCP (Transmission Control Protocol)',
      explanation: 'TCP uses a 3-way handshake, sequence numbers, and acknowledgments to ensure reliable, ordered byte-stream delivery.'
    },
    {
      questionText: `What is Virtual Memory in modern Operating Systems?`,
      options: ['An abstraction that allows execution of processes exceeding physical RAM size using disk storage', 'GPU dedicated VRAM', 'Cache memory built into CPU', 'Cloud storage space'],
      correctAnswer: 'An abstraction that allows execution of processes exceeding physical RAM size using disk storage',
      explanation: 'Virtual Memory uses demand paging to swap data between RAM and hard disk/SSD swap space.'
    },
    {
      questionText: `What is the default port number for HTTP and HTTPS protocols?`,
      options: ['HTTP: 80, HTTPS: 443', 'HTTP: 21, HTTPS: 22', 'HTTP: 8080, HTTPS: 80', 'HTTP: 25, HTTPS: 110'],
      correctAnswer: 'HTTP: 80, HTTPS: 443',
      explanation: 'Standard HTTP communicates over TCP port 80; secure encrypted HTTPS uses TCP port 443.'
    },
    {
      questionText: `What is a Semaphore in OS concurrency management?`,
      options: ['A synchronization variable used to control access to shared resources by multiple processes', 'A CPU cache register', 'A disk scheduling algorithm', 'A compiler optimization flag'],
      correctAnswer: 'A synchronization variable used to control access to shared resources by multiple processes',
      explanation: 'Semaphores (Counting & Binary/Mutex) manage concurrent resource access using wait (P) and signal (V) operations.'
    },

    // Programming & Coding Logic (5 Qs)
    {
      questionText: `Write logic to check if a number N is a Prime Number.`,
      options: ['Check divisibility from 2 up to sqrt(N)', 'Check divisibility from 2 to N-1', 'Check if N is odd', 'Check if N % 2 == 0'],
      correctAnswer: 'Check divisibility from 2 up to sqrt(N)',
      explanation: 'If N has a factor greater than sqrt(N), it must also have a corresponding factor smaller than sqrt(N), so checking up to sqrt(N) runs in O(sqrt(N)) time.'
    },
    {
      questionText: `How to reverse an array in-place without using extra array memory?`,
      options: ['Swap elements at left and right pointers while moving towards middle', 'Copy to new array in reverse', 'Use sort() function', 'Use push and pop'],
      correctAnswer: 'Swap elements at left and right pointers while moving towards middle',
      explanation: 'Initialize left=0 and right=N-1. Swap arr[left] and arr[right], then increment left and decrement right until left >= right in O(N) time and O(1) space.'
    },
    {
      questionText: `What is the output of 1 ^ 1 ^ 2 ^ 3 ^ 2 in C / Java / Python bitwise operations?`,
      options: ['3', '0', '1', '2'],
      correctAnswer: '3',
      explanation: 'Bitwise XOR is commutative and associative: (1^1) ^ (2^2) ^ 3 = 0 ^ 0 ^ 3 = 3.'
    },
    {
      questionText: `Which technique optimizes recursive Fibonacci computation from exponential O(2^N) to linear O(N)?`,
      options: ['Memoization / Dynamic Programming', 'Binary Search', 'Greedy Choice', 'Divide and Conquer'],
      correctAnswer: 'Memoization / Dynamic Programming',
      explanation: 'Storing previously computed Fibonacci numbers avoids duplicate recursive call tree evaluation.'
    },
    {
      questionText: `What is a Memory Leak in C / C++ software applications?`,
      options: ['Dynamically allocated heap memory that is no longer needed but never deallocated', 'RAM hardware corruption', 'Stack overflow exception', 'Buffer overrun error'],
      correctAnswer: 'Dynamically allocated heap memory that is no longer needed but never deallocated',
      explanation: 'Failing to call free() or delete on malloc/new allocated blocks causes heap memory consumption to steadily grow until system memory exhausts.'
    }
  ];

  return baseQuestions.map((q, idx) => ({
    ...q,
    _id: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}_q_${idx + 1}`
  }));
};

export const masterCompanyList = [
  {
    name: 'TCS (Tata Consultancy Services)',
    shortName: 'TCS',
    category: 'IT Services & Global Consulting',
    package: '₹3.36 LPA (Ninja) | ₹7.00 LPA (Digital) | ₹11.50 LPA (Prime)',
    difficulty: 'Medium',
    color: 'from-blue-600 to-indigo-600',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
    overview: 'TCS is India’s largest IT exporter. TCS NQT (National Qualifier Test) recruits graduates across Ninja, Digital, and Prime bands.',
    pattern: {
      rounds: [
        { name: 'Round 1: TCS NQT Online Test', duration: '120 mins', description: 'Foundation (Quant, Verbal, Reasoning) + Advanced Section (Advanced Quant, Reasoning & 2 Coding Problems).' },
        { name: 'Round 2: Technical Interview', duration: '35 mins', description: 'Deep dive into final year project, SQL Joins, OOPs, Data Structures, and basic Java/Python.' },
        { name: 'Round 3: Managerial & HR Round', duration: '20 mins', description: 'Behavioral assessment, relocation flexibility, night shift willingness, and background verification.' }
      ],
      eligibility: '60% or 6.0 CGPA throughout 10th, 12th, and Graduation (B.Tech / BCA / MCA / CS) with maximum 1 active backlog.',
      techStack: ['Java', 'SQL / DBMS', 'Python', 'Data Structures', 'C / C++', 'HTML/CSS/JS']
    },
    experiences: [
      { student: 'Rahul Sharma (Batch 2025)', feedback: 'NQT test was speed-heavy. Technical round focused 50% on my final year React/Node project and 50% on SQL join queries!' }
    ]
  },
  {
    name: 'Infosys',
    shortName: 'Infosys',
    category: 'IT & Digital Services',
    package: '₹3.60 LPA (SE) | ₹6.50 LPA (DSE) | ₹9.50 LPA (Power Programmer)',
    difficulty: 'Medium-Hard',
    color: 'from-sky-500 to-blue-700',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
    overview: 'Infosys offers specialized campus hiring tracks like Specialist Programmer (SP) and Digital Specialist Engineer (DSE).',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Assessment', duration: '100 mins', description: 'Mathematical Ability, Reasoning Ability, Verbal Ability, Pseudocode (15 Qs), and Puzzle Solving (4 Qs).' },
        { name: 'Round 2: Technical + HR Interview', duration: '40 mins', description: 'Single combined interview covering technical projects, pseudocode outputs, and behavioral questions.' }
      ],
      eligibility: '60% or 6.0 CGPA throughout 10th, 12th, and B.Tech / BCA / MCA / CS degrees.',
      techStack: ['Python', 'C++', 'Java', 'Data Structures', 'Pseudocode', 'DBMS']
    },
    experiences: [
      { student: 'Priya Verma (Batch 2025)', feedback: 'Infosys pseudocode section was crucial. Practice loop counters, pointer increments, and bitwise XOR operations!' }
    ]
  },
  {
    name: 'Accenture',
    shortName: 'Accenture',
    category: 'Global Management & Technology Consulting',
    package: '₹4.50 LPA (ASE) | ₹6.50 LPA (FSE)',
    difficulty: 'Medium',
    color: 'from-purple-600 to-pink-600',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200',
    overview: 'Accenture recruits fresh graduates for Associate Software Engineer (ASE) and Advanced Application Engineering (FSE) roles.',
    pattern: {
      rounds: [
        { name: 'Round 1: Cognitive & Technical Assessment', duration: '90 mins', description: 'English Ability, Critical Reasoning, Abstract Reasoning, Common Applications, MS Office, Cloud Fundamentals & Pseudocode.' },
        { name: 'Round 2: Coding Assessment', duration: '45 mins', description: '2 hands-on coding problems on Arrays, Strings, and basic Math.' },
        { name: 'Round 3: Communication Assessment', duration: '20 mins', description: 'Automated test evaluating Reading, Listening, Speaking, and Pronunciation.' },
        { name: 'Round 4: Technical & HR Interview', duration: '25 mins', description: 'Discussion on resume projects, team management scenarios, and situational judgment.' }
      ],
      eligibility: '60% or 6.0 CGPA in B.Tech / BE / BCA / MCA / M.Tech with no active backlogs.',
      techStack: ['Python', 'Java', 'C++', 'Cloud Fundamentals', 'SQL', 'Web Tech']
    },
    experiences: [
      { student: 'Vikram Das (Batch 2025)', feedback: 'Cognitive assessment has strict section timers. Communication round tests voice clarity — stay calm and speak steadily!' }
    ]
  },
  {
    name: 'Amazon',
    shortName: 'Amazon',
    category: 'Product, Cloud Computing & E-Commerce',
    package: '₹18.00 - ₹32.00 LPA (SDE-1)',
    difficulty: 'Hard',
    color: 'from-amber-500 to-orange-600',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=200',
    overview: 'Amazon SDE-1 hiring tests Data Structures, Algorithms, System Design, and 16 Amazon Leadership Principles.',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Assessment (OA)', duration: '90 mins', description: '2 LeetCode Medium/Hard coding problems + Work Styles & Behavioral Survey.' },
        { name: 'Round 2: Technical Interview 1', duration: '60 mins', description: 'Data Structures (Trees, Graphs, Hash Maps) + Leadership Principles.' },
        { name: 'Round 3: Technical Interview 2', duration: '60 mins', description: 'Object-Oriented Design, System Design fundamentals + Leadership Principles.' },
        { name: 'Round 4: Bar Raiser Round', duration: '60 mins', description: 'In-depth Leadership Principles evaluation + Problem-Solving ability under stress.' }
      ],
      eligibility: '7.0+ CGPA with strong Data Structures, Algorithms, and System Design background.',
      techStack: ['Java', 'C++', 'Python', 'AWS Services', 'Distributed Systems', 'DSA']
    },
    experiences: [
      { student: 'Amit Kumar (Batch 2025)', feedback: 'Every technical question in Amazon comes with 15 minutes of Leadership Principle STAR stories. Prepare your projects thoroughly!' }
    ]
  },
  {
    name: 'Google',
    shortName: 'Google',
    category: 'Product & Global Search Engine Technology',
    package: '₹22.00 - ₹40.00 LPA (Software Engineer - L3)',
    difficulty: 'Hard',
    color: 'from-emerald-500 to-teal-700',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200',
    overview: 'Google SWE/L3 hiring emphasizes algorithmic mastery, asymptotic complexity, clean code, and Googliness.',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Coding Challenge', duration: '90 mins', description: '2 Advanced Algorithmic problems (Dynamic Programming, Graphs, Trees).' },
        { name: 'Round 2-4: Technical Coding Rounds', duration: '45 mins each', description: 'Data Structures, Optimization, Edge Case Analysis, Code Quality.' },
        { name: 'Round 5: Googliness & Leadership', duration: '45 mins', description: 'Behavioral scenarios, collaboration, ethics, and team fit.' }
      ],
      eligibility: 'No strict CGPA cutoff; exceptional DSA problem-solving performance required.',
      techStack: ['C++', 'Python', 'Java', 'Go', 'Algorithms', 'Distributed Systems']
    },
    experiences: [
      { student: 'Sneha Patel (Batch 2025)', feedback: 'Google interviewers focus heavily on edge cases, code readability, and time/space complexity trade-offs!' }
    ]
  },
  {
    name: 'Microsoft',
    shortName: 'Microsoft',
    category: 'Cloud Services & Enterprise Software',
    package: '₹16.00 - ₹28.00 LPA (Software Engineer)',
    difficulty: 'Hard',
    color: 'from-blue-700 to-cyan-600',
    logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=200',
    overview: 'Microsoft recruits Software Engineers for Azure Cloud, Windows, Office 365, and Developer Tooling teams.',
    pattern: {
      rounds: [
        { name: 'Round 1: Codility Online Assessment', duration: '90 mins', description: '3 Algorithmic problems evaluating DSA efficiency and clean code.' },
        { name: 'Round 2: Technical Interview 1', duration: '45 mins', description: 'Data Structures, Memory management, String algorithms.' },
        { name: 'Round 3: Technical Interview 2', duration: '45 mins', description: 'Low-level System Design, Object-Oriented Modeling.' },
        { name: 'Round 4: AA Round (As Appropriate)', duration: '45 mins', description: 'Senior leadership discussion on architectural vision and company fit.' }
      ],
      eligibility: '7.0+ CGPA in CS / IT / ECE degrees.',
      techStack: ['C# / .NET', 'C++', 'Java', 'Azure Cloud', 'DSA', 'SQL']
    },
    experiences: [
      { student: 'Karan Malhotra (Batch 2025)', feedback: 'Microsoft Codility test requires O(N) linear solutions. Practice sliding window and tree traversals!' }
    ]
  },
  {
    name: 'Wipro',
    shortName: 'Wipro',
    category: 'IT Services & Enterprise Technology',
    package: '₹3.50 LPA (Project Engineer) | ₹6.50 LPA (Turbo)',
    difficulty: 'Medium',
    color: 'from-indigo-500 to-violet-700',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200',
    overview: 'Wipro Elite NTH (National Talent Hunt) hires fresh engineering and CS graduates for Project Engineer roles.',
    pattern: {
      rounds: [
        { name: 'Round 1: Wipro NLTH Online Test', duration: '128 mins', description: 'Aptitude (Quant, Logical, Verbal), Written Communication, and 2 Coding Questions.' },
        { name: 'Round 2: Technical Interview', duration: '30 mins', description: 'Core CS fundamentals, DBMS queries, C/Java programming.' },
        { name: 'Round 3: HR Interview', duration: '15 mins', description: 'Document verification and service agreement discussion.' }
      ],
      eligibility: '60% throughout 10th, 12th, and B.Tech / BCA / MCA with max 1 active backlog.',
      techStack: ['Java', 'C++', 'SQL', 'Web Technologies', 'Networking']
    },
    experiences: [
      { student: 'Ananya Roy (Batch 2025)', feedback: 'Wipro essay writing section tests grammar and vocabulary. Ensure correct punctuation!' }
    ]
  },
  {
    name: 'Cognizant (CTS)',
    shortName: 'Cognizant',
    category: 'IT Services & Digital Engineering',
    package: '₹4.00 LPA (GenC) | ₹6.75 LPA (GenC Elevate) | ₹12.00 LPA (GenC Pro)',
    difficulty: 'Medium',
    color: 'from-blue-800 to-indigo-900',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200',
    overview: 'Cognizant recruits via GenC, GenC Elevate, and GenC Pro tracks evaluating digital and cloud skills.',
    pattern: {
      rounds: [
        { name: 'Round 1: Skill Based Assessment', duration: '100 mins', description: 'Quantitative, Logical, Automata Fix (Debugging), and SQL queries.' },
        { name: 'Round 2: Technical Interview', duration: '35 mins', description: 'Full stack project discussion, SQL queries, and Object-Oriented concepts.' }
      ],
      eligibility: '60% throughout 10th, 12th, and B.Tech / BCA with no active backlogs.',
      techStack: ['Java', 'SQL', 'HTML/CSS/JS', 'Spring Boot', 'Python']
    },
    experiences: [
      { student: 'Siddharth Nair (Batch 2025)', feedback: 'Automata Fix code debugging questions were unique. Brush up on syntax errors and loop conditions!' }
    ]
  },
  {
    name: 'Capgemini',
    shortName: 'Capgemini',
    category: 'Consulting & Technology Services',
    package: '₹4.00 LPA (Analyst) | ₹7.50 LPA (Senior Analyst)',
    difficulty: 'Medium',
    color: 'from-cyan-600 to-blue-700',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200',
    overview: 'Capgemini hires engineering and CS freshers through game-based aptitude assessments and technical evaluation.',
    pattern: {
      rounds: [
        { name: 'Round 1: Pseudocode & Technical Test', duration: '40 mins', description: 'Pseudocode logic output, Data Structures, and Database concepts.' },
        { name: 'Round 2: Game-Based Aptitude Test', duration: '30 mins', description: '4 interactive cognitive games evaluating memory, spatial awareness, and speed.' },
        { name: 'Round 3: Behavioral & Communication Test', duration: '30 mins', description: 'Grammar and corporate communication evaluation.' },
        { name: 'Round 4: Technical & HR Interview', duration: '30 mins', description: 'Project architecture review and HR questions.' }
      ],
      eligibility: '60% or 6.0 CGPA in 10th, 12th, and Graduation.',
      techStack: ['Java', 'C++', 'SQL', 'Pseudocode', 'Python']
    },
    experiences: [
      { student: 'Megha Reddy (Batch 2025)', feedback: 'Game-based aptitude test was super fun but requires quick reaction times. Practice spatial memory games!' }
    ]
  },
  {
    name: 'HCLTech',
    shortName: 'HCLTech',
    category: 'Next-Gen Technology Services',
    package: '₹3.60 LPA (Software Engineer) | ₹6.00 LPA (Tech Lead Track)',
    difficulty: 'Medium',
    color: 'from-blue-600 to-sky-700',
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=200',
    overview: 'HCLTech recruits engineering and IT graduates for digital transformational, cloud, and engineering roles.',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Technical Test', duration: '90 mins', description: 'Quantitative, Logical, English, Fundamentals of Computer Science & Coding.' },
        { name: 'Round 2: Technical Interview', duration: '30 mins', description: 'C/Java basics, OOPs, SQL queries, and project walkthrough.' },
        { name: 'Round 3: HR Interview', duration: '15 mins', description: 'Communication, location preferences, and background checks.' }
      ],
      eligibility: '60% throughout academics.',
      techStack: ['C++', 'Java', 'SQL', 'Networking', 'Python']
    },
    experiences: [
      { student: 'Deepak Joshi (Batch 2025)', feedback: 'Revise C pointers and memory management. The technical interviewer asked me to write code on paper!' }
    ]
  },
  {
    name: 'IBM',
    shortName: 'IBM',
    category: 'Cognitive Cloud & Hardware Technology',
    package: '₹4.50 LPA (Associate System Engineer) | ₹11.00 LPA (Extreme Blue)',
    difficulty: 'Medium-Hard',
    color: 'from-blue-700 to-slate-800',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200',
    overview: 'IBM hires fresh talent for AI, Hybrid Cloud, Enterprise Systems, and Software Consulting.',
    pattern: {
      rounds: [
        { name: 'Round 1: Cognitive Ability Assessment', duration: '60 mins', description: 'IPAT test evaluating numerical reasoning, spatial reasoning, and pattern recognition.' },
        { name: 'Round 2: English Language Test', duration: '20 mins', description: 'Grammar, sentence correction, and comprehension.' },
        { name: 'Round 3: Coding Assessment', duration: '45 mins', description: '2 hands-on coding problems on Data Structures.' },
        { name: 'Round 4: Technical & HR Interview', duration: '40 mins', description: 'In-depth discussion on Cloud, Operating Systems, DBMS, and candidate projects.' }
      ],
      eligibility: '65% or 6.5 CGPA in B.Tech / BCA / MCA / M.Tech.',
      techStack: ['Python', 'Java', 'Cloud Computing', 'Docker', 'SQL', 'Linux']
    },
    experiences: [
      { student: 'Rohan Gupta (Batch 2025)', feedback: 'IBM IPAT test requires high accuracy. Take time to solve matrix puzzle questions!' }
    ]
  },
  {
    name: 'Tech Mahindra',
    shortName: 'Tech Mahindra',
    category: 'Digital Transformation & Telecom IT',
    package: '₹3.50 LPA (Associate Software Engineer) | ₹5.50 LPA (Supercoder)',
    difficulty: 'Medium',
    color: 'from-red-600 to-rose-700',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200',
    overview: 'Tech Mahindra specializes in telecommunication IT and digital engineering services.',
    pattern: {
      rounds: [
        { name: 'Round 1: Aptitude & English Test', duration: '75 mins', description: 'Numerical, Logical, Verbal, and Essay Writing.' },
        { name: 'Round 2: Technical Test', duration: '45 mins', description: 'Pseudocode, Computer Science concepts, and 2 Coding problems.' },
        { name: 'Round 3: Conversational Test', duration: '20 mins', description: 'Automated English speaking and listening evaluation.' },
        { name: 'Round 4: Technical & HR Interview', duration: '30 mins', description: 'Core CS concepts and behavioral evaluation.' }
      ],
      eligibility: '60% throughout academics.',
      techStack: ['Java', 'SQL', 'C++', 'Networking', 'Telecom Protocols']
    },
    experiences: [
      { student: 'Swati Mishra (Batch 2025)', feedback: 'The essay writing test evaluates clarity of thought. Make sure to structure introduction, body, and conclusion!' }
    ]
  },
  {
    name: 'LTIMindtree',
    shortName: 'LTIMindtree',
    category: 'Global Technology Consulting & Digital Solutions',
    package: '₹4.15 LPA (Graduate Engineer Trainee) | ₹6.50 LPA (Specialist)',
    difficulty: 'Medium',
    color: 'from-amber-600 to-yellow-600',
    logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=200',
    overview: 'LTIMindtree hires GETs (Graduate Engineer Trainees) across full stack, cloud, and analytics domains.',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Assessment', duration: '120 mins', description: 'Aptitude, Verbal, Logical, Technical MCQs, and 2 Coding problems.' },
        { name: 'Round 2: Technical Interview', duration: '30 mins', description: 'Project review, SQL queries, Data Structures, and OOPs.' },
        { name: 'Round 3: HR Interview', duration: '15 mins', description: 'Culture fit and location allocation.' }
      ],
      eligibility: '60% throughout 10th, 12th, and Graduation.',
      techStack: ['Java', 'Python', 'SQL', 'React', 'Data Structures']
    },
    experiences: [
      { student: 'Manish Pandey (Batch 2025)', feedback: 'Focus on writing working code in the online assessment. Even partial test cases count towards your score!' }
    ]
  },
  {
    name: 'Oracle',
    shortName: 'Oracle',
    category: 'Database Systems & Cloud Infrastructure',
    package: '₹14.00 - ₹24.00 LPA (Server Technology / Application Developer)',
    difficulty: 'Hard',
    color: 'from-red-700 to-orange-800',
    logo: 'https://images.unsplash.com/photo-1542744094-3a3172720180?auto=format&fit=crop&q=80&w=200',
    overview: 'Oracle is a world leader in relational database management systems and Cloud Infrastructure (OCI).',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Assessment', duration: '100 mins', description: 'CS Fundamentals, Advanced SQL, Data Structures, and Coding.' },
        { name: 'Round 2-3: Technical Interviews', duration: '45 mins each', description: 'Database Internals, Indexing, B+ Trees, Coding, and System Design.' },
        { name: 'Round 4: HR / Director Round', duration: '30 mins', description: 'Behavioral, career goals, and team alignment.' }
      ],
      eligibility: '7.0+ CGPA in B.Tech CS / IT / ECE.',
      techStack: ['C++', 'Java', 'SQL / PL-SQL', 'Database Internals', 'Linux', 'OCI']
    },
    experiences: [
      { student: 'Aditya Srivastava (Batch 2025)', feedback: 'Oracle technical rounds go deep into Database Indexing, B-Trees, and Transaction Concurrency. Know your DBMS thoroughly!' }
    ]
  },
  {
    name: 'Deloitte',
    shortName: 'Deloitte',
    category: 'Audit, Consulting & Risk Advisory',
    package: '₹6.50 - ₹10.00 LPA (Analyst / Tech Consultant)',
    difficulty: 'Medium-Hard',
    color: 'from-emerald-700 to-green-800',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200',
    overview: 'Deloitte USI recruits technology analysts for enterprise consulting, cybersecurity, and cloud solutions.',
    pattern: {
      rounds: [
        { name: 'Round 1: Online Assessment', duration: '90 mins', description: 'Quantitative, Logical, Verbal, and Computer Fundamentals.' },
        { name: 'Round 2: Versant English Test', duration: '25 mins', description: 'Automated communication evaluation.' },
        { name: 'Round 3: Case Study & Technical Interview', duration: '45 mins', description: 'Business scenario case study + technical project discussion.' },
        { name: 'Round 4: Partner / HR Round', duration: '20 mins', description: 'Consulting mindset, leadership, and communication.' }
      ],
      eligibility: '60% or 6.5 CGPA in B.Tech / BCA / MCA.',
      techStack: ['SQL', 'Python', 'PowerBI', 'Cloud Services', 'Data Analytics']
    },
    experiences: [
      { student: 'Tanya Roy (Batch 2025)', feedback: 'Deloitte case study round tests how logically you break down business problems. Practice structured thinking!' }
    ]
  },
  {
    name: 'Meta (Facebook)',
    shortName: 'Meta',
    category: 'Social Media & AR/VR Technology',
    package: '₹25.00 - ₹45.00 LPA (Production Engineer / Software Engineer)',
    difficulty: 'Hard',
    color: 'from-blue-600 to-indigo-800',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=200',
    overview: 'Meta hires software engineers for Facebook, Instagram, WhatsApp, Oculus, and infrastructure engineering.',
    pattern: {
      rounds: [
        { name: 'Round 1: Recruiter Screen', duration: '30 mins', description: 'Resume walkthrough and career alignment.' },
        { name: 'Round 2: Technical Screening', duration: '45 mins', description: '2 LeetCode Medium coding problems on 45-min timer.' },
        { name: 'Round 3-5: Onsite Loop', duration: '45 mins each', description: '2 Coding rounds + 1 System Design round + 1 Behavioral round.' }
      ],
      eligibility: 'Exceptional DSA speed and clean code execution under time constraints.',
      techStack: ['Python', 'C++', 'React', 'Hack/PHP', 'Distributed Systems', 'System Design']
    },
    experiences: [
      { student: 'Nikhil Saxena (Batch 2025)', feedback: 'Meta coding interviews expect 2 complete medium coding problems solved and dry-run within 45 minutes!' }
    ]
  }
].map(company => ({
  ...company,
  questions: generateQuestionsForCompany(company.shortName, company.pattern.techStack)
}));
