module.exports = function (ctx)
{
  var options = {
    map: ctx.options.map,
    parser: false,
    plugins: [
      require('postcss-import')({}),
      require('postcss-cssnext')({}),
      require('postcss-url')({url: 'copy', useHash: true})
    ]

  };

  return options;
};

