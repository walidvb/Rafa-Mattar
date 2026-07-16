// ponytail: postinstall patch for react-player v2.16 Vimeo light previews
// (noembed can 403). Revisit if upgrading past 2.16 or switching players.
const fs = require('fs')
const path = require('path')

const NEEDLE =
  'this.setState({ image: null });\n    return window.fetch(oEmbedUrl.replace("{url}", url)).then((response) => response.json()).then((data) => {'

const REPLACEMENT = `this.setState({ image: null });
    let requestUrl = null;
    if (/vimeo\\.com/.test(url)) {
      // Vimeo preview fix for react-player v2.16:
      // old endpoint can return 403 for some videos.
      requestUrl = \`https://vimeo.com/api/oembed.json?url=\${encodeURIComponent(url)}\`;
    } else if (oEmbedUrl) {
      requestUrl = oEmbedUrl.replace("{url}", url);
    } else {
      return;
    }
    return window.fetch(requestUrl).then((response) => response.json()).then((data) => {`

const MARKER = 'vimeo.com/api/oembed.json'

const files = [
  'node_modules/react-player/lib/Preview.js',
  'node_modules/react-player/lazy/Preview.js',
]

for (const rel of files) {
  const file = path.join(__dirname, '..', rel)
  if (!fs.existsSync(file)) continue

  const src = fs.readFileSync(file, 'utf8')
  if (src.includes(MARKER)) {
    console.log(`[patch-react-player] already patched ${rel}`)
    continue
  }
  if (!src.includes(NEEDLE)) {
    console.warn(`[patch-react-player] skip ${rel}: expected fetchImage snippet not found`)
    continue
  }

  fs.writeFileSync(file, src.replace(NEEDLE, REPLACEMENT))
  console.log(`[patch-react-player] patched ${rel}`)
}
