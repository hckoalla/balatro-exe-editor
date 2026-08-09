import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe, FIXTURE_STUB } from '../../test/fixtures/build-synthetic-balatro-exe'
import { locateEmbeddedZip } from './locate-embedded-zip'

describe('locateEmbeddedZip', () => {
  it('finds the offset where the stub ends and the embedded ZIP begins', () => {
    const exe = buildSyntheticBalatroExe('return {}')

    expect(locateEmbeddedZip(exe)).toBe(FIXTURE_STUB.length)
  })

  it('throws a clear error when the buffer has no ZIP at all', () => {
    const notAnExe = Buffer.from('this is not an exe and has no zip inside it')

    expect(() => locateEmbeddedZip(notAnExe)).toThrow(/does not look like a fused/i)
  })

  it('throws a clear error when an end-of-central-directory record is found but is inconsistent', () => {
    // Assinatura de EOCD (PK\x05\x06) seguida de campos que apontam pra um offset impossível.
    const corrupted = Buffer.alloc(22)
    corrupted.writeUInt32LE(0x06054b50, 0) // signature
    corrupted.writeUInt32LE(0xffffffff, 12) // cdSize absurdo
    corrupted.writeUInt32LE(0xffffffff, 16) // cdOffset absurdo

    expect(() => locateEmbeddedZip(corrupted)).toThrow(/corrupted|inconsistent/i)
  })
})
