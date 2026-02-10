import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';

const BASE_URL = 'https://pub-23c0c0ee5e774a90bc4dd356ef88e11c.r2.dev';

const LOCAL_ROOT_PATH = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DocumentDirectoryPath;
const LOCAL_BUNDLE_FILENAME = Platform.OS === 'ios' ? 'index.ios.bundle' : 'index.android.bundle';
const LOCAL_BUNDLE_PATH = `${LOCAL_ROOT_PATH}/${LOCAL_BUNDLE_FILENAME}`;

const VERSION_KEY = 'OTA_BUNDLE_VERSION';

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

export const getCurrentOTAVersion = async (): Promise<number> => {
    try {
        const version = await AsyncStorage.getItem(VERSION_KEY);
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

        const zipPath = `${LOCAL_ROOT_PATH}/ota_update.zip`;

        if (await RNFS.exists(zipPath)) {
            await RNFS.unlink(zipPath);
        }

        console.log(`[OTA] Downloading ZIP to: ${zipPath}`);

        const ret = RNFS.downloadFile({
            fromUrl: url,
            toFile: zipPath,
            progress: (res) => {
                const progress = (res.bytesWritten / res.contentLength);
                if (onProgress) onProgress(progress);
            },
        });

        const result = await ret.promise;

        if (result.statusCode !== 200) {
            console.error('[OTA] Download status code:', result.statusCode);
            return false;
        }

        console.log('[OTA] ZIP Download success. Unzipping...');

        try {
            const charset = 'UTF-8';
            const path = await unzip(zipPath, LOCAL_ROOT_PATH, charset);
            console.log(`[OTA] Unzip completed to: ${path}`);

            await RNFS.unlink(zipPath);

            const bundleExists = await RNFS.exists(LOCAL_BUNDLE_PATH);
            if (bundleExists) {
                console.log('[OTA] Bundle file verified.');
                return true;
            } else {
                console.error('[OTA] Bundle file missing after unzip.');
                return false;
            }

        } catch (unzipError) {
            console.error('[OTA] Unzip failed:', unzipError);
            return false;
        }

    } catch (error) {
        console.error('[OTA] Download failed:', error);
        return false;
    }
};

export const updateLocalVersion = async (version: number) => {
    await AsyncStorage.setItem(VERSION_KEY, version.toString());
};
