// const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  // eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
  //   name: 'image',
  //   functionsDir: './netlify/functions/',
  // });

  eleventyConfig.addCollection('articles', collectionApi => {
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