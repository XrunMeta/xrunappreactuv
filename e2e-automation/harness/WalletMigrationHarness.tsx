

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import * as Crypto from 'expo-crypto';

import { initI18nSync } from '../../src/locales';
import { WalletKeyPinPromptModal } from '../../src/components/WalletKeyPinPromptModal';
import {
  encryptWithPin,
  pinVerifyHash,
  upsertEntry,
  userHash,
  readVault,
  deriveEvmAddress,
  detectLegacyEntries,
  clearUserUnlock,
  writeVault,
  type WalletKey,
} from '../../src/services/walletKeyStore';
import { deleteKek } from '../../src/services/walletKek';

initI18nSync();

const EMAIL = 'oth-test@example.invalid';
const MEMBER = 999001;
const PIN = '123456';

const NET_CODE = { eth: 'c1', pol: 'c16' } as const;

type Row = { network: 'eth' | 'pol'; ver: number | undefined; s: string | undefined };

export default function WalletMigrationHarness() {
  const [log, setLog] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [legacy, setLegacy] = useState<string>('미확인');
  const [modalVisible, setModalVisible] = useState(false);

  const say = useCallback((m: string) => setLog((l) => [...l, m]), []);

  const refresh = useCallback(async () => {
    const vault = await readVault();
    const next: Row[] = (['eth', 'pol'] as const).map((network) => {
      const e = vault.find((x) => x.u === userHash(EMAIL, MEMBER, network));
      return { network, ver: e?.ver, s: e?.s };
    });
    setRows(next);
    setLegacy(String(await detectLegacyEntries(EMAIL, MEMBER)));
  }, []);

  const seed = useCallback(async () => {
    setLog([]);

    await writeVault([]);
    await deleteKek();
    clearUserUnlock(EMAIL, MEMBER);

    for (const network of ['eth', 'pol'] as const) {

      const pk = '0x' + Array.from(Crypto.getRandomBytes(32))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const address = await deriveEvmAddress(pk);
      const wallets: WalletKey[] = [
        { wallet_code: NET_CODE[network], address, private_key: pk, derivation_path: '' } as WalletKey,
      ];
      await upsertEntry({
        u: userHash(EMAIL, MEMBER, network),
        c: encryptWithPin(JSON.stringify(wallets), PIN, EMAIL, MEMBER),
        h: pinVerifyHash(PIN, EMAIL, MEMBER),
        s: 's1',
      } as any);
      say(`${network} v1 심음 — ${address.slice(0, 10)}…`);
    }
    await refresh();
  }, [refresh, say]);

  const done = rows.length > 0 && rows.every((r) => r.ver === 2);

  return (
    <View style={styles.root} testID="wallet-migration-harness">
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.h}>v1 → v2 마이그레이션 실측</Text>
        <Text style={styles.meta}>{`${EMAIL} · member ${MEMBER} · PIN ${PIN}`}</Text>

        <Pressable testID="mig-seed" onPress={seed} style={styles.btn}>
          <Text style={styles.btnText}>1. v1 항목 심기 (vault 초기화 + KEK 삭제)</Text>
        </Pressable>
        <Pressable testID="mig-open" onPress={() => setModalVisible(true)} style={styles.btn}>
          <Text style={styles.btnText}>2. PIN 모달 열기</Text>
        </Pressable>
        <Pressable testID="mig-refresh" onPress={refresh} style={styles.btn}>
          <Text style={styles.btnText}>3. vault 다시 읽기</Text>
        </Pressable>

        {
}
        <Text style={styles.h}>vault 상태</Text>
        {rows.map((r) => (
          <Text key={r.network} testID={`mig-row-${r.network}`} style={styles.row}>
            {`${r.network}: ver=${r.ver ?? 'v1'} s=${r.s ?? '없음'}`}
          </Text>
        ))}
        <Text testID="mig-legacy" style={styles.row}>{`detectLegacyEntries=${legacy}`}</Text>
        <Text testID="mig-verdict" style={[styles.row, styles.verdict]}>
          {done ? 'MIGRATION_DONE' : 'MIGRATION_PENDING'}
        </Text>

        <Text style={styles.h}>로그</Text>
        {log.map((l, i) => (
          <Text key={i} style={styles.log}>{l}</Text>
        ))}
      </ScrollView>

      {}
      <WalletKeyPinPromptModal
        visible={modalVisible}
        memberId={MEMBER}
        email={EMAIL}
        onSuccess={async () => {
          setModalVisible(false);
          say('모달 onSuccess — 마이그 저장 완료 시점');
          await refresh();
        }}
        onCancel={() => {
          setModalVisible(false);
          say('모달 취소됨');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20, paddingTop: 60 },
  h: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6, color: '#111' },
  meta: { fontSize: 11, color: '#666', marginBottom: 8 },
  btn: { backgroundColor: '#eef', borderWidth: 1, borderColor: '#99c', padding: 12, marginBottom: 8 },
  btnText: { fontSize: 13, color: '#113' },
  row: { fontSize: 13, color: '#111', marginBottom: 2 },
  verdict: { fontWeight: '700', marginTop: 6 },
  log: { fontSize: 11, color: '#444' },
});
