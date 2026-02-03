import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_aa7413, v_472849, v_39a996, v_4623af, v_03e392 } from 'rcmrninabrnb';
import { v_dc21b6, v_f2f2dd, v_8b3997, v_3e029d } from '../services/otaCheck';

const v_7f5f8a = () => {
    const [v_cf55be, v_72f90e] = v_5ab095(false);
    const [v_a2dcc0, v_c90ab1] = v_5ab095<v_3e029d | null>(null);
    const [v_a63fde, v_6306c3] = v_5ab095(0);
    const [v_328f2e, v_fa9c37] = v_5ab095(false);

    v_c4deb2(() => {
        v_7e5bd3();
    }, []);

    const v_7e5bd3 = async () => {
        if (__DEV__) return; 

        const v_34d5e3 = await v_dc21b6();
        if (v_34d5e3) {
            v_c90ab1(v_34d5e3);
            v_72f90e(true);
        }
    };

    const v_02f61c = async () => {
        if (!v_a2dcc0) return;

        v_fa9c37(true);
        try {
            const v_593e63 = await v_f2f2dd(v_a2dcc0.url, (v_e2a85c) => {
                v_6306c3(v_e2a85c);
            });

            if (v_593e63) {
                await v_8b3997(v_a2dcc0.version);
                v_03e392.alert(
                    '업데이트 완료',
                    '최신 버전을 적용하기 위해 앱을 재시작해 주세요.',
                    [{
                        text: '확인', onPress: () => {

                            v_72f90e(false);
                        }
                    }]
                );
            } else {
                v_03e392.alert('오류', '업데이트 다운로드에 실패했습니다.');
                v_fa9c37(false);
            }
        } catch (v_9e86fd) {
            console.error(v_9e86fd);
            v_fa9c37(false);
            v_03e392.alert('오류', '업데이트 중 오류가 발생했습니다.');
        }
    };

    if (!v_cf55be || !v_a2dcc0) return null;

    return (
        <Modal visible={v_cf55be} transparent animationType="fade">
            <View style={v_d81136.overlay}>
                <View style={v_d81136.container}>
                    <Text style={v_d81136.title}>새로운 업데이트 발견</Text>
                    <Text style={v_d81136.message}>
                        {v_a2dcc0.description || '앱의 성능 향상과 버그 수정을 위한 업데이트가 있습니다.'}
                    </Text>

                    {v_328f2e ? (
                        <View style={v_d81136.progressContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={v_d81136.progressText}>{Math.round(v_a63fde * 100)}%</Text>
                        </View>
                    ) : (
                        <View style={v_d81136.buttonContainer}>
                            {!v_a2dcc0.forceUpdate && (
                                <TouchableOpacity onPress={() => v_72f90e(false)} style={v_d81136.cancelButton}>
                                    <Text style={v_d81136.cancelText}>나중에</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={v_02f61c} style={v_d81136.updateButton}>
                                <Text style={v_d81136.updateText}>업데이트</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const v_d81136 = v_472849.create({
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

export default v_7f5f8a;
