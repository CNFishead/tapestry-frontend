import type { ReactNode } from "react";
import type { ButtonProps } from "../button/Button.component";

export type ModalProps = {
  /** Whether the modal is visible */
  open?: boolean;
  /** Title of the modal */
  title?: ReactNode;
  /** Callback when the modal is closed (via cancel button, close icon, or mask click) */
  onCancel?: () => void;
  /** Callback when the OK button is clicked */
  onOk?: () => void;
  /** Footer content, pass null to hide footer */
  footer?: ReactNode;
  /** Text for the OK button */
  okText?: string;
  /** Text for the Cancel button */
  cancelText?: string;
  /** Width of the modal */
  width?: string | number;
  /** Whether to center the modal vertically */
  centered?: boolean;
  /** Whether to show the close button in the header */
  closable?: boolean;
  /** Whether clicking the mask (backdrop) closes the modal */
  maskClosable?: boolean;
  /** Loading state for the OK button */
  confirmLoading?: boolean;
  /** Props for the OK button */
  okButtonProps?: Partial<ButtonProps>;
  /** Props for the Cancel button */
  cancelButtonProps?: Partial<ButtonProps>;
  /** Custom class name for the modal */
  className?: string;
  /** Inline styles for the modal body */
  bodyStyle?: React.CSSProperties;
  /** Whether to destroy child components on close */
  destroyOnClose?: boolean;
  /** The content of the modal */
  children?: ReactNode;
  /** The z-index of the modal */
  zIndex?: number;
  /** Custom class name for the modal wrapper */
  wrapClassName?: string;
};
