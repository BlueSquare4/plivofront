// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',        // force dark mode :contentReference[oaicite:0]{index=0}
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />      {/* normalize + dark‑mode background/text :contentReference[oaicite:1]{index=1} */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
