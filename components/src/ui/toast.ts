"use client";

import { isValidElement } from "react";
import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
  }
};

const reactNodeToText = (value: React.ReactNode): string => {
  if (value === null || value === undefined || typeof value === "boolean") {
    return "";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(reactNodeToText).join(" ").trim();
  }
  if (isValidElement(value)) {
    const element = value as React.ReactElement<{ children?: React.ReactNode }>;
    return reactNodeToText(element.props?.children);
  }
  return "";
};

const resolveToastDescription = (description: ExternalToast["description"]): React.ReactNode => {
  if (typeof description === "function") {
    return description();
  }
  return description;
};

const getToastCopyText = (message: string | React.ReactNode, data?: ExternalToast): string => {
  const descriptionText = reactNodeToText(resolveToastDescription(data?.description));
  if (descriptionText.length > 0) {
    return descriptionText;
  }
  return reactNodeToText(message);
};

// Wrapper that adds a default OK action button to success/info toasts and a
// Copy action button to error/warning toasts. Built with `Object.assign` so the
// result retains the call signature of the underlying sonner toast function
// (object spread would erase it).
export const toast = Object.assign(
  (message: string | React.ReactNode, data?: ExternalToast) => sonnerToast(message, data),
  sonnerToast,
  {
    success: (message: string | React.ReactNode, data?: ExternalToast) =>
      sonnerToast.success(message, {
        ...data,
        action: data?.action || {
          label: "OK",
          onClick: () => {},
        },
      }),
    info: (message: string | React.ReactNode, data?: ExternalToast) =>
      sonnerToast.info(message, {
        ...data,
        action: data?.action || {
          label: "OK",
          onClick: () => {},
        },
      }),
    error: (message: string | React.ReactNode, data?: ExternalToast) =>
      sonnerToast.error(message, {
        ...data,
        action: data?.action || {
          label: "Copy",
          onClick: () => copyToClipboard(getToastCopyText(message, data)),
        },
      }),
    warning: (message: string | React.ReactNode, data?: ExternalToast) =>
      sonnerToast.warning(message, {
        ...data,
        action: data?.action || {
          label: "Copy",
          onClick: () => copyToClipboard(getToastCopyText(message, data)),
        },
      }),
  },
);
