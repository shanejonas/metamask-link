module.exports = {
  pathPrefix: '/metamask-link',
  siteMetadata: {
    title: 'MetaMask Link',
    description: 'This tool lets you link to metamask actions.',
    logoUrl:
      'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
    author: '',
  },
  plugins: [
    'gatsby-theme-material-ui',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'metamask-link',
        short_name: 'metamask-link',
        start_url: '/',
        background_color: 'transparent',
        theme_color: '#3f51b5',
        display: 'minimal-ui',
        icon: 'src/images/metamask-fox.svg', // This path is relative to the root of the site.
      },
    },
  ],
};
