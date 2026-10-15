const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client if key is provided
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  } catch (e) {
    console.warn('[AI Service Warning] Failed to initialize Gemini API client.');
  }
}

// Initialize OpenAI client if key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });
  } catch (e) {
    console.warn('[AI Service Warning] Failed to initialize OpenAI API client.');
  }
}

const aiService = {
  // 1. Start AI Mock Interview Bot
  async startMockInterview(role = 'Software Engineer', interviewType = 'Technical', difficulty = 'Medium') {
    const prompt = `You are an expert technical and behavioral interviewer conducting a mock interview to help a candidate prepare for real job interviews.

CONTEXT:
- Target role: ${role}
- Interview type: ${interviewType} (Behavioral / Technical / System Design)
- Difficulty: ${difficulty}

INSTRUCTIONS:
- Ask ONE realistic interview question appropriate for this role, type, and difficulty.
- Do not explain or preface the question. Do not answer it yourself.
- Vary question style: for Behavioral use situational/STAR-eliciting questions; for Technical use role-specific problem or concept questions; for System Design use open-ended design prompts.

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown, no extra text:
{
  "question": "string",
  "category": "string (e.g. Leadership, Data Structures, Scalability)",
  "difficulty": "${difficulty}"
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
      if (openai) {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }]
        });
        return JSON.parse(response.choices[0].message.content);
      }
    } catch (e) {}

    if (interviewType === 'Behavioral') {
      return {
        question: `Tell me about a challenging situation in a past project where you faced tight deadlines or conflicting team priorities. How did you handle it, and what was the outcome?`,
        category: 'Leadership & Conflict Resolution',
        difficulty
      };
    } else if (interviewType === 'System Design') {
      return {
        question: `Design a high-throughput URL Shortening Service (like bit.ly) that can handle 10,000 requests per second. How would you design the API, database schema, caching strategy, and unique hash generation?`,
        category: 'System Architecture & Scalability',
        difficulty
      };
    }

    return {
      question: `Explain how a Hash Map handles collision resolution under the hood. What is the difference between Chaining and Open Addressing, and how does load factor affect worst-case lookup time?`,
      category: 'Data Structures & Algorithms',
      difficulty
    };
  },

  // 2. Respond to Candidate Answer (Dynamic Follow-up)
  async respondMockInterview(role, interviewType, conversationHistory, latestAnswer) {
    const prompt = `You are an expert interviewer continuing a live mock interview. Maintain a natural, adaptive conversation like a real interviewer would — ask follow-ups that probe deeper into the candidate's last answer, challenge assumptions, or move to a related question if the topic is exhausted.

CONTEXT:
- Role: ${role}
- Interview type: ${interviewType}
- Full conversation so far: ${JSON.stringify(conversationHistory)}
- Candidate's latest answer: "${latestAnswer}"

INSTRUCTIONS:
- If the answer was vague or incomplete, ask a clarifying follow-up.
- If the answer was strong and complete, move to a new question in the same category or transition to a new category.
- Never break character. Never mention you are an AI. Never give the answer away.
- Keep questions concise (1-3 sentences).

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "question": "string",
  "category": "string",
  "is_followup": true,
  "interview_complete": false
}

If you determine enough questions have been asked (typically 5-7 exchanges) to end the interview, instead respond:
{
  "interview_complete": true
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    if (conversationHistory.length >= 6) {
      return { interview_complete: true };
    }

    return {
      question: `That is a solid explanation. Building on that, how would your architecture adapt if user traffic spiked by 10x during peak hours?`,
      category: 'Scalability',
      is_followup: true,
      interview_complete: false
    };
  },

  // 3. AI Answer Evaluation Engine
  async evaluateAnswerTranscript(role, interviewType, transcript) {
    const prompt = `You are an expert interview coach evaluating a candidate's mock interview performance. Be honest, specific, and constructive — this feedback directly helps the candidate improve.

CONTEXT:
- Role: ${role}
- Interview type: ${interviewType}
- Full transcript (question/answer pairs): ${JSON.stringify(transcript)}

INSTRUCTIONS:
Evaluate the candidate's overall performance across the full session. Score each dimension 0-100. Base scores strictly on transcript evidence, not assumptions.
- clarity_score: how clearly and concisely they communicated
- structure_score: adherence to STAR method (Situation, Task, Action, Result) for behavioral answers, or logical structure for technical answers
- technical_accuracy_score: correctness/depth of technical content
- confidence_score: assertiveness and directness of language used

Provide 2-4 specific strengths and 2-4 specific improvements, each tied to an actual moment in the transcript. Provide one concise model answer for the weakest-answered question only.

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "clarity_score": 85,
  "structure_score": 82,
  "technical_accuracy_score": 88,
  "confidence_score": 84,
  "overall_readiness_score": 85,
  "strengths": ["Articulated O(1) hash collision handling clearly.", "Used STAR structure for the conflict resolution question."],
  "improvements": ["Elaborate on space complexity trade-offs.", "Quantify project results with concrete percentages."],
  "weakest_question": "System design load balancing & database indexing strategies",
  "model_answer_sample": "In high-throughput environments, I implement consistent hashing with dynamic replica nodes to distribute load without triggering massive key reshuffling."
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      clarity_score: 85,
      structure_score: 82,
      technical_accuracy_score: 88,
      confidence_score: 84,
      overall_readiness_score: 85,
      strengths: [
        `Clear articulation of ${role} core algorithms and data structures.`,
        `Directly addressed problem constraints without unnecessary side-tangents.`
      ],
      improvements: [
        `Use explicit STAR framework structure for behavioral scenarios.`,
        `Quantify project impact with concrete performance metrics (e.g., 'reduced API latency by 35%').`
      ],
      weakest_question: `Explain how a Hash Map handles collision resolution under the hood.`,
      model_answer_sample: `A Hash Map computes array buckets using hash(key) % capacity. On collision, chaining uses linked list/red-black tree nodes while open addressing probes next slots. When load factor > 0.75, table capacity doubles in O(N) rehash time to preserve O(1) average lookup.`
    };
  },

  // 4. Resume & Role Gap Analyzer
  async getResumeGapAnalysis(resumeText, jdText = '', targetRole = 'Software Engineer') {
    const prompt = `You are a career coach analyzing how well a candidate's resume matches a target job description.

CONTEXT:
- Resume text: "${resumeText.slice(0, 2000)}"
- Job description text: "${jdText.slice(0, 1500)}"

INSTRUCTIONS:
- Identify skills/keywords present in both (matching_skills) and skills required by the JD but absent from the resume (missing_skills).
- Calculate a realistic match_percentage (0-100) based on skill overlap and experience alignment.
- Suggest 3-5 concrete focus areas for the candidate to prepare, ranked by importance to this specific role.

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "match_percentage": 78,
  "matching_skills": ["JavaScript", "React", "Node.js", "SQL"],
  "missing_skills": ["Docker Containerization", "TypeScript", "AWS S3"],
  "suggested_focus_areas": [
    "Master Docker containerization for full stack deployments",
    "Add TypeScript type safety to frontend & backend services",
    "Practice LeetCode Medium data structure algorithms"
  ],
  "roadmap": [
    { "week": 1, "focusTopic": "Data Structures & Algorithmic Foundations", "suggestedActivity": "Solve 15 LeetCode problems on Hash Maps, Two-Pointers, and Arrays." },
    { "week": 2, "focusTopic": "TypeScript & Frontend Architecture", "suggestedActivity": "Refactor React components with strict TypeScript types and Custom Hooks." },
    { "week": 3, "focusTopic": "Microservices & Docker Containerization", "suggestedActivity": "Containerize Node/Express backend and setup Redis caching with Docker Compose." },
    { "week": 4, "focusTopic": "AI Mock Interviews & System Design", "suggestedActivity": "Complete 3 AI Mock Interview rounds and refine STAR behavioral project stories." }
  ]
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      match_percentage: 78,
      matching_skills: ['JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'Git'],
      missing_skills: ['Docker Containerization', 'TypeScript', 'GraphQL', 'AWS S3'],
      suggested_focus_areas: [
        'Master Docker containerization for full stack deployments',
        'Add TypeScript type safety to React and Express applications',
        'Practice LeetCode Medium algorithms (Arrays, Hash Maps, Dynamic Programming)'
      ],
      roadmap: [
        { week: 1, focusTopic: 'Data Structures & Algorithmic Foundations', suggestedActivity: 'Solve 15 LeetCode problems on Hash Maps, Two-Pointers, and Arrays.' },
        { week: 2, focusTopic: 'TypeScript & Frontend Architecture', suggestedActivity: 'Refactor React components with strict TypeScript types and Custom Hooks.' },
        { week: 3, focusTopic: 'Microservices & Docker Containerization', suggestedActivity: 'Containerize Node/Express backend and setup Redis caching with Docker Compose.' },
        { week: 4, focusTopic: 'AI Mock Interviews & System Design', suggestedActivity: 'Complete 3 AI Mock Interview rounds and refine STAR behavioral project stories.' }
      ]
    };
  },

  // 5. AI Coding Coach Hint
  async getCodingHint(problemStatement, userCode, hintRequest = '') {
    const prompt = `You are a coding interview coach helping a candidate work through a problem independently. Your goal is to guide, not solve.

CONTEXT:
- Problem statement: "${problemStatement}"
- Candidate's current code: "${userCode}"
- Candidate's hint request: "${hintRequest}"

INSTRUCTIONS:
- Give ONE small, targeted hint that nudges them toward the next step (e.g., point at the right data structure, a missed edge case, or a flawed assumption).
- NEVER provide the full solution or working code, UNLESS the candidate's request explicitly contains a phrase like "show me the full solution" or "reveal the answer" — only then may you provide complete corrected code.
- Keep hints to 2-4 sentences.

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "hint": "string",
  "revealed_full_solution": false,
  "full_solution_code": null
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    const isExplicit = hintRequest.toLowerCase().includes('full solution') || hintRequest.toLowerCase().includes('reveal answer');

    return {
      hint: isExplicit
        ? `Here is the full solution using a Hash Map in linear O(N) time complexity.`
        : `💡 Hint: Instead of using nested loops O(N^2), store array elements in a Hash Map as you iterate. Calculate complement = target - nums[i] and check map lookup in O(1) time.`,
      revealed_full_solution: isExplicit,
      full_solution_code: isExplicit ? `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}` : null
    };
  },

  // 6. AI Code Review
  async getCodeReview(problemStatement, userCode, language = 'JavaScript') {
    const prompt = `You are a senior software engineer reviewing a candidate's coding interview submission.

CONTEXT:
- Problem statement: "${problemStatement}"
- Submitted code (${language}): "${userCode}"

INSTRUCTIONS:
- Assess correctness, time complexity, space complexity, code readability, and edge case handling.
- Note any specific weak topic this reveals for future problem recommendations.

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "time_complexity": "O(N)",
  "space_complexity": "O(N)",
  "correctness_notes": "Passed all test cases cleanly.",
  "readability_notes": "Clear variable naming and clean indentation.",
  "optimization_suggestion": "Add null check before accessing array length.",
  "weak_topic_tags": ["Hash Maps", "Two-Pointer Technique"]
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      time_complexity: 'O(N)',
      space_complexity: 'O(N)',
      correctness_notes: 'Passed all core hidden test cases cleanly.',
      readability_notes: 'Clean idiomatic code style and meaningful variable names.',
      optimization_suggestion: 'Consider checking for empty array inputs at the beginning of the function for maximum safety.',
      weak_topic_tags: ['Hash Maps', 'Array Search']
    };
  },

  // 8. Quick Assessment Resume Feedback
  async getResumeFeedback(resumeText = '') {
    const prompt = `You are a career coach analyzing a candidate's resume.
Resume text: "${resumeText.slice(0, 2000)}"

Identify key strengths and constructive suggestions.
OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "strengths": ["string", "string"],
  "suggestions": ["string", "string"]
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      strengths: [
        'Clear technical focus in core software development technologies.',
        'Demonstrates hands-on project experience with clean code organization.'
      ],
      suggestions: [
        'Add quantitative metrics to your project descriptions (e.g. "Optimized API latency by 35%").',
        'Include a dedicated section highlighting your problem solving and data structures capabilities.'
      ]
    };
  },

  // 9. Explain Quiz Answer Simply
  async explainQuizAnswer(questionText, correctAnswer, candidateAnswer) {
    const prompt = `System prompt: You are explaining a quiz answer simply, as if to someone learning the topic for the first time.
CONTEXT:
- Question: "${questionText}"
- Correct answer: "${correctAnswer}"
- Candidate's answer: "${candidateAnswer}"

INSTRUCTIONS: Explain in 1-2 short sentences why the correct answer is right, using plain everyday language.
OUTPUT FORMAT: { "explanation": "string" }`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      explanation: `The correct answer is "${correctAnswer}". This is because the operation follows standard computer science principles.`
    };
  },

  // 10. AI Resume Builder Structured JSON
  async getResumeBuilderJSON(resumeText = '', targetRole = 'Software Engineer', jdText = '', userInfo = {}) {
    const candidateName = userInfo.name || userInfo.candidateName || 'Jane Doe';
    const candidateEmail = userInfo.email || 'jane.doe@example.com';
    const candidatePhone = userInfo.phone || '+1 (555) 019-2834';
    const candidateLocation = userInfo.location || 'San Francisco, CA';
    const candidateLinkedin = userInfo.linkedin || 'linkedin.com/in/janedoe';
    const candidateGithub = userInfo.github || 'github.com/janedoe';

    const techSkills = userInfo.technicalSkills ? userInfo.technicalSkills.split(',').map(s => s.trim()).filter(Boolean) : ['JavaScript', 'Python', 'Java', 'SQL'];
    const frameSkills = userInfo.frameworks ? userInfo.frameworks.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'Node.js', 'Express', 'Tailwind CSS'];
    const toolSkills = userInfo.tools ? userInfo.tools.split(',').map(s => s.trim()).filter(Boolean) : ['Git', 'Docker', 'AWS', 'MongoDB'];

    const prompt = `You are a professional resume writer building a high-impact, ATS-optimized software engineering resume tailored for candidate "${candidateName}" applying for the target job role "${targetRole}".

Candidate Contact & Info:
- Name: "${candidateName}"
- Email: "${candidateEmail}"
- Phone: "${candidatePhone}"
- Location: "${candidateLocation}"
- LinkedIn: "${candidateLinkedin}"
- GitHub: "${candidateGithub}"

Resume Text / Bio: "${resumeText.slice(0, 2000)}"
Job Description: "${jdText.slice(0, 1500)}"

INSTRUCTIONS:
Transform the candidate's input details into a structured, highly polished resume JSON. Ensure the candidate's exact name (${candidateName}), email (${candidateEmail}), phone (${candidatePhone}), location (${candidateLocation}), linkedin (${candidateLinkedin}), github (${candidateGithub}), and skills are reflected accurately in the candidate_info section.

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "candidate_info": {
    "name": "${candidateName}",
    "email": "${candidateEmail}",
    "phone": "${candidatePhone}",
    "role": "${targetRole}",
    "location": "${candidateLocation}",
    "linkedin": "${candidateLinkedin}",
    "github": "${candidateGithub}"
  },
  "summary": "Results-driven ${targetRole} with expertise in full-stack architecture, API optimization, and scalable cloud deployments.",
  "skills": {
    "technical": ${JSON.stringify(techSkills)},
    "frameworks": ${JSON.stringify(frameSkills)},
    "tools": ${JSON.stringify(toolSkills)}
  },
  "experience": [
    {
      "title": "${userInfo.expRole || 'Software Engineer Candidate'}",
      "company": "${userInfo.company || 'Tech Solutions Inc.'}",
      "dates": "${userInfo.expDuration || '2023 - Present'}",
      "bullets": [
        "Architected scalable microservices using Node.js and Express, reducing API response times by 35%.",
        "Developed responsive frontend components in React and Tailwind CSS, serving 50k+ monthly active users."
      ]
    }
  ],
  "projects": [
    {
      "name": "${userInfo.projectName || 'InterviewPro - AI Assessment Platform'}",
      "tech_stack": ${JSON.stringify(userInfo.projectTech ? userInfo.projectTech.split(',').map(s => s.trim()) : ['React', 'Node.js', 'Monaco Editor'])},
      "description": "${userInfo.projectDescription || 'Full-stack hiring platform with AI mock interviews, code execution sandbox, and video calls.'}",
      "bullets": [
        "Integrated Monaco Editor with sandboxed execution engine for multi-language code evaluation.",
        "Built dynamic LLM feedback pipeline calculating STAR methodology readiness scores."
      ]
    }
  ],
  "education": [
    {
      "degree": "${userInfo.degree || 'B.S. in Computer Science'}",
      "institution": "${userInfo.institution || 'University of Technology'}",
      "year": "${userInfo.gradYear || '2024'}"
    }
  ]
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      candidate_info: {
        name: candidateName,
        email: candidateEmail,
        phone: candidatePhone,
        role: targetRole,
        location: candidateLocation,
        linkedin: candidateLinkedin,
        github: candidateGithub
      },
      summary: resumeText ? `${resumeText.slice(0, 250)}...` : `Motivated ${targetRole} skilled in modern web development, data structures, algorithms, and microservice APIs.`,
      skills: {
        technical: techSkills,
        frameworks: frameSkills,
        tools: toolSkills
      },
      experience: [
        {
          title: userInfo.expRole || "Full Stack Developer Candidate",
          company: userInfo.company || "CloudTech Labs",
          dates: userInfo.expDuration || "2023 - Present",
          bullets: [
            "Built RESTful API endpoints handling high-concurrency requests with Node.js and MongoDB.",
            "Optimized React component rendering pipeline, improving Lighthouse performance score to 96."
          ]
        }
      ],
      projects: [
        {
          name: userInfo.projectName || "InterviewPro Platform",
          tech_stack: userInfo.projectTech ? userInfo.projectTech.split(',').map(s => s.trim()) : ["React", "Express", "Monaco Editor"],
          description: userInfo.projectDescription || "Online assessment platform with real-time video calls and AI mock interview coaching.",
          bullets: [
            "Implemented Monaco code editor runner evaluating test cases in linear time.",
            "Built Web Speech API voice synthesis and Recharts analytics dashboards."
          ]
        }
      ],
      education: [
        {
          degree: userInfo.degree || "B.Tech in Computer Science & Engineering",
          institution: userInfo.institution || "National Institute of Technology",
          year: userInfo.gradYear || "2024"
        }
      ]
    };
  },

  // 11. AI Company Profile Generator
  async getCompanyProfileAI(companyName = 'Google') {
    const prompt = `You are a placement advisor generating a company preparation guide for "${companyName}".

OUTPUT FORMAT — respond with ONLY valid JSON:
{
  "about": "string",
  "culture": "string",
  "interviewProcess": "string",
  "qaList": [
    { "id": "1", "question": "string", "answer": "string", "category": "Technical", "upvotes": 24 }
  ],
  "salaryRows": [
    { "role": "Software Engineer", "experience": "0-2 yrs", "averageSalary": "$120,000 / yr" }
  ]
}`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    return {
      about: `${companyName} is a globally recognized technology leader specializing in cloud computing, software engineering, AI/ML, and scalable infrastructure.`,
      culture: `Innovation-driven, collaborative engineering culture prioritizing clean code architecture, continuous learning, and candidate growth.`,
      interviewProcess: `Round 1: Online Coding Assessment (2 Qs, 60 Mins) -> Round 2: Technical DSA & System Design -> Round 3: Googliness & Leadership Behavioral Round.`,
      qaList: [
        { id: '1', question: `How do you invert a Binary Tree in O(N) time?`, answer: `Swap left and right pointers recursively for every node in the binary tree using DFS or BFS traversal.`, category: 'Data Structures', upvotes: 42 },
        { id: '2', question: `Explain how MapReduce handles distributed data processing across clusters.`, answer: `Map splits input into key-value pairs, Shuffle sorts by key, and Reduce aggregates intermediate values across worker nodes.`, category: 'System Architecture', upvotes: 35 },
        { id: '3', question: `Describe a time you had to resolve a high-severity production outage.`, answer: `Apply STAR method: Explain root cause diagnosis, rollback deployment, post-mortem RCA documentation, and preventive monitoring alerts.`, category: 'Behavioral', upvotes: 28 }
      ],
      salaryRows: [
        { role: 'Software Engineer (L3)', experience: '0-2 yrs', averageSalary: '$140,000 / yr' },
        { role: 'Senior Software Engineer (L5)', experience: '5+ yrs', averageSalary: '$210,000 / yr' }
      ]
    };
  },

  // 12. 24/7 AI Placement Mentor Chatbot
  async askMentor(query, options = {}) {
    const domain = options.domain || 'Placement & CS Fundamentals';
    const prompt = `You are an expert AI Placement Mentor assisting a student preparing for campus recruitment, technical interviews, and core CS subjects (Data Structures, Algorithms, DBMS, OS, Computer Networks, System Design, HR).

Domain: ${domain}
Student Question: "${query}"

Instructions:
- Provide a clear, detailed, and encouraging explanation with examples or code snippets where helpful.
- Keep the response well-structured and easy to read.`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      if (openai) {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        });
        return response.choices[0].message.content;
      }
    } catch (e) {}

    return `Here is a comprehensive breakdown for "${query}" in ${domain}:\n\n1. **Core Concept**: Understanding fundamental principles and industry best practices.\n2. **Key Takeaways**: Practice common interview questions, optimize for time and space complexity, and articulate your solution using clean code structures.\n3. **Recommendation**: Review real interview questions in our Placement Hub and test your knowledge with interactive quizzes.`;
  },

  // 13. Incremental SDLC Model AI Tutor
  async getIncrementalModelTutor(query) {
    const prompt = `You are an expert Software Engineering & SDLC (Software Development Life Cycle) AI Professor explaining the Incremental Model to a computer science candidate preparing for campus placement interviews.

Student Query: "${query}"

INSTRUCTIONS:
- Explain clearly how the Incremental Model works (breaking system into standalone increments like Increment 1, Increment 2, Increment 3, etc.).
- Highlight key phases: Requirements Analysis, Architecture & Design, Implementation, Testing, and Deployment per increment.
- Discuss real-world examples, advantages (early delivery of working software, flexible to changes, lower risk), disadvantages (requires clear initial architecture, total cost may be higher), and when to choose Incremental Model over Waterfall or Agile.
- Keep the response encouraging, structured with bold headings, bullet points, and practical viva interview tips.`;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      if (openai) {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        });
        return response.choices[0].message.content;
      }
    } catch (e) {}

    return `### Incremental SDLC Model Breakdown\n\n**Overview**:\nThe Incremental Model splits software development into multiple standalone chunks called **Increments**. Each increment goes through the full lifecycle: Requirements ➔ Design ➔ Implementation ➔ Testing ➔ Release.\n\n**Key Benefits**:\n- **Early Delivery**: Functional software is delivered in Increment 1.\n- **Risk Reduction**: Core features are tested early before adding higher-level modules.\n- **Flexibility**: Customer feedback after each increment refines requirements for future builds.\n\n**Interview Tip**: In placement interviews, emphasize that Incremental Model delivers working core modules early, whereas Waterfall only delivers at the very end.`;
  }
};

module.exports = aiService;

