import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { Provider } from "jotai";
import { PublicKeyModal } from "~/components/features/public-key-modal";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
        <PublicKeyModal />
      </div>
    </Provider>
  );
};

export default MyApp;
