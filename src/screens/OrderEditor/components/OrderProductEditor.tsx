import { LoadingScreen } from "components/Loading";
import { toast } from "components/Toast";
import Fuse from "fuse.js";
import type { Dispatch, FC, MutableRefObject, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  Searchbar,
  Surface,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import type {
  OrderProduct,
  OrderProductWithoutOrderId,
} from "services/order/types";
import type { Product } from "services/product";
import { useProductsQuery } from "services/product";
import { useNumberFormatCurrency } from "utils/currency";
import { isNumeric } from "utils/number";

const styles = StyleSheet.create({
  btnDone: {
    width: "100%",
  },
  empty: {
    opacity: 0.7,
    padding: 18,
  },
  emptyText: {
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  inputAmount: {
    width: 60,
  },
  inputPerPrice: {
    marginRight: 12,
    width: 100,
  },
  list: {
    flex: 1,
  },
  listItem: {
    height: 64,
  },
  searchbar: {
    margin: 10,
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
});

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
  isBuyOrder: boolean;
  orderProduct: OrderProductWithoutOrderId | null | undefined;
  setOrderProducts: Dispatch<SetStateAction<OrderProductWithoutOrderId[]>>;
  formMapRef: MutableRefObject<Map<number, boolean>>;
}> = ({ product, isBuyOrder, orderProduct, setOrderProducts, formMapRef }) => {
  const { t } = useTranslation();

  const form = useForm<Pick<OrderProduct, "per_price" | "amount">>({
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const {
    control,
    formState: { errors },
    getFieldState,
  } = form;

  const updateFormState = useCallback(() => {
    formMapRef.current.set(
      product.id,
      Boolean(errors.amount || errors.per_price)
    );
  }, [errors, product.id, formMapRef]);

  const perPrice = Number(useWatch({ control, name: "per_price" }));
  useEffect(() => {
    const perPriceState = getFieldState("per_price");
    if (perPriceState.isDirty && !perPriceState.invalid) {
      setOrderProducts((ops) =>
        Array.from(ops).map((op) =>
          op.product_id === product.id ? { ...op, per_price: perPrice } : op
        )
      );
    }
    updateFormState();
  }, [
    perPrice,
    getFieldState,
    setOrderProducts,
    product.id,
    formMapRef,
    updateFormState,
  ]);
  const amount = Number(useWatch({ control, name: "amount" }));
  useEffect(() => {
    const amountState = getFieldState("amount");
    if (amountState.isDirty && !amountState.invalid) {
      setOrderProducts((ops) =>
        Array.from(ops).map((op) =>
          op.product_id === product.id ? { ...op, amount } : op
        )
      );
    }
    updateFormState();
  }, [
    amount,
    getFieldState,
    setOrderProducts,
    product.id,
    formMapRef,
    updateFormState,
  ]);

  const defaultPerPrice = isBuyOrder
    ? product.default_buy_price
    : product.default_sell_price;

  const addProduct = useCallback(() => {
    setOrderProducts((orderProducts) => [
      ...orderProducts,
      {
        product_id: product.id,
        amount: 1,
        per_price: defaultPerPrice,
      },
    ]);
  }, [product.id, setOrderProducts, defaultPerPrice]);

  const listRight = useCallback(
    () =>
      orderProduct ? (
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
                label={isBuyOrder ? t("order.per_cost") : t("order.per_price")}
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
              orderProduct ? orderProduct.per_price : defaultPerPrice
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
            defaultValue={orderProduct?.amount || 0}
          />
        </>
      ) : (
        <Button onPress={addProduct}>{t("order_editor.add")}</Button>
      ),
    [control, defaultPerPrice, t, orderProduct, isBuyOrder, addProduct]
  );

  return (
    <List.Item style={styles.listItem} title={product.name} right={listRight} />
  );
};

const ProductListEmpty: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.empty}>
      <Title style={styles.emptyTitle}>
        {t("order_editor.order_no_products")}
      </Title>
      <Text style={styles.emptyText}>{t("order_editor.search_prompt")}</Text>
    </View>
  );
};

const ProductList: FC<{
  isBuyOrder: boolean;
  orderProducts: OrderProductWithoutOrderId[];
  setOrderProducts: Dispatch<SetStateAction<OrderProductWithoutOrderId[]>>;
  dismiss(): void;
}> = ({ orderProducts, setOrderProducts, isBuyOrder, dismiss }) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll(!showAll);

  const { data: dataProducts, status: statusGetProducts } = useProductsQuery();
  const fuse = useMemo(
    () =>
      new Fuse(dataProducts || [], {
        keys: ["name", "description"],
      }),
    [dataProducts]
  );

  const formMapRef = useRef(new Map<number, boolean>());

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => {
      return (
        <ProductItem
          key={item.id}
          product={item}
          isBuyOrder={isBuyOrder}
          orderProduct={orderProducts.find((oP) => oP.product_id === item.id)}
          setOrderProducts={setOrderProducts}
          formMapRef={formMapRef}
        />
      );
    },
    [isBuyOrder, orderProducts, setOrderProducts, formMapRef]
  );

  const data = useMemo(() => {
    const trimmedSQ = searchQuery.trim();
    if (trimmedSQ !== "") {
      return fuse.search(trimmedSQ).map((result) => result.item);
    }
    if (showAll) return dataProducts;
    else
      return dataProducts?.filter((p) =>
        orderProducts.some((oP) => oP.product_id === p.id)
      );
  }, [dataProducts, searchQuery, orderProducts, fuse, showAll]);

  const onDone = () => {
    for (const hasError of formMapRef.current.values()) {
      if (hasError) {
        toast.error(t("form.form_is_invalid"));
        return;
      }
    }
    setOrderProducts(orderProducts.filter((op) => op.amount > 0));
    dismiss();
  };

  return (
    <>
      <FlatList
        style={styles.list}
        ItemSeparatorComponent={Divider}
        data={data || []}
        renderItem={renderItem}
        ListHeaderComponent={
          <Searchbar
            style={styles.searchbar}
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
          />
        }
        ListEmptyComponent={
          statusGetProducts === "loading" ? (
            <LoadingScreen />
          ) : searchQuery === "" ? (
            <ProductListEmpty />
          ) : null
        }
        ListFooterComponent={
          searchQuery === "" ? (
            <Button labelStyle={{ fontSize: 12 }} onPress={toggleShowAll}>
              {t(
                showAll ? "order_editor.show_all_off" : "order_editor.show_all"
              )}
            </Button>
          ) : null
        }
      />
      <Dialog.Actions>
        <Button mode="contained" onPress={onDone} style={styles.btnDone}>
          {t("action.done")}
        </Button>
      </Dialog.Actions>
    </>
  );
};

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

  const [visible, setVisible] = useState(false);

  const presentList = () => setVisible(true);

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
          dismissable={false}
          style={StyleSheet.absoluteFill}
          visible={visible}
        >
          <ProductList
            isBuyOrder={isBuyOrder}
            orderProducts={orderProducts}
            setOrderProducts={setOrderProducts}
            dismiss={() => setVisible(false)}
          />
        </Dialog>
      </Portal>
    </>
  );
};
