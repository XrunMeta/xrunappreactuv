export default {
  page1: {
    title: 'Your Own Wallet Key',
    body: [
      'Your xrun wallet has a Private Key that only you hold.',
      'This key is the one and only proof of wallet ownership. Unlike a password, it cannot be changed — the key itself is your asset.',
      'Whoever holds this key owns the wallet.',
    ],
  },
  page2: {
    title: 'Back Up Your Key Safely',
    body: [
      'You can back up your wallet key in the app. Even if you lose your device or delete the app, a backup lets you restore your wallet.',
      'Encrypted backup: locked with a PIN for safety — recommended',
      'Plain backup: anyone can open it, so never share it',
      'If you lose your backup file and PIN, no one can recover it for you. Keep them in a safe, separate place.',
    ],
  },
  page3: {
    title: "What the Company Knows and Doesn't",
    body: [
      'xrun only knows your wallet address. Your private key is never stored on company servers.',
      'However, due to the nature of blockchain, all transactions made with that address can be viewed by anyone (including the company). This is the essence of a public ledger.',
      'If you lose your key, the company cannot recover it. The ultimate responsibility for key management is yours.',
    ],
  },
  rememberHeading: 'Please remember',
  agree: { label: 'I have read and understood all of the above.' },
  button: { prev: 'Back', next: 'Next', start: 'Get Started' },
  readonly: { close: 'Close' },
};
