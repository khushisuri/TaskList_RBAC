export const verifyAuthority = (req, res, next) => {
  try {
    if (req.user?.role === 'viewer') {
      return res.status(403).json({ message: 'Forbidden' }); 
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
