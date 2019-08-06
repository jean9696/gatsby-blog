/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blogLayoutMarkdown
// ====================================================

export interface blogLayoutMarkdown_markdownRemark_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  date: any | null;
  path: string | null;
  title: string | null;
}

export interface blogLayoutMarkdown_markdownRemark {
  __typename: "MarkdownRemark";
  html: string | null;
  timeToRead: number | null;
  frontmatter: blogLayoutMarkdown_markdownRemark_frontmatter | null;
}

export interface blogLayoutMarkdown {
  markdownRemark: blogLayoutMarkdown_markdownRemark | null;
}

export interface blogLayoutMarkdownVariables {
  path: string;
}
