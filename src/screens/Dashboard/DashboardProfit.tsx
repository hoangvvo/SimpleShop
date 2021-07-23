import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import {
  Button,
  Caption,
  Card,
  Colors,
  Divider,
  List,
  Text,
  Title,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { ParamList, RouteName } from "screens/types";
import {
  OrderProductsStats,
  useOrderProductsStats,
  useProfit,
} from "services/calculate";
import { useProductQuery } from "services/product/api";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  dateButton: {
    marginBottom: 12,
  },
  statsHeader: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 0,
  },
  statsValue: {
    fontSize: 40,
    color: Colors.blue400,
    fontWeight: "bold",
  },
  stat: {
    padding: 12,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  statRank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statProfit: {
    color: Colors.green400,
    textAlign: "center",
  },
  statProfitWidth: {
    width: 76,
  },
  statAmount: {
    textAlign: "center",
    color: Colors.blue400,
  },
  statAmountWidth: {
    width: 48,
  },
  statHeaderText: {
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 12,
    textAlignVertical: "center",
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  listCenter: {
    justifyContent: "center",
  },
});

const OrderProductStatItem: FC<{ stats: OrderProductsStats; index: number }> =
  ({ stats, index }) => {
    const { data: product } = useProductQuery(stats.product_id);
    return (
      <List.Item
        left={({ style }) => (
          <View style={[styles.listCenter, style]}>
            <Caption style={styles.statRank}>#{index + 1}</Caption>
          </View>
        )}
        title={<Text>{product?.name}</Text>}
        descriptionNumberOfLines={1}
        right={({ style }) => (
          <>
            <View style={[styles.listCenter, styles.statAmountWidth, style]}>
              <Text style={styles.statAmount}>{stats.amount}</Text>
            </View>
            <View style={[styles.listCenter, styles.statProfitWidth, style]}>
              <Text style={styles.statProfit}>{stats.profit}</Text>
            </View>
          </>
        )}
      />
    );
  };

const renderItem: ListRenderItem<OrderProductsStats> = ({ item, index }) => (
  <OrderProductStatItem stats={item} index={index} />
);

const keyExtractor = (item: OrderProductsStats) => String(item.product_id);

const todayRangeInit = () => {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59);
  return { startDate, endDate };
};

export const DashboardProfitScreen: FC<
  StackScreenProps<ParamList, RouteName.DashboardProfit>
> = () => {
  const [range, setRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>(todayRangeInit);

  const { t, i18n } = useTranslation();

  const intlDtFormat = useMemo(
    () => Intl.DateTimeFormat(i18n.language),
    [i18n.language]
  );

  const [openDate, setOpenDate] = useState(false);

  const { data: profit } = useProfit(
    range.startDate.getTime(),
    range.endDate.getTime()
  );

  const { data: orderProductsStats } = useOrderProductsStats(
    range.startDate.getTime(),
    range.endDate.getTime()
  );

  const sortedOrderProductsStats = useMemo(
    () =>
      orderProductsStats
        ? [...orderProductsStats].sort((a, b) => b.profit - a.profit)
        : undefined,
    [orderProductsStats]
  );

  return (
    <View style={screenStyles.content}>
      <Button
        mode="contained"
        icon="calendar-range"
        onPress={() => setOpenDate(true)}
        style={styles.dateButton}
      >
        {intlDtFormat.format(range.startDate)} -{" "}
        {intlDtFormat.format(range.endDate)}
      </Button>
      <DatePickerModal
        mode="range"
        visible={openDate}
        onDismiss={() => setOpenDate(false)}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={({ startDate, endDate }) => {
          if (!startDate || !endDate) return;
          setOpenDate(false);
          setRange({ startDate, endDate });
        }}
        locale={i18n.language}
        saveLabel={t("action.save")}
        startLabel={t("time.start")}
        endLabel={t("time.end")}
        label={t("time.select_period")}
      />
      <Card style={styles.stat}>
        <Text style={styles.statsHeader}>{t("stats.profit")}</Text>
        <Text style={styles.statsValue}>{profit}</Text>
      </Card>
      <FlatList
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Title>{t("stats.top_products")}</Title>
            <View style={styles.statHeader}>
              <Caption style={[styles.statAmountWidth, styles.statHeaderText]}>
                {t("order.amount")}
              </Caption>
              <Caption style={[styles.statProfitWidth, styles.statHeaderText]}>
                {t("stats.profit")}
              </Caption>
            </View>
          </View>
        }
        ItemSeparatorComponent={Divider}
        data={sortedOrderProductsStats}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};
