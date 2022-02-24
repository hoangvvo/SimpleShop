import type { FC, ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Caption,
  Colors,
  Divider,
  List,
  Text,
} from "react-native-paper";
import type { OrderProductsStats } from "services/calculate";
import { useOrderProductsStatsQuery } from "services/calculate";
import { useProductQuery } from "services/product";
import { useNumberFormatCurrency } from "utils/currency";
import { calcProfit } from "utils/number";

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listAmount: {
    color: Colors.blue400,
    textAlign: "center",
  },
  listAmountWidth: {
    width: 48,
  },
  listColHead: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  listColHeadText: {
    fontWeight: "bold",
    lineHeight: 12,
    textAlign: "center",
    textAlignVertical: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listHeader: {
    marginTop: 16,
  },
  listProfit: {
    color: Colors.green400,
    textAlign: "center",
  },
  listProfitWidth: {
    width: 88,
  },
  listRank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listSide: {
    justifyContent: "center",
  },
});

const OrderProductStatItem: FC<{
  stats: OrderProductsStats;
  index: number;
  property: "profit" | "revenue";
}> = ({ stats, index, property }) => {
  const { data: product } = useProductQuery(stats.product_id);
  const numberFormatProfit = useNumberFormatCurrency();

  const val = property === "revenue" ? stats.revenue : calcProfit(stats);

  return (
    <List.Item
      left={({ style }) => (
        <View style={[styles.listSide, style]}>
          <Caption style={styles.listRank}>#{index + 1}</Caption>
        </View>
      )}
      title={<Text>{product?.name}</Text>}
      descriptionNumberOfLines={1}
      right={({ style }) => (
        <>
          <View style={[styles.listSide, styles.listAmountWidth, style]}>
            <Text style={styles.listAmount}>{stats.amount}</Text>
          </View>
          <View style={[styles.listSide, styles.listProfitWidth, style]}>
            <Text style={styles.listProfit}>
              {numberFormatProfit.format(val)}
            </Text>
          </View>
        </>
      )}
    />
  );
};

const ProductRankList: FC<{
  property: "profit" | "revenue";
  range: {
    from: Date;
    to: Date;
  };
  ListHeaderNode: ReactNode;
}> = ({ property, range, ListHeaderNode }) => {
  const { t } = useTranslation();

  const { data: orderProductsStats, isLoading } = useOrderProductsStatsQuery(
    range.from.getTime(),
    range.to.getTime()
  );

  const sortedOrderProductsStats = useMemo(
    () =>
      orderProductsStats
        ? [...orderProductsStats].sort((a, b) => calcProfit(b) - calcProfit(a))
        : undefined,
    [orderProductsStats]
  );

  const renderItem = useCallback<ListRenderItem<OrderProductsStats>>(
    ({ item, index }) => (
      <OrderProductStatItem
        key={item.product_id}
        property={property}
        stats={item}
        index={index}
      />
    ),
    [property]
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={isLoading ? <ActivityIndicator /> : null}
      ListHeaderComponent={
        <>
          {ListHeaderNode}
          <View style={styles.listHeader}>
            <View style={styles.listColHead}>
              <Caption style={[styles.listAmountWidth, styles.listColHeadText]}>
                {t("order.amount")}
              </Caption>
              <Caption style={[styles.listProfitWidth, styles.listColHeadText]}>
                {t(`stats.${property}`)}
              </Caption>
            </View>
          </View>
        </>
      }
      ItemSeparatorComponent={Divider}
      data={sortedOrderProductsStats}
      renderItem={renderItem}
    />
  );
};

export default ProductRankList;
