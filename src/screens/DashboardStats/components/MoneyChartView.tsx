import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent } from "react-native";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Colors, Text, Title } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import type { RangeChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { useNumberFormatCurrency } from "utils/currency";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import type { RangeProps } from "../shared";

const styles = StyleSheet.create({
  statValue: {
    color: Colors.blue400,
    fontSize: 18,
    fontWeight: "bold",
  },
  titleWrap: {
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
    title: string;
  }
> = ({ range, setRange, data, total, title }) => {
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
      <View onLayout={onWidthLayout} style={styles.titleWrap}>
        <Title>{title}</Title>
        <Button
          icon="calendar-range"
          onPress={() => setVisiblePicker(true)}
          labelStyle={{ fontSize: 12 }}
        >
          {intlDtFormat.format(range.from)} - {intlDtFormat.format(range.to)}
        </Button>
      </View>
      <Text style={styles.statValue}>{numberFormatProfit.format(total)}</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width || Dimensions.get("window").width}
        height={320}
      >
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
