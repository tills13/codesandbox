import GlobalStyles from "../components/GlobalStyles";
import SelectableStateProvider from "../components/SelectableStateProvider";
import { globalState } from "../globalState";

export default function App({ Component, pageProps }) {
  return (
    <SelectableStateProvider provider={globalState}>
      <GlobalStyles />
      <Component {...pageProps} />
    </SelectableStateProvider>
  );
}
