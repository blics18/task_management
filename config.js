module.exports = {
  cookieName: 'session',
  secret: 'blahblahhaha',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
};
