import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { Card, Colors, List, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteName } from "screens/types";
import type { Order } from "services/order";

const styles = StyleSheet.create({
  listOpaque: {
    opacity: 0.4,
  },
  listSide: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  listStatuses: {
    justifyContent: "center",
    marginLeft: 4,
    paddingHorizontal: 2,
  },
  typeTag: {
    borderRadius: 2,
    justifyContent: "center",
    marginRight: 4,
    width: 8,
  },
});

const colorBuy = Colors.red400;
const colorSell = Colors.green400;

const openInMap = (q: string) => {
  const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
  Linking.openURL(`${scheme}${q}`);
};

const OrderItem: FC<{ order: Order & { customer_name?: string } }> = ({
  order,
}) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const dtStr = useMemo(() => {
    return new Intl.DateTimeFormat(i18n.language).format(order.created_at);
  }, [i18n.language, order.created_at]);

  const onEdit = () =>
    navigation.navigate(RouteName.OrderEditor, {
      id: order.id,
      isBuyOrder: false,
    });

  const openMap = useCallback(() => {
    if (order.loc_text) openInMap(order.loc_text);
  }, [order.loc_text]);

  const listRight = useCallback(
    () => (
      <View style={styles.listSide}>
        {Boolean(order.loc_text) && (
          <Card
            style={styles.listStatuses}
            mode="outlined"
            accessibilityLabel={t("order.loc_text")}
            onPress={openMap}
          >
            <Icon
              color={Colors.blue400}
              style={{ marginTop: 12 }}
              name="map"
              size={24}
            />
          </Card>
        )}
        <Card
          mode="outlined"
          style={[styles.listStatuses, { backgroundColor: Colors.transparent }]}
        >
          <Icon
            name="cash"
            accessibilityLabel={`${t("order.has_paid")}: ${
              order.has_paid ? t("action.yes") : t("action.no")
            }`}
            color={order.has_paid ? Colors.green400 : Colors.blueGrey100}
            size={24}
          />
          <Icon
            name="truck-delivery"
            accessibilityLabel={`${t("order.has_delivered")}: ${
              order.has_delivered ? t("action.yes") : t("action.no")
            }`}
            color={order.has_delivered ? Colors.green400 : Colors.blueGrey100}
            size={24}
          />
        </Card>
      </View>
    ),
    [t, order, openMap]
  );
  const listLeft = useCallback(
    () => (
      <View
        style={[
          styles.typeTag,
          {
            backgroundColor: order.is_buy_order ? colorBuy : colorSell,
          },
        ]}
        accessibilityLabel={
          order.is_buy_order ? t("order.buy") : t("order.sell")
        }
      />
    ),
    [t, order.is_buy_order]
  );

  const theme = useTheme();

  return (
    <List.Item
      style={
        order.has_delivered && order.has_paid ? styles.listOpaque : undefined
      }
      title={
        order.customer_name
          ? order.customer_name
          : t("order.order_number_num", { id: order.id })
      }
      titleStyle={
        order.customer_name ? { color: theme.colors.primary } : undefined
      }
      description={`${dtStr} ${order.loc_text ? `• ${order.loc_text}` : ""}`}
      left={listLeft}
      right={listRight}
      onPress={onEdit}
      titleNumberOfLines={1}
      descriptionNumberOfLines={1}
    />
  );
};

export default OrderItem;
