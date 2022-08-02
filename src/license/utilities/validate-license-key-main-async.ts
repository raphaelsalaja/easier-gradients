import {
  LicenseKeyValidationResult,
  validateGumroadLicenseKeyMainAsync
} from '@create-figma-plugin/utilities'

import { GUMROAD_PRODUCT_ID } from '../../config'
import { REVALIDATE_LICENSE_KEY_MINUTES } from './constants'
import { loadLicenseAsync } from './load-license-async'
import { saveLicenseAsync } from './save-license-async'

export async function validateLicenseKeyMainAsync(): Promise<LicenseKeyValidationResult> {
  const savedLicense = await loadLicenseAsync()
  if (savedLicense.result === 'VALID') {
    // If the saved license key is already valid, compare the last validated
    // time with the current time. Skip validation and immediately return the
    // saved license key if and only if the license key was already validated
    // within the last `REVALIDATE_LICENSE_KEY_MINUTES`.
    const validationUnixTimestamp = new Date(
      savedLicense.validationTimestamp
    ).getTime()
    const currentUnixTimestamp = Date.now()
    if (
      currentUnixTimestamp - validationUnixTimestamp <
      REVALIDATE_LICENSE_KEY_MINUTES * 60
    ) {
      return savedLicense
    }
  }

  // Validate the saved license key via the Gumroad API, and save the result to
  // the user’s settings if the license key was valid.
  const license = await validateGumroadLicenseKeyMainAsync({
    licenseKey: savedLicense.licenseKey === null ? '' : savedLicense.licenseKey,
    productPermalink: GUMROAD_PRODUCT_ID
  })
  if (license.result === 'VALID') {
    await saveLicenseAsync(savedLicense)
  }
  return license
}
