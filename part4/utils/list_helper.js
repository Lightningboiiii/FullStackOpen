const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const sumOfLikes = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(sumOfLikes, 0)
}

const favoriteBlog = blogs => {
  if(!blogs.length) {
    return { _id: '', title: '', author: '', url: '', likes: 0, __v: 0 }
  }

  const mostLikes = (sum, blog) => {
    return blog.likes >= sum.likes
      ? blog
      : sum
  }
  return blogs.reduce(mostLikes, { likes: 0 })
}

const mostBlogs = blogs => {
  if(!blogs.length) {
    return { author: '', blogs: 0 }
  }

  const blogCount = _.countBy(blogs, 'author')
  const maxCount = _.maxBy(Object.entries(blogCount))

  return { author: maxCount[0], blogs: maxCount[1] }
}

const mostLikes = blogs => {
  if(!blogs.length) {
    return { author: '', likes: 0 }
  }

  const authors = _.groupBy(blogs, 'author')
  const likes = (group) => _.sumBy(group, 'likes')
  const authorLikes = _.mapValues(authors, author => likes(author))
  const maxLikes = _.max(Object.values(authorLikes))
  const topAuthor = _.findKey(authorLikes, (value, key) => value === maxLikes ? key : '')

  return { author: topAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
