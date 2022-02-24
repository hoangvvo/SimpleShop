import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import OrderItem from "screens/Orders/components/OrderItem";
import type { Customer } from "services/customer";
import type { Order } from "services/order";
import { useOrdersQueryByCustomerId } from "services/order";

const renderItem: ListRenderItem<Order> = ({ item }) => (
  <OrderItem key={item.id} order={item} />
);
const CustomerOrders: FC<{ customer: Customer }> = ({ customer }) => {
  const { t } = useTranslation();
  const { data } = useOrdersQueryByCustomerId(customer.id);

  return (
    <>
      <List.Subheader>{t("order.title_one")}</List.Subheader>
      <FlatList renderItem={renderItem} data={data} />
    </>
  );
};

export default CustomerOrders;
