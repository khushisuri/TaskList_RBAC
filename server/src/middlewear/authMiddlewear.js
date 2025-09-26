import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'Access denied' });

    const actualToken = header.startsWith('Bearer ')
      ? header.split(' ')[1]
      : header;

    if (!actualToken) return res.status(401).json({ message: 'Access denied' });

    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
