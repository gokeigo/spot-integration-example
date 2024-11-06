interface DivIframeProps {
  url: string;
}

export const DivIframe = ({ url }: DivIframeProps) => {
  return (
    <div className="flex items-center justify-center">
      <iframe src={url} className="h-[820px] w-80 rounded-lg" />
    </div>
  );
};

export default DivIframe;
