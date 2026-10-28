import { LensClient } from '@anvia/lens'

export const lens = new LensClient({ optional: true })
export const lensObserver = lens.observer({ captureMode: 'safe' })
