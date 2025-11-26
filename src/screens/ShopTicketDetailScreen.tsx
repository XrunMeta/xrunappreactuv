import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_122070,
  v_19b633,
  v_4623af,
  v_03e392,
  v_326be8,
  v_39a996,
  v_5f4661,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import v_dc0e55 from 'bfgjhdhiuhcmlahuvrfzrfn';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_700ef9 } from '../context';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_029bad } from '../types';
import { v_97ad19, v_7b3801 } from '../services';
import { v_e4a763 } from '../utils/env';
import { v_1bfbd0 } from '../constants';

export const v_a1c4a5 = () => {
  const { selectedShopItem: v_dfe883 } = v_700ef9();
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const v_e74f9a = v_e662ae<any>(null);

  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_c811e3, v_41f285] = v_5ab095<v_029bad | null>(null);
  const [v_cd31a8, v_deef62] = v_5ab095(false);

  const v_6b1b52 = String((v_dfe883 as any)?.storage || v_c811e3?.storage || '');
  const v_cd1db8 = (v_dfe883 as any)?.txID;
  const v_a94bd8 = v_cd1db8 || (v_dfe883 as any)?.transaction || '';

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(String(v_ef7306.member));
          }
        }
      } catch (v_5e9bfe) {
        console.error('[티켓 상세] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_223cb4 = async () => {
    if (!v_717992 || !v_6b1b52) return;

    try {
      v_deef62(true);
      const v_43c42e = await v_97ad19(v_717992);

      if (v_43c42e && v_43c42e.status === 'success' && v_43c42e.data) {
        const v_791474 = v_43c42e.data.find(v_8c0b26 => v_8c0b26.storage === v_6b1b52);
        if (v_791474) {
          v_41f285(v_791474);
          console.log('[티켓 상세] 티켓 데이터 새로고침 완료:', v_791474);
        } else {
          console.log('[티켓 상세] 해당 storageId와 일치하는 아이템을 찾을 수 없습니다:', v_6b1b52);
        }
      }
    } catch (v_5e9bfe) {
      console.error('[티켓 상세] 티켓 데이터 새로고침 오류:', v_5e9bfe);
    } finally {
      v_deef62(false);
    }
  };

  v_c4deb2(() => {
    if (!v_717992 || !v_6b1b52) return;

    v_223cb4();

    const v_ad1d65 = setInterval(() => {
      console.log('[티켓 상세] === 10초마다 티켓 데이터 새로고침 ===');
      v_223cb4();
    }, 10000);

    return () => {
      clearInterval(v_ad1d65);
    };
  }, [v_717992, v_6b1b52]);

  const v_222d64 = (v_fba864): string => {
    const v_7eac46 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let v_43c42e = '';
    let v_ebec57 = 0;

    while (v_ebec57 < v_fba864.length) {
      const v_779914 = v_fba864.charCodeAt(v_ebec57++);
      const v_148ff6 = v_ebec57 < v_fba864.length ? v_fba864.charCodeAt(v_ebec57++) : 0;
      const v_3f4e2e = v_ebec57 < v_fba864.length ? v_fba864.charCodeAt(v_ebec57++) : 0;

      const v_d157e5 = (v_779914 << 16) | (v_148ff6 << 8) | v_3f4e2e;

      v_43c42e += v_7eac46.charAt((v_d157e5 >> 18) & 63);
      v_43c42e += v_7eac46.charAt((v_d157e5 >> 12) & 63);
      v_43c42e += v_ebec57 - 2 < v_fba864.length ? v_7eac46.charAt((v_d157e5 >> 6) & 63) : '=';
      v_43c42e += v_ebec57 - 1 < v_fba864.length ? v_7eac46.charAt(v_d157e5 & 63) : '=';
    }

    return v_43c42e;
  };

  const v_116428 = (): string => {

    const v_281520 = v_c811e3?.txID || v_c811e3?.txid || v_c811e3?.transaction || v_cd1db8 || v_a94bd8;

    if (!v_6b1b52) {
      return v_281520 || '';
    }

    const v_e3a04d = v_222d64(v_6b1b52.toString());
    const v_c9c489 = v_e4a763();
    const v_c01615 = v_c9c489.GATEWAY_NODEJS.replace('/oth-path', '');
    const v_8a32c8 = `${v_c01615}/page/allreave/${v_e3a04d}`;

    console.log('[티켓 상세] === QR 코드 주소 생성 ===');
    console.log('[티켓 상세] 원본 storageId:', v_6b1b52);
    console.log('[티켓 상세] storageId 타입:', typeof v_6b1b52);
    console.log('[티켓 상세] base64 인코딩된 storageId:', v_e3a04d);
    console.log('[티켓 상세] 생성된 QR 코드 주소:', v_8a32c8);

    const v_818375 = (() => {
      const v_7eac46 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let v_43c42e = '';
      let v_ebec57 = 0;

      const v_fba864 = v_e3a04d.replace(/=+$/, '');

      while (v_ebec57 < v_fba864.length) {
        const v_e6e31d = v_7eac46.indexOf(v_fba864.charAt(v_ebec57++));
        const v_61fadf = v_7eac46.indexOf(v_fba864.charAt(v_ebec57++));
        const v_298983 = v_7eac46.indexOf(v_fba864.charAt(v_ebec57++));
        const v_c0971f = v_7eac46.indexOf(v_fba864.charAt(v_ebec57++));

        const v_d157e5 = (v_e6e31d << 18) | (v_61fadf << 12) | (v_298983 << 6) | v_c0971f;

        v_43c42e += String.fromCharCode((v_d157e5 >> 16) & 255);
        if (v_298983 !== 64) v_43c42e += String.fromCharCode((v_d157e5 >> 8) & 255);
        if (v_c0971f !== 64) v_43c42e += String.fromCharCode(v_d157e5 & 255);
      }

      return v_43c42e;
    })();

    console.log('[티켓 상세] base64 디코딩 테스트 결과:', v_818375);
    console.log('[티켓 상세] ========================');

    return v_8a32c8;
  };

  const v_1de78e = v_116428();
  const v_2e72da = v_c811e3?.status || (v_dfe883 as any)?.status;

  const v_2911e0 = v_2e72da == 10307 || v_2e72da === 10307;

  console.log('[티켓 상세] === 상태 확인 ===');
  console.log('[티켓 상세] currentStatus:', v_2e72da);
  console.log('[티켓 상세] currentStatus 타입:', typeof v_2e72da);
  console.log('[티켓 상세] currentStatus == 10307:', v_2e72da == 10307);
  console.log('[티켓 상세] currentStatus === 10307:', v_2e72da === 10307);
  console.log('[티켓 상세] isAvailable:', v_2911e0);
  console.log('[티켓 상세] ticketData?.status:', v_c811e3?.status);
  console.log('[티켓 상세] selectedShopItem?.status:', (v_dfe883 as any)?.status);
  console.log('[티켓 상세] ================');

  const v_a155a6 = async () => {
    const v_281520 = v_c811e3?.txID || v_c811e3?.txid || v_c811e3?.transaction || v_cd1db8 || v_a94bd8;

    if (!v_281520) {
      v_03e392.alert('오류', '복사할 티켓 번호가 없습니다.');
      return;
    }

    await v_fba5a0.setStringAsync(v_281520);
    v_03e392.alert('복사됨', '티켓 번호가 클립보드에 복사되었습니다.');
  };

  const v_434673 = async () => {
    const v_bffa41 = v_1de78e;
    if (!v_bffa41) {
      v_03e392.alert('오류', '공유할 QR 코드가 없습니다.');
      return;
    }

    try {

      v_e74f9a.current?.toDataURL(async (v_91b89e) => {
        try {

          const v_6a425b = `티켓 번호: ${v_a94bd8}\nQR 코드 URL: ${v_bffa41}`;

          await v_5f4661.share({
            message: v_6a425b,
            title: '티켓 QR 코드',
          });
        } catch (v_8c89c1) {
          console.error('[티켓 상세] QR 공유 오류:', v_8c89c1);

          try {
            await v_5f4661.share({
              message: `티켓 QR 코드: ${v_bffa41}`,
              title: '티켓 QR 코드',
            });
          } catch (v_741f30) {
            console.error('[티켓 상세] QR 공유 대안 실패:', v_741f30);
            v_03e392.alert('오류', 'QR 코드 공유에 실패했습니다.');
          }
        }
      });
    } catch (v_5e9bfe) {
      console.error('[티켓 상세] QR 공유 오류:', v_5e9bfe);

      try {
        await v_5f4661.share({
          message: `티켓 QR 코드: ${v_1de78e}`,
          title: '티켓 QR 코드',
        });
      } catch (v_741f30) {
        v_03e392.alert('오류', 'QR 코드 공유에 실패했습니다.');
      }
    }
  };

  const v_6ff8af = async () => {
    const v_26c75d = String(v_c811e3?.storage || v_6b1b52 || '');

    console.log('[티켓 상세] === 삭제 확인 ===');
    console.log('[티켓 상세] memberId:', v_717992);
    console.log('[티켓 상세] storageId (원본):', v_6b1b52);
    console.log('[티켓 상세] ticketData?.storage:', v_c811e3?.storage);
    console.log('[티켓 상세] currentStorageId (최종):', v_26c75d);
    console.log('[티켓 상세] ================');

    if (!v_717992 || !v_26c75d) {
      v_03e392.alert('오류', `삭제할 수 없습니다. 필요한 정보가 없습니다.\nmemberId: ${v_717992 || '없음'}\nstorageId: ${v_26c75d || '없음'}`);
      return;
    }

    v_03e392.alert('삭제', '티켓을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        onPress: async () => {
          try {
            v_deef62(true);
            console.log('[티켓 상세] === 티켓 삭제 시작 ===');
            console.log('[티켓 상세] memberId:', v_717992);
            console.log('[티켓 상세] storageId:', v_26c75d);
            console.log('[티켓 상세] storageId 타입:', typeof v_26c75d);

            const v_43c42e = await v_7b3801(v_717992, v_26c75d);

            console.log('[티켓 상세] 삭제 API 응답:', v_43c42e);

            if (v_43c42e.status === 'success') {
              console.log('[티켓 상세] 삭제 성공');
              v_03e392.alert('삭제 완료', '티켓이 삭제되었습니다.', [
                {
                  text: '확인',
                  onPress: () => {

                    v_9b57fc(v_ce4741.shopMyTicket);
                  },
                },
              ]);
            } else {
              console.log('[티켓 상세] 삭제 실패:', v_43c42e.message);
              v_03e392.alert('삭제 실패', v_43c42e.message || '티켓 삭제에 실패했습니다.');
            }
          } catch (v_5e9bfe) {
            console.error('[티켓 상세] === 티켓 삭제 오류 ===');
            console.error('[티켓 상세] 오류 타입:', v_5e9bfe?.constructor?.name);
            console.error('[티켓 상세] 오류 메시지:', v_5e9bfe?.message);
            console.error('[티켓 상세] 오류 전체:', v_5e9bfe);
            if (v_5e9bfe?.response) {
              console.error('[티켓 상세] 응답 상태:', v_5e9bfe.response.status);
              console.error('[티켓 상세] 응답 데이터:', v_5e9bfe.response.data);
            }
            console.error('[티켓 상세] ====================');
            v_03e392.alert('오류', `티켓 삭제 중 오류가 발생했습니다.\n${v_5e9bfe?.message || '알 수 없는 오류'}`);
          } finally {
            v_deef62(false);
          }
        },
      },
    ]);
  };

  const v_281520 = v_c811e3?.txID || v_c811e3?.txid || v_c811e3?.transaction || v_cd1db8 || v_a94bd8;

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.shopTicketDetail.title')} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          {}
          <View style={v_d81136.qrWrapper}>
            <View
              style={[
                v_d81136.qrBorder,
                {
                  opacity: v_2911e0 ? 1 : 0.3,
                  borderColor: '#DEDEDE',
                },
              ]}>
              {v_1de78e ? (
                <QRCode
                  value={String(v_1de78e)}
                  size={150}
                  color={v_2911e0 ? '#000' : '#999999'}
                  backgroundColor="#FFFFFF"
                  getRef={(v_3f4e2e) => (v_e74f9a.current = v_3f4e2e)}
                />
              ) : (
                <Text style={v_d81136.errorText}>QR 코드를 생성할 수 없습니다</Text>
              )}
            </View>
          </View>

          <Text style={v_d81136.itemTitle}>{v_dfe883?.title ?? '티켓'}</Text>

          {}
          <View style={v_d81136.ticketFieldContainer}>
            <View style={v_d81136.ticketFieldHeader}>
              <Text style={v_d81136.ticketFieldLabel}>
                Ticket Number
              </Text>
              <Text
                style={[
                  v_d81136.ticketFieldStatus,
                  {
                    color: v_2911e0 ? '#3391D0' : '#707070',
                  },
                ]}>
                {v_2911e0 ? 'Available' : 'Redeemed'}
              </Text>
            </View>
            <View style={v_d81136.ticketFieldBox}>
              <Text style={v_d81136.ticketFieldNumber}>
                {v_281520 || 'No Ticket Available'}
              </Text>
            </View>
          </View>

          {v_cd31a8 && (
            <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} style={{ marginBottom: 16 }} />
          )}
        </View>
      </ScrollView>

      {}
      <View style={v_d81136.actionButtonsContainer}>
        {v_2911e0 ? (
          <>
            <TouchableOpacity
              style={[v_d81136.actionButton, v_d81136.copyButton]}
              onPress={v_a155a6}
              disabled={!v_1de78e}>
              <Text style={v_d81136.actionButtonText}>Copy Ticket Number</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[v_d81136.actionButton, v_d81136.shareButton]}
              onPress={v_434673}
              disabled={!v_1de78e}>
              <Text style={v_d81136.shareButtonText}>Share QR Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[v_d81136.actionButton, v_d81136.deleteButton]}
            onPress={v_6ff8af}>
            <Text style={v_d81136.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 120, 
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrBorder: {
    padding: 30,
    borderRadius: 32,
    borderColor: '#DEDEDE',
    borderWidth: 10,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#111',
    marginBottom: 12,
  },

  ticketFieldContainer: {
    marginTop: 30,
    paddingHorizontal: 0, 
    width: '100%', 
  },
  ticketFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0, 
    marginBottom: 5, 
  },
  ticketFieldLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 0, 
    fontWeight: '500',
  },
  ticketFieldStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  ticketFieldBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%', 
    marginTop: 0, 
  },
  ticketFieldNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },

  actionButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#343A5A',
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#FFDC04',
  },
  deleteButton: {
    backgroundColor: '#343A5A',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
