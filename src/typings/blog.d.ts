declare interface Blog {
  id: string;
  frontmatter: {
    path: string;
    title: string;
    date: string;
    lang: string;
    type: string;
  }
  excerpt: string;
  html: string;
}

declare interface MarkdownRemark<T> {
  edges: {
    node: T;
  }[]
}