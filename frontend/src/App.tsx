import React from 'react';
import { DAppProvider, Kovan, Config } from "@usedapp/core";
import { Header } from './components/header';
import { Container } from "@material-ui/core"
import { Main } from "./components/main"
import { getDefaultProvider } from 'ethers'


const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: getDefaultProvider('kovan'),
  },
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000
  }
}

function App() {
  return (
    <DAppProvider config={config
    }>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>

    </DAppProvider>

  );
}

export default App;
