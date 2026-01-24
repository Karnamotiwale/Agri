import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utilities using Sonner
 */
export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            duration: 3000,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            duration: 4000,
        });
    },

    loading: (message: string) => {
        return sonnerToast.loading(message);
    },

    dismiss: (toastId: string | number) => {
        sonnerToast.dismiss(toastId);
    },

    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((err: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading,
            success,
            error,
        });
    },
};
