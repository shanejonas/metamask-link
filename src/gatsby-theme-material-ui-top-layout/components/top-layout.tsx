import { MuiThemeProvider, AppBar, CssBaseline, Toolbar, Grid, Typography, Tooltip, IconButton } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/default";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { useStaticQuery, graphql } from "gatsby";
import React from "react"
const ThemeTopLayout = require("gatsby-theme-material-ui-top-layout/src/components/top-layout").default;

const TopLayout: React.FC = ({ children }) => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
          description
          logoUrl
        }
      }
    }
  `);
  return (
    <ThemeTopLayout theme={theme} >
      <AppBar position="static" color="default" elevation={0} >
        <Toolbar>
          <Grid container alignContent="center" alignItems="center" justify="space-between" >
            <Grid item container direction="row" xs={5} >
              <Grid style={{ paddingRight: "5px" }}>
                <img
                  alt="logo"
                  height="30"
                  style={{
                    marginTop: "6px",
                  }
                  }
                  src={data.site.siteMetadata.logoUrl} />
              </Grid>
              < Grid style={{ marginTop: "7px" }}>
                <Typography color="textSecondary" variant="h6" >
                  {data.site.siteMetadata.title}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="row" xs={7} justify="flex-end" alignItems="center" >
              <Tooltip title={"Toggle Dark Mode"}>
                <IconButton onClick={darkMode.toggle}>
                  {darkMode.value ? <Brightness3Icon fontSize="small" /> : <WbSunnyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {children}
    </ThemeTopLayout>
  )
}

export default TopLayout;
