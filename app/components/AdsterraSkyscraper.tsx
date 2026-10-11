'use client';

export default function AdsterraSkyscraper({
  adKey = '41466093384ed116b1b1139c979dbfde',
}: {
  adKey?: string;
}) {
  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <base target="_blank">
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : 600,
      'width' : 160,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
</body>
</html>`;

  return (
    <div className="w-[160px] h-[600px] flex items-center justify-center overflow-hidden bg-gray-50/50 rounded shadow-2xs">
      <iframe
        title="Adsterra 160x600 Skyscraper"
        srcDoc={iframeContent}
        width={160}
        height={600}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}