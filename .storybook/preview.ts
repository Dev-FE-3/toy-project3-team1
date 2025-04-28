import type { Preview } from '@storybook/react'
import '../src/shared/model/styles/globals.css'
import './sbStyles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
