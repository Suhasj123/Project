const Company = require('../models/Company');
const { seedCompanies } = require('../utils/seedData');
const { getIsMockMode } = require('../config/db');

exports.getAllCompanies = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json(seedCompanies);
    }
    const companies = await Company.find();
    if (companies.length === 0) {
      return res.json(seedCompanies);
    }
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company preparation modules' });
  }
};

exports.getCompanyByName = async (req, res) => {
  try {
    const nameParam = req.params.name.toLowerCase();
    if (getIsMockMode()) {
      const found = seedCompanies.find(c => c.name.toLowerCase() === nameParam);
      if (!found) return res.status(404).json({ message: 'Company not found' });
      return res.json(found);
    }

    const company = await Company.findOne({ name: new RegExp(`^${nameParam}$`, 'i') });
    if (!company) {
      const seedFound = seedCompanies.find(c => c.name.toLowerCase() === nameParam);
      if (seedFound) return res.json(seedFound);
      return res.status(404).json({ message: 'Company module not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company details' });
  }
};
