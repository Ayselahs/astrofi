import ReactModal from 'react-modal'
import '../styles/globals.css'

if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#__next')
}

function MyApp({ Component, pageProps }) {

  return <Component {...pageProps} />
}

export default MyApp
