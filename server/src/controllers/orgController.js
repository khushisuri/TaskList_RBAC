import Organization from '../models/Organization.js';

export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    if (organizations.length > 0) {
      return res.status(200).json({ organizations });
    }
    res.status(404).json({ message: 'no organizations' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'org id is not valid' });
    }
    const organization = await Organization.findById(id);
    if (organization) {
      return res.status(200).json({ organization });
    }
    res.status(404).json({ message: 'organization does not exisit' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildOrganizations = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'org id is not valid' });
    }
    const organizations = await Organization.find({parentOrgId:id});
    return res.status(200).json({ organizations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
