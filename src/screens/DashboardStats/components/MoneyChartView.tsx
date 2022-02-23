import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent } from "react-native";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Chip, Colors, Text, Title } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import type { RangeChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNumberFormatCurrency } from "utils/currency";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import type { RangeProps } from "../shared";

const styles = StyleSheet.create({
  diff: {
    borderRadius: 8,
  },
  diffText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  statValue: {
    color: Colors.blue400,
    fontSize: 18,
    fontWeight: "bold",
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

const profitFormatOptions: Intl.NumberFormatOptions = {
  notation: "compact",
  compactDisplay: "short",
};

const MoneyChartView: FC<
  RangeProps & {
    data: {
      from: number;
      to: number;
      value: number;
    }[];
    total: number;
    previousTotal: number;
    title: string;
  }
> = ({ range, setRange, data, total, previousTotal, title }) => {
  const { t, i18n } = useTranslation();

  const numberFormatProfit = useNumberFormatCurrency(profitFormatOptions);
  const [width, setWidth] = useState<undefined | number>(undefined);
  const onWidthLayout = useCallback(
    (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width),
    []
  );

  const [visiblePicker, setVisiblePicker] = useState(false);
  const onDatePickerConfirm: RangeChange = ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    setVisiblePicker(false);
    setRange({ from: startDate, to: endDate });
  };

  const intlDtFormat = useMemo(
    () => Intl.DateTimeFormat(i18n.language),
    [i18n.language]
  );

  const intlNumFormat = useMemo(
    () =>
      Intl.NumberFormat(i18n.language, {
        notation: "compact",
      }),
    [i18n.language]
  );

  const diffPerc = useMemo(() => {
    if (previousTotal === 0) return 1;
    return (total - previousTotal) / previousTotal;
  }, [total, previousTotal]);

  return (
    <>
      <DatePickerModal
        locale="en"
        mode="range"
        visible={visiblePicker}
        onDismiss={() => setVisiblePicker(false)}
        startDate={range.from}
        endDate={range.to}
        onConfirm={onDatePickerConfirm}
        saveLabel={t("action.save")}
        startLabel={t("time.start")}
        endLabel={t("time.end")}
        label={t("time.select_period")}
      />
      <Button
        mode="outlined"
        icon="calendar-range"
        onPress={() => setVisiblePicker(true)}
        labelStyle={{ fontSize: 12 }}
      >
        {intlDtFormat.format(range.from)} - {intlDtFormat.format(range.to)}
      </Button>
      <View onLayout={onWidthLayout} style={styles.wrap}>
        <Title>{title}</Title>
      </View>
      <View style={styles.wrap}>
        <Text style={styles.statValue}>{numberFormatProfit.format(total)}</Text>
        <Chip
          icon={() => (
            <Icon
              name={diffPerc >= 0 ? "arrow-up" : "arrow-down"}
              size={16}
              color={Colors.white}
            />
          )}
          textStyle={styles.diffText}
          style={[
            styles.diff,
            {
              backgroundColor:
                diffPerc > 0
                  ? Colors.green400
                  : diffPerc < 0
                  ? Colors.red400
                  : Colors.grey400,
            },
          ]}
        >
          {(diffPerc * 100).toFixed(2)}%
        </Chip>
      </View>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width || Dimensions.get("window").width - 64}
        height={320}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(v) => intlNumFormat.format(v)}
        />
        <VictoryLine
          data={data}
          interpolation="natural"
          x="from"
          y="value"
          scale={{ x: "time", y: "linear" }}
        />
      </VictoryChart>
    </>
  );
};

export default MoneyChartView;
