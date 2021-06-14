import React, { useEffect, useState, useRef } from "react";
import { Grid, Typography, Button, useTheme } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import Link from "@material-ui/core/Link";
import { green, grey } from "@material-ui/core/colors";
import useQueryParams from "../hooks/useQueryString";
import * as qs from 'qs';
import QRCode from "react-qr-code";
import * as monaco from "monaco-editor";
import CustomEditor from "../components/CustomEditor";
import _ from "lodash";
import MetaMaskOpenRPCDocument from "@metamask/api-specs";
import { useClipboard } from "use-clipboard-copy";
import { Check } from "@material-ui/icons";
import canvg from 'canvg';
import { Link as GatsbyLink } from "gatsby";
import { ExampleObject, ExamplePairingObject, MethodObject, MethodOrReference, OpenrpcDocument } from "@open-rpc/meta-schema";
import ExamplesDropdown from "../components/ExamplesDropdown";

const exampleMethods = ['wallet_addEthereumChain', 'wallet_watchAsset'];

const $RefParser = require("@apidevtools/json-schema-ref-parser"); //tslint:disable-line

const getShortenedUrlWithQs = (url: string | undefined, newQs: string) => {
  if (!url) {
    return;
  }
  if (url.length < 140) {
    return url + "?" + qs.stringify(JSON.parse(newQs), { encode: false });
  }
  return url.substring(0, 60) + '[...]' + url.substring(url.length - 60, url.length - 1) + "?" + qs.stringify(JSON.parse(newQs), { encode: false });
}

// Initiate download of blob
function download(
  filename: string, // string
  blob: Blob, // Blob
) {
  if ((window as any).navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}


interface IProps {
  location: Location;
}

const MyApp: React.FC<IProps> = ({ location }) => {
  const clipboard = useClipboard();
  const theme = useTheme();
  const [openrpcDocument, setOpenrpcDocument] = useState<OpenrpcDocument>();
  const [methodExamples, setMethodExamples] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadQrCode, setDownloadQRCode] = useState(false);
  const [queryParams] = useQueryParams(location.search);
  const qrCodeRef = useRef();
  const darkMode = useDarkMode();
  const [value, setValue] = useState(() => {
    return JSON.stringify(queryParams || {}, null, 4);
  });

  const getUrlWithoutSearch = (includeDeep: boolean = true) => {
    let url = location.protocol + "//" + location.host + location.pathname;
    if (includeDeep) {
      url = url + 'deep';
    }
    return url;
  }

  useEffect(() => {
    const t = darkMode.value ? "vs-dark" : "vs";
    monaco.editor.setTheme(t);
  }, [darkMode.value]);

  useEffect(() => {
    $RefParser.dereference(MetaMaskOpenRPCDocument).then(setOpenrpcDocument);
  }, [])

  useEffect(() => {
    const _methodExamples: any = [];
    // generate jsonrpc {method, params} examples out of an openrpcdoc
    openrpcDocument?.methods.filter((_method: MethodOrReference) => {
      let method = _method as MethodObject;
      return exampleMethods.includes(method.name);
    }).forEach((_method: MethodOrReference) => {
      let method = _method as MethodObject;
      let exampleParams: any;
      let emptyParams = [] as any;
      let examplePosition = 0;
      let example;
      type TParamStructure = "either" | "by-name" | "by-position";
      if (method && method.examples && method.examples[examplePosition]) {
        example = method.examples[examplePosition] as ExamplePairingObject;
        const paramStructure: TParamStructure = method.paramStructure || "either";
        exampleParams = paramStructure === "by-name"
          ? (example.params as ExampleObject[]).reduce(((memo, p) => {
            memo[p.name] = p.value;
            return memo;
          }), {} as any)
          : (example.params as ExampleObject[]).map(((p) => p.value));
      }
      if (method && method.paramStructure === "by-name") {
        emptyParams = {};
      }
      _methodExamples.push({
        method: method.name,
        params: exampleParams || emptyParams,
      })
    });
    setMethodExamples(_methodExamples);
  }, [openrpcDocument])

  const downloadQRCode = async () => {
    setDownloadQRCode(true);
    const svg = document.querySelector('#qr-code svg');
    if (!svg) {
      return;
    }
    setTimeout(async () => {
      const data = (new XMLSerializer()).serializeToString(svg);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      const v = canvg.fromString(context, data);
      v.start();
      await v.ready;
      canvas.toBlob(function (blob) {
        if (!blob) {
          return;
        }
        download(`QRCodeMetaMaskLink-${new Date().toISOString()}.png`, blob);
      });
    }, 0);
    setTimeout(() => {
      setDownloadQRCode(false);
    }, 1000);

  }
  const copyLink = () => {
    const link = getUrlWithoutSearch() + '?' + qs.stringify(JSON.parse(value), { encode: false })
    clipboard.copy(link);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1000);
  }

  return (
    <Grid container style={{
      padding: "40px",
      paddingTop: "15px"
    }}>
      <Grid item xs={5} style={{ marginLeft: "30px", paddingBottom: "40px" }}>
        <Typography variant="h3" gutterBottom>Deep link generator</Typography>
        <Typography variant="body1">Create deep links for MetaMask confirmations - including adding custom networks, tokens, payment requests, and more. It uses the window.ethereum provider under the hood. <Link href="https://metamask.github.io/api-playground/api-documentation/">Read the api reference docs</Link>.</Typography>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Grid container xs={12} justify="flex-end" style={{marginBottom: "20px"}}>
            <Grid item>
              <ExamplesDropdown examples={methodExamples} onChange={(example) => setValue(JSON.stringify(example, null, 4))} />
            </Grid>
          </Grid>
          <CustomEditor
            openrpcDocument={openrpcDocument}
            value={value}
            onChange={_.debounce((v) => {
              try {
                JSON.parse(v);
                setValue(v);
                window?.history.pushState('', '', getUrlWithoutSearch(false) + '?' + qs.stringify(JSON.parse(v), { encode: false }));
              } catch (e) {
                console.error(e);
              }
            }, 500)}
          />
        </Grid>
        <Grid xs={6} justify="center" alignItems="center" style={{ padding: "20px" }}>
          <Grid item style={{ marginBottom: "20px", height: "350px" }} id="qr-code">
            {typeof window !== 'undefined' && <QRCode ref={qrCodeRef as any} value={getUrlWithoutSearch() + '?' + qs.stringify(JSON.parse(value), { encode: false })} size={350} />}
          </Grid>
          <Grid item style={{ paddingBottom: "50px", marginLeft: "60px" }}>
            <Button startIcon={downloadQrCode ? <Check style={{ color: green[500] }} /> : undefined} variant="contained" color="primary" onClick={() => downloadQRCode()}>{downloadQrCode ? "Downloaded QR Image!" : "Download QR Image"}</Button>
          </Grid>
          <Grid>
            <Grid item>
              <Typography variant="h5">Deep Link</Typography>
            </Grid>
            <Grid item style={{ paddingBottom: "20px", maxWidth: "500px" }}>
              {typeof window !== 'undefined' &&
                <GatsbyLink to={'/deep?' + qs.stringify(JSON.parse(value), { encode: false })} style={{ textDecoration: "none", color: theme.palette.primary.main, fontSize: theme.typography.body1.fontSize }}>
                  {getShortenedUrlWithQs(getUrlWithoutSearch(), value)}
                </GatsbyLink>
              }
            </Grid>
            <Grid item style={{ paddingBottom: "20px", marginLeft: "60px" }}>
              <Button startIcon={linkCopied ? <Check style={{ color: green[500] }} /> : undefined} variant="contained" color="primary" onClick={() => copyLink()}>{linkCopied ? "Link Copied!" : "Copy Link"}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyApp;
