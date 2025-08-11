type WebViewProps = {
  url: string;
};

export default function WebView({ url }: WebViewProps) {
  return (
    <iframe
      src={url}
      className="h-full w-full border-0"
      title="Don’s PlayWorld"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
    />
  );
}
