# Ramu-Fungible-Token (RFT)

A SIP-010 compliant fungible token smart contract built on the Stacks blockchain.

## 📋 Table of Contents

- [Overview](#overview)
- [Token Details](#token-details)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Contract Functions](#contract-functions)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Learning Resources](#learning-resources)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Ramu-Fungible-Token (RFT) is a fungible token implementation that follows the [SIP-010 Fungible Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md). This standard ensures interoperability with wallets, exchanges, and other Stacks ecosystem applications.

### What is a Fungible Token?

Fungible tokens are interchangeable digital assets where each token is identical in value and functionality (like USD, Bitcoin, or traditional cryptocurrencies). Unlike NFTs, one RFT token is exactly the same as another RFT token.

## 💎 Token Details

| Property | Value |
|----------|-------|
| **Name** | Ramu-Fungible-Token |
| **Symbol** | RFT |
| **Decimals** | 6 |
| **Max Supply** | Unlimited (mintable by owner) |
| **Standard** | SIP-010 |
| **Blockchain** | Stacks |

### Decimals Explanation

With 6 decimals, token amounts are displayed as:
- `1.000000` = 1 RFT
- `0.500000` = 0.5 RFT
- The smallest unit is `0.000001` RFT

## ✨ Features

- ✅ **SIP-010 Compliant**: Full compatibility with Stacks wallets and dApps
- ✅ **Mintable**: Owner can create new tokens
- ✅ **Transferable**: Users can send tokens to other addresses
- ✅ **No Maximum Supply**: Flexible supply management
- ✅ **Metadata Support**: URI for token information
- ✅ **Access Control**: Only contract owner can mint

## 🛠️ Prerequisites

Before working with this contract, ensure you have:

- [Clarinet](https://github.com/hirosystems/clarinet) - Stacks smart contract development tool
- [Node.js](https://nodejs.org/) (v14 or higher)
- Basic understanding of [Clarity](https://clarity-lang.org/) programming language
- A Stacks wallet (for mainnet deployment)

### Installing Clarinet

```bash
# macOS (Homebrew)
brew install clarinet

# Windows (Winget)
winget install clarinet

# Linux
wget -nv https://github.com/hirosystems/clarinet/releases/download/v1.7.0/clarinet-linux-x64.tar.gz -O clarinet-linux-x64.tar.gz
tar -xf clarinet-linux-x64.tar.gz
chmod +x ./clarinet
mv ./clarinet /usr/local/bin
```

## 📥 Installation

1. **Create a new Clarinet project**

```bash
clarinet new ramu-fungible-token
cd ramu-fungible-token
```

2. **Add the contract**

Create a file `contracts/ramu-fungible-token.clar` and paste the contract code.

3. **Update Clarinet.toml**

```toml
[project]
name = "ramu-fungible-token"
description = "SIP-010 Fungible Token"
authors = []
telemetry = false
boot_contracts = ["SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard"]

[contracts.ramu-fungible-token]
path = "contracts/ramu-fungible-token.clar"
clarity_version = 2
epoch = 2.4
```

4. **Check the contract**

```bash
clarinet check
```

## 📚 Contract Functions

### Read-Only Functions

These functions don't modify the blockchain state and are free to call.

#### `get-balance`

Get the token balance of a principal.

```clarity
(get-balance (who principal))
```

**Parameters:**
- `who`: The principal address to check

**Returns:** `(ok uint)` - The balance

**Example:**
```clarity
(contract-call? .ramu-fungible-token get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
;; Returns: (ok u1000000)
```

---

#### `get-total-supply`

Get the total supply of tokens in circulation.

```clarity
(get-total-supply)
```

**Returns:** `(ok uint)` - The total supply

**Example:**
```clarity
(contract-call? .ramu-fungible-token get-total-supply)
;; Returns: (ok u10000000)
```

---

#### `get-name`

Get the human-readable token name.

```clarity
(get-name)
```

**Returns:** `(ok "Ramu-Fungible-Token")`

---

#### `get-symbol`

Get the token ticker symbol.

```clarity
(get-symbol)
```

**Returns:** `(ok "RFT")`

---

#### `get-decimals`

Get the number of decimal places.

```clarity
(get-decimals)
```

**Returns:** `(ok u6)`

---

#### `get-token-uri`

Get the URI for token metadata.

```clarity
(get-token-uri)
```

**Returns:** `(ok (some u"https://hiro.so"))`

---

### Public Functions

These functions modify the blockchain state and require transaction fees.

#### `mint`

Mint new tokens to a recipient. **Only the contract owner can call this.**

```clarity
(mint (amount uint) (recipient principal))
```

**Parameters:**
- `amount`: Number of tokens to mint (in micro-units)
- `recipient`: The principal to receive the tokens

**Returns:** `(ok true)` or error

**Errors:**
- `(err u100)`: Only owner can mint

**Example:**
```clarity
;; Mint 100 RFT (100000000 micro-units) to an address
(contract-call? .ramu-fungible-token mint u100000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

---

#### `transfer`

Transfer tokens from sender to recipient.

```clarity
(transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
```

**Parameters:**
- `amount`: Number of tokens to transfer (in micro-units)
- `sender`: The principal sending tokens (must be tx-sender)
- `recipient`: The principal receiving tokens
- `memo`: Optional note (max 34 bytes)

**Returns:** `(ok true)` or error

**Errors:**
- `(err u101)`: Not the token owner

**Example:**
```clarity
;; Transfer 10 RFT (10000000 micro-units) with a memo
(contract-call? .ramu-fungible-token transfer 
  u10000000 
  tx-sender 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
  (some 0x68656c6c6f)) ;; "hello" in hex
```

## 💡 Usage Examples

### Example 1: Initial Token Distribution

```clarity
;; Contract owner minting initial supply
;; Mint 1,000,000 RFT to the treasury
(contract-call? .ramu-fungible-token mint u1000000000000 'ST1TREASURY_ADDRESS)

;; Mint 500,000 RFT to team wallet
(contract-call? .ramu-fungible-token mint u500000000000 'ST1TEAM_ADDRESS)
```

### Example 2: User Transfer

```clarity
;; Alice sends 50 RFT to Bob
(contract-call? .ramu-fungible-token transfer 
  u50000000  ;; 50 tokens with 6 decimals
  tx-sender  ;; Alice (must be the caller)
  'ST1BOB_ADDRESS
  none)      ;; No memo
```

### Example 3: Transfer with Memo

```clarity
;; Payment for services with invoice reference
(contract-call? .ramu-fungible-token transfer 
  u100000000
  tx-sender
  'ST1CONTRACTOR_ADDRESS
  (some 0x494e562d31323334)) ;; "INV-1234" in hex
```

### Example 4: Check Balance

```clarity
;; Check your own balance
(contract-call? .ramu-fungible-token get-balance tx-sender)

;; Check another address's balance
(contract-call? .ramu-fungible-token get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

## 🧪 Testing

### Create Test File

Create `tests/ramu-fungible-token_test.ts`:

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can mint tokens as contract owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'ramu-fungible-token',
                'mint',
                [types.uint(1000000), types.principal(wallet1.address)],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Check balance
        let balance = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-balance',
            [types.principal(wallet1.address)],
            deployer.address
        );
        balance.result.expectOk().expectUint(1000000);
    },
});

Clarinet.test({
    name: "Cannot mint tokens as non-owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'ramu-fungible-token',
                'mint',
                [types.uint(1000000), types.principal(wallet2.address)],
                wallet1.address
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(100);
    },
});

Clarinet.test({
    name: "Can transfer tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Mint to wallet1
            Tx.contractCall(
                'ramu-fungible-token',
                'mint',
                [types.uint(1000000), types.principal(wallet1.address)],
                deployer.address
            ),
            // Transfer from wallet1 to wallet2
            Tx.contractCall(
                'ramu-fungible-token',
                'transfer',
                [
                    types.uint(500000),
                    types.principal(wallet1.address),
                    types.principal(wallet2.address),
                    types.none()
                ],
                wallet1.address
            )
        ]);
        
        block.receipts[1].result.expectOk().expectBool(true);
        
        // Check balances
        let balance1 = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-balance',
            [types.principal(wallet1.address)],
            deployer.address
        );
        balance1.result.expectOk().expectUint(500000);
        
        let balance2 = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-balance',
            [types.principal(wallet2.address)],
            deployer.address
        );
        balance2.result.expectOk().expectUint(500000);
    },
});

Clarinet.test({
    name: "Get token metadata",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let name = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-name',
            [],
            deployer.address
        );
        name.result.expectOk().expectAscii("Ramu-Fungible-Token");
        
        let symbol = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-symbol',
            [],
            deployer.address
        );
        symbol.result.expectOk().expectAscii("RFT");
        
        let decimals = chain.callReadOnlyFn(
            'ramu-fungible-token',
            'get-decimals',
            [],
            deployer.address
        );
        decimals.result.expectOk().expectUint(6);
    },
});
```

### Run Tests

```bash
clarinet test
```

## 🚀 Deployment

### Testnet Deployment

1. **Configure your testnet account**

Get testnet STX from the [faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet).

2. **Deploy using Clarinet**

```bash
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Mainnet Deployment

1. **Update deployment plan**

```bash
clarinet deployments generate --mainnet
```

2. **Review costs**

Check the deployment plan for estimated costs.

3. **Deploy**

```bash
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

### Using Stacks CLI

Alternatively, deploy using the Stacks CLI:

```bash
stx deploy_contract ramu-fungible-token contracts/ramu-fungible-token.clar --testnet
```

## 🔒 Security Considerations

### Access Control

- ✅ **Minting**: Only the contract deployer (CONTRACT_OWNER) can mint new tokens
- ✅ **Transfers**: Only the token owner can transfer their tokens
- ✅ **No Burn Function**: Currently, tokens cannot be destroyed (consider adding if needed)

### Best Practices

1. **Test Thoroughly**: Always test on testnet before mainnet deployment
2. **Audit**: Consider a professional audit for production use
3. **Token URI**: Update the TOKEN_URI to point to your actual metadata
4. **Max Supply**: Consider adding a maximum supply cap if needed
5. **Pausable**: Consider adding pause functionality for emergencies

### Known Limitations

- No built-in burning mechanism
- Unlimited minting by owner
- No transfer hooks or callbacks
- Simple access control (only owner-based)

## 📖 Learning Resources

### Clarity Language

- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [Clarity Book](https://book.clarity-lang.org/)
- [Clarity Examples](https://github.com/clarity-lang/overview)

### Stacks Blockchain

- [Stacks Documentation](https://docs.stacks.co/)
- [Stacks Academy](https://academy.stacks.org/)
- [Hiro Documentation](https://docs.hiro.so/)

### SIP-010 Standard

- [SIP-010 Specification](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [SIP-010 Trait](https://explorer.stacks.co/txid/SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard?chain=mainnet)

### Community

- [Stacks Discord](https://discord.gg/stacks)
- [Stacks Forum](https://forum.stacks.org/)
- [Reddit r/stacks](https://reddit.com/r/stacks)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow Clarity best practices
- Update documentation
- Ensure all tests pass

## 📝 Common Issues & Troubleshooting

### Issue: "Contract not found"

**Solution**: Ensure the SIP-010 trait contract is deployed or use the correct trait reference.

### Issue: "ERR_OWNER_ONLY (u100)"

**Solution**: Only the contract deployer can mint tokens. Check that you're calling from the correct address.

### Issue: "ERR_NOT_TOKEN_OWNER (u101)"

**Solution**: You can only transfer tokens you own. Ensure the sender parameter matches tx-sender.

### Issue: Decimal Confusion

**Remember**: With 6 decimals:
- To represent 1 RFT, use `u1000000`
- To represent 0.5 RFT, use `u500000`
- To represent 100 RFT, use `u100000000`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stacks Foundation for the blockchain platform
- Hiro Systems for development tools
- The Clarity community for resources and support

---

**Disclaimer**: This contract is provided as-is for educational purposes. Always conduct thorough testing and auditing before using in production.

For questions or support, please open an issue or reach out to the community.

**Happy Building! 🚀**