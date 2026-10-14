import "./GlowingEffect.css";

function GlowingEffect() {
    return(
        <svg
            className="hero-waves"
            viewBox="0 0 1920 500"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2f7bff" stopOpacity="0" />
                    <stop offset="35%" stopColor="#2f7bff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#5aa2ff" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Soft blurred glow under each line */}
            <g className="wave-blur" fill="none" stroke="url(#waveGradient)" strokeWidth="18">
                {/*<path d="M0 330 C 350 250, 700 420, 1100 470 S 1700 420, 1920 380" />
                <path d="M0 410 C 400 340, 800 470, 1200 500 S 1750 470, 1920 440" opacity="0.6" />*/}
                <path d="M0 250 C 300 40, 650 470, 1000 300 S 1600 60, 1920 260" />
                <path d="M0 340 C 350 140, 750 500, 1150 380 S 1700 160, 1920 340" opacity="0.6" />
            </g>

            {/* Crisp thin highlight on top */}
            <g fill="none" stroke="url(#waveGradient)" strokeWidth="3">
                {/*<path d="M0 330 C 350 250, 700 420, 1100 470 S 1700 420, 1920 380" />
                <path d="M0 410 C 400 340, 800 470, 1200 500 S 1750 470, 1920 440" opacity="0.5" />
                <path d="M900 470 C 1300 440, 1650 420, 1920 360" opacity="0.7" />*/}
                <path d="M0 250 C 300 40, 650 470, 1000 300 S 1600 60, 1920 260" />
                <path d="M0 340 C 350 140, 750 500, 1150 380 S 1700 160, 1920 340" opacity="0.5" />
                <path d="M900 430 C 1250 260, 1600 490, 1920 290" opacity="0.7" />

            </g>
        </svg>
    )
}

export default GlowingEffect;