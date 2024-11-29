import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store the decoded user object in the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}