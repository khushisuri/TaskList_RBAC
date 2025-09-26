import Task from '../models/Task.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

const roleBasedTaskFetch = async (req) => {
  const user = await User.findById(req.user.id);
  if (!user) return [];

  const baseOrgId = user.orgId;
  if (req.user.role === 'owner') {
    const children = await Organization.find({ parentOrgId: baseOrgId }).select('_id');
    const orgIds = [baseOrgId, ...children.map((c) => c._id)];
    return await Task.find({ orgId: { $in: orgIds } }).sort({ createdAt: -1 });
  }
  
  return await Task.find({ orgId: baseOrgId }).sort({ createdAt: -1 });
};

export const createTask = async (req, res) => {
  try {
    const { title, description = '', completedStatus = false } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    const newTask = await Task.create({
      title,
      description,
      completedStatus,
      userId,
      orgId: user.orgId,
    });
    await newTask.save()
    const tasks = await roleBasedTaskFetch(req);
    return res.status(201).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await roleBasedTaskFetch(req);
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const { title, description, completedStatus } = req.body;
    const update = {};
    if (title !== undefined) update['title'] = title;
    if (description !== undefined) update['description'] = description;
    if (completedStatus !== undefined) update['completedStatus'] = completedStatus;

    const task = await Task.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const tasks = await roleBasedTaskFetch(req);
    return res.status(200).json({ task, tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    const tasks = await roleBasedTaskFetch(req);
    return res.status(200).json({ message: 'Task deleted', tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

