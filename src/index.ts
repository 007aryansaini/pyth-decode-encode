import { HermesClient } from '@pythnetwork/hermes-client'
import { decodeHermesHexData, sliceAccumulatorBinary } from './utils/parsers'

async function main(): Promise<void> {
  const connection = new HermesClient('https://hermes.pyth.network', {})
  const priceIds: string[] = [
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
    "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445", // AAVE/USD
    "0xa98bfb9501a843d1c048fd51e71e403da89df1e996016fd692332f835bef5778", // ABSTER/USD
    "0x4d716b908b470fabc1f9eeaf62ad32424b2388bf981401385df19ead98499c7c", // ACT/USD
    "0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d", // ADA/USD
    "0xdd83d991ed72e3d688509ca349f29d2bd3d883af74a17b9515c310ff70e9d1e4", // AERGO/USD
    "0x9db37f4d5654aad3e37e2e14ffd8d53265fb3026d1d8f91146539eebaa2ef45f", // AERO/USD
    "0x104e4d9ba218610b9af53c887f9fcb7396615259867a5a4b5983a65802aeee0b", // AEVO/USD
    "0x17cd845b16e874485b2684f8b8d1517d744105dbb904eec30222717f4bc9ee0d", // AFSUI/USD
    "0x2551eca7784671173def2c41e6f3e51e11cd87494863f1d208fdd8c64a1f85ae", // AI16Z/USD
    "0x0fc54579a29ba60a08fdb5c28348f22fd3bec18e221dd6b90369950db638a5a7", // AIXBT/USD
    "0x4ea5bb4d2f5900cc2e97ba534240950740b4d3b89fe712a94a7304fd2fd92702", // AKT/USD
    "0xfa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0", // ALGO/USD
    "0xccca1d2b0d9a9ca72aa2c849329520a378aea0ec7ef14497e67da4050d6cf578", // ALICE/USD
    "0xa6cdf5ac29a2bb75c2d1347e85362b703c7c8090a21d358e6b4155294e5b3159", // ALP/USD.RR
    "0x119ff2acf90f68582f5afd6f7d5f12dbae81e4423f165837169d6b94c27fb384", // ALT/USD
    "0x9074ab34363ea1aada15db169f4678c10117e48f1ad1a8ba9f69c2a939c3a377", // AMI/USD
    "0xd37e4513ebe235fff81e453d400debaf9a49a5df2b7faa11b3831d35d7e72cb7", // AMP/USD
    "0xc311b1d00e78d0e487e57efa12b21e77873985ff68925184fd288bf0fdf2e427"  // AMPL/USD
  ]

  const priceUpdates = await connection.getLatestPriceUpdates(priceIds)
  const hexData = priceUpdates?.binary?.data[0]
  if (!hexData) throw new Error('No hex data found')

  const decoded = decodeHermesHexData(hexData)
  console.log('Decoded 20 Tokens Prices:', decoded)

  const slicedHex = sliceAccumulatorBinary(hexData, 0, 5).toString('hex')
  console.log('Encoded 5-token calldata (hex):', slicedHex)

  const decodedFiveTokens = decodeHermesHexData(slicedHex)
  console.log('Decoded First 5 Token Prices:', decodedFiveTokens)
  
}

main().catch(console.error)