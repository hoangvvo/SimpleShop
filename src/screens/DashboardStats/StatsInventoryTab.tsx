import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Caption,
  Card,
  Colors,
  Divider,
  List,
  Text,
} from "react-native-paper";
import type { ProductInventoryStat } from "services/calculate";
import { useInventoryCostsQuery } from "services/calculate";
import { useProductQuery } from "services/product";
import { useNumberFormatCurrency } from "utils/currency";

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  listAmount: {
    color: Colors.blue400,
    textAlign: "center",
  },
  listAmountWidth: {
    width: 64,
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
  listCost: {
    color: Colors.blue400,
    textAlign: "center",
  },
  listCostWidth: {
    width: 96,
  },
  listHeader: {
    marginTop: 16,
  },
  listRank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listSide: {
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

const ProductInventoryItem: FC<{
  stat: ProductInventoryStat;
  index: number;
}> = ({ stat, index }) => {
  const { data: product } = useProductQuery(stat.product_id);
  const numberFormatProfit = useNumberFormatCurrency();

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
            <Text style={styles.listAmount}>{stat.inventory}</Text>
          </View>
          <View style={[styles.listSide, styles.listCostWidth, style]}>
            <Text style={styles.listCost}>
              {numberFormatProfit.format(stat.cost)}
            </Text>
          </View>
        </>
      )}
    />
  );
};

const renderItem: ListRenderItem<ProductInventoryStat> = ({ item, index }) => (
  <ProductInventoryItem key={item.product_id} index={index} stat={item} />
);

const StatsInventoryTab: FC = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useInventoryCostsQuery();

  const sortedData = useMemo(
    () => [...(data || [])].sort((a, b) => b.cost - a.cost),
    [data]
  );

  const total = useMemo(
    () => data?.reduce((prev: number = 0, curr) => prev + curr.cost, 0),
    [data]
  );
  const numberFormatProfit = useNumberFormatCurrency();

  return (
    <View style={styles.fill}>
      <FlatList
        style={styles.fill}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : null}
        ListHeaderComponent={
          <>
            <View style={styles.listHeader}>
              <View style={styles.listColHead}>
                <Caption
                  style={[styles.listAmountWidth, styles.listColHeadText]}
                >
                  {t("product.stock")}
                </Caption>
                <Caption style={[styles.listCostWidth, styles.listColHeadText]}>
                  {t(`stats.cost`)}
                </Caption>
              </View>
            </View>
          </>
        }
        ItemSeparatorComponent={Divider}
        data={sortedData}
        renderItem={renderItem}
      />
      <Card>
        <Card.Content style={styles.totalRow}>
          <Text style={styles.totalText}>{t("order.total")}</Text>
          <Text style={styles.totalText}>
            {numberFormatProfit.format(total || 0)}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default StatsInventoryTab;
