# 🔍 Pyth Hermes Decoder – TypeScript Project

A powerful TypeScript project that interacts with the [Pyth Network](https://pyth.network) to fetch and decode real-time price feed updates from their [Hermes API](https://docs.pyth.network/price-feeds). This tool converts raw binary (hex) calldata into human-readable JSON price data and enables re-encoding of selected price update subsets for custom broadcasting or relaying.

---

## 🚀 Features

- ✅ **Real-time Data Fetching** - Retrieve latest price feed data from Hermes (Pyth Network)
- 🔍 **Binary Decoding** - Convert raw hex data into structured JSON format
- ✂️ **Selective Processing** - Slice and re-encode subsets of updates (e.g., first 5 tokens)
- ⚡ **Efficient Parsing** - Optimized buffer processing using `Buffer` and `bn.js`
- 📊 **Type Safety** - Complete TypeScript definitions for all data structures

---

## 📁 Project Structure

```
├── ABI/pythContractABI.json  # ABI of pyth contract
src/
├── index.ts                 # Entry point – fetch, decode, slice, and log
├── types/
│   └── PriceFeed.ts        # TypeScript interfaces for decoded price data
└── utils/
    ├── constants.ts        # Configuration constants (headers, sizes, versions)
    └── parsers.ts          # Core decoding logic for Hermes binary data
```

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)

### 1. Clone the Repository

```bash
git clone https://github.com/007aryansaini/pyth-decode-encode.git
cd pyth-decode-encode
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
PVT_KEY=""
ALCHEMY_KEY=""
```

### 4. Run the Application

```bash
npm run dev
```


### Sample Output
The application will fetch, decode, and process Pyth price feed data. Example transaction on Polygon:
- [TX Hash - 0x78a31c63dcea47028d1d8776f16d5065e9c1be962fea5acfd405c45a186beeb4](https://polygonscan.com/tx/0x78a31c63dcea47028d1d8776f16d5065e9c1be962fea5acfd405c45a186beeb4)


---

## 📚 Resources

- [Pyth Network Documentation](https://docs.pyth.network/price-feeds)
- [Hermes API Reference](https://docs.pyth.network/price-feeds/fetch-price-updates)


---


## 👨‍💻 Author

**Aryan Saini** - [@007aryansaini](https://github.com/007aryansaini)

---
