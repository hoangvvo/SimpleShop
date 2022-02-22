import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Fuse from "fuse.js";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Divider, FAB, List, Searchbar, Text, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParamList, RouteName } from "screens/types";
import { Customer } from "services/customer";
import { useCustomersQuery } from "services/customer/api";
import { TabThemeColor } from "styles/Colors";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  fab: {
    backgroundColor: TabThemeColor.customer,
  },
  list: { flex: 1 },
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

const CustomerItem: FC<{ customer: Customer }> = ({ customer }) => {
  const navigation = useNavigation();

  const onEdit = () =>
    navigation.navigate(RouteName.CustomerEditor, { id: customer.id });

  return (
    <List.Item
      title={<Text style={styles.listTitle}>{customer.name}</Text>}
      description={customer.loc_text}
      descriptionNumberOfLines={1}
      onPress={onEdit}
    />
  );
};

const renderItem: ListRenderItem<Customer> = ({ item }) => (
  <CustomerItem customer={item} />
);

export const CustomersScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Customers>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const onAdd = () => navigation.navigate(RouteName.CustomerEditor);

  const { data } = useCustomersQuery();
  const fuse = useMemo(
    () =>
      new Fuse(data || [], {
        keys: ["name"],
      }),
    [data]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const customers = useMemo(() => {
    const trimmedSQ = searchQuery.trim();
    if (!trimmedSQ) return data;
    return fuse.search(trimmedSQ).map((result) => result.item);
  }, [fuse, searchQuery, data]);

  return (
    <SafeAreaView style={screenStyles.root}>
      <View style={[screenStyles.content, screenStyles.contentRoot]}>
        <Title style={screenStyles.title}>{t("customer.title_other")}</Title>
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={Divider}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <>
              <Searchbar
                onChangeText={(query) => setSearchQuery(query)}
                value={searchQuery}
                style={styles.searchbar}
              />
            </>
          }
          data={customers}
          renderItem={renderItem}
        />
      </View>
      <FAB
        accessibilityLabel={t("customer_editor.title_create")}
        onPress={onAdd}
        style={[screenStyles.fab, styles.fab]}
        icon="plus"
      />
    </SafeAreaView>
  );
};
