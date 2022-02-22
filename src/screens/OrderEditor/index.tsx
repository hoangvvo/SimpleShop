import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadingScreen } from "components/Loading";
import { toast } from "components/Toast";
import type { FC } from "react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar } from "react-native-paper";
import type { ParamList, RouteName } from "screens/types";
import type { Order } from "services/order";
import {
  useOrderCreateMutation,
  useOrderQuery,
  useOrderUpdateMutation,
} from "services/order";
import type { OrderProductWithoutOrderId } from "services/order/types";
import { styles as screenStyles } from "styles/screens";
import { OrderDelete } from "./components/OrderDelete";
import { OrderProductEditor } from "./components/OrderProductEditor";
import { OrderDetailEditor } from "./components/OrdersDetailEditor";

const OrderEditorScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.OrderEditor>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<
    Omit<Order, "id" | "created_at" | "is_buy_order">
  >({});
  const editingId = route.params?.id;

  const [isBuyOrder, setIsBuyOrder] = useState(false);

  const [orderProducts, setOrderProducts] = useState<
    OrderProductWithoutOrderId[]
  >([]);

  const { mutate: mutateCreate, status: statusCreate } = useOrderCreateMutation(
    {
      onSuccess() {
        toast.success(
          t("entity.has_been_created", { name: t("order.title_one") })
        );
        navigation.goBack();
      },
      onError(e) {
        toast.error(e.message);
      },
    }
  );

  const { mutate: mutateEdit, status: statusEdit } = useOrderUpdateMutation({
    onSuccess() {
      toast.success(
        t("entity.has_been_updated", { name: t("order.title_one") })
      );
      navigation.goBack();
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  const onSubmit = useMemo(
    () =>
      handleSubmit((data) => {
        if (orderProducts.reduce((prev, curr) => prev + curr.amount, 0) <= 0) {
          return toast.error(t("order_editor.order_no_products"));
        }
        if (editingId) {
          mutateEdit({
            id: editingId,
            ...data,
            order_products: orderProducts,
          });
        } else {
          mutateCreate({
            is_buy_order: isBuyOrder,
            ...data,
            order_products: orderProducts,
          });
        }
      }),
    [
      t,
      handleSubmit,
      mutateCreate,
      mutateEdit,
      editingId,
      isBuyOrder,
      orderProducts,
    ]
  );

  const { data: editingOrder, status: statusGetEdit } = useOrderQuery(
    editingId || -1
  );

  useEffect(() => {
    if (!editingOrder) setIsBuyOrder(route.params.isBuyOrder);
  }, [route, editingOrder]);

  useEffect(() => {
    if (editingOrder) {
      setIsBuyOrder(editingOrder.is_buy_order);
      setValue("loc_text", editingOrder.loc_text);
      setValue("note", editingOrder.note);
      setValue("has_paid", editingOrder.has_paid);
      setValue("has_delivered", editingOrder.has_delivered);
      setOrderProducts(editingOrder.orderProducts);
    }
  }, [editingOrder, setValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${
        editingId
          ? t("order_editor.title_edit")
          : t("order_editor.title_create")
      } (${isBuyOrder ? t("order.buy") : t("order.sell")})`,
    });
  }, [navigation, editingId, t, isBuyOrder]);

  const disableEditing = statusCreate === "loading" || statusEdit === "loading";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <Appbar.Action
            icon="check"
            onPress={onSubmit}
            disabled={disableEditing}
            accessibilityLabel={
              editingId ? t("entity.update") : t("entity.create")
            }
          />
        );
      },
    });
  }, [editingId, navigation, t, disableEditing, onSubmit]);

  return statusGetEdit === "loading" ? (
    <LoadingScreen />
  ) : (
    <View style={screenStyles.root}>
      <ScrollView style={screenStyles.content}>
        <OrderDetailEditor
          control={control}
          disableEditing={disableEditing}
          isBuyOrder={isBuyOrder}
        />
        {editingOrder && <OrderDelete order={editingOrder} />}
      </ScrollView>
      <OrderProductEditor
        orderProducts={orderProducts}
        setOrderProducts={setOrderProducts}
        isBuyOrder={isBuyOrder}
      />
    </View>
  );
};

export default OrderEditorScreen;
