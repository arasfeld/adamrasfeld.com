'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface DeviceFrameProps {
  children?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  deviceType?: DeviceType;
  size?: Size;
  className?: string;
  hideShadow?: boolean;
  hideReflection?: boolean;
  priority?: boolean;
}

const deviceConfigs = {
  desktop: {
    aspectRatio: 'aspect-[16/9]', // 1920x1080
    borderRadius: 'rounded-xl',
    screenRadius: 'rounded-lg',
  },
  tablet: {
    aspectRatio: 'aspect-[3/4]', // 768x1024
    borderRadius: 'rounded-2xl',
    screenRadius: 'rounded-xl',
  },
  mobile: {
    aspectRatio: 'aspect-[9/16]', // Standard mobile ratio
    borderRadius: 'rounded-3xl',
    screenRadius: 'rounded-2xl',
  },
};

const sizeConfigs = {
  sm: {
    desktop: 'max-w-56 max-h-40',
    tablet: 'max-w-44 max-h-40',
    mobile: 'max-w-28 max-h-40',
  },
  md: {
    desktop: 'max-w-80 max-h-56',
    tablet: 'max-w-64 max-h-56',
    mobile: 'max-w-36 max-h-56',
  },
  lg: {
    desktop: 'max-w-96 max-h-72',
    tablet: 'max-w-80 max-h-72',
    mobile: 'max-w-44 max-h-72',
  },
  xl: {
    desktop: 'max-w-[28rem] max-h-96',
    tablet: 'max-w-[24rem] max-h-96',
    mobile: 'max-w-52 max-h-96',
  },
};

export function DeviceFrame({
  children,
  imageSrc,
  imageAlt,
  deviceType = 'desktop',
  size = 'md',
  className,
  hideShadow = false,
  hideReflection = false,
  priority = false,
}: DeviceFrameProps) {
  const config = deviceConfigs[deviceType];
  const sizeClass = sizeConfigs[size][deviceType];
  const [imageError, setImageError] = useState(false);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'desktop':
        return (
          <Monitor className="h-12 w-12 text-gray-400 dark:text-gray-600" />
        );
      case 'tablet':
        return (
          <Tablet className="h-10 w-10 text-gray-400 dark:text-gray-600" />
        );
      case 'mobile':
        return (
          <Smartphone className="h-8 w-8 text-gray-400 dark:text-gray-600" />
        );
    }
  };

  return (
    <div
      className={cn(
        'relative mx-auto',
        sizeClass,
        config.aspectRatio,
        className
      )}
    >
      {/* Device Frame */}
      <div
        className={cn(
          'relative h-full w-full p-2',
          config.borderRadius,
          'bg-white/20 dark:bg-black/20',
          'border border-white/30 dark:border-white/10',
          'backdrop-blur-sm',
          !hideShadow && 'shadow-2xl',
          'hover:shadow-3xl transform transition-all duration-300 hover:scale-[1.02]'
        )}
      >
        {/* Screen */}
        <div
          className={cn(
            'relative h-full w-full',
            config.screenRadius,
            'overflow-hidden',
            'bg-black',
            'border border-white/20 dark:border-white/10',
            'shadow-inner'
          )}
        >
          {/* Content */}
          {imageSrc && !imageError ? (
            <Image
              src={imageSrc}
              alt={imageAlt || 'Device screenshot'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : children ? (
            children
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100/20 dark:bg-gray-800/20">
              {getDeviceIcon()}
            </div>
          )}

          {/* Screen Reflection */}
          {!hideReflection && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
          )}
        </div>

        {/* Device Details */}
        {deviceType === 'mobile' && (
          <>
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-white/40 dark:bg-white/20" />
          </>
        )}
      </div>

      {/* Ambient Shadow */}
      {!hideShadow && (
        <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 transform rounded-full bg-black/10 blur-xl dark:bg-black/20" />
      )}
    </div>
  );
}
