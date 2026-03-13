import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Text,
} from 'react-native';
import { PaginationParams, PaginationResponse, DataListRef } from '../types';
import { COLORS, SIZES, FONTS } from '../constants';

export interface DataListProps<T> {

  fetchData: (params: PaginationParams) => Promise<PaginationResponse<T>>;

  ItemComponent: React.ComponentType<T>;

  pageSize?: number;

  contentContainerStyle?: ViewStyle;

  keyExtractor?: (item: T, index: number) => string;

  onItemPress?: (item: T, index: number) => void;

  emptyMessage?: string;

  itemProps?: Record<string, any>;
}

const DataListComponent = <T extends Record<string, any>>(
  {
    fetchData,
    ItemComponent,
    pageSize = 20,
    contentContainerStyle,
    keyExtractor,
    onItemPress,
    emptyMessage,
    itemProps,
  }: DataListProps<T>,
  ref: React.Ref<DataListRef>
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const prevItemComponentRef = useRef<React.ComponentType<T>>(ItemComponent);
  const prevFetchDataRef = useRef(fetchData);

  const isEndReachedLoadingRef = useRef(false);

  const fetchIdRef = useRef(0);

  useImperativeHandle(ref, () => ({
    reloadData: () => {
      setData([]);
      setCurrentPage(1);
      setHasMore(true);
      setError(null);
      loadData(1, true);
    },
  }));

  const loadData = async (page: number, isReload: boolean = false): Promise<void> => {

    if (!isReload && loadingMore) {
      return Promise.resolve();
    }

    const currentFetchId = fetchIdRef.current + 1;
    fetchIdRef.current = currentFetchId;

    try {
      if (isReload) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await fetchData({ page, pageSize });

      if (fetchIdRef.current !== currentFetchId) {
        return;
      }

      if (isReload) {
        setData(response.data);
      } else {
        setData((prevData) => [...prevData, ...response.data]);
      }

      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err) {

      if (fetchIdRef.current !== currentFetchId) {
        return;
      }

      const error = err instanceof Error ? err : new Error('데이터 로드 중 오류가 발생했습니다.');
      setError(error);
      console.error('DataList loadData error:', error);
    } finally {

      if (fetchIdRef.current === currentFetchId) {
        if (isReload) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    }
  };

  useEffect(() => {
    const itemComponentChanged = prevItemComponentRef.current !== ItemComponent;
    const fetchDataChanged = prevFetchDataRef.current !== fetchData;

    if (itemComponentChanged || fetchDataChanged) {

      prevItemComponentRef.current = ItemComponent;
      prevFetchDataRef.current = fetchData;

      setData([]);
      setCurrentPage(1);
      setHasMore(true);
      setError(null);
      loadData(1, true);
    }
  }, [ItemComponent, fetchData]);

  useEffect(() => {
    loadData(1, true);
  }, []);

  const handleEndReached = () => {

    if (isEndReachedLoadingRef.current || loading || loadingMore || !hasMore) {
      return;
    }

    isEndReachedLoadingRef.current = true;

    loadData(currentPage + 1, false).finally(() => {

      isEndReachedLoadingRef.current = false;
    });
  };

  const getKey = (item: T, index: number): string => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }

    return `item-${index}`;
  };

  const handleItemPress = (item: T, index: number) => {
    if (onItemPress) {
      onItemPress(item, index);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingVertical: Math.min(SIZES.medium, 16) }, 
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

        const threshold = 100; 
        const distanceFromEnd = contentSize.height - (layoutMeasurement.height + contentOffset.y);

        if (distanceFromEnd <= threshold) {
          handleEndReached();
        }
      }}
      scrollEventThrottle={16}
    >
      {}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      )}

      {}
      {error && !loading && (
        <View style={styles.errorContainer}>
          {}
        </View>
      )}

      {}
      {!loading && (
        <>
          {data.map((item, index) => {

            return (
              <View key={getKey(item, index)}>
                <ItemComponent
                  {...item}
                  {...itemProps}
                  {...(onItemPress && {
                    onPress: () => handleItemPress(item, index),
                  })}
                />
              </View>
            );
          })}

          {}
          {loadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          )}

          {}
          {!hasMore && data.length > 0 && (
            <View style={styles.endContainer}>
              {}
            </View>
          )}

          {}
          {!hasMore && data.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              {emptyMessage && <Text style={styles.emptyText}>{emptyMessage}</Text>}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: SIZES.xlarge,
  },
  loadingMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
  },
  errorContainer: {
    paddingVertical: SIZES.medium,
  },
  endContainer: {
    paddingVertical: SIZES.medium,
  },
  emptyContainer: {
    paddingVertical: SIZES.xlarge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.medium,
    color: '#888888',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});

export const DataList = forwardRef(DataListComponent) as <T extends Record<string, any>>(
  props: DataListProps<T> & { ref?: React.Ref<DataListRef> }
) => React.ReactElement;

