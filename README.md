# Blux Wallet Kit - The Missing Piece for Stellar dApps

Blux is a **comprehensive authentication and wallet connect kit** designed for Stellar dApps. It simplifies onboarding by integrating multiple authentication methods, including **wallets, email, phone, and OAuth**. With Blux, developers can create seamless multi-auth experiences without the complexity of building custom authentication solutions from scratch.

## Features

- **Multi-Wallet Support**: Easily integrate Stellar wallets such as **Rabet, xBull, Lobstr, Freighter, and Albedo**.
- **OAuth & Social Login** *(Coming Soon)*: Support for **Apple, Meta, Google, and more**.
- **Email & Phone Authentication** *(Coming Soon)*: Securely onboard users with non-crypto credentials.
- **Customizable UI**: Adjust themes, fonts, backgrounds, logos, cover images, corner radius, and text colors.
- **Configurable Networks**: Set up and modify network preferences via API keys.
- **Future-Proof**: More wallets and authentication methods will be added based on community feedback.

## Installation

Blux can be installed via npm:

```sh
npm i @bluxcc/react
```

or using yarn:

```sh
yarn add @bluxcc/react
```

## Usage

Import Blux and set up the authentication flow:

```tsx
import { BluxProvider, useBlux } from "@bluxcc/react";

const YourComponent = () => {
  const { connect } = useBlux();
  return <button onClick={connect}>Connect Wallet</button>;
};

const App = () => {
  return (
    <BluxProvider config={{ appName: "YourApp", network: "testnet" }}>
      <YourComponent />
    </BluxProvider>
  );
};

export default App;
```

## Customization

Developers can customize various UI elements:

- **Themes & Fonts**
- **Backgrounds, Logos, and Cover Images**
- **Corner Radius & Text Colors**
- **Authentication Limits** (Free tier supports 500-1000 accounts per auth method)

Configuration options can be set via the `BluxProvider` config or environment variables.

## Supported Wallets

Currently supported connection methods:

- [x] **Rabet**
- [x] **xBull**
- [x] **Lobstr**
- [x] **Freighter**
- [x] **Albedo**
- [ ] **Ledger**
- [ ] **Trezor**
- [ ] **Hana**
- [ ] **WalletConnect**
- [ ] **OAuth**
- [ ] **Email**
- [ ] **Phone**

## License & Usage Restrictions

- **No Production Use Until 2028**: This software is provided under the **Blux Team License** with restrictions on production use.
- **No Forking or Unauthorized Modifications**: Removing references to **Blux Team** or forking without attribution is strictly prohibited.
- **Custom Licensing Available**: Contact us at [support@blux.cc](mailto:support@blux.cc) to discuss licensing options.

## Support & Contact

For support, licensing, or inquiries, reach out via:

- **Email**: [support@blux.cc](mailto:support@blux.cc)
- **X (Twitter)**: [@BluxOfficial](https://twitter.com/BluxOfficial)

## Roadmap & Future Plans

Blux is evolving. Follow our updates on [X (Twitter)](https://twitter.com/BluxOfficial) for:

- **OAuth Authentication (Apple, Meta, Google, etc.)**
- **Email & Phone-Based Authentication**
- **More Wallet Integrations**
- **Enhanced Customization & Security Features**

Stay tuned. We have many exciting developments ahead!
