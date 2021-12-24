import logoSmall from '@public/images/logo_small.png';
import Image from 'next/image';
import Link from 'next/link';
import Logo from './Logo';

import logo_full from '@public/images/logo_full_light.png'
import styled from 'styled-components';
import { WithPointer } from '../../features/home/WithPointer';

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

const Mail = (props: any) => <svg {...props} className={`svg ${props.className}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><g fill="none"><path d="M2.721 2.051l15.355 7.566a.5.5 0 0 1 0 .897L2.72 18.08a.5.5 0 0 1-.704-.576l1.969-7.434l-1.97-7.442a.5.5 0 0 1 .705-.577zm.543 1.383l1.61 6.082l.062-.012L5 9.5h7a.5.5 0 0 1 .09.992L12 10.5H5a.506.506 0 0 1-.092-.008l-1.643 6.206l13.458-6.632L3.264 3.434z" fill="currentColor" /></g></svg>

export const SendEmail = () => <a className="inline-flex hover:text-brand" href="mailto:info@futurproche.ch">
  <Mail />
</a>

const MenuLinks = ({ className = '' }: { className?: string }) => <ul className={`flex md:gap-8 pl-2 pr-2 md:pr-0 ${className}`}>
  {menuItems.map(item => (
    <li key={item.label}>
      <Link href={item.href}>
        <a className="inline-flex hover:text-brand">{item.label}</a>
      </Link>
    </li>))}
    <li>
    {/* <WithPointer className="h-full flex items-center" pointerTitle="Écrivez-nous" within={false}> */}
      <div className="h-full flex items-center">
        <SendEmail />
      </div>
      {/* </WithPointer> */}
    </li>
</ul>

const Header = ({ fullLogo }: { fullLogo: boolean }) => {

  return <>
    { fullLogo && <div className="relative mt-8 md:mt-12 container mx-auto px-2 md:px-0">
      <div className="absolute top-2 bg-white md:bg-transparent z-20 w-full">
        <Image src={logo_full} alt="logo" width={330} height={144}/>
      </div>
    </div> }
    <div className={`${!fullLogo && 'justify-between'} md:justify-between flex flex-row items-center z-50 sticky py-2 top-0 container mx-auto`}>
      <div className="flex justify-start">
        <Link href="/">
          <a className="inline-flex">
            {/* <Image src={logo} alt="logo" objectFit='contain' height={80} /> */}
            {/* <Image src={logoSmall} alt="logo" objectFit='contain' height={80} /> */}
            <Logo />
          </a>
        </Link>
      </div>
      {!fullLogo && <MenuLinks className={`md:inline-flex flex-grow pl-4 justify-between md:justify-end`}/>}
      {fullLogo && <MenuLinks className="hidden md:flex justify-end pr-2 sticky top-6 z-10 right-0 gap-4"/>}
    </div>
      {fullLogo && <MenuLinks className="md:hidden justify-end pr-2 sticky top-6 z-10 right-0 gap-4"/>}
  </>
}

export default Header