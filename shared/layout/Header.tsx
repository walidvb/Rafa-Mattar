import Image from 'next/image';

import logo from '@public/images/logo.png'
import logoSmall from '@public/images/logo_small.png'

const Header = ({ }) => {

  return <div className="h-20 flex flex-row justify-between fixed top-0">
    <div className="flex justify-start">
      {/* <Image src={logo} alt="logo" objectFit='contain' height={80} /> */}
      <Image src={logoSmall} alt="logo" objectFit='contain' height={80} />
    </div>
  </div>
}

export default Header