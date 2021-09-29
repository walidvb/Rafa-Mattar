

export default function FullScreenVideo({ id }: { id: string }){
  return <div className="vimeo-wrapper">
    <iframe src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&byline=0&title=0`}
      frameBorder="0" allowFullScreen></iframe>
  </div>
}