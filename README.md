# SimpleShop

A tiny app to manage inventory and keep track of orders and profits.

I made this for a family member who runs her own small shop,
so it would not be suitable for large scale operations, in which case
you should consider a more advanced solution like Shopify or [Saleor](https://github.com/mirumee/saleor).

See [Screenshots](./resources/screenshots) to learn more.

## Features

### General features

- Offline-first: Backed by SQLite and allows importing, exporting Data
- Light/Dark theme
- Multi-languages (See [Supported languages](./src/locales))

### Orders tracking

- Buy and sell orders: Use _Buy_ order to keep track of Cost and _Sell_ order to keep track of revenue
- Product price can be overridden, like for the time you sell to your lovely neighbor
- Keep track of _paid_ and _delivered_ status

### Profit calculation

- Calculate the profits of sold products
- Can select date range of calculation
- Rank products by profit

### Products management

- Update product info and set default sell/buy price

## Development

1. Clone the source code
2. Run `yarn`
3. Set up emulator or physical devices
4. Run `yarn start` and `yarn android`/`yarn ios` in two different terminals

## License

See [LICENSE](LICENSE).
