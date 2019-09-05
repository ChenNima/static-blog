declare interface Blog {
  id: string;
  frontmatter: {
    path: string;
    title: string;
    date: string;
  }
  excerpt: string;
  html: string;
}