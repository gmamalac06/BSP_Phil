import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselSlide {
    id: string;
    title: string;
    description?: string | null;
    image_url: string;
    link_url?: string | null;
}

interface EventCarouselProps {
    slides: CarouselSlide[];
    autoPlayInterval?: number;
}

export function EventCarousel({ slides, autoPlayInterval = 5000 }: EventCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying && !isHovering && slides.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % slides.length);
            }, autoPlayInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, isHovering, slides.length, autoPlayInterval]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    if (slides.length === 0) {
        return null;
    }

    const currentSlide = slides[currentIndex];

    return (
        <div
            className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Slides Container */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="min-w-full h-full relative flex-shrink-0"
                    >
                        {/* Background Image */}
                        <img
                            src={failedImages.has(slide.id) ? "/bsp-logo.svg" : slide.image_url}
                            alt={slide.title}
                            className={cn(
                                "w-full h-full object-cover",
                                failedImages.has(slide.id) && "object-contain p-20 bg-muted"
                            )}
                            onError={() => {
                                setFailedImages(prev => new Set(prev).add(slide.id));
                            }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 line-clamp-2">
                                {slide.title}
                            </h2>
                            {slide.description && (
                                <p className="text-sm md:text-lg text-white/80 line-clamp-2 max-w-2xl">
                                    {slide.description}
                                </p>
                            )}
                            {slide.link_url && (
                                <a
                                    href={slide.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-6 py-2 bg-primary/90 hover:bg-primary rounded-full text-sm font-medium transition-colors"
                                >
                                    Learn More
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                        onClick={goToPrevious}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                        onClick={goToNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Dots Indicator & Play/Pause */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    {/* Dots */}
                    <div className="flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full transition-all",
                                    index === currentIndex
                                        ? "bg-white w-8"
                                        : "bg-white/50 hover:bg-white/70"
                                )}
                            />
                        ))}
                    </div>

                    {/* Play/Pause Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
