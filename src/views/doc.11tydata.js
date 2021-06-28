module.exports = {
  pagination: {
    data: 'collections.articles',
    size: 1,
    alias: 'article'
  },

  eleventyComputed: {
    permalink: function(data) {
      return `/${data.article.fileSlug}/`
    }
  }
}