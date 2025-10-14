const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Authorization denied.' 
      })
    }

    // Extract token
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
    
    // Add user info to request
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token. Authorization denied.' 
    })
  }
}

module.exports = { authenticate }
