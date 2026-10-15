const seedQuestions = [
  // Quantitative Aptitude
  {
    category: 'Quantitative Aptitude',
    subTopic: 'Time and Work',
    difficulty: 'Easy',
    questionText: 'A can do a work in 10 days and B in 15 days. How many days will they take to finish the work together?',
    options: ['5 days', '6 days', '7.5 days', '8 days'],
    correctAnswer: '6 days',
    explanation: 'A 1 day work = 1/10, B 1 day work = 1/15. Together 1 day work = 1/10 + 1/15 = 5/30 = 1/6. Total days = 6.',
    questionType: 'MCQ',
    referenceNotes: 'Formula: Combined Days = (A * B) / (A + B).'
  },
  {
    category: 'Quantitative Aptitude',
    subTopic: 'Profit and Loss',
    difficulty: 'Medium',
    questionText: 'A trader sells an item at a profit of 20%. If he bought it at 10% less and sold it for $18 less, he would gain 30%. Find Cost Price.',
    options: ['$$600$', '$$500$', '$$400$', '$$450$'],
    correctAnswer: '$$600$',
    explanation: 'Let CP = x. SP1 = 1.2x. New CP = 0.9x. New SP = 1.3 * 0.9x = 1.17x. Given 1.2x - 1.17x = 18 => 0.03x = 18 => x = 600.',
    questionType: 'MCQ',
    referenceNotes: 'Profit % = (Profit / Cost Price) * 100.'
  },
  {
    category: 'Quantitative Aptitude',
    subTopic: 'Averages',
    difficulty: 'Easy',
    questionText: 'The average score of 5 students in a test is 80. If one student who scored 100 is removed, what is the new average?',
    options: ['75', '78', '70', '72'],
    correctAnswer: '75',
    explanation: 'Total score = 5 * 80 = 400. After removing 100, remaining sum = 300. New average = 300 / 4 = 75.',
    questionType: 'MCQ',
    referenceNotes: 'Average = Total Sum / Count of items.'
  },
  {
    category: 'Quantitative Aptitude',
    subTopic: 'Speed, Distance & Time',
    difficulty: 'Medium',
    questionText: 'A train 150m long crosses a pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['50 km/h', '60 km/h', '66 km/h', '70 km/h'],
    correctAnswer: '60 km/h',
    explanation: 'Speed = 150/9 m/s = 50/3 m/s. In km/h = (50/3) * (18/5) = 60 km/h.',
    questionType: 'MCQ',
    referenceNotes: 'To convert m/s to km/h, multiply by 18/5.'
  },

  // Logical Reasoning
  {
    category: 'Logical Reasoning',
    subTopic: 'Number Series',
    difficulty: 'Easy',
    questionText: 'Complete the series: 3, 7, 15, 31, 63, ?',
    options: ['125', '127', '129', '131'],
    correctAnswer: '127',
    explanation: 'Pattern: Each term is (previous * 2) + 1. So 63 * 2 + 1 = 127.',
    questionType: 'MCQ',
    referenceNotes: 'Look for exponential growth or double difference patterns in series questions.'
  },
  {
    category: 'Logical Reasoning',
    subTopic: 'Coding-Decoding',
    difficulty: 'Easy',
    questionText: 'If COMPUTER is coded as RFUVQNPC, how is MEDICINE coded in that language?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEJDJEO'],
    correctAnswer: 'EOJDJEFM',
    explanation: 'Reverse the word and add +1 to each letter. Reverse of MEDICINE is ENICIDEM -> +1 gives EOJDJEFM.',
    questionType: 'MCQ',
    referenceNotes: 'Check letter reversal, (+1/-1) offsets, and position swaps.'
  },
  {
    category: 'Logical Reasoning',
    subTopic: 'Blood Relations',
    difficulty: 'Medium',
    questionText: 'Pointing to a photograph, a man said "I have no brother or sister, but that man\'s father is my father\'s son". Whose photo was it?',
    options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
    correctAnswer: 'His son\'s',
    explanation: '"My father\'s son" = the man himself (since he has no brother). So "that man\'s father is ME" -> The photo is his son.',
    questionType: 'MCQ',
    referenceNotes: 'Break down blood relation statements backwards step by step.'
  },

  // Verbal Ability
  {
    category: 'Verbal Ability',
    subTopic: 'Antonyms & Synonyms',
    difficulty: 'Easy',
    questionText: 'Select the word that is most nearly OPPOSITE in meaning to "CANDID":',
    options: ['Frank', 'Deceitful', 'Outspoken', 'Sincere'],
    correctAnswer: 'Deceitful',
    explanation: 'Candid means honest and straightforward. The opposite is deceitful or secretive.',
    questionType: 'MCQ',
    referenceNotes: 'Read root words and prefixes (e.g. De-, Un-, In-).'
  },
  {
    category: 'Verbal Ability',
    subTopic: 'Sentence Correction',
    difficulty: 'Medium',
    questionText: 'Choose the correct sentence:',
    options: [
      'Neither of the two boys were present.',
      'Neither of the two boys was present.',
      'Neither of the two boys are present.',
      'Neither of the two boys have been present.'
    ],
    correctAnswer: 'Neither of the two boys was present.',
    explanation: '"Neither" is a singular pronoun and takes a singular verb "was".',
    questionType: 'MCQ',
    referenceNotes: 'Subject-Verb agreement rule: Neither/Either take singular verbs.'
  },

  // Data Interpretation
  {
    category: 'Data Interpretation',
    subTopic: 'Pie Chart Analysis',
    difficulty: 'Medium',
    questionText: 'If a company spends 25% of its 10 Million budget on R&D and 40% on Marketing, how much more money is spent on Marketing than R&D?',
    options: ['$1.5 Million', '$2.5 Million', '$1.0 Million', '$2.0 Million'],
    correctAnswer: '$1.5 Million',
    explanation: 'Difference = (40% - 25%) = 15% of $10M = $1.5 Million.',
    questionType: 'MCQ',
    referenceNotes: 'Calculate percentage differences before converting to raw amounts to save time.'
  },

  // ==========================================
  // Coding Questions by Language (Python, Java, C++, JavaScript, C)
  // ==========================================

  // --- PYTHON CODING QUESTIONS ---
  {
    category: 'Coding',
    subTopic: 'Python Strings & Slicing',
    difficulty: 'Easy',
    language: 'Python',
    questionType: 'Coding',
    questionText: 'Problem 1 (Python): Check if a string is a Palindrome ignoring non-alphanumeric characters.',
    codeSnippet: `def is_palindrome(s: str) -> bool:\n    # Step 1: Normalize & filter non-alphanumeric chars\n    clean_s = ''.join(c.lower() for c in s if c.isalnum())\n    # Step 2: Compare with reversed slice\n    return clean_s == clean_s[::-1]`,
    options: ['Slicing / Two-Pointer O(N) approach', 'O(N^2) String Mutation', 'IndexError', 'RecursionError'],
    correctAnswer: 'Slicing / Two-Pointer O(N) approach',
    explanation: 'Python list/string slicing [::-1] creates a reversed view in O(N) time. Filtering with isalnum() handles spaces and symbols cleanly.',
    referenceNotes: 'Python strings are immutable. clean_s[::-1] is optimized in CPython.'
  },
  {
    category: 'Coding',
    subTopic: 'Python Dictionaries & Hash Maps',
    difficulty: 'Easy',
    language: 'Python',
    questionType: 'Coding',
    questionText: 'Problem 2 (Python): Find two indices in a list that add up to a given target (Two Sum).',
    codeSnippet: `def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}  # Map value -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
    options: ['O(N) Dictionary Hash Map single pass', 'O(N^2) Nested for-loops', 'O(N log N) Sorting', 'KeyError exception'],
    correctAnswer: 'O(N) Dictionary Hash Map single pass',
    explanation: 'Python dict lookups `in seen` run in O(1) average time. One linear pass over the list finds the complement in O(N) total time.',
    referenceNotes: 'Dictionary lookups are implemented as high-performance open-addressing hash tables.'
  },
  {
    category: 'Coding',
    subTopic: 'Python Linked Lists',
    difficulty: 'Medium',
    language: 'Python',
    questionType: 'Coding',
    questionText: 'Problem 3 (Python): Reverse a Singly Linked List in-place and return new head.',
    codeSnippet: `def reverse_linked_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
    options: ['Iterative in-place O(N) reversal', 'Recursive call stack overflow', 'O(N^2) Node traversal', 'AttributeError on NoneType'],
    correctAnswer: 'Iterative in-place O(N) reversal',
    explanation: 'Three pointers (prev, curr, next_node) reverse references iteratively in O(N) time and O(1) space without extra memory allocation.',
    referenceNotes: 'Reversing in-place avoids constructing auxiliary linked list nodes.'
  },
  {
    category: 'Coding',
    subTopic: 'Python Dynamic Programming',
    difficulty: 'Medium',
    language: 'Python',
    questionType: 'Coding',
    questionText: 'Problem 4 (Python): Find the contiguous subarray with maximum sum using Kadane\'s Algorithm.',
    codeSnippet: `def max_subarray(nums: list[int]) -> int:\n    max_sum = current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_sum = max(max_sum, current_sum)\n    return max_sum`,
    options: ['Kadane\'s Algorithm dynamic programming O(N)', 'Brute force triple loop O(N^3)', 'Divide and conquer O(N^2)', 'Index out of range'],
    correctAnswer: 'Kadane\'s Algorithm dynamic programming O(N)',
    explanation: 'Kadane\'s algorithm calculates max contiguous sum ending at each index in a single O(N) pass, requiring O(1) extra space.',
    referenceNotes: 'Works seamlessly even when all array values are negative.'
  },
  {
    category: 'Coding',
    subTopic: 'Python Stacks & Parsing',
    difficulty: 'Medium',
    language: 'Python',
    questionType: 'Coding',
    questionText: 'Problem 5 (Python): Validate balanced parentheses string \'({[]})\' using a stack.',
    codeSnippet: `def is_valid_parentheses(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack`,
    options: ['Stack LIFO matching O(N)', 'Queue FIFO traversal', 'Regex string replacement O(N^2)', 'KeyError on lookup'],
    correctAnswer: 'Stack LIFO matching O(N)',
    explanation: 'Pushing opening brackets onto a stack and popping to match closing brackets runs in O(N) time and guarantees balanced pairs.',
    referenceNotes: 'Python lists provide O(1) append() and pop() for stack implementations.'
  },

  // --- JAVA CODING QUESTIONS ---
  {
    category: 'Coding',
    subTopic: 'Java Strings & Arrays',
    difficulty: 'Easy',
    language: 'Java',
    questionType: 'Coding',
    questionText: 'Problem 1 (Java): Check if a string is a Palindrome ignoring case and non-alphanumeric chars.',
    codeSnippet: `public static boolean isPalindrome(String s) {\n    String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n    int left = 0, right = clean.length() - 1;\n    while (left < right) {\n        if (clean.charAt(left++) != clean.charAt(right--)) return false;\n    }\n    return true;\n}`,
    options: ['Two-pointer O(N) string check', 'O(N^2) String Mutation', 'ArrayIndexOutOfBoundsException', 'NullPointerException'],
    correctAnswer: 'Two-pointer O(N) string check',
    explanation: 'Uses clean.charAt() with two pointers meeting in the center to verify palindrome symmetry in O(N) time.',
    referenceNotes: 'Remember String.replaceAll() uses regular expressions in Java.'
  },
  {
    category: 'Coding',
    subTopic: 'Java HashMaps & Collections',
    difficulty: 'Easy',
    language: 'Java',
    questionType: 'Coding',
    questionText: 'Problem 2 (Java): Find two array indices that add up to a Target using HashMap.',
    codeSnippet: `import java.util.HashMap;\n\npublic static int[] twoSum(int[] nums, int target) {\n    HashMap<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[0];\n}`,
    options: ['HashMap complement lookup O(N)', 'Brute force double loop O(N^2)', 'Arrays.sort() O(N log N)', 'ConcurrentModificationException'],
    correctAnswer: 'HashMap complement lookup O(N)',
    explanation: 'Java HashMap.containsKey() and get() have O(1) average time complexity, giving O(N) overall runtime for Two Sum.',
    referenceNotes: 'HashMap is part of Java Collections Framework (java.util).'
  },
  {
    category: 'Coding',
    subTopic: 'Java Linked Lists',
    difficulty: 'Medium',
    language: 'Java',
    questionType: 'Coding',
    questionText: 'Problem 3 (Java): In-place Singly Linked List reversal.',
    codeSnippet: `public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
    options: ['In-place 3-pointer O(N) iteration', 'Stack recursion overflow', 'O(N^2) Node copying', 'NullPointerException'],
    correctAnswer: 'In-place 3-pointer O(N) iteration',
    explanation: 'Iteratively rewires curr.next to prev pointer while preserving nextTemp, reversing the entire list in O(N) time with O(1) memory.',
    referenceNotes: 'Always store nextTemp before mutating curr.next.'
  },
  {
    category: 'Coding',
    subTopic: 'Java Dynamic Programming',
    difficulty: 'Medium',
    language: 'Java',
    questionType: 'Coding',
    questionText: 'Problem 4 (Java): Maximum Subarray Sum using Kadane\'s Algorithm.',
    codeSnippet: `public static int maxSubArray(int[] nums) {\n    int maxSoFar = nums[0];\n    int currMax = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}`,
    options: ['Kadane\'s Algorithm single-pass O(N)', 'Brute force triple loop O(N^3)', 'Divide and Conquer O(N log N)', 'ArithmeticException'],
    correctAnswer: 'Kadane\'s Algorithm single-pass O(N)',
    explanation: 'Kadane\'s algorithm scans the array once, keeping track of the best subarray sum ending at each position in O(N) time.',
    referenceNotes: 'Math.max() provides clean numeric comparisons in Java.'
  },
  {
    category: 'Coding',
    subTopic: 'Java Stacks',
    difficulty: 'Medium',
    language: 'Java',
    questionType: 'Coding',
    questionText: 'Problem 5 (Java): Validate balanced brackets string using java.util.Stack.',
    codeSnippet: `import java.util.Stack;\n\npublic static boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == \'(\') stack.push(\')\');\n        else if (c == \'{\') stack.push(\'}\');\n        else if (c == \'[\') stack.push(\']\');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}`,
    options: ['Stack LIFO verification O(N)', 'Queue FIFO traversal', 'String regex replace', 'EmptyStackException'],
    correctAnswer: 'Stack LIFO verification O(N)',
    explanation: 'Pushes expected closing brackets onto the stack. Comparing stack.pop() against encountered closing brackets validates balanced order in O(N).',
    referenceNotes: 'Deque<Character> ArrayDeque is often preferred over legacy Stack in modern Java.'
  },

  // --- C++ CODING QUESTIONS ---
  {
    category: 'Coding',
    subTopic: 'C++ Strings & Two Pointers',
    difficulty: 'Easy',
    language: 'C++',
    questionType: 'Coding',
    questionText: 'Problem 1 (C++): Check Palindrome using two pointers and STL isalnum().',
    codeSnippet: `#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        while (left < right && !isalnum(s[left])) left++;\n        while (left < right && !isalnum(s[right])) right--;\n        if (tolower(s[left++]) != tolower(s[right--])) return false;\n    }\n    return true;\n}`,
    options: ['Two-pointer O(N) scan using STL', 'O(N^2) string copying', 'Segmentation fault', 'Memory leak'],
    correctAnswer: 'Two-pointer O(N) scan using STL',
    explanation: 'C++ STL isalnum() and tolower() skip non-alphanumeric chars and verify palindrome symmetry in-place in O(N) time with O(1) space.',
    referenceNotes: 'C++ strings support random access indexing s[left] in O(1).'
  },
  {
    category: 'Coding',
    subTopic: 'C++ STL unordered_map',
    difficulty: 'Easy',
    language: 'C++',
    questionType: 'Coding',
    questionText: 'Problem 2 (C++): Two Sum using std::unordered_map.',
    codeSnippet: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int complement = target - nums[i];\n        if (mp.find(complement) != mp.end()) {\n            return { mp[complement], i };\n        }\n        mp[nums[i]] = i;\n    }\n    return {};\n}`,
    options: ['unordered_map hash table O(N)', 'Nested loop brute force O(N^2)', 'std::sort with two pointers O(N log N)', 'out_of_range exception'],
    correctAnswer: 'unordered_map hash table O(N)',
    explanation: 'std::unordered_map lookup mp.find() runs in O(1) average time via hash buckets, yielding an optimal O(N) runtime.',
    referenceNotes: 'Use std::unordered_map instead of std::map for O(1) hash table performance.'
  },
  {
    category: 'Coding',
    subTopic: 'C++ Pointers & Linked Lists',
    difficulty: 'Medium',
    language: 'C++',
    questionType: 'Coding',
    questionText: 'Problem 3 (C++): Reverse Singly Linked List with raw pointers.',
    codeSnippet: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr != nullptr) {\n        ListNode* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
    options: ['In-place 3-pointer iterative reversal O(N)', 'Recursion stack overflow', 'Dangling pointer hazard', 'Memory leak'],
    correctAnswer: 'In-place 3-pointer iterative reversal O(N)',
    explanation: 'Iterative pointer rewiring uses O(1) extra memory and runs in O(N) time with zero dynamic allocations or memory leaks.',
    referenceNotes: 'Remember to initialize pointers to nullptr in C++11 and later.'
  },
  {
    category: 'Coding',
    subTopic: 'C++ Dynamic Programming',
    difficulty: 'Medium',
    language: 'C++',
    questionType: 'Coding',
    questionText: 'Problem 4 (C++): Maximum Subarray Sum with Kadane\'s Algorithm and std::max.',
    codeSnippet: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSoFar = nums[0];\n    int currMax = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        currMax = max(nums[i], currMax + nums[i]);\n        maxSoFar = max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}`,
    options: ['Kadane\'s algorithm with std::max O(N)', 'Brute force triple loops O(N^3)', 'Divide and conquer O(N log N)', 'vector subscript error'],
    correctAnswer: 'Kadane\'s algorithm with std::max O(N)',
    explanation: 'Calculates the optimal running subarray sum in a single O(N) pass utilizing STL std::max.',
    referenceNotes: 'std::max requires <algorithm> header in C++.'
  },
  {
    category: 'Coding',
    subTopic: 'C++ STL stack',
    difficulty: 'Medium',
    language: 'C++',
    questionType: 'Coding',
    questionText: 'Problem 5 (C++): Valid Balanced Parentheses check using std::stack.',
    codeSnippet: `#include <stack>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == \')\' && st.top() != \'(\') return false;\n            if (c == \'}\' && st.top() != \'{\') return false;\n            if (c == \']\' && st.top() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`,
    options: ['std::stack LIFO matching O(N)', 'std::queue FIFO checking', 'std::string::replace recursive', 'std::out_of_range'],
    correctAnswer: 'std::stack LIFO matching O(N)',
    explanation: 'Uses std::stack to push opening brackets and pop matching closing brackets, checking balanced order in O(N) time.',
    referenceNotes: 'Always check !st.empty() before calling st.top() to avoid undefined behavior.'
  },

  // --- JAVASCRIPT CODING QUESTIONS ---
  {
    category: 'Coding',
    subTopic: 'JavaScript Strings & Regex',
    difficulty: 'Easy',
    language: 'JavaScript',
    questionType: 'Coding',
    questionText: 'Problem 1 (JavaScript): Check if a string is a Palindrome ignoring non-alphanumeric chars.',
    codeSnippet: `function isPalindrome(str) {\n  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = cleanStr.length - 1;\n  while (left < right) {\n    if (cleanStr[left] !== cleanStr[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
    options: ['Optimal O(N) Two-Pointer approach', 'O(N^2) String Mutation', 'Stack Overflow Error', 'Syntax Error'],
    correctAnswer: 'Optimal O(N) Two-Pointer approach',
    explanation: 'Regex /[^a-z0-9]/g strips non-alphanumerics, and two pointers inward check symmetry in O(N) time.',
    referenceNotes: 'JavaScript strings are primitive and immutable.'
  },
  {
    category: 'Coding',
    subTopic: 'JavaScript Maps & Hash Tables',
    difficulty: 'Easy',
    language: 'JavaScript',
    questionType: 'Coding',
    questionText: 'Problem 2 (JavaScript): Find two indices in an array whose elements sum up to Target (Two Sum).',
    codeSnippet: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    options: ['O(N) Map single-pass solution', 'O(N^2) Brute Force nested loops', 'O(N log N) Sorting approach', 'Infinite loop error'],
    correctAnswer: 'O(N) Map single-pass solution',
    explanation: 'JavaScript Map has() and get() operate in O(1) time, solving Two Sum in a single O(N) pass.',
    referenceNotes: 'ES6 Map supports any key types and preserves insertion order.'
  },
  {
    category: 'Coding',
    subTopic: 'JavaScript Linked Lists',
    difficulty: 'Medium',
    language: 'JavaScript',
    questionType: 'Coding',
    questionText: 'Problem 3 (JavaScript): Reverse a Singly Linked List in-place and return new head.',
    codeSnippet: `function reverseLinkedList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}`,
    options: ['In-Place Iterative O(N) reversal', 'Recursive call stack overflow', 'O(N^2) Node reassignment', 'Memory leak error'],
    correctAnswer: 'In-Place Iterative O(N) reversal',
    explanation: 'Sliding three object references (prev, curr, nextTemp) reverses the list in-place in O(N) time with O(1) space.',
    referenceNotes: 'JavaScript garbage collector cleans unreferenced previous heads.'
  },
  {
    category: 'Coding',
    subTopic: 'JavaScript Dynamic Programming',
    difficulty: 'Medium',
    language: 'JavaScript',
    questionType: 'Coding',
    questionText: 'Problem 4 (JavaScript): Maximum Subarray Sum using Kadane\'s Algorithm.',
    codeSnippet: `function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}`,
    options: ['Kadane\'s Algorithm single-pass O(N)', 'Brute force triple loops O(N^3)', 'Divide and conquer O(N log N)', 'NaN return error'],
    correctAnswer: 'Kadane\'s Algorithm single-pass O(N)',
    explanation: 'Uses Math.max() to maintain running sum in a single O(N) pass, taking O(1) extra memory.',
    referenceNotes: 'Handles all negative values correctly by returning the highest single negative.'
  },
  {
    category: 'Coding',
    subTopic: 'JavaScript Stacks',
    difficulty: 'Medium',
    language: 'JavaScript',
    questionType: 'Coding',
    questionText: 'Problem 5 (JavaScript): Validate balanced parentheses using an array stack.',
    codeSnippet: `function isValidParentheses(s) {\n  const stack = [];\n  const pairs = { \')\': \'(\', \'}\': \'{\', \']\': \'[\' };\n  for (let char of s) {\n    if (char === \'(\' || char === \'{\' || char === \'[\') {\n      stack.push(char);\n    } else if (pairs[char]) {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    options: ['Stack LIFO matching O(N)', 'Queue FIFO traversal', 'Regex recursion O(N^2)', 'TypeError on pop'],
    correctAnswer: 'Stack LIFO matching O(N)',
    explanation: 'Array push() and pop() operate in O(1) amortized time, verifying balanced bracket nesting in O(N) time.',
    referenceNotes: 'stack.length === 0 ensures no unclosed open brackets remain.'
  },

  // --- C CODING QUESTIONS ---
  {
    category: 'Coding',
    subTopic: 'C Strings & Pointers',
    difficulty: 'Easy',
    language: 'C',
    questionType: 'Coding',
    questionText: 'Problem 1 (C): Check if a null-terminated string is a Palindrome.',
    codeSnippet: `#include <stdbool.h>\n#include <ctype.h>\n#include <string.h>\n\nbool isPalindrome(char* s) {\n    int left = 0, right = strlen(s) - 1;\n    while (left < right) {\n        while (left < right && !isalnum(s[left])) left++;\n        while (left < right && !isalnum(s[right])) right--;\n        if (tolower(s[left++]) != tolower(s[right--])) return false;\n    }\n    return true;\n}`,
    options: ['Two-pointer pointer arithmetic O(N)', 'String mutation segmentation fault', 'Buffer overflow error', 'Wild pointer dereference'],
    correctAnswer: 'Two-pointer pointer arithmetic O(N)',
    explanation: 'Standard C two-pointer traversal comparing characters inward in O(N) time without allocating extra memory.',
    referenceNotes: 'Ensure string is null-terminated before calling strlen().'
  },
  {
    category: 'Coding',
    subTopic: 'C Dynamic Programming',
    difficulty: 'Medium',
    language: 'C',
    questionType: 'Coding',
    questionText: 'Problem 2 (C): Find Maximum Subarray Sum using Kadane\'s Algorithm.',
    codeSnippet: `int maxSubArray(int* nums, int numsSize) {\n    int maxSoFar = nums[0];\n    int currMax = nums[0];\n    for (int i = 1; i < numsSize; i++) {\n        currMax = (nums[i] > currMax + nums[i]) ? nums[i] : (currMax + nums[i]);\n        if (currMax > maxSoFar) maxSoFar = currMax;\n    }\n    return maxSoFar;\n}`,
    options: ['Kadane\'s algorithm O(N) linear scan', 'Brute force triple loops O(N^3)', 'Divide and conquer recursion O(N log N)', 'Segmentation fault'],
    correctAnswer: 'Kadane\'s algorithm O(N) linear scan',
    explanation: 'Single loop calculating max subarray sum ending at index i in O(N) time and O(1) space.',
    referenceNotes: 'Avoid ternary operator macro issues by writing clean numeric checks.'
  },

  // Software Engineering & SDLC (Incremental Model)
  {
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Easy',
    questionText: 'In Software Engineering, what defines the Incremental Model process?',
    options: [
      'Delivering the entire system as a single monolithic release at the very end',
      'Decomposing requirements into multiple standalone modules and delivering operational builds iteratively',
      'Skipping software architecture and coding directly without requirements',
      'Refactoring code continuously without releasing working software builds'
    ],
    correctAnswer: 'Decomposing requirements into multiple standalone modules and delivering operational builds iteratively',
    explanation: 'The Incremental Model breaks software development into smaller standalone increments. Each increment performs requirements, design, coding, and testing to produce an operational build.',
    questionType: 'MCQ',
    referenceNotes: 'Core system functionality is delivered in Increment 1, followed by feature expansions.'
  },
  {
    category: 'Software Engineering',
    subTopic: 'Incremental Model',
    difficulty: 'Medium',
    questionText: 'What is a major advantage of the Incremental SDLC Model over the Waterfall Model?',
    options: [
      'It requires zero initial planning or architectural design',
      'Working software is delivered earlier, allowing early customer feedback and lower risk of total failure',
      'Overall project cost is guaranteed to be 50% lower',
      'It removes the need for unit testing and system integration'
    ],
    correctAnswer: 'Working software is delivered earlier, allowing early customer feedback and lower risk of total failure',
    explanation: 'Because Increment 1 produces a working core module early in the project timeline, stakeholders get early hands-on feedback and project risk is significantly mitigated.',
    questionType: 'MCQ',
    referenceNotes: 'Waterfall only yields a working product in the final phase, making late changes expensive.'
  }
];

const seedCompanies = [
  {
    name: 'TCS',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'NQT Aptitude & Coding', duration: '120 mins', description: 'Quantitative, Logical, Verbal, Foundation & Advanced Coding.' },
        { name: 'Technical Interview', duration: '30 mins', description: 'Core CS subjects (DBMS, Java/Python, OOPs, SQL).' },
        { name: 'HR / MR Round', duration: '15 mins', description: 'Behavioral, relocation willingness, communication assessment.' }
      ],
      eligibility: '60% throughout 10th, 12th, and B.Tech / CS Graduation with max 1 active backlog.',
      difficulty: 'Medium'
    },
    technicalQuestions: [
      { question: 'What is the difference between primary key and unique key in SQL?', answer: 'Primary key does not allow NULL values and only 1 allowed per table. Unique key allows one NULL value and multiple unique keys can exist.', topic: 'DBMS' },
      { question: 'Explain Method Overloading vs Method Overriding.', answer: 'Overloading is compile-time polymorphism in same class with different parameters. Overriding is runtime polymorphism in child class with same method signature.', topic: 'OOPs' }
    ],
    hrQuestions: [
      { question: 'Why do you want to join TCS?', answer: 'Mention TCS market stability, extensive learning platforms (iON), and global project exposure for freshers.', tips: 'Highlight your enthusiasm for continuous learning.' }
    ],
    codingQuestions: [
      { title: 'Count Vowels and Consonants', problemStatement: 'Write a program to count vowels, consonants, and spaces in a string.', solution: 'Iterate character by character using char.toLowerCase() and check against vowels set.', language: 'Java' }
    ],
    experiences: [
      { studentName: 'Rahul Sharma', college: 'Tech Scholar', year: '2025', verdict: 'Selected', story: 'NQT test was medium. Technical round focused heavily on SQL joins and my final year React project!' }
    ],
    preparationTips: ['Focus on TCS NQT previous year quantitative aptitude questions.', 'Be clear on your final year project architecture.']
  },
  {
    name: 'Infosys',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'Online Assessment', duration: '100 mins', description: 'Mathematical, Reasoning, Verbal, Pseudocode & Puzzle solving.' },
        { name: 'Technical + HR Interview', duration: '40 mins', description: 'Single combined interview covering technical projects and scenario questions.' }
      ],
      eligibility: '60% or 6.0 CGPA in CS / IT degrees.',
      difficulty: 'Medium-Hard'
    },
    technicalQuestions: [
      { question: 'What is a Pointers in C++ and how to avoid memory leaks?', answer: 'Pointers store memory addresses. Use delete / free or smart pointers (unique_ptr, shared_ptr) to release heap memory.', topic: 'C++' }
    ],
    hrQuestions: [
      { question: 'Are you comfortable relocating to Infosys Mysore Training Campus?', answer: 'Express high enthusiasm for Mysore Global Education Center training.', tips: 'Always answer positively regarding relocation.' }
    ],
    codingQuestions: [
      { title: 'Reverse a Linked List', problemStatement: 'Given head of a singly linked list, reverse the list and return new head.', solution: 'Use three pointers: prev, current, next.', language: 'Python' }
    ],
    experiences: [
      { studentName: 'Priya Verma', college: 'State CS Dept', year: '2025', verdict: 'Selected', story: 'Pseudocode questions were tricky. Brush up on loop execution counts and bitwise operators!' }
    ],
    preparationTips: ['Practice pseudocode output questions.', 'Understand core Data Structures like Stacks and Arrays.']
  },
  {
    name: 'Accenture',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'Cognitive & Technical Assessment', duration: '90 mins', description: 'English Ability, Critical Reasoning, Abstract Reasoning, MS Office & Cloud fundamentals.' },
        { name: 'Coding Assessment', duration: '45 mins', description: '2 Coding problems on arrays/strings.' },
        { name: 'Communication Assessment', duration: '30 mins', description: 'Automated AI voice reading, repeating, and speaking evaluation.' }
      ],
      eligibility: '65% or 6.5 CGPA in CS/IT with no active backlogs during onboarding.',
      difficulty: 'Medium'
    },
    technicalQuestions: [
      { question: 'Explain the difference between GET and POST HTTP methods.', answer: 'GET requests parameters in URL, idempotent, cached. POST sends payload in request body, secure, non-cached.', topic: 'Web Development' }
    ],
    hrQuestions: [
      { question: 'Describe a situation where you worked in a team under tight deadlines.', answer: 'Focus on communication, task division, and resolving conflicts.', tips: 'Use the STAR technique.' }
    ],
    codingQuestions: [
      { title: 'Find Second Largest Element', problemStatement: 'Find the second largest number in an unsorted array without sorting.', solution: 'Maintain largest and secondLargest variables in a single pass O(N).', language: 'C++' }
    ],
    experiences: [
      { studentName: 'Ankit Kumar', college: 'City Tech', year: '2025', verdict: 'Selected', story: 'Communication round tests clarity and pronunciation. Speak loudly and steadily in a quiet room!' }
    ],
    preparationTips: ['Ensure good mic quality for the automated communication round.', 'Practice basic MS Office & Networking questions.']
  },
  {
    name: 'Wipro',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'NLTH Aptitude & Essay', duration: '120 mins', description: 'Verbal, Analytical, Quantitative, Essay Writing, 2 Coding Qs.' },
        { name: 'Technical Interview', duration: '30 mins', description: 'Programming basics, OOPs, Data Structures.' }
      ],
      eligibility: '60% throughout in 10th, 12th, and Graduation.',
      difficulty: 'Easy-Medium'
    },
    technicalQuestions: [
      { question: 'What is normalized database form (1NF, 2NF, 3NF)?', answer: '1NF eliminates repeating groups. 2NF removes partial dependencies. 3NF removes transitive dependencies.', topic: 'DBMS' }
    ],
    hrQuestions: [
      { question: 'Where do you see yourself in 3 years?', answer: 'Aim to be a skilled full-stack developer taking ownership of key modules.', tips: 'Show commitment to growth and stability.' }
    ],
    codingQuestions: [
      { title: 'Palindrome String Check', problemStatement: 'Check whether a given string is palindrome ignoring case.', solution: 'Two-pointer approach comparing start and end characters.', language: 'JavaScript' }
    ],
    experiences: [
      { studentName: 'Sneha Patel', college: 'National Inst', year: '2025', verdict: 'Selected', story: 'Essay writing test checks grammar and spelling. Keep paragraphs clear!' }
    ],
    preparationTips: ['Practice essay writing online without spellcheck.', 'Prepare core OOP definitions with real-world examples.']
  },
  {
    name: 'Cognizant',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'GenC Aptitude & Skill Assessment', duration: '120 mins', description: 'Quantitative, Reasoning, Verbal & Domain Specific Technical MCQs.' },
        { name: 'Technical Interview', duration: '45 mins', description: 'Deep dive into projects, Web Technologies, and SQL.' }
      ],
      eligibility: '60% or 6.0 CGPA throughout.',
      difficulty: 'Medium'
    },
    technicalQuestions: [
      { question: 'What is the Virtual DOM in React and how does it work?', answer: 'Virtual DOM is an in-memory lightweight copy of Real DOM. React uses diffing algorithm to update only changed nodes efficiently.', topic: 'MERN Stack' }
    ],
    hrQuestions: [
      { question: 'How do you handle constructive feedback from senior team members?', answer: 'Listen actively, ask clarifying questions, and use it as an opportunity to improve code quality.', tips: 'Demonstrate humility and growth mindset.' }
    ],
    codingQuestions: [
      { title: 'Fibonacci Series Iterative', problemStatement: 'Generate first N terms of Fibonacci sequence.', solution: 'Iterative loop maintaining last two numbers.', language: 'Java' }
    ],
    experiences: [
      { studentName: 'Vikas Gupta', college: 'Apex College', year: '2025', verdict: 'Selected', story: 'Interviewers tested live SQL query writing on screen sharing!' }
    ],
    preparationTips: ['Be comfortable writing live code and SQL queries during screen share.']
  },
  {
    name: 'Capgemini',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200',
    pattern: {
      rounds: [
        { name: 'Pseudocode & Game-based Aptitude', duration: '90 mins', description: '4 Interactive memory/spatial games + Pseudocode test.' },
        { name: 'Behavioral & Tech Interview', duration: '30 mins', description: 'Scenario questions, project presentation.' }
      ],
      eligibility: '55% or 5.5 CGPA in CS / IT.',
      difficulty: 'Medium'
    },
    technicalQuestions: [
      { question: 'What is REST API and what are standard response status codes?', answer: 'Representational State Transfer API. 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.', topic: 'Web APIs' }
    ],
    hrQuestions: [
      { question: 'What are your key strengths and weaknesses?', answer: 'State a technical strength (e.g. quick learner of modern JS frameworks) and a genuine weakness with an active solution (e.g. working on public speaking).', tips: 'Never say "I have no weakness".' }
    ],
    codingQuestions: [
      { title: 'Array Factorial Calculation', problemStatement: 'Calculate factorial of a number handling large values.', solution: 'BigInteger or array representation for overflow.', language: 'C' }
    ],
    experiences: [
      { studentName: 'Megha Nair', college: 'Tech Campus', year: '2025', verdict: 'Selected', story: 'Game-based aptitude tests focus, spatial awareness, and quick decisions!' }
    ],
    preparationTips: ['Try sample game-based aptitude practice tests before the actual assessment.']
  }
];

const seedAchievements = [
  { code: 'FIRST_QUIZ', title: 'First Quiz Completed', description: 'Completed your very first aptitude or coding quiz!', badgeIcon: '🎯', category: 'Quiz' },
  { code: 'SOLVED_100', title: '100 Questions Solved', description: 'Reached 100 questions practiced on the portal.', badgeIcon: '🔥', category: 'Quiz' },
  { code: 'STREAK_7', title: '7-Day Streak', description: 'Practiced continuously for 7 days in a row.', badgeIcon: '⚡', category: 'Streak' },
  { code: 'QUIZ_MASTER', title: 'Quiz Master', description: 'Scored 90%+ in 5 different quiz assessments.', badgeIcon: '👑', category: 'Quiz' },
  { code: 'INTERVIEW_EXPERT', title: 'Interview Expert', description: 'Completed 3 AI Mock Interviews with High confidence rating.', badgeIcon: '🤖', category: 'Interview' },
  { code: 'CODING_CHAMPION', title: 'Coding Champion', description: 'Solved coding challenges across 3 different programming languages.', badgeIcon: '🏆', category: 'Coding' }
];

module.exports = { seedQuestions, seedCompanies, seedAchievements };
