import styled from 'styled-components'
import { useDesktop } from '../shared/hooks/useDesktop';

const BackgroundDiv = styled.div`
  ${
    // @ts-ignore
    ({ img }) => `
     background-image: url(${img});
  `}
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-color: var(--brand-color);
`

export default function FullScreenVideo({ src, imgSrc }: { src: string, imgSrc: string }){
  const isDesktop = useDesktop()
  const id = getIdFromVimeoUrl(src)

  return <div className="w-screen h-screen flex items-center justify-center bg-black">
  <div className="vimeo-wrapper">
      { !isDesktop ? 
        // @ts-ignore
        <BackgroundDiv img={imgSrc}/> : 
        <iframe src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&byline=0&title=0`}
          frameBorder="0" allowFullScreen></iframe>
      }
    </div>
  </div>
}

const getIdFromVimeoUrl = (url: string) => {
  const regex = /https:\/\/vimeo.com\/(\d+)/
  const match = url.match(regex)
  if (!match) {
    return null
  }
  return match[1]
}
