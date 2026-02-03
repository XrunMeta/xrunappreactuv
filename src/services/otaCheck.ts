import { v_326be8, v_03e392 } from 'rcmrninabrnb';
import v_e23cc8 from 'leepezcsdonqtat';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

const v_110ec6 = 'https://assets.example.invalid';

export const v_0b7c00 = v_326be8.OS === 'ios' ? 'index.ios.bundle' : 'index.android.bundle';
export const v_2908ae = `${v_e23cc8.DocumentDirectoryPath}/${v_0b7c00}`;
const v_ae6ff7 = 'OTA_BUNDLE_VERSION';

export interface OTAVersionInfo {
    version: number;
    url: string;
    forceUpdate?: boolean;
    description?: string;
}

export interface OTAMetadata {
    android: OTAVersionInfo;
    ios: OTAVersionInfo;
}

export const v_bb787c = async (): Promise<number> => {
    try {
        const v_0e1851 = await v_e84827.getItem(v_ae6ff7);
        return v_0e1851 ? parseInt(v_0e1851, 10) : 0;
    } catch (v_5e9bfe) {
        return 0;
    }
};

export const v_dc21b6 = async (): Promise<OTAVersionInfo | null> => {
    try {
        const v_3393e3 = await fetch(`${v_110ec6}/version.json?t=${new Date().getTime()}`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!v_3393e3.ok) {
            console.log('[OTA] server response not ok');
            return null;
        }

        const v_9390e8 = await v_3393e3.json();
        const v_f3e4c6 = v_326be8.OS === 'ios' ? v_9390e8.ios : v_9390e8.android;

        const v_4587b3 = await v_bb787c();

        console.log(`[OTA] Local Version: ${v_4587b3}, Server Version: ${v_f3e4c6.version}`);

        if (v_f3e4c6.version > v_4587b3) {
            return v_f3e4c6;
        }

        return null;
    } catch (v_5e9bfe) {
        console.error('[OTA] Version check failed:', v_5e9bfe);
        return null;
    }
};

export const v_f2f2dd = async (
    v_f71b56,
    v_94c617
): Promise<boolean> => {
    try {
        const v_4df3e5 = `${v_2908ae}.tmp`;

        const v_6636da = v_e23cc8.downloadFile({
            fromUrl: v_f71b56,
            toFile: v_4df3e5,
            progress: (v_8f00b9) => {
                const v_a63fde = (v_8f00b9.bytesWritten / v_8f00b9.contentLength);
                if (v_94c617) v_94c617(v_a63fde);
            },
        });

        const v_43c42e = await v_6636da.promise;

        if (v_43c42e.statusCode === 200) {

            if (await v_e23cc8.exists(v_2908ae)) {
                await v_e23cc8.unlink(v_2908ae);
            }

            await v_e23cc8.moveFile(v_4df3e5, v_2908ae);
            console.log('[OTA] Download success:', v_2908ae);
            return true;
        } else {
            console.error('[OTA] Download status code:', v_43c42e.statusCode);
            return false;
        }
    } catch (v_5e9bfe) {
        console.error('[OTA] Download failed:', v_5e9bfe);
        return false;
    }
};

export const v_8b3997 = async (v_0e1851) => {
    await v_e84827.setItem(v_ae6ff7, v_0e1851.toString());
};
