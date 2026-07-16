import { GetStaticProps } from 'next';
import Image from 'next/image';

import { Header } from '@features/Header';
import { getPages, getSiteConfig, strapiMediaUrl } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { Page, SiteConfig } from '@shared/strapi-types';

interface AboutPageProps {
  pages: Page[];
  siteConfig: SiteConfig | null;
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const pages = await getPages();
  const siteConfig = await getSiteConfig();

  return {
    revalidate: 120,
    props: {
      pages,
      siteConfig,
    },
  };
};

export default function About({ pages, siteConfig }: AboutPageProps) {
  const pictureUrl = strapiMediaUrl(siteConfig?.about?.picture?.url);
  const paragraphs = (siteConfig?.about?.bio ?? '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const ogImage =
    strapiMediaUrl(siteConfig?.og?.image?.url) ?? pictureUrl;
  const ogDescription =
    siteConfig?.og?.description ?? paragraphs[0] ?? undefined;

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center px-2 pb-8 md:px-4">
      <OGTags
        title="Rafael Mattar — About"
        description={ogDescription}
        image={ogImage}
        path="about"
      />
      <Header pages={pages} className="w-full px-2" />

      <div className="grow px-2 py-10 md:py-16 container mx-auto flex items-center justify-center">
        <div className="flex items-start gap-8 md:grid-cols-[minmax(220px,340px)_minmax(0,1fr)] md:gap-12">
          {pictureUrl ? (
            <Image
              src={pictureUrl}
              alt="Rafael Mattar"
              width={680}
              height={680}
              className="aspect-square w-full object-cover max-w-[460px]"
              priority
            />
          ) : null}

          <div className="text-[18px] leading-[1.55] text-white md:text-[20px] max-w-[70ch] font-extralight">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}

            <div className="mt-10 space-y-1">
              <p>
                <a
                  href="mailto:mattarrafael@gmail.com"
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  mattarrafael@gmail.com
                </a>
              </p>
              <p className="font-light">São Paulo / SP Brasil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
