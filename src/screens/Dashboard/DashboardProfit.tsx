import { StackScreenProps } from "@react-navigation/stack";
import { FC, useCallback, useMemo, useState } from "react";
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
import type { RangeChange } from "react-native-paper-dates/lib/typescript/src/Date/Calendar";
import { ParamList, RouteName } from "screens/types";
import {
  OrderProductsStats,
  useOrderProductsStatsQuery,
  useProfitQuery,
} from "services/calculate";
import { useProductQuery } from "services/product/api";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  dateButton: {
    marginBottom: 12,
  },
  list: {
    flex: 1,
    marginTop: 16,
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
  listProfit: {
    color: Colors.green400,
    textAlign: "center",
  },
  listProfitWidth: {
    width: 76,
  },
  listRank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listSide: {
    justifyContent: "center",
  },
  stat: {
    padding: 12,
  },
  statLabel: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 0,
  },
  statValue: {
    color: Colors.blue400,
    fontSize: 40,
    fontWeight: "bold",
  },
});

const OrderProductStatItem: FC<{ stats: OrderProductsStats; index: number }> =
  ({ stats, index }) => {
    const { data: product } = useProductQuery(stats.product_id);
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
              <Text style={styles.listProfit}>{stats.profit}</Text>
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

  const { data: profit } = useProfitQuery(
    range.startDate.getTime(),
    range.endDate.getTime()
  );

  const { data: orderProductsStats } = useOrderProductsStatsQuery(
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

  const openDatePicker = useCallback(() => setOpenDate(true), []);
  const closeDatePicker = useCallback(() => setOpenDate(false), []);
  const onDatePickerConfirm = useCallback<RangeChange>(
    ({ startDate, endDate }) => {
      if (!startDate || !endDate) return;
      setOpenDate(false);
      setRange({ startDate, endDate });
    },
    []
  );

  return (
    <View style={screenStyles.content}>
      <Button
        mode="contained"
        icon="calendar-range"
        onPress={openDatePicker}
        style={styles.dateButton}
      >
        {intlDtFormat.format(range.startDate)} -{" "}
        {intlDtFormat.format(range.endDate)}
      </Button>
      <DatePickerModal
        mode="range"
        visible={openDate}
        onDismiss={closeDatePicker}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onDatePickerConfirm}
        locale={i18n.language}
        saveLabel={t("action.save")}
        startLabel={t("time.start")}
        endLabel={t("time.end")}
        label={t("time.select_period")}
      />
      <Card style={styles.stat}>
        <Text style={styles.statLabel}>{t("stats.profit")}</Text>
        <Text style={styles.statValue}>{profit}</Text>
      </Card>
      <FlatList
        style={styles.list}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View>
            <Title>{t("stats.top_products")}</Title>
            <View style={styles.listColHead}>
              <Caption style={[styles.listAmountWidth, styles.listColHeadText]}>
                {t("order.amount")}
              </Caption>
              <Caption style={[styles.listProfitWidth, styles.listColHeadText]}>
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
