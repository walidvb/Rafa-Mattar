import logoSmall from '@public/images/logo_small.png';
import Image from 'next/image';
import Link from 'next/link';
import Logo from './Logo';

import logo_full from '@public/images/logo_full_light.png'

const Header = ({ fullLogo }: { fullLogo: boolean }) => {

  return <>
    { fullLogo && <div className="relative ml-4 mt-4 md:ml-16 md:mt-12">
      <div className="absolute top-2 left-0">
        <Image src={logo_full} alt="logo" width={330} height={144}/>
      </div>
    </div> }
    <div className="flex flex-row justify-between z-50 ml-4 md:ml-0 md:px-16 sticky py-2 top-0">
      <div className="flex justify-start translate-x-[4px]">
        <Link href="/">
          <a>
            {/* <Image src={logo} alt="logo" objectFit='contain' height={80} /> */}
            {/* <Image src={logoSmall} alt="logo" objectFit='contain' height={80} /> */}
            <Logo />
          </a>
        </Link>
      </div>
    </div>
  </>
}

export default Header