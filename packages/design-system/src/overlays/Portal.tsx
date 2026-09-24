import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function Portal({ children }: { readonly children: ReactNode }) {
  return createPortal(children, document.body);
}