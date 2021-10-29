import Image from 'next/image';

import logo from '@public/images/logo.png'
import logoSmall from '@public/images/logo_small.png'
import Link from 'next/link';

const Header = ({ }) => {

  return <div className="h-20 flex flex-row justify-between fixed top-0 z-50">
    <div className="flex justify-start">
      <Link href="/">
        <a>
          {/* <Image src={logo} alt="logo" objectFit='contain' height={80} /> */}
          <Image src={logoSmall} alt="logo" objectFit='contain' height={80} />
        </a>
      </Link>
    </div>
  </div>
}

export default Header