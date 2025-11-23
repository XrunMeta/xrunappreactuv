import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import * as v_fba5a0 from 'hfxxehldoiokdq';
import { v_729608 } from '../components';
import { v_5f4661 } from 'rcmrninabrnb';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_700ef9 } from '../context';

export const v_a1c4a5 = () => {
  const { selectedShopItem: v_dfe883 } = v_700ef9();
  const v_a94bd8 = '1231258081';

  const v_dd4201 = async () => {
    await v_fba5a0.setStringAsync(v_a94bd8);
  };

  const v_22cd2d = async () => {
    await v_5f4661.share({ message: `티켓 번호: ${v_a94bd8}` });
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Tiket Detail" showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <View style={v_d81136.qrWrapper}>
            <View style={v_d81136.qrBorder}>
              <Feather name="grid" size={56} color="#343a5a" />
            </View>
          </View>

          <Text style={v_d81136.itemTitle}>{v_dfe883?.title ?? '티켓'}</Text>

          <View style={v_d81136.infoRow}>
            <Text style={v_d81136.label}>Tiket Number</Text>
            <Text style={v_d81136.status}>Available</Text>
          </View>
          <View style={v_d81136.ticketBox}>
            <Text style={v_d81136.ticketNumber}>{v_a94bd8}</Text>
          </View>

          <TouchableOpacity style={[v_d81136.button, v_d81136.primaryButton]} onPress={v_dd4201}>
            <Text style={v_d81136.primaryText}>Copy Tiket Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[v_d81136.button, v_d81136.shareButton]} onPress={v_22cd2d}>
            <Text style={v_d81136.shareText}>Share QR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#111',
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 40,
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
    width: 247,
    height: 247,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#111',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#3391d0',
  },
  ticketBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e6ed',
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  ticketNumber: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#707070',
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#343a5a',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  shareButton: {
    backgroundColor: '#ffdc04',
  },
  shareText: {
    color: '#1a2e35',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
});


