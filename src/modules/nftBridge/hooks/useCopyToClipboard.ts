import { useCallback } from "react";
import { toastSuccess } from "src/common/services/toaster";

function pushToClipboard(content: any) {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return;
  }
  return navigator.clipboard.writeText(content);
}

export default function useCopyToClipboard(content: string) {
  return useCallback(() => {
    pushToClipboard(content)?.then(() => toastSuccess('Copied'));
  }, [content]);
}