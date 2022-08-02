import { resetDocumentUseCount } from '@create-figma-plugin/utilities'

import { saveLicenseAsync } from '../license/utilities/save-license-async'

export default async function (): Promise<void> {
  await saveLicenseAsync({
    email: null,
    licenseKey: null,
    purchaseTimestamp: null,
    result: 'INVALID_EMPTY',
    validationTimestamp: null,
    variant: null
  })
  resetDocumentUseCount()
  figma.closePlugin('Reset')
}
