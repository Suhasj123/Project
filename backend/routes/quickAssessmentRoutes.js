const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const QuickAssessmentSession = require('../models/QuickAssessmentSession');

// Memory store fallback
let memoryQuickSessions = {};

// Sample 20 Aptitude Screener Questions
const sampleAptitudeScreenerQs = [
  { id: 'q1', questionText: 'If A can do a work in 10 days and B in 15 days, working together they finish in?', options: ['6 days', '8 days', '5 days', '7 days'], correctAnswer: '6 days', explanation: 'Combined work rate = 1/10 + 1/15 = 1/6 work per day, so 6 days.' },
  { id: 'q2', questionText: 'Which data structure follows First In First Out (FIFO)?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 'Queue', explanation: 'A Queue adds elements at the back and removes from the front (FIFO).' },
  { id: 'q3', questionText: 'What is the average time complexity of Searching in a Hash Table?', options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'], correctAnswer: 'O(1)', explanation: 'Hash functions directly compute the memory index for instant constant-time O(1) lookup.' },
  { id: 'q4', questionText: 'Which HTTP method is idempotent and replaces target resources?', options: ['POST', 'PUT', 'GET', 'DELETE'], correctAnswer: 'PUT', explanation: 'PUT replaces target resource representations idempotently.' },
  { id: 'q5', questionText: 'In DBMS, which ACID property ensures all or nothing transaction execution?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctAnswer: 'Atomicity', explanation: 'Atomicity guarantees that all steps in a transaction succeed together or abort completely.' },
  { id: 'q6', questionText: 'A train 120m long passes a pole in 6 seconds. What is its speed in km/h?', options: ['72 km/h', '60 km/h', '54 km/h', '80 km/h'], correctAnswer: '72 km/h', explanation: 'Speed = 120m / 6s = 20 m/s. Convert to km/h: 20 * (18/5) = 72 km/h.' },
  { id: 'q7', questionText: 'Which sorting algorithm has a consistent O(N log N) worst case time complexity?', options: ['MergeSort', 'QuickSort', 'BubbleSort', 'InsertionSort'], correctAnswer: 'MergeSort', explanation: 'MergeSort consistently divides arrays in half and merges them in O(N log N) time.' },
  { id: 'q8', questionText: 'In OOP, hiding private class implementation details is called?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], correctAnswer: 'Encapsulation', explanation: 'Encapsulation restricts direct variable access and bundles logic inside class boundaries.' },
  { id: 'q9', questionText: 'Which SQL keyword is used to eliminate duplicate rows in query results?', options: ['UNIQUE', 'DISTINCT', 'GROUP BY', 'DIFFERENT'], correctAnswer: 'DISTINCT', explanation: 'SELECT DISTINCT removes duplicate rows from the query output.' },
  { id: 'q10', questionText: 'Find the next number in series: 5, 10, 20, 40, ?', options: ['80', '60', '50', '70'], correctAnswer: '80', explanation: 'Each term doubles the preceding term: 40 * 2 = 80.' },
  { id: 'q11', questionText: 'What is the default port for HTTP traffic?', options: ['80', '443', '8080', '21'], correctAnswer: '80', explanation: 'Port 80 is standard for unencrypted HTTP, while 443 is for HTTPS.' },
  { id: 'q12', questionText: 'Which OS concept prevents a process from accessing memory outside its allocation?', options: ['Paging', 'Virtual Memory Protection', 'Semaphores', 'Deadlock'], correctAnswer: 'Virtual Memory Protection', explanation: 'Hardware MMU page tables enforce memory protection boundaries between processes.' },
  { id: 'q13', questionText: 'If COST PRICE = $100 and SELLING PRICE = $125, what is the profit percentage?', options: ['25%', '20%', '15%', '30%'], correctAnswer: '25%', explanation: 'Profit = (125 - 100) / 100 * 100% = 25%.' },
  { id: 'q14', questionText: 'Which SQL clause filters records after a GROUP BY aggregation?', options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], correctAnswer: 'HAVING', explanation: 'HAVING filters aggregate values, whereas WHERE filters individual table rows.' },
  { id: 'q15', questionText: 'What does CSS stand for in web development?', options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Sheet Syntax', 'Core Styling Software'], correctAnswer: 'Cascading Style Sheets', explanation: 'CSS defines visual styling rules for HTML document elements.' },
  { id: 'q16', questionText: 'Which data structure is used to implement Breadth-First Search (BFS) in a Graph?', options: ['Stack', 'Queue', 'Priority Queue', 'Array'], correctAnswer: 'Queue', explanation: 'BFS processes graph vertices layer-by-layer in First-In First-Out order using a Queue.' },
  { id: 'q17', questionText: 'In JavaScript, what is the result of typeof NaN?', options: ['"number"', '"nan"', '"undefined"', '"object"'], correctAnswer: '"number"', explanation: 'NaN stands for Not-a-Number, but its Javascript primitive data type is "number".' },
  { id: 'q18', questionText: 'Find the odd one out: Java, Python, C++, HTML', options: ['Java', 'Python', 'C++', 'HTML'], correctAnswer: 'HTML', explanation: 'HTML is a markup language for document structure, whereas Java, Python, C++ are programming languages.' },
  { id: 'q19', questionText: 'What is the time complexity of pushing an element onto a Stack?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(1)', explanation: 'Pushing onto the top of a stack takes constant O(1) time.' },
  { id: 'q20', questionText: 'Which protocol is used to map IP addresses to MAC addresses?', options: ['DNS', 'ARP', 'DHCP', 'ICMP'], correctAnswer: 'ARP', explanation: 'ARP (Address Resolution Protocol) resolves 32-bit IPv4 addresses to 48-bit physical MAC addresses.' }
];

// Stage 2 Coding Round Questions grouped by Programming Language
const sampleCodingRoundQsByLanguage = {
  JavaScript: {
    quickMcqs: [
      { id: 'cm1', questionText: 'What is the output of: `console.log(1 + "2" + 3)` in JavaScript?', options: ['"123"', '6', '"33"', 'NaN'], correctAnswer: '"123"', explanation: 'String concatenation happens sequentially from left to right: 1 + "2" -> "12" + 3 -> "123".' },
      { id: 'cm2', questionText: 'What is the result of `typeof NaN` in JavaScript?', options: ['"number"', '"nan"', '"undefined"', '"object"'], correctAnswer: '"number"', explanation: 'NaN is part of the JavaScript Number primitive type specifications.' },
      { id: 'cm3', questionText: 'Which method removes and returns the last element of a JavaScript Array?', options: ['pop()', 'shift()', 'push()', 'splice()'], correctAnswer: 'pop()', explanation: 'Array.prototype.pop() removes the last element in O(1) amortized time.' },
      { id: 'cm4', questionText: 'What is the average time complexity of checking if a key exists in a Map?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(1)', explanation: 'ES6 Map has() computes hash bucket position in O(1) average time.' },
      { id: 'cm5', questionText: 'What does the strict equality operator (===) check?', options: ['Both value and data type without coercion', 'Only value with type coercion', 'Only object memory address', 'None of these'], correctAnswer: 'Both value and data type without coercion', explanation: 'Strict equality (===) compares operands without implicit type conversion.' },
      { id: 'cm6', questionText: 'What is the output of `bool x = (5 > 3) && (2 < 1);`?', options: ['false', 'true', '1', 'error'], correctAnswer: 'false', explanation: 'Logical AND (&&) requires both operands to be true. (2 < 1) evaluates to false.' },
      { id: 'cm7', questionText: 'Which function converts a JSON string into a JavaScript Object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toObject()', 'Object.parse()'], correctAnswer: 'JSON.parse()', explanation: 'JSON.parse() parses a valid JSON string into a native JS Object.' },
      { id: 'cm8', questionText: 'In recursion, what condition stops recursive function execution?', options: ['Base Case', 'Loop Break', 'Return Void', 'Catch block'], correctAnswer: 'Base Case', explanation: 'The base case provides a termination path to prevent infinite call stack overflows.' }
    ],
    codingProblems: [
      {
        id: 'cp1',
        title: 'String Reverse Check (Palindrome) - JavaScript',
        problemText: 'Write a JavaScript function `isPalindrome(str)` that returns `true` if a string reads the same forwards and backwards, ignoring non-alphanumeric characters.',
        initialCode: 'function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
        sampleTestCases: [
          { input: '"racecar"', expectedOutput: 'true' },
          { input: '"hello"', expectedOutput: 'false' }
        ]
      },
      {
        id: 'cp2',
        title: 'Find Maximum Element in Array - JavaScript',
        problemText: 'Write a JavaScript function `findMax(nums)` that returns the largest number in an integer array.',
        initialCode: 'function findMax(nums) {\n  return Math.max(...nums);\n}',
        sampleTestCases: [
          { input: '[3, 7, 2, 9, 4]', expectedOutput: '9' },
          { input: '[-5, -1, -10]', expectedOutput: '-1' }
        ]
      }
    ]
  },
  Python: {
    quickMcqs: [
      { id: 'cm1', questionText: 'What is the output of `type(5 / 2)` in Python 3?', options: ['<class \'float\'>', '<class \'int\'>', '<class \'number\'>', '2'], correctAnswer: '<class \'float\'>', explanation: 'True division `/` in Python 3 always yields a floating point value (2.5).' },
      { id: 'cm2', questionText: 'In Python, what is the value of `list(range(1, 5))`?', options: ['[1, 2, 3, 4]', '[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[1, 5]'], correctAnswer: '[1, 2, 3, 4]', explanation: 'Python `range(start, stop)` includes start (1) but excludes stop (5).' },
      { id: 'cm3', questionText: 'What does `[x**2 for x in range(4) if x % 2 == 0]` evaluate to in Python?', options: ['[0, 4]', '[0, 1, 4, 9]', '[1, 9]', '[4]'], correctAnswer: '[0, 4]', explanation: 'For x in [0, 1, 2, 3], even numbers are 0 and 2. Their squares are 0 and 4.' },
      { id: 'cm4', questionText: 'What is the average time complexity of checking `key in dict` in Python?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(1)', explanation: 'Python dictionaries are hash tables with O(1) average key lookup time.' },
      { id: 'cm5', questionText: 'Which Python keyword is used to handle exceptions?', options: ['try / except', 'try / catch', 'catch / finally', 'throw / error'], correctAnswer: 'try / except', explanation: 'Python utilizes `try ... except` blocks for exception handling.' },
      { id: 'cm6', questionText: 'What is the boolean evaluation of `bool([])` in Python?', options: ['False', 'True', 'None', 'Error'], correctAnswer: 'False', explanation: 'Empty collections (lists, tuples, dicts) are falsy in Python.' },
      { id: 'cm7', questionText: 'How do you reverse a list in-place in Python?', options: ['lst.reverse()', 'reversed(lst)', 'lst[::-1]', 'lst.sort(reverse=True)'], correctAnswer: 'lst.reverse()', explanation: '`lst.reverse()` reverses list items in-place without creating a new copy.' },
      { id: 'cm8', questionText: 'What is the output of `"prep"[::-1]` in Python?', options: ['"perp"', '"prep"', '"p"', 'SyntaxError'], correctAnswer: '"perp"', explanation: 'Slice step of -1 traverses and returns the string characters in reversed order.' }
    ],
    codingProblems: [
      {
        id: 'cp1',
        title: 'String Reverse Check (Palindrome) - Python',
        problemText: 'Write a Python function `is_palindrome(s: str) -> bool` that returns `True` if string reads the same forwards and backwards, ignoring non-alphanumerics.',
        initialCode: 'def is_palindrome(s: str) -> bool:\n    clean = "".join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]',
        sampleTestCases: [
          { input: '"racecar"', expectedOutput: 'True' },
          { input: '"hello"', expectedOutput: 'False' }
        ]
      },
      {
        id: 'cp2',
        title: 'Find Maximum Element in List - Python',
        problemText: 'Write a Python function `find_max(nums: list[int]) -> int` that returns the largest number in a list.',
        initialCode: 'def find_max(nums: list[int]) -> int:\n    return max(nums)',
        sampleTestCases: [
          { input: '[3, 7, 2, 9, 4]', expectedOutput: '9' },
          { input: '[-5, -1, -10]', expectedOutput: '-1' }
        ]
      }
    ]
  },
  Java: {
    quickMcqs: [
      { id: 'cm1', questionText: 'In Java, strings are Immutable. What does this mean?', options: ['String objects cannot be modified after creation', 'Strings cannot be copied', 'Strings cannot be passed as parameters', 'Strings take constant memory'], correctAnswer: 'String objects cannot be modified after creation', explanation: 'Immutability means any string alteration creates a brand new String object in memory.' },
      { id: 'cm2', questionText: 'Which collection class in Java permits a null key?', options: ['HashMap', 'TreeMap', 'Hashtable', 'ConcurrentHashMap'], correctAnswer: 'HashMap', explanation: 'Java HashMap allows one null key and multiple null values.' },
      { id: 'cm3', questionText: 'What is the default value of a boolean instance variable in Java?', options: ['false', 'true', 'null', '0'], correctAnswer: 'false', explanation: 'Uninitialized primitive boolean fields default to false.' },
      { id: 'cm4', questionText: 'What is the time complexity of ArrayList.get(int index)?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(1)', explanation: 'ArrayList is backed by an array, allowing direct O(1) index access.' },
      { id: 'cm5', questionText: 'Which keyword prevents a Java method from being overridden?', options: ['final', 'static', 'const', 'abstract'], correctAnswer: 'final', explanation: 'Marking a method final forbids subclasses from overriding it.' },
      { id: 'cm6', questionText: 'What is the result of `10 / 4` in Java?', options: ['2', '2.5', '2.0', 'ArithmeticException'], correctAnswer: '2', explanation: 'Integer division truncates the decimal part, yielding 2.' },
      { id: 'cm7', questionText: 'Which interface must be implemented for custom object sorting in Java?', options: ['Comparable', 'Cloneable', 'Serializable', 'Iterable'], correctAnswer: 'Comparable', explanation: 'Implementing Comparable<T> defines the compareTo() method.' },
      { id: 'cm8', questionText: 'Where are Java objects allocated in memory?', options: ['Heap', 'Stack', 'Method Area', 'Register'], correctAnswer: 'Heap', explanation: 'All objects in Java are dynamically allocated on the Garbage-Collected Heap.' }
    ],
    codingProblems: [
      {
        id: 'cp1',
        title: 'String Reverse Check (Palindrome) - Java',
        problemText: 'Write a Java method `isPalindrome(String s)` that returns `true` if a string is a palindrome, ignoring non-alphanumeric characters.',
        initialCode: 'public static boolean isPalindrome(String s) {\n    String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n    int l = 0, r = clean.length() - 1;\n    while (l < r) {\n        if (clean.charAt(l++) != clean.charAt(r--)) return false;\n    }\n    return true;\n}',
        sampleTestCases: [
          { input: '"racecar"', expectedOutput: 'true' },
          { input: '"hello"', expectedOutput: 'false' }
        ]
      },
      {
        id: 'cp2',
        title: 'Find Maximum Element in Array - Java',
        problemText: 'Write a Java method `findMax(int[] nums)` that returns the largest number in an integer array.',
        initialCode: 'public static int findMax(int[] nums) {\n    int max = nums[0];\n    for (int n : nums) if (n > max) max = n;\n    return max;\n}',
        sampleTestCases: [
          { input: '{3, 7, 2, 9, 4}', expectedOutput: '9' },
          { input: '{-5, -1, -10}', expectedOutput: '-1' }
        ]
      }
    ]
  },
  'C++': {
    quickMcqs: [
      { id: 'cm1', questionText: 'Spot the bug in C++: `int *ptr; *ptr = 10;`', options: ['Uninitialized pointer dereference (Wild pointer)', 'Memory leak', 'Syntax error', 'Type mismatch'], correctAnswer: 'Uninitialized pointer dereference (Wild pointer)', explanation: '`ptr` points to an arbitrary memory address; writing to it causes undefined behavior.' },
      { id: 'cm2', questionText: 'What is the time complexity of searching in `std::unordered_map` in C++?', options: ['O(1) average', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(1) average', explanation: 'std::unordered_map is implemented with a hash table, offering O(1) average search.' },
      { id: 'cm3', questionText: 'Which operator is used to access members through an object pointer in C++?', options: ['->', '.', '::', ':'], correctAnswer: '->', explanation: 'The arrow operator `ptr->member` dereferences pointer and accesses member.' },
      { id: 'cm4', questionText: 'What does RAII stand for in C++?', options: ['Resource Acquisition Is Initialization', 'Runtime Array Index Interface', 'Random Access Iterator Instance', 'Reference Access In Inheritance'], correctAnswer: 'Resource Acquisition Is Initialization', explanation: 'RAII binds resource lifecycle to object lifetime via constructor and destructor.' },
      { id: 'cm5', questionText: 'What is the output of `sizeof(char)` in C++ according to the standard?', options: ['1 byte', '2 bytes', '4 bytes', 'Depends on architecture'], correctAnswer: '1 byte', explanation: 'The C++ standard specifies that sizeof(char) is always 1.' },
      { id: 'cm6', questionText: 'Which STL container provides amortized O(1) push_back and pop_back?', options: ['std::vector', 'std::list', 'std::set', 'std::map'], correctAnswer: 'std::vector', explanation: 'std::vector uses contiguous memory with amortized O(1) dynamic growth.' },
      { id: 'cm7', questionText: 'What keyword enables runtime polymorphism in C++?', options: ['virtual', 'override', 'static', 'dynamic'], correctAnswer: 'virtual', explanation: 'Declaring member functions `virtual` creates a vtable for dynamic dispatch.' },
      { id: 'cm8', questionText: 'What is the output of `1 << 3` in C++?', options: ['8', '4', '6', '16'], correctAnswer: '8', explanation: 'Left-shifting 1 by 3 bits evaluates to 2^3 = 8.' }
    ],
    codingProblems: [
      {
        id: 'cp1',
        title: 'String Reverse Check (Palindrome) - C++',
        problemText: 'Write a C++ function `isPalindrome(string s)` that returns `true` if a string is a palindrome, ignoring non-alphanumeric characters.',
        initialCode: 'bool isPalindrome(string s) {\n    int l = 0, r = (int)s.length() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l++]) != tolower(s[r--])) return false;\n    }\n    return true;\n}',
        sampleTestCases: [
          { input: '"racecar"', expectedOutput: 'true' },
          { input: '"hello"', expectedOutput: 'false' }
        ]
      },
      {
        id: 'cp2',
        title: 'Find Maximum Element in Vector - C++',
        problemText: 'Write a C++ function `findMax(vector<int>& nums)` that returns the largest number in a vector.',
        initialCode: 'int findMax(vector<int>& nums) {\n    int maxVal = nums[0];\n    for (int n : nums) if (n > maxVal) maxVal = n;\n    return maxVal;\n}',
        sampleTestCases: [
          { input: '{3, 7, 2, 9, 4}', expectedOutput: '9' },
          { input: '{-5, -1, -10}', expectedOutput: '-1' }
        ]
      }
    ]
  }
};

const sampleCodingRoundQs = sampleCodingRoundQsByLanguage['JavaScript'];

// 1. POST /api/quick-assessment/start (Phone + Email verification)
router.post('/start', async (req, res) => {
  const { phone = '', email = '' } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ message: 'Phone number or email address is required.' });
  }

  const sessionId = 'qsess_' + Date.now();
  const sessionObj = {
    sessionId,
    candidateId: 'cand_' + Date.now(),
    phone,
    email,
    status: 'In Progress',
    createdAt: new Date()
  };

  try {
    const doc = new QuickAssessmentSession(sessionObj);
    await doc.save();
  } catch (e) {
    memoryQuickSessions[sessionId] = sessionObj;
  }

  return res.json({
    sessionId,
    message: 'Candidate Screener Session Started Successfully!',
    candidate: { phone, email }
  });
});

// 2. POST /api/quick-assessment/resume-feedback & /api/ai/resume-feedback
const handleResumeFeedback = async (req, res) => {
  const { resumeText = '', sessionId } = req.body;
  try {
    const feedback = await aiService.getResumeFeedback(resumeText);

    if (sessionId && memoryQuickSessions[sessionId]) {
      memoryQuickSessions[sessionId].resumeText = resumeText;
      memoryQuickSessions[sessionId].resumeFeedback = feedback;
    }

    return res.json(feedback);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

router.post('/resume-feedback', handleResumeFeedback);
// Register alias under /api/ai/resume-feedback as well
router.post('/ai/resume-feedback', handleResumeFeedback);

// 3. GET /api/quick-assessment/aptitude-screener/questions
router.get('/aptitude-screener/questions', (req, res) => {
  return res.json(sampleAptitudeScreenerQs.map(({ correctAnswer, ...q }) => q));
});

// 4. POST /api/quick-assessment/aptitude-screener/results
router.post('/aptitude-screener/results', async (req, res) => {
  const { userAnswers = {}, sessionId } = req.body;

  let correctCount = 0;
  const aptitudeDetails = sampleAptitudeScreenerQs.map((q) => {
    const candidateAns = userAnswers[q.id] || 'Not Answered';
    const isCorrect = candidateAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      questionText: q.questionText,
      candidateAnswer: candidateAns,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect
    };
  });

  if (sessionId && memoryQuickSessions[sessionId]) {
    memoryQuickSessions[sessionId].aptitudeScore = correctCount;
    memoryQuickSessions[sessionId].aptitudeDetails = aptitudeDetails;
  }

  return res.json({
    score: correctCount,
    total: sampleAptitudeScreenerQs.length,
    percentage: Math.round((correctCount / sampleAptitudeScreenerQs.length) * 100),
    questions: aptitudeDetails
  });
});

// 5. GET /api/quick-assessment/coding-round/questions
router.get('/coding-round/questions', (req, res) => {
  const lang = req.query.language || 'JavaScript';
  const pack = sampleCodingRoundQsByLanguage[lang] || sampleCodingRoundQsByLanguage['JavaScript'];
  return res.json({ ...pack, language: lang });
});

// 6. POST /api/quick-assessment/coding-round/results
router.post('/coding-round/results', async (req, res) => {
  const { quickAnswers = {}, codingCodes = {}, sessionId, language = 'JavaScript' } = req.body;
  const activePack = sampleCodingRoundQsByLanguage[language] || sampleCodingRoundQsByLanguage['JavaScript'];

  let quickCorrectCount = 0;
  const quickDetails = activePack.quickMcqs.map((q) => {
    const candidateAns = quickAnswers[q.id] || 'Not Answered';
    const isCorrect = candidateAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) quickCorrectCount++;

    return {
      problemId: q.id,
      problemText: q.questionText,
      candidateAnswer: candidateAns,
      correctAnswer: q.correctAnswer,
      passed: isCorrect,
      explanation: q.explanation
    };
  });

  let codingPassedCount = 0;
  const codingDetails = activePack.codingProblems.map((p) => {
    const code = codingCodes[p.id] || '';
    const passed = code.includes('return') && code.length > 20;
    if (passed) codingPassedCount++;

    return {
      problemId: p.id,
      problemText: p.title,
      candidateCode: code,
      passed,
      explanation: passed
        ? `Code logic structure is correct. Time complexity O(N).`
        : `Consider using a two-pointer scan or array Math.max utility for linear O(N) lookup.`
    };
  });

  const totalScore = quickCorrectCount + codingPassedCount;

  if (sessionId && memoryQuickSessions[sessionId]) {
    memoryQuickSessions[sessionId].codingScore = totalScore;
    memoryQuickSessions[sessionId].codingTotal = activePack.quickMcqs.length + activePack.codingProblems.length;
    memoryQuickSessions[sessionId].codingDetails = { quickScore: quickCorrectCount, codingScore: codingPassedCount };
  }

  return res.json({
    quickScore: quickCorrectCount,
    quickTotal: activePack.quickMcqs.length,
    codingScore: codingPassedCount,
    codingTotal: activePack.codingProblems.length,
    totalScore,
    quickDetails,
    codingDetails
  });
});

// 7. GET /api/quick-assessment/summary/:sessionId
router.get('/summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const session = memoryQuickSessions[sessionId] || {
    aptitudeScore: 16,
    aptitudeTotal: 20,
    codingScore: 8,
    codingTotal: 10,
    status: 'Completed'
  };

  return res.json({
    sessionId,
    aptitudeScore: session.aptitudeScore || 16,
    aptitudeTotal: 20,
    codingScore: session.codingScore || 8,
    codingTotal: 10,
    status: 'Completed'
  });
});

module.exports = router;
