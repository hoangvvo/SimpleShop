import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationBar } from "components/NavigationBar";
import { Toaster } from "components/Toast";
import merge from "deepmerge";
import { InitComponent } from "InitComponent";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LogBox, StatusBar } from "react-native";
import {
  Colors,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import CustomerEditorScreen from "screens/CustomerEditor";
import CustomersScreen from "screens/Customers";
import DashboardScreen from "screens/Dashboard";
import DashboardStatsScreen from "screens/DashboardStats";
import DebugScreen from "screens/Debug";
import OrderEditorScreen from "screens/OrderEditor";
import OrdersScreen from "screens/Orders";
import ProductEditorScreen from "screens/ProductEditor";
import ProductsScreen from "screens/Products";
import SettingsScreen from "screens/Settings";
import { RouteName } from "screens/types";
import { TabThemeColor } from "styles/Colors";
import { useCurrentColorScheme } from "styles/colorScheme";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

CombinedDefaultTheme.colors.primary = CombinedDarkTheme.colors.primary =
  Colors.blue500;

const Main: FC = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator shifting>
      <Tab.Screen
        name={RouteName.Dashboard}
        component={DashboardScreen}
        options={{
          tabBarLabel: t("dashboard.title"),
          tabBarIcon: "home",
          tabBarColor: TabThemeColor.dashboard,
          title: t("dashboard.title"),
        }}
      />
      <Tab.Screen
        name={RouteName.Orders}
        component={OrdersScreen}
        options={{
          tabBarLabel: t("order.title_other"),
          tabBarIcon: "clipboard-text",
          tabBarColor: TabThemeColor.order,
          title: t("order.title_other"),
        }}
      />
      <Tab.Screen
        name={RouteName.Products}
        component={ProductsScreen}
        options={{
          tabBarLabel: t("product.title_other"),
          tabBarIcon: "shopping",
          tabBarColor: TabThemeColor.product,
          title: t("product.title_other"),
        }}
      />
      <Tab.Screen
        name={RouteName.Customers}
        component={CustomersScreen}
        options={{
          tabBarLabel: t("customer.title_other"),
          tabBarIcon: "account",
          tabBarColor: TabThemeColor.customer,
          title: t("customer.title_others"),
        }}
      />
    </Tab.Navigator>
  );
};

const queryClient = new QueryClient();

const AppInner: FC = () => {
  const { t } = useTranslation();

  const colorScheme = useCurrentColorScheme();

  const theme = useMemo(
    () => (colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme),
    [colorScheme]
  );

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <StatusBar translucent backgroundColor="transparent" />
          <Portal.Host>
            <NavigationContainer theme={theme}>
              <Stack.Navigator
                screenOptions={{
                  header(props) {
                    return <NavigationBar {...props} />;
                  },
                }}
              >
                <Stack.Screen
                  name={RouteName.Main}
                  component={Main}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={RouteName.OrderEditor}
                  component={OrderEditorScreen}
                  options={{
                    headerTitle: "",
                    headerTintColor: TabThemeColor.order,
                  }}
                />
                <Stack.Screen
                  name={RouteName.ProductEditor}
                  component={ProductEditorScreen}
                  options={{
                    headerTitle: "",
                    headerTintColor: TabThemeColor.product,
                  }}
                />
                <Stack.Screen
                  name={RouteName.CustomerEditor}
                  component={CustomerEditorScreen}
                  options={{
                    headerTitle: "",
                    headerTintColor: TabThemeColor.customer,
                  }}
                />
                <Stack.Screen
                  name={RouteName.Settings}
                  component={SettingsScreen}
                  options={{
                    headerTitle: t("settings.title"),
                  }}
                />
                <Stack.Screen
                  name={RouteName.DashboardStats}
                  component={DashboardStatsScreen}
                  options={{
                    headerTitle: t("stats.title"),
                  }}
                />
                <Stack.Screen
                  name={RouteName.Debug}
                  component={DebugScreen}
                  options={{ title: "DEBUG" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Portal.Host>
          <Toaster />
        </SafeAreaProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <InitComponent>
      <AppInner />
    </InitComponent>
  );
}
