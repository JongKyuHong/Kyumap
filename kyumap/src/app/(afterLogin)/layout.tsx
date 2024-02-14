import React, { ReactNode } from "react";
type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
