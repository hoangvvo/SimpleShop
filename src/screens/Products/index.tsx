import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Fuse from "fuse.js";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { RefreshControl, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Caption,
  Colors,
  Divider,
  FAB,
  List,
  Searchbar,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "react-query";
import type { ParamList } from "screens/types";
import { RouteName } from "screens/types";
import { useProductsStockQuery } from "services/calculate";
import type { Product } from "services/product";
import { invalidateCache, useProductsQuery } from "services/product";
import { TabThemeColor } from "styles/Colors";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  fab: {
    backgroundColor: TabThemeColor.product,
  },
  listHeadQuantity: {
    lineHeight: 12,
    width: 56,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  listQuantityText: {
    textAlign: "center",
    width: 56,
  },
  listSide: {
    justifyContent: "center",
  },
  listTitle: {
    fontWeight: "bold",
  },
  searchbar: {
    marginVertical: 10,
  },
});

const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const navigation = useNavigation();

  const onEdit = () =>
    navigation.navigate(RouteName.ProductEditor, { id: product.id });

  const { data: stocks } = useProductsStockQuery();

  const stockCount = stocks?.[product.id] || 0;

  return (
    <List.Item
      title={<Text style={styles.listTitle}>{product.name}</Text>}
      right={({ style }) => (
        <View style={[style, styles.listSide]}>
          <Text
            style={[
              styles.listQuantityText,
              stockCount < 0 && { color: Colors.red500 },
            ]}
          >
            {stockCount}
          </Text>
        </View>
      )}
      description={product.description}
      descriptionNumberOfLines={1}
      onPress={onEdit}
    />
  );
};

const renderItem: ListRenderItem<Product> = ({ item }) => (
  <ProductItem product={item} />
);

const keyExtractor = (item: Product) => String(item.id);

const ProductsScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Products>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const onAdd = () => navigation.navigate(RouteName.ProductEditor);

  const { data, isLoading } = useProductsQuery();
  const fuse = useMemo(
    () =>
      new Fuse(data || [], {
        keys: ["name", "description"],
      }),
    [data]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const products = useMemo(() => {
    const trimmedSQ = searchQuery.trim();
    if (!trimmedSQ) return data;
    return fuse.search(trimmedSQ).map((result) => result.item);
  }, [fuse, searchQuery, data]);

  const theme = useTheme();

  const client = useQueryClient();

  return (
    <SafeAreaView style={screenStyles.root}>
      <Title style={screenStyles.title}>{t("product.title_other")}</Title>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => invalidateCache(client)}
          />
        }
        style={screenStyles.fill}
        contentContainerStyle={screenStyles.content}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : null}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={{ backgroundColor: theme.colors.background }}>
            <Searchbar
              onChangeText={(query) => setSearchQuery(query)}
              value={searchQuery}
              style={styles.searchbar}
            />
            <View style={styles.listHeader}>
              <Caption style={styles.listHeadQuantity}>
                {t("product.stock")}
              </Caption>
            </View>
          </View>
        }
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <FAB
        accessibilityLabel={t("product_editor.title_create")}
        onPress={onAdd}
        style={[screenStyles.fab, styles.fab]}
        icon="plus"
      />
    </SafeAreaView>
  );
};

export default ProductsScreen;
