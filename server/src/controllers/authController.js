import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Organization from '../models/Organization.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User does not exist' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    return res.status(200).json({ user, token });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      org,         // only used if role = "owner" (org name)
      orgId,       // required if role != "owner"
      parentOrgId, // optional if owner and has parent
    } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let orgIdVal;

    if (role !== "owner") {
      // non-owners must provide orgId
      if (!orgId) {
        return res
          .status(400)
          .json({ message: "Organization ID required for non-owner roles" });
      }

      // verify organization exists
      const existingOrg = await Organization.findById(orgId);
      if (!existingOrg) {
        return res.status(404).json({ message: "Organization not found" });
      }

      orgIdVal = existingOrg._id;
    } else {
      // owner creates a new org
      if (!org) {
        return res
          .status(400)
          .json({ message: "Organization name required for owner" });
      }

      const newOrg = new Organization({
        name: org,
        parentOrgId: parentOrgId ? parentOrgId : null,
      });
      const savedOrg = await newOrg.save();
      orgIdVal = savedOrg._id;
    }

    // create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      orgId: orgIdVal,
    });

    const savedUser = await newUser.save();

    // sanitize output (don’t send password)
    const userSafe = savedUser.toObject();
    delete userSafe.password;

    return res.status(201).json({ user: userSafe });
  } catch (err) {
    console.error("Error registering user:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).lean();
    delete user.password;
    if (user) {
      return res.status(200).json({ user: user });
    }
    res.status(404).json({ message: 'user not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
