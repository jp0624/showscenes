// src/components/layout/Hero/HeroSlide.tsx


interface HeroSlideProps {
	image: string;
	color: string; // dominant color
	dark: boolean; // O1-A overlay-intensity flag
	index: number;
	isActive: boolean;
	children?: React.ReactNode;
}

export default function HeroSlide({
	image,
	color: _color,
	dark: _dark,
	isActive,
	children,
}: HeroSlideProps) {
	return (
		<div
			className={`
                absolute inset-0 transition-opacity duration-[900ms]
                ${isActive ? "opacity-100" : "opacity-0"}
            `}
			aria-hidden={!isActive} inert={!isActive} style={{
				zIndex: isActive ? 2 : 1,
			}}
		>
			{/* BACKDROP */}
			<div className="absolute inset-0 overflow-hidden">
				<img
					src={image}
					alt=""
					className="w-full h-full object-cover scale-[1.15] md:scale-[1.08] lg:scale-[1.04] transition-transform duration-[1800ms]"
					loading="eager"
				/>

				{/* DARK CINEMATIC OVERLAY (O1-A: Heavy Black) */}
				<div
					className="absolute inset-0"
					style={{
						background: "linear-gradient(90deg,rgba(8,8,15,.92),rgba(8,8,15,.45) 55%,rgba(8,8,15,.1)),linear-gradient(0deg,rgba(8,8,15,.5),transparent 50%)",
					}}
				/>
			</div>

			{/* CONTENT */}
			<div className="relative z-20 pt-24 pb-20 px-6 max-w-6xl mx-auto">
				{children}
			</div>
		</div>
	);
}

