import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/favicon.webp"></link>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
            rel="stylesheet"
          />
          {/* @ts-ignore */}
          {this.props.styleTags}
        </Head>
        <body className="text-neutral-100 ">
          {/* <body className="text-neutral-900 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-900"> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
