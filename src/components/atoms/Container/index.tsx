import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef } from 'react';

type ContainerProps = ComponentProps<'div'> & {
  as?: React.ElementType;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = 'Container';
