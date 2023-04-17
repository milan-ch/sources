import * as React from "react";

export const ScrollablePane = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      {children}
    </div>
  );
};