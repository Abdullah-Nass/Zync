import { useSlide } from '../hooks/use-slide'

export default function LoginSide() {
  const slideBoxRef = useSlide({
    from: '-translate-x-20 opacity-0',
    to: 'translate-x-0 opacity-100',
  })

  return (
    <div className="flex-col gap-5 bg-secondary-background p-8 pt-15 hidden lg:flex ring ring-1 ring-gray-300">
      <h1 className="text-primary font-bold text-6xl mt-10 select-none">
        Zync
      </h1>

      <div
        ref={slideBoxRef}
        className="space-y-4 mt-10 transform -translate-x-20 opacity-0 transition-all duration-700 ease-out"
      >
        <h2 className="font-semibold text-5xl">Connect. Share. Follow.</h2>
        <h3 className="text-4xl leading-[1.4]">
          Share your thoughts,
          <br /> follow people who inspire you,
          <br />
          and build your own feed.
        </h3>
      </div>
    </div>
  )
}
