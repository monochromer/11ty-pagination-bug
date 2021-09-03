let isCalled = false;

module.exports = {
  pagination: {
    data: 'collections.articles',
    size: 1,
    alias: 'article'
  },

  permalink: '/',

  eleventyComputed: {
    permalink: function(data) {
      return `/${data.article.fileSlug}/`
    }
  }
}