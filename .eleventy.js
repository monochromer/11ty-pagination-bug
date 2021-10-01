const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy');

module.exports = function(evelentyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: 'image',
    functionsDir: './netlify/functions/',
  });

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