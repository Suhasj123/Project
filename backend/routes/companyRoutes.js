const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const CompanyProfile = require('../models/CompanyProfile');
const CompanyReview = require('../models/CompanyReview');

// Initial default seed companies
const defaultCompanies = [
  {
    companyId: 'google',
    name: 'Google',
    industry: 'Technology & Cloud',
    about: 'Google is an American multinational technology company focusing on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, and quantum computing.',
    culture: 'Innovation-driven engineering culture with emphasis on scalability, high availability, and open source contributions.',
    interviewProcess: '1. Online Assessment (2 Coding Qs) -> 2. Technical Screen -> 3. Onsite (3 DSA + 1 System Design + 1 Googliness)',
    isVerified: true,
    qaList: [
      { id: 'g1', question: 'Invert a Binary Tree recursively and iteratively.', answer: 'Swap left and right children recursively for each node in O(N) time.', category: 'Algorithms', upvotes: 56 },
      { id: 'g2', question: 'Design Google Drive storage service architecture.', answer: 'Use block-level deduplication, metadata DB (Spanner), object store (GCS), and chunk servers.', category: 'System Design', upvotes: 48 }
    ],
    salaryRows: [
      { role: 'Software Engineer III (L4)', experience: '2-4 yrs', averageSalary: '$185,000 / yr' },
      { role: 'Senior Software Engineer (L5)', experience: '5+ yrs', averageSalary: '$260,000 / yr' }
    ]
  },
  {
    companyId: 'microsoft',
    name: 'Microsoft',
    industry: 'Enterprise Software & Azure',
    about: 'Microsoft develops and supports computer software, consumer electronics, personal computers, and cloud services.',
    culture: 'Growth mindset environment with high focus on cloud resilience, accessibility, and teamwork.',
    interviewProcess: '1. Online Assessment -> 2. Technical Telephonic Round -> 3. Final Onsite 4 Rounds (DSA, System Design, AA Behavioral)',
    isVerified: true,
    qaList: [
      { id: 'm1', question: 'Find median in a stream of running numbers.', answer: 'Use two heaps: a max-heap for the lower half and a min-heap for the upper half.', category: 'Data Structures', upvotes: 39 },
      { id: 'm2', question: 'Explain Azure Event Hubs vs Service Bus.', answer: 'Event Hubs is designed for high-throughput telemetry streams; Service Bus is for transactional messaging.', category: 'Cloud Architecture', upvotes: 31 }
    ],
    salaryRows: [
      { role: 'Software Engineer II (SDE-2)', experience: '2-4 yrs', averageSalary: '$165,000 / yr' }
    ]
  },
  {
    companyId: 'amazon',
    name: 'Amazon',
    industry: 'E-Commerce & AWS',
    about: 'Amazon focuses on e-commerce, cloud computing (AWS), online streaming, and artificial intelligence.',
    culture: 'Obsessed with 16 Leadership Principles including Customer Obsession and Bias for Action.',
    interviewProcess: '1. Online Assessment (Debugging + Coding) -> 2. Technical + LP Behavioral Rounds (4 Rounds)',
    isVerified: true,
    qaList: [
      { id: 'a1', question: 'Implement LRU Cache with O(1) get and put.', answer: 'Combine a doubly linked list with a Hash Map for O(1) removals and lookups.', category: 'Data Structures', upvotes: 62 },
      { id: 'a2', question: 'Describe a situation where you had to make a decision with incomplete data.', answer: 'Use STAR method highlighting Bias for Action and calculated risk mitigation.', category: 'Leadership Principles', upvotes: 44 }
    ],
    salaryRows: [
      { role: 'Software Engineer II (L5)', experience: '2-5 yrs', averageSalary: '$175,000 / yr' }
    ]
  }
];

// GET /api/companies (Search & Industry filter)
router.get('/', async (req, res) => {
  const { search = '', industry = 'All' } = req.query;

  try {
    let list = await CompanyProfile.find();
    if (!list || list.length === 0) {
      list = defaultCompanies;
    }

    const filtered = list.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
      const matchInd = industry === 'All' || c.industry === industry;
      return matchSearch && matchInd;
    });

    return res.json(filtered);
  } catch (err) {
    return res.json(defaultCompanies);
  }
});

// POST /api/companies/generate (Generate new company via AI)
router.post('/generate', async (req, res) => {
  const { name = '' } = req.body;
  if (!name) return res.status(400).json({ message: 'Company name is required' });

  const companyId = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  try {
    const aiData = await aiService.getCompanyProfileAI(name);

    const newCompany = {
      companyId,
      name,
      industry: 'Technology & Services',
      about: aiData.about,
      culture: aiData.culture,
      interviewProcess: aiData.interviewProcess,
      isVerified: false,
      qaList: aiData.qaList || [],
      salaryRows: aiData.salaryRows || [],
      createdAt: new Date()
    };

    try {
      const doc = new CompanyProfile(newCompany);
      await doc.save();
    } catch (e) {}

    return res.json(newCompany);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let company = await CompanyProfile.findOne({ companyId: id });
    if (!company) {
      company = defaultCompanies.find(c => c.companyId === id) || defaultCompanies[0];
    }

    let reviews = await CompanyReview.find({ companyId: id }).sort({ createdAt: -1 });

    return res.json({ company, reviews });
  } catch (err) {
    return res.json({ company: defaultCompanies[0], reviews: [] });
  }
});

// POST /api/companies/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { authorName, rating, role, pros, cons, experienceText } = req.body;

  try {
    const review = new CompanyReview({
      companyId: id,
      authorName: authorName || 'Anonymous Candidate',
      rating: rating || 5,
      role: role || 'Software Engineer',
      pros: pros || 'Great team collaboration and technical challenges.',
      cons: cons || 'Fast-paced environment requiring strong adaptability.',
      experienceText: experienceText || ''
    });

    await review.save();
    return res.json(review);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/company-matcher/suggest (Lightweight candidate target role matcher)
router.get('/matcher/suggest', (req, res) => {
  const { targetRole = 'Software Engineer' } = req.query;

  return res.json({
    recommendedCompanies: [
      { name: 'Google', matchReason: `High demand for ${targetRole} in Cloud & AI infrastructure.` },
      { name: 'Microsoft', matchReason: `Active hiring for ${targetRole} across Azure & Developer Tools.` },
      { name: 'Amazon', matchReason: `Strong alignment for ${targetRole} with AWS cloud services.` }
    ]
  });
});

module.exports = router;
