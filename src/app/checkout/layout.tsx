import { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
