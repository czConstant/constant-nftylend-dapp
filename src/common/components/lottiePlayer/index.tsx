import { Player } from '@lottiefiles/react-lottie-player';

interface LottiePlayerProps {
  autoplay?: boolean;
  loop?: boolean;
  src: object;
  className?: string;
  style: { [key: string]: string | number; } | undefined;
}

const LottiePlayer = (props: LottiePlayerProps) => {
  const { autoplay, loop, src, className, style } = props;
  return <Player className={className} autoplay={autoplay} loop={loop} src={src} style={style} />;
};

export default LottiePlayer;
