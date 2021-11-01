import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = ctx.renderPage((App: any) => (props: any) =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...initialProps, ...page, styleTags };

  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="/fonts/stylesheet.css" />
          {/* @ts-ignore */}
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument