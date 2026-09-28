/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useSound } from '../../hooks/useSound';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  playSoundOnClick?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      className = '',
      onClick,
      playSoundOnClick = true,
      ...props
    },
    ref
  ) => {
    const { playSound } = useSound();
    const prefersReduced = usePrefersReducedMotion();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (playSoundOnClick) {
        playSound('click');
      }
      onClick?.(e);
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-xs font-semibold rounded-full min-h-[38px]',
      md: 'px-6 py-3 text-sm font-semibold rounded-full min-h-[46px]',
      lg: 'px-7 py-3.5 text-base font-semibold rounded-full min-h-[52px]',
    }[size];

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-[#F4A6B5] via-[#F7C3A3] to-[#CDBDEB] text-[#252126] deskora-shadow-md hover:deskora-shadow-elevated active:opacity-95',
      secondary:
        'bg-white text-[#252126] border border-[#F0E8EA] hover:border-[#EFA7B5]/40 deskora-shadow-sm hover:deskora-shadow-md',
      ghost:
        'bg-transparent text-[#6F6870] hover:text-[#252126] hover:bg-[#FFF4EC]/60',
      outline:
        'bg-transparent text-[#252126] border border-[#F0E8EA] hover:border-[#EFA7B5]',
    }[variant];

    return (
      <motion.button
        ref={ref}
        whileHover={prefersReduced ? {} : { y: -1 }}
        whileTap={prefersReduced ? {} : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        onClick={handleClick}
        className={`interactive-element group relative inline-flex items-center justify-center gap-2 font-medium tracking-tight select-none outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] focus-visible:ring-offset-2 transition-shadow duration-200 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
        <span className="whitespace-nowrap">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
