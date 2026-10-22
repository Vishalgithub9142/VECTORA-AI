const isProd = process.env.NODE_ENV === 'production';

/**
 * Sets authentication cookie with environment‑aware options.
 * @param {object} res Express response object
 * @param {string} token JWT token value (empty string to clear)
 * @param {object} [options] Additional cookie options (e.g., maxAge)
 */
function setAuthCookie(res, token, options = {}) {
  const defaultOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    path: '/',
    ...(options.maxAge !== undefined ? { maxAge: options.maxAge } : {}),
  };
  res.cookie('token', token, defaultOptions);
}

module.exports = { setAuthCookie };
