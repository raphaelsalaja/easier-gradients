import {
  LicenseKeyValidationResult,
  saveSettingsAsync
} from '@create-figma-plugin/utilities'

import { SETTINGS_KEY } from './constants'

export async function saveLicenseAsync(
  license: LicenseKeyValidationResult
): Promise<void> {
  await saveSettingsAsync(license, SETTINGS_KEY)
}
