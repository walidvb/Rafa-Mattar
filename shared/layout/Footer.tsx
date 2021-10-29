import Image from 'next/image';

import logo from '@public/images/logo.png'

const Footer = ({ }) => {

  return <div className="leading-10 md:flex flex-row flex-grow-0 py-8 px-4 justify-between text-gray-400 items-center">
    <div className="">FUTUR PROCHE</div>
    <div>
      Via Gallo 6
      <br />
      <a href="mailto:info@futurproche.com">info@futurproche.com</a>
      <br />
      <a href="tel:+393287312924">+39 3287312924</a>
    </div>
  </div>
}

export default Footer