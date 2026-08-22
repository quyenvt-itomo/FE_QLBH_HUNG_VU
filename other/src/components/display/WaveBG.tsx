const WaveBG: React.FC = () => {
  return (
    <div className="absolute -top-8 -left-8 w-[calc(100%+64px)] h-[calc(100%+64px)] z-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#416c51" />
            <stop offset="100%" stopColor="#114123" />
          </linearGradient>
        </defs>

        <path
          fill="url(#waveGradient)"
          fillOpacity="1"
          d="M0,320L30,288C60,256,120,192,180,181.3C240,171,300,213,360,240C420,267,480,277,540,245.3C600,213,660,139,720,138.7C780,139,840,213,900,202.7C960,192,1020,96,1080,85.3C1140,75,1200,149,1260,186.7C1320,224,1380,224,1410,224L1440,224L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveBG;
