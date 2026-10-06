import Image from 'next/image';

export default function PageMasthead({
  title,
  tagline,
}: {
  title: string;
  tagline?: string;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-14 pb-8 border-b-2 border-amber-600 flex flex-col items-center text-center">
      <Image
        src="/logo.png"
        alt="The Grind Chronicle"
        width={56}
        height={56}
        className="w-12 h-12 object-contain mb-3"
      />
      <h1
        className="uppercase font-bold"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          color: '#1A1A1A',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h1>
      {tagline && (
        <p
          className="italic text-[#666] mt-2 max-w-md"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {tagline}
        </p>
      )}
    </div>
  );
}