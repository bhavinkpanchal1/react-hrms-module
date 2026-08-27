import { cn } from '@/shared/lib/cn';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
interface ModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  title:    string;
  children: ReactNode;
  footer?:  ReactNode;
  size?:    ModalSize;
  closeDisabled?: boolean;
}
const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeDisabled = false,
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? dialog)?.focus();

    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closeDisabled) onClose();
      if (e.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (controls.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', h);
    return () => {
      document.removeEventListener('keydown', h);
      previouslyFocused?.focus();
    };
  }, [closeDisabled, isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeDisabled ? undefined : onClose} />
      <div ref={dialogRef} tabIndex={-1} className={cn('relative z-10 w-full rounded-xl bg-white shadow-xl outline-none dark:bg-navy-750', sizeClasses[size])}
        role="dialog" aria-modal="true" aria-labelledby={titleId}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-6 py-4 dark:border-navy-600">
          <h3 id={titleId} className="text-base font-semibold text-slate-800 dark:text-navy-100">
            {title}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close dialog" disabled={closeDisabled}
            className="btn size-8 rounded-full p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-navy-600">
            <X className="size-4" />
          </button>
        </div>
        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-150 px-6 py-4 dark:border-navy-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
