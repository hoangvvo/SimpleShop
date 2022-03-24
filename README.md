# SimpleShop

A tiny app to manage inventory and keep track of orders and profits.

I made this for a family member who runs her own small shop,
so it would not be suitable for large scale operations, in which case
you should consider a more advanced solution like Shopify or [Saleor](https://github.com/mirumee/saleor).

Google Play: https://play.google.com/store/apps/details?id=com.hoangvvo.simpleshop

## Features

### General features

- Offline-first, free forever: Backed by SQLite, allowing importing, exporting data
- Light/Dark theme
- Multi-languages (See [Supported languages](./src/locales))

### Orders tracking

- Import and sell orders: Use _Import_ order to keep track of Stock and Cost and _Sell_ order to keep track of revenue
- Product price/cost can be overridden, like for the time you give discount for your lovely neighbor
- Keep track of _paid_ and _delivered_ status

### Profit/Revenue calculation

- Calculate the **revenue** and **profits** of sold products
- Can select date range of calculation
- Rank products by revenue and profit

### Products management

- Update product info and set default sell price/import cost

### Customers management

- Manage customers to quick fill addresses

## Development

1. Clone the source code
2. Run `yarn`
3. Set up emulator or physical devices
4. Run `yarn start` and `yarn android`/`yarn ios` in two different terminals

## Build

### Android

1. Copy `simple-shop.keystore` file back into `android/app`.
2. Update the `*****` with the keystore password in `android/gradle.properties`.
3. Run `cd android && ./gradlew bundleRelease`.

## License

See [LICENSE](LICENSE).
