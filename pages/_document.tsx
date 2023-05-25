import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* @ts-ignore */}
          {this.props.styleTags}
        </Head>
        <body className="text-neutral-900 bg-neutral-100 ">
        {/* <body className="text-neutral-900 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-900"> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument