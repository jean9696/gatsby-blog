/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OtherPost
// ====================================================

export interface OtherPost_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  title: string | null;
  path: string | null;
  date: any | null;
}

export interface OtherPost {
  __typename: "MarkdownRemark";
  frontmatter: OtherPost_frontmatter | null;
  timeToRead: number | null;
  excerpt: string | null;
}
