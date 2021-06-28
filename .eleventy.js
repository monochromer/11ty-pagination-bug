module.exports = function(evelentyConfig) {
  evelentyConfig.addCollection('articles', collectionApi => {
    return collectionApi.getFilteredByGlob('src/articles/**/index.md');
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: [
      'md',
      'njk',
    ],
  }
}