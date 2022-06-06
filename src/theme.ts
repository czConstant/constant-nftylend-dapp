import { extendTheme } from '@chakra-ui/react'
import type { ComponentStyleConfig } from '@chakra-ui/theme'

const Text: ComponentStyleConfig = {
  baseStyle: {
    color: 'text.primary',
  },
  variants: {
    primary: {
      color: 'text.primary',
    },
    secondary: {
      color: 'text.secondary',
    },
  }
}

const Tabs: ComponentStyleConfig = {
  defaultProps: {
    variant: 'unstyled',
    colorScheme: ''
  }
}

const customTheme = extendTheme({ 
  colors: {
    text: {
      primary: '#FCFCFD',
      secondary: '#777E90',
    },
    primary: {
      50: '#efe4ff',
      100: '#cdb3ff',
      200: '#ac80ff',
      300: '#8a4dfe',
      400: '#6a1cfd',
      500: '#5103e4',
      600: '#3e01b2',
      700: '#2c0080',
      800: '#1b004f',
      900: '#0a001f',
    },
    background: {
      default: '#1A1A1A',
      card: '#282828',
    }
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: 'background.default',
        color: 'text.primary',
      },
      // styles for the `a`
      a: {
        color: 'text.primary',
        _hover: {
          textDecoration: 'underline',
        },
      },
      button: {
        _focus: {
          boxShadow: 'none',
        }
      }
    },
  },
  components: {
    Tabs,
    Text,
  }
 });

export default customTheme;