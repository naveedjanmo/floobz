import '../styles/base.css'
import '../styles/globals.css'

import SVG from 'react-inlinesvg';

function MyApp({ Component, pageProps, Background }) {
  return (
    <main>
      <header>
        <span className="word">
          Floobz NFT
        </span>
      </header>
      
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp