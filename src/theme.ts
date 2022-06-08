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
    attrLabel: {
      fontWeight: 'normal',
      color: 'text.secondary',
      fontSize: 'xs',
      textTransform: 'uppercase',
    }
  }
}

const Button: ComponentStyleConfig = {
  variants: {
    solid: {
      bgColor: 'brand.primary.400',
      _hover: {
        bgColor: 'brand.primary.500',
      },
      _active: {
        bgColor: 'brand.primary.500',
      },
    }
  }
}

const Tabs: ComponentStyleConfig = {
  variants: {
    enclosed: {
      tablist: {
        borderColor: 'background.border',
      },
      tab: {
        color: 'text.secondary',
        _focus: {
          boxShadow: 'none',
        },
        _selected: {
          color: 'text.primary',
          boxShadow: 'none',
          borderColor: 'background.border',
          borderBottomColor: 'black',
        },
      },
    }
  }
}

const Table: ComponentStyleConfig = {
  sizes: {
    md: {
      th: {
        pt: 6,
        pb: 6,
      },
      td: {
        fontSize: 'sm',
      }
    }
  },
  variants: {
    striped: {
      bgColor: 'background.default',
      thead: {
        th: {
          color: 'text.primary',
          fontWeight: 900,
          bgColor: 'background.card',
          border: 'none',
        }
      },
      tbody: {
        tr: {
          _even: {
            td: {
              bgColor: 'background.card',
              border: 'none',
            },
          },
          _odd: {
            td: {
              bgColor: 'background.default',
              border: 'none',
            }
          },
        },
      },
    }
  }
}

const Menu: ComponentStyleConfig = {
  defaultProps: {
    variant: 'default',
  },
  variants: {
    default: {
      button: {
        bgColor: 'background.card',
        border: '2px solid',
        borderColor: 'background.border',
        fontSize: 'sm',
      },
      list: {
        bgColor: 'background.card',
        border: 'none',
        boxShadow: '0 20px 20px 0 rgba(0,0,0,0.30)',
      },
      item: {
        fontSize: 'sm',
        bgColor: 'background.card',
        pt: 3,
        pb: 3,
        _focus: {
          bgColor: 'background.border',
        },
        _hover: {
          bgColor: 'background.border',
        },
      }
    }
  }
}

const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    p: 4,
    borderRadius: 8,
  },
}

const Divider: ComponentStyleConfig = {
  baseStyle: {
    color: 'text.secondary',
    borderColor: 'background.border',
  }
}

const customTheme = extendTheme({ 
  colors: {
    text: {
      primary: '#FCFCFD',
      secondary: '#777E90',
    },
    brand: {
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
      success: {
        50: '#dcfffe',
        100: '#affff5',
        200: '#80ffea',
        300: '#51ffdc',
        400: '#2affc9',
        500: '#1ae6a8',
        600: '#0cb37d',
        700: '#008055',
        800: '#004d37',
        900: '#001c13',
      },
      warning: {
        50: '#fff0dd',
        100: '#fed7b1',
        200: '#fabd83',
        300: '#f8a354',
        400: '#f48924',
        500: '#db6f0b',
        600: '#ab5706',
        700: '#7a3d03',
        800: '#4b2400',
        900: '#1e0900',
      },
    },
    background: {
      default: '#1A1A1A',
      darker: '#141416',
      card: '#282828',
      border: '#2E3136',
    }
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        fontFamily: 'Poppins',
        bgColor: 'background.default',
        color: 'text.primary',
      },
      // styles for the `a`
      a: {
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  components: {
    Tabs,
    Text,
    Button,
    Table,
    Menu,
    Tooltip,
    Divider,
  },
 });

export default customTheme;