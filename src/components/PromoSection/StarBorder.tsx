import './StarBorder.css'

import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'

type Props<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
  color?: string
  speed?: string
  style?: CSSProperties
  thickness?: number
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>

export const StarBorder = <T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  color = '#1e3a8a',
  speed = '6s',
  style,
  thickness = 1,
  ...rest
}: Props<T>) => {
  const Component = as || 'div'

  return (
    <Component
      className={`star-border-container ${className}`.trim()}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  )
}

export default StarBorder
