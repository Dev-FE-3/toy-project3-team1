import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-backgrounds',
    '@storybook/addon-toolbars',
    '@storybook/addon-measure',
    '@storybook/addon-controls',
    '@storybook/addon-outline',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
export default config
