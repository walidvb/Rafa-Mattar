import Link from 'next/link';
import { Entry } from 'contentful';
import { ISession } from '@types/contentful';
import { FaInstagram, FaVimeoSquare, FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const Header = ({ books }: { books: Entry<ISession>[] }) => {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const active = router.query.slug

  const showBooks = active !== "works" || hovered
  return (
    <header className="mx-auto uppercase py-4 tracking-wider">
      <div className="mb-4 flex flex-col lg:grid lg:grid-cols-3 lg:items-center justify-between  gap-4 ">
        <h1 className="font-title uppercase text-3xl grow ">Rafael Mattar</h1>
        <ul className="flex gap-8 grow lg:justify-center order-last lg:order-none">
          <li>
            <Link href="/" className={`hover:line-through ${'works' === active ? 'line-through' : ''}`}>
              Works
            </Link>

          </li>
          <li>
            <div className="relative group">
              <button
                className={`uppercase ${showBooks ? 'line-through' : ''}`}
                onMouseEnter={() => {
                  setHovered(true);
                }}
                onMouseLeave={() => {
                  setHovered(false);
                }}
                onFocus={() => {
                  setHovered(true);
                }}
                onBlur={() => {
                  setHovered(false);
                }}
              >
                Autorais
              </button>
            </div>
          </li>
        </ul>
        <ul className={`grow text-right inline-flex lg:justify-end gap-4`}>
          <li>
            <a
              href="https://vimeo.com/rafaelmattar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 group opacity-30 cursor-not-allowed"
            >
              <FaWhatsapp className="h-6 w-6 group-hover:-translate-y-[2px] translate-y-0 transition inline-block" />
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/rafaelmattar"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-neutral-700 group`}
            >
              <FaInstagram className="h-6 w-6 group-hover:-translate-y-[2px] translate-y-0 transition inline-block" />
            </a>
          </li>
          <li>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 group "
            >
              <FaVimeoSquare className="h-6 w-6 group-hover:-translate-y-[2px] translate-y-0 transition inline-block" />
            </a>
          </li>
        </ul>
      </div>
      <div className="flex lg:justify-center lg:text-center">
        {[...books, ...books, ...books].map((book, i) => (
          <Link
            className={`block first:pl-0 lg:first:pl-4 px-4 py-1 mt-1 text-xs last:border-r-0 border-r transition ${
              book.fields.slug === active ? 'line-through' : ''
            } ${
              showBooks
                ? 'opacity-1 translate-y-0'
                : 'opacity-0 -translate-y-[2px]'
            }`}
            key={book.sys.id}
            href={`/${book.fields.slug}`}
            style={{
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {book.fields.name}
          </Link>
        ))}
      </div>
    </header>
  );
};
