import * as React from 'react';

export const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
export const CardContent = Card;
export const CardHeader = Card;
export const CardTitle = Card; 