import Link from 'next/link';
import { Entry } from 'contentful';
import { ISession } from '@types/contentful';
import { FaInstagram, FaVimeoSquare, FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

export const Header = ({ books }: { books: Entry<ISession>[] }) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const active = router.query.slug || 'work';

  const showBooks = active !== 'work' || hovered;
  const timer = useRef(null);
  return (
    <header className="mx-auto uppercase py-4 px-2 tracking-wider">
      <div className="mb-4 flex flex-col lg:grid lg:grid-cols-3 lg:items-center justify-between  gap-4 ">
        <h1 className="font-title uppercase text-3xl grow">
          {'Rafael Mattar'.split('').map((letter, i) => (
            <span className="inline-block hover:-translate-y-1 transition-all" key={i}>{letter === " " ? <>&nbsp;</> : letter}</span>
          ))}
        </h1>
        <ul className="flex gap-8 grow lg:justify-center order-last lg:order-none">
          <li>
            <Link
              href="/"
              className={`hover:line-through ${
                'work' === active ? 'line-through' : ''
              }`}
            >
              Work
            </Link>
          </li>
          <li>
            <div className="relative group">
              <button
                className={`uppercase ${showBooks ? 'line-through' : ''}`}
                onMouseEnter={() => {
                  clearTimeout(timer.current);
                  setHovered(true);
                }}
                onMouseLeave={() => {
                  clearTimeout(timer.current);
                  timer.current = setTimeout(() => {
                    setHovered(false);
                  }, 800);
                }}
                onFocus={() => {
                  clearTimeout(timer.current);
                  setHovered(true);
                }}
                onBlur={() => {
                  timer.current = setTimeout(() => {
                    setHovered(false);
                  }, 800);
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
        {books
          .filter(({ fields: { slug } }) => slug !== 'work')
          .map((book, i) => (
            <Link
              className={`block first:pl-0 lg:first:pl-4 px-4 py-1 mt-1 text-xs last:border-r-0 border-r transition hover:line-through ${
                book.fields.slug === active ? 'line-through' : ''
              }
            ${'delay-[1s] group-hover:delay-0 hover:opacity-1 hover:translate-y-0 '}
             ${
               showBooks
                 ? 'opacity-1 translate-y-0'
                 : 'opacity-0 -translate-y-[4px]'
             }`}
              key={book.sys.id}
              href={`/${book.fields.slug}`}
              style={{
                transitionDelay: `${i * 50}ms`,
              }}
              onMouseEnter={() => clearTimeout(timer.current)}
              onMouseLeave={() =>
                (timer.current = setTimeout(() => {
                  setHovered(false);
                }, 800))
              }
            >
              {book.fields.name}
            </Link>
          ))}
      </div>
    </header>
  );
};
