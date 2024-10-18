import { SetStateAction } from 'react';
import { Gallery, Image } from 'react-grid-gallery';

type GalleryImageProps<T extends Image> = {
  images: T[];
  setImageIndex?: (value: SetStateAction<number>) => void;
};

export const GalleryImage = <T extends Image>({ images, setImageIndex }: GalleryImageProps<T>) => {
  const displayLimit = 5;
  const imagesToShow = images.slice(0, displayLimit - 1);
  const remainingCount = images.length - displayLimit;

  return (
    <Gallery
      images={[
        ...imagesToShow,
        {
          ...images[displayLimit - 1],
          customOverlay: (
            <div className="absolute inset-0 w-full h-full bg-csol_black/60 text-csol_white flex justify-center items-center text-3xl z-10 rounded-lg font-semibold">
              + {remainingCount}
            </div>
          ),
        },
      ]}
      onClick={(index: number) => setImageIndex?.(index)}
      enableImageSelection={false}
      maxRows={2}
      rowHeight={300}
    />
  );
};
