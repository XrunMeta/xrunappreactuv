import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { checkOTAVersion, downloadBundle, updateLocalVersion, OTAVersionInfo } from '../services/otaCheck';

const OTAUpdateDialog = () => {
    const [visible, setVisible] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<OTAVersionInfo | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        checkForUpdate();
    }, []);

    const checkForUpdate = async () => {
        if (__DEV__) return; 

        const info = await checkOTAVersion();
        if (info) {
            setUpdateInfo(info);
            setVisible(true);
        }
    };

    const handleUpdate = async () => {
        if (!updateInfo) return;

        setIsDownloading(true);
        try {
            const success = await downloadBundle(updateInfo.url, (p) => {
                setProgress(p);
            });

            if (success) {
                await updateLocalVersion(updateInfo.version);
                Alert.alert(
                    '업데이트 완료',
                    '최신 버전을 적용하기 위해 앱을 재시작해 주세요.',
                    [{
                        text: '확인', onPress: () => {

                            setVisible(false);
                        }
                    }]
                );
            } else {
                Alert.alert('오류', '업데이트 다운로드에 실패했습니다.');
                setIsDownloading(false);
            }
        } catch (e) {
            console.error(e);
            setIsDownloading(false);
            Alert.alert('오류', '업데이트 중 오류가 발생했습니다.');
        }
    };

    if (!visible || !updateInfo) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>새로운 업데이트 발견</Text>
                    <Text style={styles.message}>
                        {updateInfo.description || '앱의 성능 향상과 버그 수정을 위한 업데이트가 있습니다.'}
                    </Text>

                    {isDownloading ? (
                        <View style={styles.progressContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                        </View>
                    ) : (
                        <View style={styles.buttonContainer}>
                            {!updateInfo.forceUpdate && (
                                <TouchableOpacity onPress={() => setVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>나중에</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                                <Text style={styles.updateText}>업데이트</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    progressContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    progressText: {
        marginTop: 10,
        fontSize: 14,
        color: '#007AFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    cancelButton: {
        padding: 10,
    },
    cancelText: {
        color: '#999',
        fontSize: 16,
    },
    updateButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    updateText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OTAUpdateDialog;
