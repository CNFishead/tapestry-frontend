"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Button from "../button/Button.component";
import type { ModalProps } from "./modal.types";
import styles from "./Modal.module.scss";

export default function Modal({
  open = false,
  title,
  onCancel,
  onOk,
  footer,
  okText = "OK",
  cancelText = "Cancel",
  width = 520,
  centered = false,
  closable = true,
  maskClosable = true,
  confirmLoading = false,
  okButtonProps,
  cancelButtonProps,
  className,
  bodyStyle,
  destroyOnClose = false,
  children,
  zIndex = 1000,
  wrapClassName,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCancel) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) {
    return null;
  }

  if (!open && destroyOnClose) {
    return null;
  }

  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable && e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  const modalContent = (
    <div
      className={clsx(styles.modalWrapper, wrapClassName, !open && styles.hidden)}
      style={{ zIndex }}
      onClick={handleMaskClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={clsx(styles.modalMask, open && styles.visible)} />
      <div className={clsx(styles.modalContainer, centered && styles.centered)}>
        <div
          className={clsx(styles.modal, open && styles.visible, className)}
          style={{ width: typeof width === "number" ? `${width}px` : width }}
        >
          {/* Header */}
          {(title || closable) && (
            <div className={styles.modalHeader}>
              {title && <div className={styles.modalTitle}>{title}</div>}
              {closable && (
                <button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close">
                  ×
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={styles.modalBody} style={bodyStyle}>
            {children}
          </div>

          {/* Footer */}
          {footer !== null && (
            <div className={styles.modalFooter}>
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <Button variant="outline" tone="neutral" onClick={onCancel} {...cancelButtonProps}>
                    {cancelText}
                  </Button>
                  <Button tone="gold" onClick={onOk} isLoading={confirmLoading} {...okButtonProps}>
                    {okText}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render in portal to body
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
}
