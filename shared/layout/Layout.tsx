import { ReactNode } from "react";
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, className }: { children: ReactNode, className?: string}) => {

  return <div className="min-h-screen flex flex-col">
    <Header />
    <div className={`${className} flex-grow`}>
      { children}
    </div>
    <Footer />
  </div>

}

export default Layout