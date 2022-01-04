import { ReactNode } from "react";
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, className, fullLogo = false }: { children: ReactNode, className?: string, fullLogo?: boolean}) => {

  return <div className="min-h-screen flex flex-col font-serif bg-white">
    <Header fullLogo={fullLogo}/>
    <div className={`${className} flex-grow pb-8`}>
      { children}
    </div>
    <Footer />
  </div>

}

export default Layout