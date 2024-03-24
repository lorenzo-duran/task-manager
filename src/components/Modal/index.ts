import { useCallback, useState } from "react";

export const useModalControl = <T extends object>() => {
  const [isOpen, setIsModalOpen] = useState(false);
  const [args, setModalArgs] = useState<T | undefined>();

  const open = useCallback((args: T) => {
    setModalArgs({ ...args });
    setIsModalOpen(true);
  }, []);

  const close = useCallback(() => {
    setModalArgs(undefined);
    setIsModalOpen(false);
  }, []);

  return {
    args,
    isOpen,
    open: open,
    close,
  };
};
