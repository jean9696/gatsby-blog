module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@components': 'src/components',
          '@layouts': 'src/layouts',
          '@pages': 'src/pages',
        },
        extensions: ['ts', 'tsx', 'js'],
      },
    },
    {
      resolve: `gatsby-plugin-ts`,
      options: {
        tsLoader: {
          logLevel: 'warn',
        },
        fileName: `types/graphql-types.ts`,
        codegen: true,
        codegenDelay: 250,
        alwaysCheck: false,
      },
    },
  ],
}
