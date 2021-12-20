
const Footer = ({ }) => {

  return <div className="md:grid gap-8 md:grid-cols-[7fr,5fr] lg:grid-cols-[8fr,4fr] flex-row flex-grow-0 py-8 px-4 md:px-0 justify-between text-gray-400 items-center container mx-auto">
    <div className="">FUTUR PROCHE</div>
    <div>
      28 boulevard du pont d&apos;arve 
      <br />
      1205 Genève
      <br />
      <a className="hover:text-black" href="mailto:info@futurproche.ch">info@futurproche.ch</a>
      <br />
      <a className="hover:text-black" href="tel:+393287312924">+39 3287312924</a>
    </div>
  </div>
}

export default Footer