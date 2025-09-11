export type LanguageKey = 'en' | 'es';

export type Translations = {
  [key: string]: {
    [lang in LanguageKey]: string;
  };
};

export type TranslationKey = keyof typeof translations;

const translations: Translations = {
  // Page titles
  logInOrSignUp: {
    en: 'Log in or Sign up',
    es: 'Inicia sesión o regístrate',
  },
  profile: {
    en: 'Profile',
    es: 'Perfil',
  },
  confirmation: {
    en: 'Confirmation',
    es: 'Confirmación',
  },
  send: {
    en: 'Send',
    es: 'Enviar',
  },
  activity: {
    en: 'Activity',
    es: 'Actividad',
  },
  swap: {
    en: 'Swap',
    es: 'Intercambiar',
  },
  receive: {
    en: 'Receive',
    es: 'Recibir',
  },
  balances: {
    en: 'Balances',
    es: 'Saldos',
  },
  wrongNetwork: {
    en: 'Wrong Network',
    es: 'Red incorrecta',
  },

  // General / Shared
  loading: {
    en: 'Loading',
    es: 'Cargando',
  },
  tryAgain: {
    en: 'Try again',
    es: 'Intenta de nuevo',
  },
  connecting: {
    en: 'Connecting',
    es: 'Conectando',
  },
  signing: {
    en: 'Signing',
    es: 'Firmando',
  },
  or: {
    en: 'or',
    es: 'o',
  },
  recent: {
    en: 'recent',
    es: 'reciente',
  },

  // Onboarding Page
  allStellarWallets: {
    en: 'All Stellar wallets',
    es: 'Todas las carteras Stellar',
  },
  email: {
    en: 'Email',
    es: 'Correo electrónico',
  },
  logInWithPasskey: {
    en: 'Log in with Passkey',
    es: 'Iniciar sesión con llave de acceso',
  },
  submit: {
    en: 'Submit',
    es: 'Enviar',
  },
  poweredByBlux: {
    en: 'Powered by Blux.cc',
    es: 'Desarrollado por Blux.cc',
  },

  // Success modal
  connectionSuccessfulTitle: {
    en: 'Connection Successful',
    es: 'Conexión exitosa',
  },
  transactionSuccessfulTitle: {
    en: 'Transaction Successful',
    es: 'Transacción exitosa',
  },
  connectionSuccessfulMessage: {
    en: 'Your account has been successfully connected to ${appName}',
    es: 'Tu cuenta se ha conectado correctamente a ${appName}',
  },
  transactionSuccessfulMessage: {
    en: 'Your transaction was successfully completed',
    es: 'Tu transacción se completó con éxito',
  },
  seeInExplorer: {
    en: 'See in explorer',
    es: 'Ver en el explorador',
  },
  loggingIn: {
    en: 'Logging In',
    es: 'Iniciando sesión',
  },
  done: {
    en: 'Done',
    es: 'Hecho',
  },

  // Sign transaction modal
  signTransactionPrompt: {
    en: 'wants your permission to approve the following transaction.',
    es: 'quiere tu permiso para aprobar la siguiente transacción.',
  },
  invalidXdr: {
    en: 'Invalid XDR',
    es: 'XDR inválido',
  },
  lobstrWarning: {
    en: 'Ensure that your LOBSTR wallet is set to the ${network} network. Otherwise, the transaction will definitely fail.',
    es: 'Asegúrate de que tu cartera LOBSTR esté configurada en la red ${network}. De lo contrario, la transacción fallará.',
  },
  yourWallet: {
    en: 'Your wallet',
    es: 'Tu cartera',
  },
  noAddressFound: {
    en: 'No address found',
    es: 'No se encontró ninguna dirección',
  },
  approve: {
    en: 'Approve',
    es: 'Aprobar',
  },

  // Activity Page
  loadingActivity: {
    en: 'Loading activity...',
    es: 'Cargando actividad...',
  },
  noActivityFound: {
    en: 'No activity found',
    es: 'No se encontró actividad',
  },
  multiOperation: {
    en: 'Multi Operation',
    es: 'Operación múltiple',
  },
  pathPaymentDescription: {
    en: 'Path payment of ${amount} ${asset}',
    es: 'Pago por ruta de ${amount} ${asset}',
  },
  seeAllInExplorer: {
    en: 'See all in explorer',
    es: 'Ver todo en el explorador',
  },

  // ConfirmCode Page
  enterConfirmationCodeTitle: {
    en: 'Enter confirmation code',
    es: 'Introduce el código de confirmación',
  },
  enterConfirmationCodeHelp: {
    en: 'Please check your email and enter confirmation code below',
    es: 'Por favor revisa tu correo electrónico e introduce el código de confirmación abajo',
  },
  invalidCodeError: {
    en: 'Invalid code, please try again.',
    es: 'Código inválido, por favor intenta de nuevo.',
  },
  resendCode: {
    en: 'Resend code',
    es: 'Reenviar código',
  },

  // Profile Page
  copied: {
    en: 'Copied!',
    es: '¡Copiado!',
  },
  logout: {
    en: 'Logout',
    es: 'Cerrar sesión',
  },

  // SelectAssets Component
  search: {
    en: 'Search',
    es: 'Buscar',
  },
  noAssetsFound: {
    en: 'No assets found',
    es: 'No se encontraron activos',
  },

  // SendForm Page
  amount: {
    en: 'Amount',
    es: 'Cantidad',
  },
  max: {
    en: 'Max',
    es: 'Máx',
  },
  to: {
    en: 'To',
    es: 'A',
  },
  enterAddress: {
    en: 'Enter address',
    es: 'Introduce la dirección',
  },
  addressRequired: {
    en: 'Address is required',
    es: 'La dirección es obligatoria',
  },
  addressInvalid: {
    en: 'Address is invalid',
    es: 'La dirección es inválida',
  },
  inactiveAccount: {
    en: 'Account is inActive',
    es: 'La cuenta está inactiva',
  },
  memo: {
    en: 'Memo',
    es: 'Memo',
  },
  enterMemo: {
    en: 'Enter Memo (optional)',
    es: 'Introduce una Memo (opcional)',
  },
  paste: {
    en: 'Paste',
    es: 'Pegar',
  },
  amountRequired: {
    en: 'Amount is required',
    es: 'La cantidad es obligatoria',
  },
  amountExceedsBalance: {
    en: 'Amount is greater than max balance',
    es: 'La cantidad excede el saldo máximo',
  },
  sendButton: {
    en: 'Send',
    es: 'Enviar',
  },

  // Waiting Modal
  loginFailed: {
    en: 'Login failed',
    es: 'Fallo al iniciar sesión',
  },
  signingFailed: {
    en: 'Signing with ${walletName} failed',
    es: 'La firma con ${walletName} falló',
  },
  waitingFor: {
    en: 'Waiting for ${walletName}',
    es: 'Esperando a ${walletName}',
  },
  signingWith: {
    en: 'Signing with ${walletName}',
    es: 'Firmando con ${walletName}',
  },
  loginRetryMessage: {
    en: 'Please try logging in again.',
    es: 'Por favor intenta iniciar sesión nuevamente.',
  },
  signingRetryMessage: {
    en: 'Please try signing again.',
    es: 'Por favor intenta firmar nuevamente.',
  },
  acceptConnection: {
    en: 'Accept connection',
    es: 'Aceptar conexión',
  },
  signRequestInWallet: {
    en: 'Sign the request in your wallet',
    es: 'Firma la solicitud en tu cartera',
  },

  // Wrong Network Page
  wrongNetworkMessage: {
    en: 'You are on a wrong network.',
    es: 'Estás en una red incorrecta.',
  },
};
export default translations;
