export type ToastVariantType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral";

export interface ToastType {
  id: string;
  type: ToastVariantType;
  message: string;
}
