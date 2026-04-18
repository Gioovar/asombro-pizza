"use client";

import { useAuthGuardStore } from "../store/useAuthGuardStore";
import { AuthModal } from "./auth/AuthModal";

export function GlobalAuthModal() {
  const { isOpen, closeModal, executePending, intentMessage } = useAuthGuardStore();
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={closeModal}
      onSuccess={executePending}
      intentMessage={intentMessage}
    />
  );
}
