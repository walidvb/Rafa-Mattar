import Link from 'next/link';
import { Entry } from 'contentful';
import { ISession } from '@types/contentful';
import { FaInstagram, FaVimeoSquare, FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { MAIN_BOOK_SLUG } from '@pages/[slug]';
import { motion } from 'framer-motion';
export const Header = ({
  books,
  className = '',
}: {
  books: Entry<ISession>[];
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const timer = useRef(null);
  const baseActive = router.query.slug;
  const [active, setActive] = useState(baseActive);
  return (
    <header
      className={clsx('mx-auto uppercase py-4 tracking-wider', className)}
    >
      <div className=" flex flex-wrap lg:grid lg:grid-cols-3 lg:items-start justify-between  gap-4">
        <Link passHref href="/">
          <h1 className="font-title  grow">
            {'Rafael Mattar'.split('').map((letter, i) => (
              <span
                className="inline-block hover:opacity-0 transition-all hover:transition-none"
                key={i}
              >
                {letter === ' ' ? <>&nbsp;</> : letter}
              </span>
            ))}
          </h1>
        </Link>
        <ul className="flex gap-8 grow lg:justify-center items-end self-stretch order-last lg:order-none text-sm ">
          {books.map((book) => {
            return (
              <li
                key={book.fields.slug}
                className="relative"
                onMouseEnter={() => {
                  setActive(book.fields.slug);
                }}
                onMouseLeave={() => {
                  setActive(baseActive);
                }}
              >
                <Link href={`/${book.fields.slug}`}>{book.fields.name}</Link>
                {active === book.fields.slug && (
                  <motion.div
                    layoutId="strike"
                    className="border-[0.5px] top-1/2 absolute w-[calc(100%+6px)] -left-[3px] border-white"
                    transition={{
                      duration: 0.15,
                      // type: 'spring',
                      ease: 'easeInOut',
                      damping: 15,
                      stiffness: 200,
                    }}
                  />
                )}
              </li>
            );
          })}

          {/* <li>
            <div className="relative group hidden md:block">
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
          </li> */}
        </ul>
        <ul
          className={`grow text-right inline-flex items-end self-stretch text-sm lg:justify-end gap-4`}
        >
          <li>
            <a
              href="https://instagram.com/rafaelmattar.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className={` group lg:translate-y-0 -translate-y-0.5 inline-block`}
            >
              <FaInstagram className="h-3.5 w-3.5 group-hover:-translate-y-[2px] translate-y-0 transition inline-block" />
            </a>
          </li>
          <li>
            <a
              href="https://vimeo.com/rafaelmattar"
              target="_blank"
              rel="noopener noreferrer"
              className=" group  lg:translate-y-0 -translate-y-0.5 inline-block"
            >
              <VimeoIcon className="h-3.5 w-3.5 group-hover:-translate-y-[2px] translate-y-0 transition inline-block" />
            </a>
          </li>
          <li>
            <Link
              href="/contact"
              className={`hover:line-through ${
                'contact' === active ? 'line-through' : ''
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

const VimeoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2500"
    height="2157"
    viewBox="-0.001 0.001 1158.763 999.998"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1158.195 231.332c-5.193 112.53-83.965 266.609-236.312 462.239C764.34 897.856 631.034 999.999 521.967 999.999c-67.519 0-124.648-62.324-171.393-186.973l-93.486-342.784c-34.625-124.648-71.847-186.973-111.665-186.973-8.656 0-38.953 18.178-90.891 54.534L-.001 267.688a14811.618 14811.618 0 0 0 168.795-150.617C244.968 51.284 302.099 16.66 340.186 13.197 430.21 4.541 485.609 66 506.384 197.573c22.506 141.961 38.087 230.254 46.742 264.879 25.969 117.724 54.534 176.586 85.696 176.586 24.237 0 60.594-38.087 109.068-114.261 48.475-76.175 74.443-134.171 77.905-173.989 6.925-65.787-19.043-98.68-77.905-98.68-27.7 0-56.266 6.06-85.696 18.178C719.325 85.044 828.393-4.98 989.398.214c119.455 3.463 175.721 80.503 168.795 231.12l.002-.002z"
    />
  </svg>
);
