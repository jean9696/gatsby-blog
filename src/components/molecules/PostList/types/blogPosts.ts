/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blogPosts
// ====================================================

export interface blogPosts_allMarkdownRemark_nodes_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  title: string | null;
  path: string | null;
  date: any | null;
}

export interface blogPosts_allMarkdownRemark_nodes {
  __typename: "MarkdownRemark";
  id: string;
  frontmatter: blogPosts_allMarkdownRemark_nodes_frontmatter | null;
  timeToRead: number | null;
  excerpt: string | null;
}

export interface blogPosts_allMarkdownRemark {
  __typename: "MarkdownRemarkConnection";
  nodes: blogPosts_allMarkdownRemark_nodes[];
}

export interface blogPosts {
  allMarkdownRemark: blogPosts_allMarkdownRemark | null;
}
