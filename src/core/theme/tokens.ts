/**
 * Arogya Botanica Design Tokens
 * Paper-cut botanical illustration, arches and leaves, one thread. Calm, human, unmistakably Arogya.
 */

export const tokens = {
  colors: {
    // Approved Botanica Palette
    ground: '#F6F1E7',        // Ivory ground
    ink: '#14382E',           // Botanical ink
    sage: '#A9B9A0',          // Sage (done)
    terracotta: '#A94B2F',    // Terracotta (now / active)
    lilac: '#CFC9E8',         // Lilac (secondary)
    apricot: '#F0CDB5',       // Apricot (warmth)

    // Canvas & Surfaces
    canvas: '#F6F1E7',
    surface: '#FFFFFF',
    surfaceMuted: '#EFE9DD',
    border: '#E2DCD0',
    borderSubtle: '#EDE7DC',

    // Text Hierarchy
    textPrimary: '#14382E',   // Botanical ink
    textSecondary: '#4A5B53', // Muted botanical slate
    textMuted: '#71827A',
    textInverted: '#FFFFFF',

    // Semantic Mapping
    done: '#A9B9A0',
    active: '#A94B2F',
    secondary: '#CFC9E8',
    warmth: '#F0CDB5',

    // Gradients
    gradientDawn: 'linear-gradient(135deg, #A9B9A0 0%, #CFC9E8 52%, #F0CDB5 100%)',
    gradientThread: 'linear-gradient(90deg, #A9B9A0 0%, #CFC9E8 50%, #F0CDB5 80%, #A94B2F 100%)',

    // Status (Symbol + Word)
    status: {
      normal: {
        bg: '#EDF5EB',
        border: '#C4DDBF',
        text: '#14382E',
        symbol: '✓',
      },
      elevated: {
        bg: '#FBF0EB',
        border: '#ECC9BD',
        text: '#A94B2F',
        symbol: '▲',
      },
      info: {
        bg: '#F2F0FA',
        border: '#D8D4EC',
        text: '#373259',
        symbol: '●',
      }
    }
  },

  typography: {
    fontHeadings: "'Newsreader', Georgia, serif",
    fontBody: "'Figtree', system-ui, -apple-system, sans-serif",
    sizes: {
      hero: '28px',
      h1: '24px',
      h2: '20px',
      body: '15px',
      meta: '13px',
      caption: '11px',
    }
  },

  shapes: {
    arch: '40px 40px 16px 16px',
    leaf: '28px 8px 28px 8px',
    folded: '16px 4px 16px 16px',
    circle: '9999px',
  }
} as const;
