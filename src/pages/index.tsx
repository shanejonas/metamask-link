import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, Avatar } from "@material-ui/core";
import Warning from "@material-ui/icons/Warning";
import useDarkMode from "use-dark-mode";
import { Link as GatsbyLink } from "gatsby";
import Link from "@material-ui/core/Link";
import { grey } from "@material-ui/core/colors";
import useQueryParams from "../hooks/useQueryString";
import { EventEmitter } from "events";
import * as qs from 'qs';
import QRCode from "react-qr-code";
import * as monaco from "monaco-editor";
import CustomEditor from "../components/CustomEditor";
import _ from "lodash";

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface EthereumProvider extends EventEmitter {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}


const getUrlWithoutSearch = () => {
  if (typeof window !== 'undefined') {
    return window.location.protocol + '//' + window.location.host + window.location.pathname
  }
}

const MyApp: React.FC = () => {
  const [queryParams] = useQueryParams();
  const darkMode = useDarkMode();
  const [value, setValue] = useState(() => {
    return JSON.stringify(queryParams, null, 4);
  });
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  useEffect(() => {
    const t = darkMode.value ? "vs-dark" : "vs";
    monaco.editor.setTheme(t);
  }, [darkMode.value]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasEthereum = window.ethereum && window.ethereum.isMetaMask;
      setShowInstallDialog(!hasEthereum);
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && queryParams && queryParams.method) {
      window.ethereum?.request(queryParams).then(console.log);
    }
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <CustomEditor
            value={value}
            onChange={_.debounce((v) => {
              try {
                JSON.parse(v);
                setValue(v);
                window?.history.pushState('', '', getUrlWithoutSearch() +  '?' + qs.stringify(JSON.parse(v), { encode: false }));
              } catch (e) {
                console.error(e);
              }
            }, 500)}
          />
        </Grid>
        <Grid xs={6} justify="center" alignItems="center">
          <Grid item style={{padding: "20px"}}>
            <QRCode value={getUrlWithoutSearch() + '?' + qs.stringify(JSON.parse(value), { encode: false })} size={400}/>
          </Grid>
          <Grid>
            <Grid item>Link:</Grid>
            <Grid item>
              <a href={getUrlWithoutSearch() + '?' + qs.stringify(JSON.parse(value), { encode: false })}>
                {getUrlWithoutSearch() + '?' + qs.stringify(JSON.parse(value), { encode: false })}
              </a>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={showInstallDialog} onClose={() => setShowInstallDialog(false)}>
        <DialogTitle>
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "6px", marginLeft: "6px" }}>
              <Warning />
            </div>
            <Typography variant="h5" style={{ marginTop: "8px", marginLeft: "6px" }}>
              MetaMask Not Detected
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Install MetaMask for your platform and refresh the page.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
          <Button startIcon={<Avatar src={"https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"} style={{ opacity: "0.9", height: "24px", width: "24px" }} />} variant="contained" color="primary" href="https://metamask.io/download.html" target="_blank">Download MetaMask</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyApp;
