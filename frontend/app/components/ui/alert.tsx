import * as React from 'react';

export const Alert = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
export const AlertDescription = Alert; 