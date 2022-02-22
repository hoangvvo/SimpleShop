import { LoadingScreen } from "components/Loading";
import { toast } from "components/Toast";
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { OrderProduct, OrderProductWithoutOrderId } from "services/order/types";
import { Product } from "services/product";
import { useProductsQuery } from "services/product/api";
import { useNumberFormatCurrency } from "utils/currency";
import { isNumeric } from "utils/number";

const styles = StyleSheet.create({
  inputAmount: {
    width: 80,
  },
  inputPerPrice: {
    marginRight: 12,
    width: 120,
  },
  list: {
    flex: 1,
  },
  totalContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  btnDone: {
    width: "100%",
  },
});

type OrderProductMap = Map<Product["id"], OrderProductWithoutOrderId>;
type FormMapRef = Map<
  Product["id"],
  UseFormReturn<Pick<OrderProduct, "per_price" | "amount">>
>;

const rules = {
  amount: {
    required: true,
    min: 0,
    max: 1000000,
    validate: (v: number) => isNumeric(v) && Number.isInteger(Number(v)),
  },
  perPrice: {
    required: true,
    min: 0,
    max: 1000000000,
    validate: isNumeric,
  },
};

const ProductItem: FC<{
  product: Product;
  orderProductMapRef: MutableRefObject<OrderProductMap>;
  formMapRef: MutableRefObject<FormMapRef>;
  isBuyOrder: boolean;
}> = ({ product, orderProductMapRef, formMapRef, isBuyOrder }) => {
  const { t } = useTranslation();

  const form = useForm<Pick<OrderProduct, "per_price" | "amount">>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const formMapRefValue = formMapRef.current;
    formMapRefValue.set(product.id, form);
    return () => {
      formMapRefValue.delete(product.id);
    };
  }, [form, formMapRef, product.id]);

  const { control, setValue } = form;

  useEffect(() => {
    const orderProduct = orderProductMapRef.current.get(product.id);
    if (!orderProduct) return;
    setValue("per_price", orderProduct.per_price);
    setValue("amount", orderProduct.amount);
  }, [orderProductMapRef, product.id, setValue]);

  const listRight = useCallback(
    () => (
      <>
        <Controller
          control={control}
          name="per_price"
          rules={rules.perPrice}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { invalid },
          }) => (
            <TextInput
              style={styles.inputPerPrice}
              label={t("order.per_price")}
              dense
              mode="outlined"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              error={invalid}
            />
          )}
          defaultValue={
            isBuyOrder ? product.default_buy_price : product.default_sell_price
          }
        />
        <Controller
          control={control}
          name="amount"
          rules={rules.amount}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { invalid },
          }) => (
            <TextInput
              style={styles.inputAmount}
              label={t("order.amount")}
              dense
              mode="outlined"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              error={invalid}
            />
          )}
          defaultValue={0}
        />
      </>
    ),
    [control, isBuyOrder, product, t]
  );

  return <List.Item title={product.name} right={listRight} />;
};

const keyExtractor = (item: Product) => String(item.id);

export const OrderProductEditor: FC<{
  isBuyOrder: boolean;
  orderProducts: OrderProductWithoutOrderId[];
  setOrderProducts: Dispatch<SetStateAction<OrderProductWithoutOrderId[]>>;
}> = ({ orderProducts, setOrderProducts, isBuyOrder }) => {
  const { t } = useTranslation();

  const totalPrice = useMemo(() => {
    let total = 0;
    for (const orderProduct of orderProducts) {
      total += orderProduct.amount * orderProduct.per_price;
    }
    return total;
  }, [orderProducts]);

  const { data: dataProducts, status: statusGetProducts } = useProductsQuery();

  const formMapRef = useRef<FormMapRef>(new Map());

  // A map used for initial values
  const orderProductMapRef = useRef<OrderProductMap>(new Map());
  useEffect(() => {
    orderProductMapRef.current.clear();
    for (const orderProduct of orderProducts) {
      orderProductMapRef.current.set(orderProduct.product_id, orderProduct);
    }
  }, [orderProducts]);

  const onDone = () => {
    const values: OrderProductWithoutOrderId[] = [];
    for (const [productId, formRef] of formMapRef.current) {
      if (Object.keys(formRef.formState.errors).length > 0) {
        toast.error(t("form.form_is_invalid"));
        return;
      }
      const formValues = formRef.getValues();
      const amount = Number(formValues.amount);
      const perPrice = Number(formValues.per_price);
      values.push({
        amount,
        per_price: perPrice,
        product_id: productId,
      });
    }
    setOrderProducts(values);
    setVisible(false);
  };

  const [visible, setVisible] = useState(false);

  const presentList = () => setVisible(true);

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => {
      return (
        <ProductItem
          product={item}
          formMapRef={formMapRef}
          orderProductMapRef={orderProductMapRef}
          isBuyOrder={isBuyOrder}
        />
      );
    },
    [isBuyOrder]
  );

  const theme = useTheme();

  const numberFormatProfit = useNumberFormatCurrency();

  return (
    <>
      <Surface
        style={[styles.totalContainer, { borderColor: theme.colors.surface }]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{t("order.total")}</Text>
          <Text style={styles.totalText}>
            {numberFormatProfit.format(totalPrice)}
          </Text>
        </View>
        <Button mode="outlined" icon="pencil" onPress={presentList}>
          {t("order_editor.product_list")}
        </Button>
      </Surface>
      <Portal>
        <Dialog
          style={StyleSheet.absoluteFill}
          visible={visible}
          onDismiss={onDone}
        >
          <FlatList
            style={styles.list}
            ItemSeparatorComponent={Divider}
            data={dataProducts || []}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              statusGetProducts === "loading" ? <LoadingScreen /> : null
            }
          />
          <Dialog.Actions>
            <Button mode="text" onPress={onDone} style={styles.btnDone}>
              {t("action.done")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
