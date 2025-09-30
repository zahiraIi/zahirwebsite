import HoverImage from '../HoverImage'

export default function HoverImageExample() {
  return (
    <div className="p-8 bg-black min-h-screen flex items-center justify-center">
      <p className="text-white text-2xl">
        Hover over{' '}
        <HoverImage imageSrc="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop">
          <span className="border-b border-white/40 hover:border-white transition-colors">
            this text
          </span>
        </HoverImage>
        {' '}to see an image
      </p>
    </div>
  )
}
