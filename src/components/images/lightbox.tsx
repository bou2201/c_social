import { useRef } from 'react';
import LightboxComponent, {
  FullscreenRef,
  LightboxExternalProps,
  ThumbnailsRef,
  ZoomRef,
} from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

/**
 * The purpose of this intermediate component is to load the Lightbox and
 * its CSS dynamically only when the lightbox becomes interactive
 */
export const Lightbox = (props: Readonly<Omit<LightboxExternalProps, 'plugins'>>) => {
  const fullscreenRef = useRef<FullscreenRef>(null);
  const zoomRef = useRef<ZoomRef>(null);
  const thumbnailsRef = useRef<ThumbnailsRef>(null);

  return (
    <LightboxComponent
      plugins={[Fullscreen, Counter, Zoom, Thumbnails]}
      zoom={{ ref: zoomRef, maxZoomPixelRatio: 3 }}
      fullscreen={{ ref: fullscreenRef }}
      thumbnails={{ ref: thumbnailsRef, border: 0 }}
      counter={{ container: { style: { top: 0, left: 0 } } }}
      carousel={{
        spacing: 0,
        padding: 0,
        imageFit: 'cover',
        finite: true,
      }}
      {...props}
    />
  );
};
