import { useCallback, useState } from "react";

export const useModalControl = <T extends object>() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalArgs, setModalArgs] = useState<T | undefined>();

  const openModal = useCallback((args: T) => {
    setModalArgs({ ...args });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalArgs(undefined);
    setIsModalOpen(false);
  }, []);

  return {
    modalArgs,
    isModalOpen,
    openModal,
    closeModal,
  };
};
