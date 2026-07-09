import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae, v_298205, v_680bcc } from 'bapkr';
import {
  v_3094a2,
  v_122070,
  v_472849,
  v_39a996,
  v_7e4944,
  v_19b633,
  v_6c4f62,
} from 'rcmrninabrnb';
import { v_5b0045, v_ae32ae, v_029581 } from '../types';
import { v_1bfbd0, v_9b1a04, v_843035 } from '../constants';

export interface DataListProps<T> {

  fetchData: (params: v_5b0045) => Promise<v_ae32ae<T>>;

  ItemComponent: v_a3453e.ComponentType<T>;

  pageSize?: number;

  contentContainerStyle?: v_7e4944;

  keyExtractor?: (item: T, index: number) => string;

  onItemPress?: (item: T, index: number) => void;

  emptyMessage?: string;

  itemProps?: Record<string, any>;

  refreshing?: boolean;
  onRefresh?: () => void;
}

const v_2219b3 = <T extends Record<string, any>>(
  {
    fetchData: v_4fa913,
    ItemComponent: v_2d6b3c,
    pageSize: v_f70bce = 20,
    contentContainerStyle: v_9aecf5,
    keyExtractor: v_4c0e3e,
    onItemPress: v_659a80,
    emptyMessage: v_76ab9a,
    itemProps: v_bce170,
    refreshing: v_612e9f,
    onRefresh: v_d5345f,
  }: DataListProps<T>,
  ref: v_a3453e.Ref<v_029581>
) => {
  const [v_9390e8, v_d57c80] = v_5ab095<T[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(false);
  const [v_f34bc3, v_23061f] = v_5ab095(false);
  const [v_6bbe19, v_1454f0] = v_5ab095(true);
  const [v_5e9bfe, v_3a7d09] = v_5ab095<Error | null>(null);
  const [v_7815ff, v_be9dba] = v_5ab095(1);

  const v_af7f2d = v_e662ae<v_a3453e.ComponentType<T>>(v_2d6b3c);
  const v_99d34b = v_e662ae(v_4fa913);

  const v_fc9c2f = v_e662ae(false);

  const v_2772fb = v_e662ae(0);

  v_298205(v_6d4ed3, () => ({
    reloadData: () => {
      v_d57c80([]);
      v_be9dba(1);
      v_1454f0(true);
      v_3a7d09(null);
      v_5c29ab(1, true);
    },
  }));

  const v_5c29ab = async (v_2365e9, v_5b37d7 = false): Promise<void> => {

    if (!v_5b37d7 && v_f34bc3) {
      return Promise.resolve();
    }

    const v_e3a9db = v_2772fb.current + 1;
    v_2772fb.current = v_e3a9db;

    try {
      if (v_5b37d7) {
        v_34a50a(true);
      } else {
        v_23061f(true);
      }
      v_3a7d09(null);

      const v_3393e3 = await v_4fa913({ page: v_2365e9, pageSize: v_f70bce });

      if (v_2772fb.current !== v_e3a9db) {
        return;
      }

      if (v_5b37d7) {
        v_d57c80(v_3393e3.data);
      } else {
        v_d57c80((v_f1d8d1) => [...v_f1d8d1, ...v_3393e3.data]);
      }

      v_1454f0(v_3393e3.hasMore);
      v_be9dba(v_2365e9);
    } catch (v_49263d) {

      if (v_2772fb.current !== v_e3a9db) {
        return;
      }

      const v_5e9bfe = v_49263d instanceof Error ? v_49263d : new Error('데이터 로드 중 오류가 발생했습니다.');
      v_3a7d09(v_5e9bfe);
      console.error('DataList loadData error:', v_5e9bfe);
    } finally {

      if (v_2772fb.current === v_e3a9db) {
        if (v_5b37d7) {
          v_34a50a(false);
        } else {
          v_23061f(false);
        }
      }
    }
  };

  v_c4deb2(() => {
    const v_7e208d = v_af7f2d.current !== v_2d6b3c;
    const v_a2ef54 = v_99d34b.current !== v_4fa913;

    if (v_7e208d || v_a2ef54) {

      v_af7f2d.current = v_2d6b3c;
      v_99d34b.current = v_4fa913;

      v_d57c80([]);
      v_be9dba(1);
      v_1454f0(true);
      v_3a7d09(null);
      v_5c29ab(1, true);
    }
  }, [v_2d6b3c, v_4fa913]);

  v_c4deb2(() => {
    v_5c29ab(1, true);
  }, []);

  const v_98107c = () => {

    if (v_fc9c2f.current || v_683210 || v_f34bc3 || !v_6bbe19) {
      return;
    }

    v_fc9c2f.current = true;

    v_5c29ab(v_7815ff + 1, false).finally(() => {

      v_fc9c2f.current = false;
    });
  };

  const v_cefe14 = (v_8c0b26, v_a56041): string => {
    if (v_4c0e3e) {
      return v_4c0e3e(v_8c0b26, v_a56041);
    }

    return `item-${v_a56041}`;
  };

  const v_8e442f = (v_8c0b26, v_a56041) => {
    if (v_659a80) {
      v_659a80(v_8c0b26, v_a56041);
    }
  };

  return (
    <ScrollView
      style={v_d81136.container}
      contentContainerStyle={[
        v_d81136.contentContainer,
        { paddingVertical: Math.min(v_9b1a04.medium, 16) }, 
        v_9aecf5,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        v_d5345f ? (
          <RefreshControl
            refreshing={!!v_612e9f}
            onRefresh={v_d5345f}
            tintColor={v_1bfbd0.primary}
            colors={[v_1bfbd0.primary]}
            progressBackgroundColor="#ffffff"
            title="새로고침 중..."
            titleColor={v_1bfbd0.text}
          />
        ) : undefined
      }
      onScroll={({ nativeEvent: v_76b943 }) => {
        const { layoutMeasurement: v_6f469f, contentOffset: v_e29918, contentSize: v_d1b3ac } = v_76b943;

        const v_d361d7 = 100; 
        const v_c5846f = v_d1b3ac.height - (v_6f469f.height + v_e29918.y);

        if (v_c5846f <= v_d361d7) {
          v_98107c();
        }
      }}
      scrollEventThrottle={16}
    >
      {}
      {v_683210 && (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      )}

      {}
      {v_5e9bfe && !v_683210 && (
        <View style={v_d81136.errorContainer}>
          {}
        </View>
      )}

      {}
      {!v_683210 && (
        <>
          {v_9390e8.map((v_8c0b26, v_a56041) => {

            return (
              <View key={v_cefe14(v_8c0b26, v_a56041)}>
                <ItemComponent
                  {...v_8c0b26}
                  {...v_bce170}
                  {...(v_659a80 && {
                    onPress: () => v_8e442f(v_8c0b26, v_a56041),
                  })}
                />
              </View>
            );
          })}

          {}
          {v_f34bc3 && (
            <View style={v_d81136.loadingMoreContainer}>
              <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
            </View>
          )}

          {}
          {!v_6bbe19 && v_9390e8.length > 0 && (
            <View style={v_d81136.endContainer}>
              {}
            </View>
          )}

          {}
          {!v_6bbe19 && v_9390e8.length === 0 && !v_683210 && (
            <View style={v_d81136.emptyContainer}>
              {v_76ab9a && <Text style={v_d81136.emptyText}>{v_76ab9a}</Text>}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.xlarge,
  },
  loadingMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.medium,
  },
  errorContainer: {
    paddingVertical: v_9b1a04.medium,
  },
  endContainer: {
    paddingVertical: v_9b1a04.medium,
  },
  emptyContainer: {
    paddingVertical: v_9b1a04.xlarge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: v_843035.size.medium,
    color: '#888888',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});

export const v_60b263 = v_680bcc(v_2219b3) as <T extends Record<string, any>>(
  props: DataListProps<T> & { ref?: v_a3453e.Ref<v_029581> }
) => v_a3453e.ReactElement;

