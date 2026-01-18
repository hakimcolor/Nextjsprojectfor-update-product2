// Simple authentication middleware (no JWT)
const authenticateUser = (req, res, next) => {
  const { email, role } = req.headers;

  if (!email) {
    return res.status(401).json({
      success: false,
      message: 'Email header required for authentication',
    });
  }

  // Simple user object
  req.user = {
    email,
    role: role || 'user',
  };

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin,
  requireAuth,
};
