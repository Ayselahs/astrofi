import ReactModal from 'react-modal'
import '../styles/globals.css'
import { UserProvider } from '@/context'

if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#__next')
}

function MyApp({ Component, pageProps }) {

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
