import {
  LicenseKeyValidationResult,
  loadSettingsAsync
} from '@create-figma-plugin/utilities'

import { SETTINGS_KEY } from './constants'

export async function loadLicenseAsync(): Promise<LicenseKeyValidationResult> {
  const license = await loadSettingsAsync<LicenseKeyValidationResult>(
    {
      email: null,
      licenseKey: null,
      purchaseTimestamp: null,
      result: 'INVALID_EMPTY',
      validationTimestamp: null,
      variant: null
    },
    SETTINGS_KEY
  )
  return license
}
