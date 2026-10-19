import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const styles: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn bg-red-600 text-white hover:bg-red-700 px-4 py-2.5',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className = '', loading, disabled, children, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
);
Button.displayName = 'Button';