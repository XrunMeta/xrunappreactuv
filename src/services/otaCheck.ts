import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://pub-291891eb932c4047b038234e214f5334.r2.dev';

export const BUNDLE_FILENAME = Platform.OS === 'ios' ? 'index.ios.bundle' : 'index.android.bundle';
export const LOCAL_BUNDLE_PATH = `${RNFS.DocumentDirectoryPath}/${BUNDLE_FILENAME}`;
const LOCAL_VERSION_KEY = 'OTA_BUNDLE_VERSION';

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

export const getCurrentOTAVersion = async (): Promise<number> => {
    try {
        const version = await AsyncStorage.getItem(LOCAL_VERSION_KEY);
        return version ? parseInt(version, 10) : 0;
    } catch (error) {
        return 0;
    }
};

export const checkOTAVersion = async (): Promise<OTAVersionInfo | null> => {
    try {
        const response = await fetch(`${BASE_URL}/version.json?t=${new Date().getTime()}`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            console.log('[OTA] server response not ok');
            return null;
        }

        const data: OTAMetadata = await response.json();
        const serverInfo = Platform.OS === 'ios' ? data.ios : data.android;

        const currentVersion = await getCurrentOTAVersion();

        console.log(`[OTA] Local Version: ${currentVersion}, Server Version: ${serverInfo.version}`);

        if (serverInfo.version > currentVersion) {
            return serverInfo;
        }

        return null;
    } catch (error) {
        console.error('[OTA] Version check failed:', error);
        return null;
    }
};

export const downloadBundle = async (
    url: string,
    onProgress?: (progress: number) => void
): Promise<boolean> => {
    try {
        const tempPath = `${LOCAL_BUNDLE_PATH}.tmp`;

        const ret = RNFS.downloadFile({
            fromUrl: url,
            toFile: tempPath,
            progress: (res) => {
                const progress = (res.bytesWritten / res.contentLength);
                if (onProgress) onProgress(progress);
            },
        });

        const result = await ret.promise;

        if (result.statusCode === 200) {

            if (await RNFS.exists(LOCAL_BUNDLE_PATH)) {
                await RNFS.unlink(LOCAL_BUNDLE_PATH);
            }

            await RNFS.moveFile(tempPath, LOCAL_BUNDLE_PATH);
            console.log('[OTA] Download success:', LOCAL_BUNDLE_PATH);
            return true;
        } else {
            console.error('[OTA] Download status code:', result.statusCode);
            return false;
        }
    } catch (error) {
        console.error('[OTA] Download failed:', error);
        return false;
    }
};

export const updateLocalVersion = async (version: number) => {
    await AsyncStorage.setItem(LOCAL_VERSION_KEY, version.toString());
};
