'use client';

import React from 'react';
import { useMediaMeta } from '../../content/content-provider';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string;
  /** 'thumb' 只用小圖（卡片、縮圖）；'full' 依螢幕寬度自動挑大小 */
  variant?: 'thumb' | 'full';
  /** 首屏圖片設 true，不延遲載入 */
  priority?: boolean;
};

/**
 * 前台統一的圖片元件：
 * - 媒體庫圖片自動帶寬高（避免版面跳動）、模糊預覽、srcset 響應式載入
 * - 外部網址或舊圖照常顯示
 */
export function MediaImage({ src, variant = 'full', priority, style, alt = '', sizes, ...rest }: Props) {
  const media = useMediaMeta();
  const [loaded, setLoaded] = React.useState(false);
  if (!src) return null;
  const meta = media[src];

  if (!meta) {
    return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" style={style} {...rest} />;
  }

  const hasThumb = meta.thumbUrl && meta.thumbUrl !== src;
  const srcSet = hasThumb && variant === 'full' ? `${meta.thumbUrl} 800w, ${src} ${meta.width}w` : undefined;

  return (
    <img
      src={variant === 'thumb' && hasThumb ? meta.thumbUrl : src}
      srcSet={srcSet}
      sizes={srcSet ? sizes || '(max-width: 1024px) 100vw, 70vw' : undefined}
      width={meta.width || undefined}
      height={meta.height || undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={{
        ...style,
        backgroundImage: !loaded && meta.blurDataUrl ? `url(${meta.blurDataUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      {...rest}
    />
  );
}
