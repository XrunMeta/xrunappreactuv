import { v_326be8, v_03e392 } from 'rcmrninabrnb';
import v_e23cc8 from 'leepezcsdonqtat';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_b4f924, v_16a625, v_b01dc0, v_03e013 } from 'zymsaqwdccswrjlzyfswgwse';

const v_110ec6 = 'https://assets.example.invalid';

const v_7005d3 = v_326be8.OS === 'ios' ? v_e23cc8.DocumentDirectoryPath : v_e23cc8.DocumentDirectoryPath;
const v_1b78b6 = v_326be8.OS === 'ios' ? 'index.ios.bundle' : 'index.android.bundle';
const v_2908ae = `${v_7005d3}/${v_1b78b6}`;

const v_619a5c = 'OTA_BUNDLE_VERSION';

export interface OTAVersionInfo {
    version: number;
    url: string;
    description: string;
    forceUpdate: boolean;
}

interface OTAMetadata {
    android: OTAVersionInfo;
    ios: OTAVersionInfo;
}

export const v_bb787c = async (): Promise<number> => {
    try {
        const v_0e1851 = await v_e84827.getItem(v_619a5c);
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

        const v_741eb4 = `${v_7005d3}/ota_update.zip`;

        if (await v_e23cc8.exists(v_741eb4)) {
            await v_e23cc8.unlink(v_741eb4);
        }

        console.log(`[OTA] Downloading ZIP to: ${v_741eb4}`);

        const v_6636da = v_e23cc8.downloadFile({
            fromUrl: v_f71b56,
            toFile: v_741eb4,
            progress: (v_8f00b9) => {
                const v_a63fde = (v_8f00b9.bytesWritten / v_8f00b9.contentLength);
                if (v_94c617) v_94c617(v_a63fde);
            },
        });

        const v_43c42e = await v_6636da.promise;

        if (v_43c42e.statusCode !== 200) {
            console.error('[OTA] Download status code:', v_43c42e.statusCode);
            return false;
        }

        console.log('[OTA] ZIP Download success. Unzipping...');

        try {
            const v_f850de = 'UTF-8';
            const v_9fe22d = await v_16a625(v_741eb4, v_7005d3, v_f850de);
            console.log(`[OTA] Unzip completed to: ${v_9fe22d}`);

            await v_e23cc8.unlink(v_741eb4);

            const v_abf741 = await v_e23cc8.exists(v_2908ae);
            if (v_abf741) {
                console.log('[OTA] Bundle file verified.');
                return true;
            } else {
                console.error('[OTA] Bundle file missing after unzip.');
                return false;
            }

        } catch (v_637ce7) {
            console.error('[OTA] Unzip failed:', v_637ce7);
            return false;
        }

    } catch (v_5e9bfe) {
        console.error('[OTA] Download failed:', v_5e9bfe);
        return false;
    }
};

export const v_8b3997 = async (v_0e1851) => {
    await v_e84827.setItem(v_619a5c, v_0e1851.toString());
};
