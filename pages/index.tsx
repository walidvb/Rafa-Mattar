import { getMedias } from '../shared/api';
// @ts-ignore
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import OGTags from '@shared/layout/OGTags';
import { decode } from 'html-entities';
import { NextPageContext } from 'next';
import Link from 'next/link';
import { ISettings } from '../@types/contentful';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Home = (props: {
  medias: any[];
  promotedMedias: any[];
  settings: ISettings;
}) => {
  console.log({ props });
  const descAsString = documentToHtmlString(
    // @ts-expect-error
    props.settings?.fields.introText

  ).replace(/(<([^>]+)>)/gi, '');
  const { medias, promotedMedias } = props;
  return (
    <>
      <OGTags description={decode(descAsString)} />
      <div className="container mx-auto px-4">
        <header className="flex flex-wrap items-center justify-between py-4 mb-8">
          <div className="w-full md:w-auto">Rafael Matar</div>

          <nav className="hidden md:block w-1/2 text-center">
            {medias.map((media) => (
              <Link
                key={media.sys.id}
                href={`/sessao/${media.fields.tag?.fields.tagName}`}
                className="text-blue-500 mx-2"
              >
                {media.fields.tag?.fields.tagName}
              </Link>
            ))}
          </nav>

          <div className="flex justify-end w-full md:w-auto">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mx-2"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mx-2"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </header>

        <div className="flex flex-wrap  md:grid-cols-4 gap-4">
          {medias.map((media) => (
            <div key={media.sys.id} className='h-row'>
              <img
                height=""
                src={media.fields.photos.fields.file.url}
                alt={media.fields.title}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async ({ req }: NextPageContext) => {
 const medias  = await getMedias()
 const promotedMedias = medias
    //  .filter((media) => media.fields.promotedToFrontPage)
   .slice(0, 4);

 return {
   props: {
     medias,
     promotedMedias,
   },
 };
};
