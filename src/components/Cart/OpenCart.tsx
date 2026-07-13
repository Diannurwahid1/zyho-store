import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="nav"
      size="clear"
      className={`navLink relative inline-flex items-center gap-2 hover:cursor-pointer ${className || ''}`.trim()}
      {...rest}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="h-4 w-4" />
        {quantity ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background"
          />
        ) : null}
      </span>
      <span>Cart</span>
    </Button>
  )
}
