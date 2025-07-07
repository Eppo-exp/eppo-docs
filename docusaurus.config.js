// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github
const darkCodeTheme = require('prism-react-renderer').themes.dracula

const footnote = require('remark-numbered-footnote-labels')

async function createConfig () {
  const katex = (await import('rehype-katex')).default
  return {
    title: 'The Eppo Docs',
    tagline: "Documentation for Eppo's experimentation platform.",
    url: 'https://docs.geteppo.com',
    baseUrl: '/',
    staticDirectories: ['static'],
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    trailingSlash: true,
    favicon: 'img/newfavicon.ico',
    organizationName: 'eppo', // Usually your GitHub org/user name.
    projectName: 'eppo', // Usually your repo name.

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            routeBasePath: '/',
            sidebarPath: require.resolve('./sidebars.js'),
            // Please change this to your repo.
            editUrl: 'https://github.com/Eppo-exp/eppo-docs/tree/main',
            path: 'docs',
            remarkPlugins: [(await import('remark-math')).default, footnote],
            rehypePlugins: [(await import('rehype-katex')).default],

          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            editUrl: 'https://github.com/Eppo-exp/eppo-docs/tree/main'
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css')
          },
          sitemap: {
            changefreq: 'weekly',
            priority: 0.5,
            ignorePatterns: ['/tags/**'],
            filename: 'sitemap.xml'
          }
        })
      ]
    ],

    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
        type: 'text/css',
        integrity:
        'sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC',
        crossorigin: 'anonymous'
      }
    ],

    clientModules: [
      require.resolve('./src/rudderstack.config.js')
    ],

    scripts: [
      {
        id: "runllm-widget-script",
        type: "module",
        src: "https://widget.runllm.com",
        "runllm-server-address": "https://api.runllm.com",
        "runllm-assistant-id": "112",
        "runllm-position": "BOTTOM_RIGHT",
        "runllm-keyboard-shortcut": "Mod+j",
        "runllm-preset": "docusaurus",
        "runllm-name": "Eppo",
        "runllm-theme-color": "#6C55D4",
        "runllm-brand-logo": "https://cdn.prod.website-files.com/6171016af5f2c517ec1ac76c/665a6c2d40484c5fa36d55b0_Untitled%20design%20(1).png",
        async: true,
      },
    ],

    plugins: [
      [
        '@docusaurus/plugin-google-gtag',
        {
          trackingID: 'G-8VW1T2Y4E8', 
          anonymizeIP: true, // GDPR compliance
        },
      ],
      [
        "@gracefullight/docusaurus-plugin-microsoft-clarity",
        {
          projectId: "q6ay3hytr7"
        },
      ],
    ],    

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'announcementBar-1', // Any value that will identify this message
        content: '<strong>Webinar: How Delivery Hero Uses Switchbacks to Drive Marketplace Innovation</strong> &nbsp; Watch the recording &nbsp;<a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=4sUDhv3AFrg">here →</a>',
        backgroundColor: '#7964d3', // Defaults to '#fff'
        textColor: '#ffffff', // Defaults to '#000'
        isCloseable: true, // Defaults to true
      },
      algolia: {
      // // The application ID provided by Algolia
        appId: 'XFI8PX63MB',

        // // Public API key: it is safe to commit it
        apiKey: '097f2a86e0398b9815e685970293621f',

        indexName: 'geteppo'

      // // ... other Algolia params
      },      
      navbar: {
        // title: 'Eppo',
        logo: {
          alt: 'Eppo',
          src: 'img/eppo_logo2024.svg',
          srcDark: 'img/eppo_logo2024_dark.svg'
        },
        items: [
          {
            href: 'https://eppo.cloud/',
            label: 'Login',
            position: 'right',
            className: 'button button--secondary',
          },          
          {
            href: 'https://www.geteppo.com/get-access',
            label: 'Get a Demo',
            position: 'right',
            className: 'button button--primary',
          },          
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Eppo',
                to: 'https://www.geteppo.com'
              },
              {
                label: 'Blog',
                to: 'https://www.geteppo.com/blog'
              },
              {
                label: 'Eppo application',
                to: 'https://eppo.cloud'
              },
              {
                label: 'Product updates',
                to: 'https://updates.eppo.cloud'
              }
            ]
          },
          {
            title: 'Reference',
            items: [
              {
                label: 'API reference',
                to: 'https://eppo.cloud/api/docs#/'
              },
              {
                label: 'Security',
                to: 'https://www.geteppo.com/security'
              }
            ]
          }

        ],
        copyright: `Copyright © ${new Date().getFullYear()} Eppo, Inc.`
      },
      prism: {
        additionalLanguages: [
          'bash',
          'csharp',
          'go',
          'groovy',
          'java',
          'javascript',
          'json',
          'php',
          'python',
          'ruby',
          'rust',
          'sql',
          'swift',
          'tsx',
          'typescript',
          'yaml',
        ],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true
      }
    })
  }
}

module.exports = createConfig
