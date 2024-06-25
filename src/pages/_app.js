import './styles/globals.css';
import 'jquery/dist/jquery.min.js';
import {WalletProvider} from '@suiet/wallet-kit';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Linea } from "@thirdweb-dev/chains";
function MyApp({ Component, pageProps }) {
  //return <Component {...pageProps} />;
  return (

   
        <ThirdwebProvider activeChain={Linea} clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}>
        <Component {...pageProps} />
      </ThirdwebProvider>

  )
}

export default MyApp;
