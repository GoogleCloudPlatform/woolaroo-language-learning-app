import { createMuiTheme } from "@material-ui/core/styles";

const baseTheme = createMuiTheme({
  typography: {
    h1: {
      fontFamily: "Product Sans Regular"
    },
    h2: {
      fontFamily: "Product Sans Regular"
    },
    h3: {
      fontFamily: "Product Sans Regular"
    },
    h4: {
      fontFamily: "Product Sans Regular"
    },
    h5: {
      fontFamily: "Product Sans Regular"
    },
    h6: {
      fontFamily: "Product Sans Regular"
    },
    subtitle1: {
      fontFamily: "Product Sans Regular"
    },

    subtitle2: {
      fontFamily: "Product Sans Regular"
    },

    body1: {
      fontFamily: "Product Sans Regular"
    },

    body2: {
      fontFamily: "Product Sans Regular"
    },

    caption: {
      fontFamily: "Product Sans Regular"
    }
  },
  overrides: {
    MuiButton: {
      baseTheme: {
        fontFamily: "Product Sans Regular"
      },
      containedSecondary: {
        fontFamily: "Product Sans Medium"
      },
      outlinedSecondary: {
        fontFamily: "Product Sans Medium"
      }
    },
    MuiInput: {
      baseTheme: {
        fontFamily: "Product Sans Regular"
      }
    },
    MuiChip: {
      label: {
          fontFamily: "Product Sans Regular"
      }
    }
  }
});

export default baseTheme;
