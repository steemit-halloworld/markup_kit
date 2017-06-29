module.exports = {
  plugins: {
    'postcss-cssnext': {},
    'cssnano': {
      preset: 'default',
      "discardComments": {"removeAll": true}
    }
  }
};