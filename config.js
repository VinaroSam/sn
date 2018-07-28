module.exports = {
  port: process.env.PORT || 4000,
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/sn',
  SECRET_TOKEN: 'lereseausocialdevinaro',
  SECRET_TOKEN_DECODE: 'lereseausocialdevinaro'
}
