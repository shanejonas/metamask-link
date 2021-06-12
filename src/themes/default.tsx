import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import { Overrides } from "@material-ui/core/styles/overrides";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";

const lightBackground = "#fff";
const darkBackground = grey[900];

const headerFontWeight = 800;

const typography: TypographyOptions = {
  button: {
    textTransform: "none",
    fontSize: "0.9rem",
    fontWeight: 400
  },
  h1: {
    fontSize: "2.25rem",
    fontWeight: headerFontWeight,
  },
  h2: {
    fontSize: "2rem",
    letterSpacing: "0",
    fontWeight: headerFontWeight,
  },
  h3: {
    fontSize: "1.75rem",
    fontWeight: headerFontWeight,
  },
  h4: {
    fontSize: "1.5rem",
    fontWeight: headerFontWeight,
  },
  h5: {
    fontSize: "0.9rem",
    fontWeight: headerFontWeight,
  },
  h6: {
    fontSize: "1.0rem",
    fontWeight: 300,
  },
  body1: {
    fontWeight: 300,
    fontSize: "1.06rem",
  },
  fontSize: 17,
  fontWeightRegular: 250,
  fontFamily: ["Helvetica", "Arial", "San-Serif"].join(","),
};

const paletteOverrides: PaletteOptions  ={
  primary: {
    main: "#0072d0",
  }
};
const overrides: Overrides = {
  MuiMenuItem: {
    root: {
      justifyContent: 'center'
    }
  },
  MuiButton: {
      contained: {
        minWidth: "200px",
        borderRadius: "35px",
        boxShadow: "0px 3px 4px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)"
      },
      outlined: {
        minWidth: "200px",
        borderRadius: "35px",
        boxShadow: "0px 3px 4px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)"
      }
  }
}

export const lightTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  overrides: {
    ...overrides,
    MuiPaper: {
      root: {
        zIndex: 1,
        opacity: 1,
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: lightBackground,
      },
    },
    MuiAppBar: {
      root: {
        backgroundColor: lightBackground,
      },
      colorDefault: {
        backgroundColor: lightBackground,
      },
      colorPrimary: {
        backgroundColor: lightBackground,
      },
    },
  },
  palette: {
    ...paletteOverrides,
    background: {
      default: "#fff",
    },
  },
  typography,
}));

export const darkTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
  },
  palette: {
    type: "dark",
    background: {
      default: grey[900],
      paper: grey[900],
    },
    ...paletteOverrides
  },
  overrides: {
    ...overrides,
    MuiPaper: {
      root: {
        zIndex: 1,
        opacity: 1,
      },
    },
    MuiAppBar: {
      root: {
        backgroundColor: darkBackground,
      },
      colorPrimary: {
        backgroundColor: darkBackground,
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: darkBackground,
      },
    },
    MuiTable: {
      root: {
        backgroundColor: darkBackground,
      },
    },
    MuiTypography: {
      root: {
        color: grey[400],
      },
    },
  },
  typography,
}));

export default {
  darkTheme,
  lightTheme,
};
