import Head from 'next/head';

const host = process.env.NEXT_PUBLIC_VERCEL_URL

export default function OGTags({ title = 'Futur Proche', description = "Une société de!", image = '/images/og.jpg', path = '/' }: { title?: string, description?: string, image?: string, path?: string }) {
  return <Head>
    <title>{title}</title>
    <meta property='og:url' content={`https://${host}/${path}`} />
    <meta property='og:type' content={"article"} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta property='og:image' content={`https://${url}${image}`} />
  </Head>
}