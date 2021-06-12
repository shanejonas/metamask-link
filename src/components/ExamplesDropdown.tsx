import { Button, Grid, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React from "react";

interface IProps {
  onChange?: (example: any) => any;
  examples?: any;
}

const ExamplesDropdown: React.FC<IProps> = ({ onChange, examples }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (example: any) => {
    setAnchorEl(null);
    if (onChange) {
      onChange(example);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button onClick={handleClick} variant="outlined" disabled={Boolean(anchorEl)} style={{ color: theme.palette.primary.main, border: 'transparent' }}>Examples</Button>
      <Menu
        id="examples-dropdown"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          style: {
            borderRadius: "25px",
            marginTop: "8px"
          }
        }}
        onClose={handleClose}
      >
        {examples.map((example: any) => (
          <MenuItem onClick={(event) => handleMenuItemClick(example)}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography variant="body1" >{example.method}</Typography>
              </Grid>
            </Grid>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ExamplesDropdown;
