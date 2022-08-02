import {formatSuccessMessage, LicenseKeyValidationResult, on, once, showUI} from '@create-figma-plugin/utilities'

import {CloseHandler, SaveLicenseHandler, ShowLicenseErrorHandler} from './types'
import {LICENSE_UI_HEIGHT, LICENSE_UI_HEIGHT_ERROR, LICENSE_UI_HEIGHT_VALID, LICENSE_UI_WIDTH, SUCCESS_MESSAGE_NOTIFICATION} from './utilities/constants'
import {saveLicenseAsync} from './utilities/save-license-async'
import {validateLicenseKeyMainAsync} from './utilities/validate-license-key-main-async'

export default async function (): Promise<void> {
	once<CloseHandler>('CLOSE', function (): void {
		figma.closePlugin()
	})

	on<SaveLicenseHandler>('SAVE_LICENSE', async function (license: LicenseKeyValidationResult): Promise<void> {
		// This is only called when `license` is valid. We save the license
		// to the user’s settings, show a success notification, and update
		// the plugin window height to fit the valid license state.
		await saveLicenseAsync(license)
		figma.notify(formatSuccessMessage(SUCCESS_MESSAGE_NOTIFICATION))
		figma.ui.resize(LICENSE_UI_WIDTH, LICENSE_UI_HEIGHT_VALID)
	})

	on<ShowLicenseErrorHandler>('SHOW_LICENSE_ERROR', function (): void {
		// Update the plugin window height to accommodate the error message.
		figma.ui.resize(LICENSE_UI_WIDTH, LICENSE_UI_HEIGHT_ERROR)
	})

	const license = await validateLicenseKeyMainAsync()
	showUI<LicenseKeyValidationResult>(
		{
			height: license.result === 'VALID' ? LICENSE_UI_HEIGHT_VALID : LICENSE_UI_HEIGHT,
			title: 'License',
			width: LICENSE_UI_WIDTH,
		},
		license
	)
}
