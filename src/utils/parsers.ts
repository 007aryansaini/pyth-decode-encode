import BN from 'bn.js'
import { DecodedPriceFeed } from '../types/PriceFeed'
import {
  ACCUMULATOR_MAGIC,
  MAJOR_VERSION,
  MINOR_VERSION,
  KECCAK160_HASH_SIZE,
  PRICE_FEED_MESSAGE_VARIANT,
} from './constants'

export function isAccumulatorUpdateData(buf: Buffer): boolean {
  return (
    buf.toString('hex', 0, 4) === ACCUMULATOR_MAGIC &&
    buf[4] === MAJOR_VERSION &&
    buf[5] === MINOR_VERSION
  )
}

export function decodePriceFeedMessage(message: Buffer): DecodedPriceFeed {
  let offset = 0
  const variant = message.readUInt8(offset)
  if (variant !== PRICE_FEED_MESSAGE_VARIANT) throw new Error('Unknown variant')

  offset += 1
  const feedId = message.subarray(offset, offset + 32).toString('hex')
  offset += 32

  const price = new BN(message.subarray(offset, offset + 8), 'be')
  offset += 8

  const confidence = new BN(message.subarray(offset, offset + 8), 'be')
  offset += 8

  const exponent = message.readInt32BE(offset)
  offset += 4

  const publishTime = new BN(message.subarray(offset, offset + 8), 'be')
  offset += 8

  const prevPublishTime = new BN(message.subarray(offset, offset + 8), 'be')
  offset += 8

  const emaPrice = new BN(message.subarray(offset, offset + 8), 'be')
  offset += 8

  const emaConfidence = new BN(message.subarray(offset, offset + 8), 'be')

  return {
    feedId,
    price: price.toString(),
    confidence: confidence.toString(),
    exponent,
    publishTime: publishTime.toString(),
    prevPublishTime: prevPublishTime.toString(),
    emaPrice: emaPrice.toString(),
    emaConfidence: emaConfidence.toString(),
  }
}

export function decodeHermesHexData(hexData: string): DecodedPriceFeed[] {
  const buf = Buffer.from(hexData, 'hex')
  if (!isAccumulatorUpdateData(buf)) throw new Error('Invalid accumulator update format')

  let offset = 6
  const trailingSize = buf.readUInt8(offset)
  offset += 1 + trailingSize

  offset += 1 // Skip proof type
  const vaaSize = buf.readUInt16BE(offset)
  offset += 2 + vaaSize

  const numUpdates = buf.readUInt8(offset)
  offset += 1

  const results: DecodedPriceFeed[] = []

  for (let i = 0; i < numUpdates; i++) {
    const messageSize = buf.readUInt16BE(offset)
    offset += 2

    const message = buf.subarray(offset, offset + messageSize)
    offset += messageSize

    const numProofs = buf.readUInt8(offset)
    offset += 1 + numProofs * KECCAK160_HASH_SIZE

    results.push(decodePriceFeedMessage(message))
  }

  return results
}

export function sliceAccumulatorBinary(hexData: string, start = 0, end = 5): Buffer {
  const data = Buffer.from(hexData, 'hex')
  if (data.toString('hex', 0, 4) !== ACCUMULATOR_MAGIC) {
    throw new Error('Invalid magic')
  }

  let cursor = 6
  const trailingPayloadSize = data.readUInt8(cursor)
  cursor += 1 + trailingPayloadSize

  cursor += 1
  const vaaSize = data.readUInt16BE(cursor)
  cursor += 2

  const vaaEnd = cursor + vaaSize
  const updatesStart = vaaEnd + 1 // +1 for numUpdates byte
  let tempCursor = updatesStart

  const updates: Buffer[] = []
  const numUpdates = data.readUInt8(vaaEnd)
  for (let i = 0; i < numUpdates; i++) {
    const updateStart = tempCursor
    const messageSize = data.readUInt16BE(tempCursor)
    tempCursor += 2 + messageSize
    const proofCount = data.readUInt8(tempCursor)
    tempCursor += 1 + proofCount * KECCAK160_HASH_SIZE
    const updateEnd = tempCursor
    updates.push(data.subarray(updateStart, updateEnd))
  }

  const selectedUpdates = updates.slice(start, end)

  const parts: Buffer[] = []
  parts.push(data.subarray(0, vaaEnd))
  parts.push(Buffer.from([selectedUpdates.length]))
  parts.push(...selectedUpdates)

  return Buffer.concat(parts)
}
