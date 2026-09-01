import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>;
export type UseClipboardReturn = [CopiedValue, CopyFn];

export function useClipboard(): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = async (text) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedText(text);
            return true;
        }

        setCopiedText(null);
        return false;
    };

    return [copiedText, copy];
}
