import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_19b633,
  v_4623af,
  v_326be8,
  v_39a996,
  v_5f4661,
} from 'rcmrninabrnb';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import v_dc0e55 from 'bfgjhdhiuhcmlahuvrfzrfn';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_570c34, v_556baf } from '../components';
import { v_700ef9 } from '../context';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_029bad } from '../types';
import { v_97ad19, v_7b3801 } from '../services';
import { v_e4a763 } from '../utils/env';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_5401ae } from '../testIDs';

export const v_a1c4a5 = () => {
  const { selectedShopItem: v_dfe883 } = v_700ef9();
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
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

        const v_791474 = v_43c42e.data.find(v_8c0b26 => String(v_8c0b26.storage) === String(v_6b1b52));
        if (v_791474) {
          v_41f285(v_791474);
          console.log('[티켓 상세] 티켓 데이터 새로고침 완료:', v_791474);
        } else {
          console.log('[티켓 상세] 해당 storageId와 일치하는 아이템을 찾을 수 없습니다:', v_6b1b52);
          console.log('[티켓 상세] 디버깅 - storageId 타입:', typeof v_6b1b52, '값:', v_6b1b52);
          console.log('[티켓 상세] 디버깅 - 첫 번째 아이템 storage 타입:', typeof v_43c42e.data[0]?.storage, '값:', v_43c42e.data[0]?.storage);
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
    const v_7dac96 = v_c9c489.USE_WORKERS_API === 'true' ? v_c9c489.GATEWAY_WORKERS : v_c9c489.GATEWAY_NODEJS;
    const v_c01615 = v_7dac96.replace('/oth-path', '');
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

  const v_2911e0 = v_2e72da == 10306 || v_2e72da === 10306;

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
      await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.error'), v_8d41d7('screens.shopTicketDetail.alerts.noTicketNumber'));
      return;
    }

    await v_fba5a0.setStringAsync(v_281520);
    await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.copied'), v_8d41d7('screens.shopTicketDetail.alerts.copySuccess'));
  };

  const v_434673 = async () => {
    const v_bffa41 = v_1de78e;
    if (!v_bffa41) {
      await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.shopTicketDetail.share.noQrCode'));
      return;
    }

    try {

      v_e74f9a.current?.toDataURL(async (v_91b89e) => {
        try {

          const v_41e0ce = v_91b89e.replace(/^data:image\/png;base64,/, '');

          const v_a7bd9e = `qr_code_${v_a94bd8}_${Date.now()}.png`;
          const v_0c2fb2 = `${FileSystem.cacheDirectory}${v_a7bd9e}`;

          await FileSystem.writeAsStringAsync(v_0c2fb2, v_41e0ce, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const v_2911e0 = await Sharing.isAvailableAsync();
          if (v_2911e0) {
            await Sharing.shareAsync(v_0c2fb2, {
              mimeType: 'image/png',
              dialogTitle: v_8d41d7('screens.shopTicketDetail.share.qrCodeTitle'),
            });
          } else {

            const v_6a425b = `${v_8d41d7('screens.shopTicketDetail.share.ticketNumber')} ${v_a94bd8}\n${v_8d41d7('screens.shopTicketDetail.share.qrCodeUrl')} ${v_bffa41}`;
            await v_fba5a0.setStringAsync(v_6a425b);
            await v_889fad(
              v_8d41d7('screens.shopTicketDetail.share.qrCodeTitle'),
              v_8d41d7('screens.shopTicketDetail.share.qrCodeUrl') + ' ' + v_bffa41 + '\n\n' + v_8d41d7('screens.shopTicketDetail.share.copiedToClipboard') || '클립보드에 복사되었습니다.'
            );
          }
        } catch (v_8c89c1) {
          console.error('[티켓 상세] QR 공유 오류:', v_8c89c1);

          try {
            const v_6a425b = `${v_8d41d7('screens.shopTicketDetail.share.ticketNumber')} ${v_a94bd8}\n${v_8d41d7('screens.shopTicketDetail.share.qrCodeUrl')} ${v_bffa41}`;
            await v_fba5a0.setStringAsync(v_6a425b);
            await v_889fad(
              v_8d41d7('screens.shopTicketDetail.share.qrCodeTitle'),
              v_8d41d7('screens.shopTicketDetail.share.qrCodeUrl') + ' ' + v_bffa41 + '\n\n' + (v_8d41d7('screens.shopTicketDetail.share.copiedToClipboard') || '클립보드에 복사되었습니다.')
            );
          } catch (v_741f30) {
            console.error('[티켓 상세] QR 공유 대안 실패:', v_741f30);
            await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.shopTicketDetail.share.shareFailed'));
          }
        }
      });
    } catch (v_5e9bfe) {
      console.error('[티켓 상세] QR 공유 오류:', v_5e9bfe);

      try {
        const v_6a425b = `${v_8d41d7('screens.shopTicketDetail.share.qrCodeTitle')}: ${v_1de78e}`;
        await v_fba5a0.setStringAsync(v_6a425b);
        await v_889fad(
          v_8d41d7('screens.shopTicketDetail.share.qrCodeTitle'),
          v_6a425b + '\n\n' + (v_8d41d7('screens.shopTicketDetail.share.copiedToClipboard') || '클립보드에 복사되었습니다.')
        );
      } catch (v_741f30) {
        await v_889fad(v_8d41d7('common.messages.error'), v_8d41d7('screens.shopTicketDetail.share.shareFailed'));
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
      await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.error'), `삭제할 수 없습니다. 필요한 정보가 없습니다.\nmemberId: ${v_717992 || '없음'}\nstorageId: ${v_26c75d || '없음'}`);
      return;
    }

    await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.deleteTitle'), v_8d41d7('screens.shopTicketDetail.alerts.deleteConfirm'), [
      { text: v_8d41d7('screens.shopTicketDetail.alerts.cancel'), style: 'cancel' },
      {
        text: v_8d41d7('screens.shopTicketDetail.alerts.delete'),
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
              await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.deleteSuccessTitle'), v_8d41d7('screens.shopTicketDetail.alerts.deleteSuccessMessage'), [
                {
                  text: v_8d41d7('screens.shopTicketDetail.alerts.confirm'),
                  onPress: () => {

                    v_9b57fc(v_ce4741.shopMyTicket);
                  },
                },
              ]);
            } else {
              console.log('[티켓 상세] 삭제 실패:', v_43c42e.message);
              await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.deleteFailedTitle'), v_43c42e.message || v_8d41d7('screens.shopTicketDetail.alerts.deleteFailedMessage'));
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
            await v_889fad(v_8d41d7('screens.shopTicketDetail.alerts.error'), `${v_8d41d7('screens.shopTicketDetail.alerts.errorDeleteMessage')}\n${v_5e9bfe?.message || '알 수 없는 오류'}`);
          } finally {
            v_deef62(false);
          }
        },
      },
    ]);
  };

  const v_281520 = v_c811e3?.txID || v_c811e3?.txid || v_c811e3?.transaction || v_cd1db8 || v_a94bd8;

  return (
    <SafeView style={v_d81136.container}>
      <Header title={v_8d41d7('screens.shopTicketDetail.title')} showBackButton />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
        showBottomBackground={false}>
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

        <Text testID={v_5401ae.shopTicketDetail.titleLabel} style={v_d81136.itemTitle}>{v_dfe883?.title ?? '티켓'}</Text>

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
      </SafeScrollView>

      {}
      <View style={v_d81136.actionButtonsContainer}>
        {v_2911e0 ? (
          <>
            <TouchableOpacity testID={v_5401ae.shopTicketDetail.copyTicketNumber}
              style={[v_d81136.actionButton, v_d81136.copyButton]}
              onPress={v_a155a6}
              disabled={!v_1de78e}>
              <Text style={v_d81136.actionButtonText}>{v_8d41d7('screens.shopTicketDetail.share.copyTicketNumber')}</Text>
            </TouchableOpacity>
            <TouchableOpacity testID={v_5401ae.shopTicketDetail.shareQr}
              style={[v_d81136.actionButton, v_d81136.shareButton]}
              onPress={v_434673}
              disabled={!v_1de78e}>
              <Text style={v_d81136.shareButtonText}>{v_8d41d7('screens.shopTicketDetail.share.shareQrImage')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity testID={v_5401ae.shopTicketDetail.confirmDelete}
            style={[v_d81136.actionButton, v_d81136.deleteButton]}
            onPress={v_6ff8af}>
            <Text style={v_d81136.actionButtonText}>{v_8d41d7('screens.shopTicketDetail.share.delete')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
    flexGrow: 1,
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
    fontSize: v_843035.size.msmall,
    color: '#999',
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: v_843035.size.mmedium,
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
    fontSize: v_843035.size.msmall,
    color: '#000',
    marginBottom: 0, 
    fontWeight: '500',
  },
  ticketFieldStatus: {
    fontSize: v_843035.size.msmall,
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
    fontSize: v_843035.size.medium,
    color: '#000',
    fontWeight: '600',
  },

  actionButtonsContainer: {
    ...v_a61db3.bottomButtonContainer,
    paddingHorizontal: v_9b1a04.large,

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
    fontSize: v_843035.size.medium,
  },
  shareButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: v_843035.size.medium,
  },
});
