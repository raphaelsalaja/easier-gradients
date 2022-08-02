import {
  EventHandler,
  LicenseKeyValidationResult
} from '@create-figma-plugin/utilities'

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}

export interface SaveLicenseHandler extends EventHandler {
  name: 'SAVE_LICENSE'
  handler: (license: LicenseKeyValidationResult) => void
}

export interface ShowLicenseErrorHandler extends EventHandler {
  name: 'SHOW_LICENSE_ERROR'
  handler: () => void
}
