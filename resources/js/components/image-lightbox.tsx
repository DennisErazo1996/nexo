import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Foto {
    id: number;
    url_con_marca_agua: string;
}

interface ImageLightboxProps {
    images: Foto[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (index: number) => void;
    title?: string;
}

export function ImageLightbox({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNavigate,
    title = 'Galería de fotos',
}: ImageLightboxProps) {
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images.length]);

    useEffect(() => {
        if (isOpen && thumbnailsRef.current) {
            const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
            if (activeThumbnail) {
                activeThumbnail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [isOpen, currentIndex]);

    if (!isOpen || images.length === 0) return null;

    const handlePrevious = () => {
        onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const handleNext = () => {
        onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const handleBackdropClick = () => {
        onClose();
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md"
            onClick={handleBackdropClick}
        >
            {/* Header bar */}
            <div
                className="z-10 flex w-full items-center justify-between p-4"
                onClick={stopPropagation}
            >
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                        {title}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="group flex items-center gap-2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    title="Cerrar (Esc)"
                >
                    <span className="hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white/70 group-hover:block uppercase">
                        Esc
                    </span>
                    <X className="size-5" />
                </button>
            </div>

            {/* Center viewport */}
            <div className="relative flex w-full flex-1 items-center justify-center px-4">
                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={(e) => {
                            stopPropagation(e);
                            handlePrevious();
                        }}
                        className="absolute left-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:left-8"
                        aria-label="Anterior foto"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                )}

                <img
                    key={images[currentIndex].id} // Force re-render for transition if needed, or use smooth transitions
                    src={images[currentIndex].url_con_marca_agua}
                    alt={`Foto ${currentIndex + 1}`}
                    onClick={stopPropagation}
                    className="max-h-[80vh] max-w-[90vw] select-none rounded-lg object-contain shadow-2xl transition-opacity duration-300"
                />

                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={(e) => {
                            stopPropagation(e);
                            handleNext();
                        }}
                        className="absolute right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:right-8"
                        aria-label="Siguiente foto"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                )}
            </div>

            {/* Bottom thumbnails bar */}
            <div
                className="z-10 w-full bg-black/50 p-4 backdrop-blur-md"
                onClick={stopPropagation}
            >
                <div
                    ref={thumbnailsRef}
                    className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {images.map((foto, index) => (
                        <button
                            key={foto.id}
                            type="button"
                            onClick={() => onNavigate(index)}
                            className={cn(
                                'relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-md transition-all',
                                currentIndex === index
                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
                                    : 'opacity-50 hover:opacity-100',
                            )}
                        >
                            <img
                                src={foto.url_con_marca_agua}
                                alt={`Thumbnail ${index + 1}`}
                                className="size-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
