# Coffer

Coffer is a Nextjs app designed to generate and manage cryptocurrency wallets. It supports both the generation of new wallets and the entry of existing recovery phrases of both Solana & Ethereum. It displays generated private and public keys, provides functionality to copy them to the clipboard, and includes features for showing or hiding sensitive information. Additionaly, it now supports access to solana devnet which provides balance checking and airdropping functionalities.

## Features

- **Generate Wallet**: Create a new wallet and view generated private and public keys.
- **Import Wallet**: Optionally enter an existing recovery phrase to generate keys.
- **Toggle Visibility**: Show or hide private keys and recovery phrases to enhance security.
- **Copy to Clipboard**: Easily copy private keys, public keys, and the recovery phrase.

## Installation

1. Ensure you have Node.js and npm installed on your machine.
2. Clone the repository
3. Install the required dependencies by running the code below.

   ```bash
   npm install
   ```

### State Management

- **`mnemonic`**: Stores the words of the recovery phrase.
- **`blockType`**: Stores the pathType(Solana/Ethereum)
- **`blockWallet`**: Stores the generated private & public keys.
- **`visiblePrivateKeys`**: Boolean array state to toggle the visibility of private keys.

## How It Works

1. **Generating a Wallet**:

   - Generates a new mnemonic phrase and derives the corresponding seed.
   - Uses the seed to generate private and public keys.
   - Displays the generated keys and mnemonic phrase.

2. **Importing a Wallet**:

   - Optionally enter a recovery phrase to derive private and public keys.

3. **Visibility Toggle**:

   - Private keys can be toggled between visible and hidden for security.

4. **Clipboard Copy**:
   - Provides functionality to copy private keys, public keys, and the recovery phrase to the clipboard.

5. **Balance Checking**:
   - Allows to check balance for public keys in the solana blockchain
  
6. **Airdropping**:
   - Allow users to airdrop upto 2sol every 8 hours from the solana devnet

## Contributing

Feel free to submit issues or pull requests. Contributions are always welcome!

## License

This project is licensed under the MIT License.
