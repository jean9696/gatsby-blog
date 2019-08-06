export interface PostLinkProps {
  post: {
    frontmatter: {
      title: string
      path: string
      date: any
    }
    excerpt: string
    timeToRead: number
  }
}
