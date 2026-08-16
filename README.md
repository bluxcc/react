# Blux: Authentication & Wallet Infrastructure for Stellar dApps

Blux gives Stellar developers one unified SDK for user authentication, wallet connections, transaction signing, and Soroban interactions. Users can onboard through supported Stellar wallets, email, social accounts, or optional SMS, while developers get built-in hooks, customizable interfaces, user management, and analytics.

## Useful Links

* **Website:** [blux.cc](https://blux.cc/)
* **Documentation:** [docs.blux.cc](https://docs.blux.cc/)
* **Live Demo:** [demo.blux.cc](https://demo.blux.cc/)
* **Dashboard:** [dashboard.blux.cc](https://dashboard.blux.cc/)
* **GitHub:** [github.com/bluxcc/core](https://github.com/bluxcc/core)

## Features

* **Multi-Wallet Support**: Integrate more than 15 Stellar-compatible wallets and connection methods.
* **OAuth & Social Login**: Onboard users through Google and other supported social accounts without requiring users to manage a traditional wallet.
* **Email Authentication**: Allow users to create or access their accounts using their email address.
* **Phone Authentication**: SMS authentication can be activated for custom partners using a paid plan. Contact Blux support to request access.
* **Customizable UI**: Adjust themes, fonts, backgrounds, logos, border radius, text colors, and other interface elements.
* **Wallet Configuration**: Include or exclude specific wallets and control the order in which they appear.
* **Configurable Networks**: Configure supported Stellar networks and select the default network for your application.
* **Custom Explorer**: Configure the block explorer used for transaction and account links.
* **Localization**: Provide the authentication experience in multiple supported languages.
* **Developer Hooks**: Use built-in React hooks and helpers for authentication, wallet state, Stellar transactions, and Soroban interactions.
* **Transaction Signing**: Connect wallets and request transaction signatures through a consistent interface.
* **Soroban Support**: Build and integrate smart contract interactions into your Stellar application.
* **Profile Interface**: Give connected users access to their account and wallet information through a built-in profile modal.
* **Dashboard & Analytics**: Review authentication activity, connection methods, login timestamps, and associated wallet addresses.
* **User Management**: View and manage users who have connected to your application.
* **Testing Tools**: Use predefined test accounts and reusable OTP credentials in configured testing environments.
* **Multiple Projects**: Create and manage multiple applications from the same Blux account.
* **Future-Proof**: More wallets and authentication methods will be added based on community feedback.

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
import { BluxProvider, useBlux, networks } from '@bluxcc/react';

const ConnectButton = () => {
  const { login } = useBlux();

  return <button onClick={login}>Login</button>;
};

const App = () => {
  const config = {
    appName: 'Your App',
    appId: 'GET_FROM_BLUX_DASHBOARD',
    networks: [networks.mainnet, networks.testnet],
    defaultNetwork: networks.mainnet,
  };

  return (
    <BluxProvider config={config}>
      <ConnectButton />
    </BluxProvider>
  );
};

export default App;
```

Create a project through the [Blux Dashboard](https://dashboard.blux.cc/) to obtain your application ID. You can create and manage multiple projects from the same account.

## Customization

Developers can customize various UI elements:

* **Themes & Fonts**
* **Backgrounds, Logos**
* **Border Radius & Text Colors**
* **Authentication Limits** (Free tier supports 500-1000 accounts per auth method)

Developers can also configure:

* Enabled authentication methods
* Included and excluded wallets
* Wallet display order
* Supported networks
* Default network
* Block explorer
* Interface language

Configuration options can be set via the `BluxProvider` config or environment variables.

## Dashboard & User Analytics

The Blux dashboard provides information about the users who have connected to your application.

Available information includes:

* Authentication method
* Login and connection timestamps
* Associated wallet addresses, when available
* Recent authentication activity
* Individual user information

This information can help developers understand how their applications are being used and troubleshoot authentication or wallet connection issues.

## Development & Testing

Blux provides predefined accounts for development and quality assurance.

Developers can use preset email identities together with a reusable testing OTP. This makes it possible to test the complete login process repeatedly without waiting for real email delivery or using personal user information.

These credentials are intended only for the configured testing environment. Refer to the [Blux documentation](https://docs.blux.cc/) for the current testing credentials and setup instructions.

## Supported Wallets

Currently supported connection methods:

* [x] **Freighter**
* [x] **Rabet**
* [x] **WalletConnect**
* [x] **HOT Wallet**
* [x] **Hana**
* [x] **xBull**
* [x] **LOBSTR**
* [x] **Ledger**
* [x] **Albedo**
* [x] **Klever Wallet**
* [x] **Bitget Wallet**
* [x] **OneKey**
* [x] **CactusLink**
* [x] **Fordefi**
* [x] **Trezor**
* [x] **Email**
* [x] **Google**
* [x] **Passkey**

## Supported Languages

Currently supported languages:

* [x] **English**
* [x] **Spanish**
* [x] **Portuguese**
* [x] **French**
* [x] **German**
* [x] **Russian**
* [x] **Chinese**
* [x] **Japanese**
* [x] **Korean**

## License & Usage Restrictions

* **No Unauthorized Modifications**: Removing references to **Blux Team** or forking without attribution is strictly prohibited.
* **Custom Licensing Available**: Contact us at [support@blux.cc](mailto:support@blux.cc) to discuss licensing options.

## Support & Contact

For support, licensing, custom SMS authentication, or other inquiries, reach out via:

* **Email**: [support@blux.cc](mailto:support@blux.cc)
* **X**: [@BluxOfficial](https://x.com/bluxofficial)

## Roadmap & Future Plans

Blux is evolving. Follow our updates on [X](https://x.com/BluxOfficial) for:

* **Additional OAuth and Social Authentication Methods**
* **More Wallet Integrations**
* **Enhanced Developer Hooks**
* **Expanded Soroban Support**
* **Enhanced Customization, Analytics, and Security Features**
