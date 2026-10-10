import Image from 'next/image';

export default function PageMasthead({
  title,
  tagline,
}: {
  title: string;
  tagline?: string;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 sm:pt-10 pb-6 border-b-2 border-amber-600 flex flex-col items-center text-center">
      <Image
        src="/logo.png"
        alt="The Grind Chronicle logo"
        width={48}
        height={48}
        className="w-10 h-10 object-contain mb-2"
      />
      <h1
        className="uppercase font-bold tracking-tight text-gray-900"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h1>
      {tagline && (
        <p
          className="italic text-gray-600 mt-1 max-w-md text-sm sm:text-base"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {tagline}
        </p>
      )}
    </div>
  );
}