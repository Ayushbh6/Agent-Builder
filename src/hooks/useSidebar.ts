import { useSidebarStore } from '@/stores/sidebar';

export function useSidebar() {
  const { isOpen, toggle, setOpen } = useSidebarStore();

  return {
    isOpen,
    toggle,
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  };
}