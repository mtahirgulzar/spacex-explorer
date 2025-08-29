import { forwardRef, createElement, ReactNode, JSX } from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2' | 'lead';
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'destructive';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ 
    variant = 'body1', 
    component, 
    className, 
    children, 
    color = 'primary',
    align = 'left',
    weight,
    ...props 
  }, ref) => {
    const variants = {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      subtitle1: 'text-lg font-medium leading-relaxed',
      subtitle2: 'text-base font-medium leading-relaxed',
      body1: 'leading-7 [&:not(:first-child)]:mt-6',
      body2: 'text-sm leading-6',
      caption: 'text-xs text-muted-foreground',
      overline: 'text-xs font-medium uppercase tracking-wider',
      lead: 'text-xl text-muted-foreground',
    };

    const colors = {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      muted: 'text-muted-foreground',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      destructive: 'text-destructive',
    };

    const alignments = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    const weights = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const defaultComponents = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h6',
      subtitle2: 'h6',
      body1: 'p',
      body2: 'p',
      caption: 'span',
      overline: 'span',
      lead: 'p',
    };

    const Component = (component || defaultComponents[variant]) as keyof JSX.IntrinsicElements;

    return createElement(
      Component,
      {
        ref,
        className: cn(
          variants[variant],
          colors[color],
          alignments[align],
          weight && weights[weight],
          className
        ),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
