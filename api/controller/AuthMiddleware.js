const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;  

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = verifiedUser;  
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = authMiddleware;
