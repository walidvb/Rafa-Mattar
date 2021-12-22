import logoSmall from '@public/images/logo_small.png';
import Image from 'next/image';
import Link from 'next/link';
import Logo from './Logo';

import logo_full from '@public/images/logo_full_light.png'

const menuItems = [
  {
    label: 'Projets',
    href: '/#projets',
  },
  {
    label: 'À Propos',
    href: '/about',
  },
  {
    label: 'Actualité',
    href: '/#actualite',
  },

]

const MenuLinks = ({ className = '' }: { className?: string }) => <ul className={`flex gap-8 pl-2 ${className}`}>
  {menuItems.map(item => (
    <li key={item.label}>
      <Link href={item.href}>
        <a className="inline-flex hover:text-brand">{item.label}</a>
      </Link>
    </li>))}
</ul>

const Header = ({ fullLogo }: { fullLogo: boolean }) => {

  return <>
    { fullLogo && <div className="relative mt-8 md:mt-12 container mx-auto">
      <div className="absolute top-2 bg-white z-20 w-full">
        <Image src={logo_full} alt="logo" width={330} height={144}/>
      </div>
    </div> }
    <div className="md:flex flex-row justify-between items-center z-50 sticky py-2 top-0 container mx-auto">
      <div className="flex justify-start">
        <Link href="/">
          <a className="inline-flex">
            {/* <Image src={logo} alt="logo" objectFit='contain' height={80} /> */}
            {/* <Image src={logoSmall} alt="logo" objectFit='contain' height={80} /> */}
            <Logo />
          </a>
        </Link>
      </div>
      <MenuLinks className="hidden md:inline-flex"/>
    </div>
    <MenuLinks className="md:hidden justify-end pr-2 sticky top-10 z-10 right-0"/>
  </>
}

export default Header