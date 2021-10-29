import { ReactNode } from "react";
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }: { children: ReactNode}) => {

  return <div className="min-h-screen flex flex-col font-serif">
    <Header />
    <div className="flex-grow">
      { children}
    </div>
    <Footer />
  </div>

}

export default Layout