import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 视觉变体 */
  variant?: ButtonVariant
  /** 尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'padding:4px 10px;font-size:12px;',
  md: 'padding:8px 16px;font-size:14px;',
  lg: 'padding:12px 22px;font-size:16px;',
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'background:#2563eb;color:#fff;border:1px solid #2563eb;',
  secondary: 'background:#f3f4f6;color:#111827;border:1px solid #d1d5db;',
  ghost: 'background:transparent;color:#2563eb;border:1px solid transparent;',
}

/**
 * Button —— @omp-web/components 的入口示例组件。
 * 占位实现：inline style 直出，后续接入设计系统时替换为 CSS-in-JS / Tailwind / CSS Modules。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', disabled = false, style, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      style={{
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        font: 'inherit',
        // 内联拼接：保持示例零依赖；接入设计系统后移除
        cssText: `${sizeStyles[size]}${variantStyles[variant]}`,
        ...(style as object),
      }}
      {...rest}
    >
      {children}
    </button>
  )
})
