import { extendTheme, theme } from '@chakra-ui/react'
import type { ComponentStyleConfig } from '@chakra-ui/theme'

const Text: ComponentStyleConfig = {
  baseStyle: {
    color: 'inherit',
  },
  variants: {
    primary: {
      color: 'text.primary',
    },
    secondary: {
      color: 'text.secondary',
    },
    warning: {
      color: 'brand.primary',
      fontWeight: 'medium',
    },
    attrLabel: {
      fontWeight: 'normal',
      color: 'text.secondary',
      fontSize: 'xs',
      textTransform: 'uppercase',
    },
  }
}

const Button: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'brand.primary',
    variant: 'brand',
  },
  variants: {
    link: {
      textDecoration: 'underline',
    },
    outline: {
      borderWidth:2 ,
      _hover: {
        bgColor: 'rgba(255, 255, 255, 0.05)',
      },
    },
    brand: (props) => ({
      ...theme.components.Button.variants.solid(props),
      backgroundImage: `linear-gradient(242deg, #246cf9 0%, #9a1ef6 0%, #3400d0 100%)`,
      _hover: {
        _disabled: {
          background: 'inherited',
        }
      }
    }),
  }
}

const Image: ComponentStyleConfig = {
  baseStyle: {
    display: 'inline-block',
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
  baseStyle: {
    button: {
      color: 'text.primary',
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
      color: 'text.primary',
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
  },
  variants: {
    outline: {
      button: {
        bg: 'transparent',
        borderWidth: 2,
        borderColor: 'background.border',
        borderRadius: 4,
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

const Accordion: ComponentStyleConfig = {
  baseStyle: {
    panel: {
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      bgColor: 'background.default',
      p: 4,
    },
    button: {
      bgColor: 'background.darker',
      borderRadius: 16,
      _hover: {
        bgColor: 'background.darker',
      },
      _expanded: {
        mb: 0.5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  }
}

const Modal: ComponentStyleConfig = {
  defaultProps: {
    size: 'lg',
  },
  baseStyle: {
    dialog: {
      bgColor: 'background.default',
      px: 4,
      py: 8,
      borderRadius: 16,
    }
  },
  sizes: {
    xl: {
      dialog: {
        w: 'fit-content',
        maxW: 'unset',
        minW: 500,
      }
    }
  }
}

const Badge: ComponentStyleConfig = {
  baseStyle: {
    fontsize: 'xs',
  },
  variants: {
    success: {
      bgColor: '#00875a33',
      color: '#00875a',
    },
    warning: {
      bgColor: '#e0720b33',
      color: '#DE710B',
    },
    danger: {
      bgColor: '#ff000033',
      color: '#ff0000',
    },
    info: {
      bgColor: '#0d6dfd33',
      color: '#0d6efd',
    },
  }
}

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)"
};
const Form: ComponentStyleConfig = {
  defaultProps: {
    variant: 'floating',
  },
  variants: {
    floating: {
      bgColor: 'background.default',
      container: {
        _focusWithin: {
          label: {
            ...activeLabelStyles
          }
        },
        "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label": {
          ...activeLabelStyles
        },
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          position: "absolute",
          backgroundColor: "background.default",
          pointerEvents: "none",
          mx: 3,
          px: 1,
          my: 2,
          transformOrigin: "left top"
        }
      }
    }
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
      info: {
        50: '#dff1ff',
        100: '#afd2ff',
        200: '#7eb3ff',
        300: '#4c95ff',
        400: '#1b77fd',
        500: '#025de4',
        600: '#0048b2',
        700: '#003480',
        800: '#001f50',
        900: '#000a20',
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
      danger: {
        50: '#ffe5e9',
        100: '#f9bcc2',
        200: '#ee919a',
        300: '#e66673',
        400: '#dd3b4b',
        500: '#c42231',
        600: '#991826',
        700: '#6e101a',
        800: '#44070e',
        900: '#1e0001',
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
          color: 'inherit',
          textDecoration: 'underline',
        },
      },
    },
  },
  components: {
    Tabs,
    Text,
    Button,
    Image,
    Table,
    Menu,
    Tooltip,
    Divider,
    Accordion,
    Modal,
    Badge,
    Form,
  },
 });

export default customTheme;