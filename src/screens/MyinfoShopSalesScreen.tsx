import v_a3453e, { v_e662ae, v_5ab095, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_aa7413, v_09d0e5, v_122070 } from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_58c85e, v_b3c0a1, v_60b263, v_029581, v_556baf } from '../components';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_5b0045, v_ae32ae } from '../types/pagination';

type PeriodOption = '1week' | '1month' | '3months' | '6months' | 'custom';
type DatePickerTarget = 'start' | 'end' | null;

export const v_1cca63 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57 } = v_a0daa8();
  const v_e5fc4b = v_e662ae<v_029581>(null);
  const [v_cd31a8] = v_5ab095<boolean>(false);

  const [v_a7e395, v_2f9f74] = v_5ab095(false);
  const [v_0f64f4, v_9d83ae] = v_5ab095<PeriodOption>('1month');
  const [v_0ec7ad, v_00496d] = v_5ab095<Date>(() => {
    const v_8dffde = new Date();
    v_8dffde.setMonth(v_8dffde.getMonth() - 1);
    return v_8dffde;
  });
  const [v_331624, v_8fae9f] = v_5ab095<Date>(new Date());

  const [v_2bd066, v_a189c0] = v_5ab095(false);
  const [v_99b0c1, v_793444] = v_5ab095<DatePickerTarget>(null);
  const [v_10c2af, v_2a41a6] = v_5ab095(new Date());

  const v_4db865 = [
    { key: '1week', label: v_8d41d7('screens.myinfoShopSales.period1Week') },
    { key: '1month', label: v_8d41d7('screens.myinfoShopSales.period1Month') },
    { key: '3months', label: v_8d41d7('screens.myinfoShopSales.period3Months') },
    { key: '6months', label: v_8d41d7('screens.myinfoShopSales.period6Months') },
    { key: 'custom', label: v_8d41d7('screens.myinfoShopSales.periodCustom') },
  ];

  const v_96a68c = [
    v_8d41d7('screens.myinfoShopSales.weekDays.sun'),
    v_8d41d7('screens.myinfoShopSales.weekDays.mon'),
    v_8d41d7('screens.myinfoShopSales.weekDays.tue'),
    v_8d41d7('screens.myinfoShopSales.weekDays.wed'),
    v_8d41d7('screens.myinfoShopSales.weekDays.thu'),
    v_8d41d7('screens.myinfoShopSales.weekDays.fri'),
    v_8d41d7('screens.myinfoShopSales.weekDays.sat'),
  ];

  const v_e065e5 = (v_8dffde): string => {
    const v_0eaaff = v_8dffde.getFullYear();
    const v_033a94 = String(v_8dffde.getMonth() + 1).padStart(2, '0');
    const v_087ffc = String(v_8dffde.getDate()).padStart(2, '0');
    return `${v_0eaaff}.${v_033a94}.${v_087ffc}`;
  };

  const v_fd2364 = (v_783ad3) => {
    v_9d83ae(v_783ad3);

    const v_227df7 = new Date();
    let v_30296e = new Date();

    switch (v_783ad3) {
      case '1week':
        v_30296e.setDate(v_227df7.getDate() - 7);
        break;
      case '1month':
        v_30296e.setMonth(v_227df7.getMonth() - 1);
        break;
      case '3months':
        v_30296e.setMonth(v_227df7.getMonth() - 3);
        break;
      case '6months':
        v_30296e.setMonth(v_227df7.getMonth() - 6);
        break;
      case 'custom':
        return;
    }

    v_00496d(v_30296e);
    v_8fae9f(v_227df7);
  };

  const v_d8aa02 = (v_5f5d6d) => {
    v_9d83ae('custom');
    v_793444(v_5f5d6d);
    v_2a41a6(v_5f5d6d === 'start' ? v_0ec7ad : v_331624);
    v_a189c0(true);
  };

  const v_5d9884 = (v_087ffc) => {
    const v_1835e1 = new Date(v_10c2af.getFullYear(), v_10c2af.getMonth(), v_087ffc);
    const v_227df7 = new Date();
    v_227df7.setHours(23, 59, 59, 999);

    if (v_1835e1 > v_227df7) return; 

    if (v_99b0c1 === 'start') {
      if (v_1835e1 > v_331624) {
        v_8fae9f(v_1835e1);
      }
      v_00496d(v_1835e1);
    } else if (v_99b0c1 === 'end') {
      if (v_1835e1 < v_0ec7ad) {
        v_00496d(v_1835e1);
      }
      v_8fae9f(v_1835e1);
    }

    v_a189c0(false);
    v_793444(null);
  };

  const v_182051 = (v_e9396c) => {
    const v_b5785c = new Date(v_10c2af);
    v_b5785c.setMonth(v_b5785c.getMonth() + v_e9396c);
    v_2a41a6(v_b5785c);
  };

  const v_16cc52 = () => {
    v_2f9f74(false);
    v_e5fc4b.current?.reloadData();
  };

  const v_fe02bb = () => {
    const v_0eaaff = v_10c2af.getFullYear();
    const v_033a94 = v_10c2af.getMonth();
    const v_c9129b = new Date(v_0eaaff, v_033a94, 1).getDay();
    const v_43142a = new Date(v_0eaaff, v_033a94 + 1, 0).getDate();
    const v_227df7 = new Date();

    const v_6a53fd = [];

    for (let v_ebec57 = 0; v_ebec57 < v_c9129b; v_ebec57++) {
      v_6a53fd.push(null);
    }

    for (let v_ebec57 = 1; v_ebec57 <= v_43142a; v_ebec57++) {
      v_6a53fd.push(v_ebec57);
    }

    const v_1835e1 = v_99b0c1 === 'start' ? v_0ec7ad : v_331624;

    return (
      <View style={v_d81136.calendarContainer}>
        {}
        <View style={v_d81136.calendarHeader}>
          <TouchableOpacity onPress={() => v_182051(-1)} style={v_d81136.calendarNavButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={v_d81136.calendarHeaderText}>
            {v_8d41d7('screens.myinfoShopSales.yearMonth', { year: v_0eaaff, month: v_033a94 + 1 })}
          </Text>
          <TouchableOpacity onPress={() => v_182051(1)} style={v_d81136.calendarNavButton}>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {}
        <View style={v_d81136.weekDaysRow}>
          {v_96a68c.map((v_087ffc, v_a56041) => (
            <Text
              key={v_087ffc}
              style={[
                v_d81136.weekDayText,
                v_a56041 === 0 && v_d81136.sundayText,
                v_a56041 === 6 && v_d81136.saturdayText,
              ]}
            >
              {v_087ffc}
            </Text>
          ))}
        </View>

        {}
        <View style={v_d81136.daysGrid}>
          {v_6a53fd.map((v_087ffc, v_a56041) => {
            if (v_087ffc === null) {
              return <View key={`empty-${v_a56041}`} style={v_d81136.dayCell} />;
            }

            const v_231db0 = new Date(v_0eaaff, v_033a94, v_087ffc);
            const v_147971 =
              v_087ffc === v_227df7.getDate() &&
              v_033a94 === v_227df7.getMonth() &&
              v_0eaaff === v_227df7.getFullYear();
            const v_599a41 =
              v_087ffc === v_1835e1.getDate() &&
              v_033a94 === v_1835e1.getMonth() &&
              v_0eaaff === v_1835e1.getFullYear();
            const v_dde7c1 = v_231db0 > v_227df7;
            const v_28012a = (v_c9129b + v_087ffc - 1) % 7;

            return (
              <TouchableOpacity
                key={v_087ffc}
                style={[
                  v_d81136.dayCell,
                  v_599a41 && v_d81136.selectedDayCell,
                  v_147971 && !v_599a41 && v_d81136.todayCell,
                ]}
                onPress={() => !v_dde7c1 && v_5d9884(v_087ffc)}
                disabled={v_dde7c1}
                activeOpacity={0.7}
              >
                <Text style={[
                  v_d81136.dayText,
                  v_28012a === 0 && v_d81136.sundayText,
                  v_28012a === 6 && v_d81136.saturdayText,
                  v_599a41 && v_d81136.selectedDayText,
                  v_dde7c1 && v_d81136.disabledDayText,
                ]}>
                  {v_087ffc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <TouchableOpacity
          style={v_d81136.calendarCloseButton}
          onPress={() => {
            v_a189c0(false);
            v_793444(null);
          }}
        >
          <Text style={v_d81136.calendarCloseButtonText}>{v_8d41d7('screens.myinfoShopSales.close')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const sampleMembers: v_b3c0a1[] = [

  ];

  const v_ff2128 = v_de06a3(async (
    params: v_5b0045
  ): Promise<v_ae32ae<v_b3c0a1>> => {
    const v_6e5804 = (v_24baff.page - 1) * v_24baff.pageSize;
    const v_402079 = v_6e5804 + v_24baff.pageSize;
    const v_98f5bb = v_f09264.slice(v_6e5804, v_402079);
    const v_6bbe19 = v_402079 < v_f09264.length;

    return {
      data: v_98f5bb,
      total: v_f09264.length,
      hasMore: v_6bbe19,
    };
  }, []);

  const v_a37640 = () => (
    <TouchableOpacity
      style={v_d81136.headerSearchButton}
      onPress={() => v_2f9f74(true)}
      activeOpacity={0.7}
    >
      <Ionicons name="calendar-outline" size={22} color={v_1bfbd0.headerText} />
    </TouchableOpacity>
  );

  return (
    <SafeView style={v_d81136.container} backgroundColor='#F8FAFC'>
      <Header
        title={v_8d41d7('screens.myinfoShopSales.title')}
        onBackPress={v_c7ac57}
        rightComponent={v_a37640()}
      />
      <View style={v_d81136.content}>
        {}
        <View style={v_d81136.infoCard}>
          <Text style={v_d81136.infoTitle}>{v_8d41d7('screens.myinfoShopSales.productTitle')}</Text>
          <Text style={v_d81136.infoText}>
            {v_8d41d7('screens.myinfoShopSales.productPrice')} : <Text style={v_d81136.infoValue}>0{v_8d41d7('screens.myinfoShopSales.currency')}</Text> / {v_8d41d7('screens.myinfoShopSales.participants')} : <Text style={v_d81136.infoValue}>0{v_8d41d7('screens.myinfoShopSales.personUnit')}</Text>
          </Text>
          <Text style={v_d81136.infoText}>
            {v_8d41d7('screens.myinfoShopSales.totalSales')} : <Text style={v_d81136.infoHighlight}>0{v_8d41d7('screens.myinfoShopSales.currency')}</Text> /{v_8d41d7('screens.myinfoShopSales.settlementInfo')}
          </Text>
        </View>

        {}
        <View style={v_d81136.selectedPeriodContainer}>
          <Ionicons name="calendar" size={16} color={v_1bfbd0.headerText} />
          <Text style={v_d81136.selectedPeriodText}>{v_e065e5(v_0ec7ad)} ~ {v_e065e5(v_331624)}</Text>
        </View>

        <View style={v_d81136.listContainer}>
          {!v_cd31a8 && v_f09264.length === 0 ? (
            <View style={v_d81136.emptyContainer}>
              <Text style={v_d81136.emptyDescription}>{v_8d41d7('screens.myinfoShopSales.noData')}</Text>
            </View>
          ) : (
            <DataList<v_b3c0a1>
              ref={v_e5fc4b}
              fetchData={v_ff2128}
              ItemComponent={v_58c85e}
              pageSize={20}
              contentContainerStyle={{ paddingVertical: 0, paddingBottom: 32 }}
            />
          )}
        </View>
      </View>

      {}
      <Modal
        visible={v_a7e395}
        transparent
        animationType="fade"
        onRequestClose={() => v_2f9f74(false)}
      >
        <Pressable style={v_d81136.modalOverlay} onPress={() => v_2f9f74(false)}>
          <Pressable style={v_d81136.modalContent} onPress={(v_9e86fd) => v_9e86fd.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={v_d81136.modalTitle}>{v_8d41d7('screens.myinfoShopSales.periodSelect')}</Text>

              {}
              <View style={v_d81136.periodOptionsContainer}>
                {v_4db865.map((v_0bd920) => (
                  <TouchableOpacity
                    key={v_0bd920.key}
                    style={[
                      v_d81136.periodOptionButton,
                      v_0f64f4 === v_0bd920.key && v_d81136.periodOptionButtonActive
                    ]}
                    onPress={() => v_fd2364(v_0bd920.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      v_d81136.periodOptionText,
                      v_0f64f4 === v_0bd920.key && v_d81136.periodOptionTextActive
                    ]}>
                      {v_0bd920.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {}
              <View style={v_d81136.dateRangeContainer}>
                <TouchableOpacity
                  style={v_d81136.dateInputContainer}
                  onPress={() => v_d8aa02('start')}
                  activeOpacity={0.7}
                >
                  <Text style={v_d81136.dateLabel}>{v_8d41d7('screens.myinfoShopSales.startDate')}</Text>
                  <View style={[
                    v_d81136.dateInput,
                    v_99b0c1 === 'start' && v_d81136.dateInputActive
                  ]}>
                    <Text style={v_d81136.dateInputText}>{v_e065e5(v_0ec7ad)}</Text>
                  </View>
                </TouchableOpacity>
                <Text style={v_d81136.dateSeparator}>~</Text>
                <TouchableOpacity
                  style={v_d81136.dateInputContainer}
                  onPress={() => v_d8aa02('end')}
                  activeOpacity={0.7}
                >
                  <Text style={v_d81136.dateLabel}>{v_8d41d7('screens.myinfoShopSales.endDate')}</Text>
                  <View style={[
                    v_d81136.dateInput,
                    v_99b0c1 === 'end' && v_d81136.dateInputActive
                  ]}>
                    <Text style={v_d81136.dateInputText}>{v_e065e5(v_331624)}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {}
              {v_2bd066 && v_fe02bb()}

              {}
              <View style={v_d81136.modalButtonContainer}>
                <TouchableOpacity
                  style={v_d81136.cancelButton}
                  onPress={() => v_2f9f74(false)}
                  activeOpacity={0.7}
                >
                  <Text style={v_d81136.cancelButtonText}>{v_8d41d7('screens.myinfoShopSales.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={v_d81136.applyButton}
                  onPress={v_16cc52}
                  activeOpacity={0.7}
                >
                  <Text style={v_d81136.applyButtonText}>{v_8d41d7('screens.myinfoShopSales.apply')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  content: {
    flex: 1,
    ...v_a61db3.scrollContent,
    paddingBottom: 0,
  },
  headerSearchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: '#e8f4fc',
    borderRadius: 12,
    padding: v_9b1a04.medium,
    marginBottom: v_9b1a04.small,
  },
  infoTitle: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoValue: {
    fontFamily: 'Roboto-Medium',
    color: '#333333',
  },
  infoHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#2196F3',
  },
  selectedPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: v_9b1a04.small,
    marginBottom: v_9b1a04.small,
  },
  selectedPeriodText: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyDescription: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: v_9b1a04.xlarge,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: v_9b1a04.xlarge,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: v_9b1a04.large,
  },
  periodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: v_9b1a04.large,
  },
  periodOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  periodOptionButtonActive: {
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderColor: v_1bfbd0.buttonPrimary,
  },
  periodOptionText: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  periodOptionTextActive: {
    color: '#ffffff',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: v_9b1a04.large,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
    marginBottom: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  dateInputActive: {
    borderColor: v_1bfbd0.buttonPrimary,
    backgroundColor: '#F0F4FF',
  },
  dateInputText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#333333',
  },
  dateSeparator: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Medium',
    color: '#999999',
    marginHorizontal: 12,
    marginBottom: 12,
  },

  calendarContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: v_9b1a04.medium,
    marginBottom: v_9b1a04.large,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: v_9b1a04.medium,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarHeaderText: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 4,
  },
  selectedDayCell: {
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  todayCell: {
    backgroundColor: '#E8F4FC',
  },
  dayText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
    lineHeight: 24,
  },
  selectedDayText: {
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  disabledDayText: {
    color: '#CCCCCC',
  },
  sundayText: {
    color: '#E53935',
  },
  saturdayText: {
    color: '#1E88E5',
  },
  calendarCloseButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  calendarCloseButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: v_1bfbd0.buttonPrimary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#ffffff',
  },
});
