import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/favicon.webp"></link>
          {/* @ts-ignore */}
          {this.props.styleTags}
        </Head>
        <body className="text-neutral-100 bg-[rgba(0,0,0,0.97)] ">
          {/* <body className="text-neutral-900 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-900"> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
