import {emit, formatErrorMessage, formatSuccessMessage, formatWarningMessage, getDocumentUseCount, incrementDocumentUseCount, loadSettingsAsync, once, pluralize, resetDocumentUseCount, showUI} from '@create-figma-plugin/utilities'
import {MAX_FREE_USES_PER_DOCUMENT} from '../config'
import licenseMain from '../license/main'
import {validateLicenseKeyMainAsync} from '../license/utilities/validate-license-key-main-async'
import {CloseUIHandler, SelectionChangedHandler, Settings, SubmitHandler} from './utilities/types.js'
import {SUCCESS_MESSAGES, WINDOW_HEIGHT, WINDOW_WIDTH} from './utilities/constants'
import {defaultSettings} from './utilities/settings'

export default async function (): Promise<void> {
	// if not selcting anything close the UI
	// if (figma.currentPage.selection.length <= 0) {
	// 	figma.closePlugin(formatWarningMessage('Please select at least one node'))
	// 	return
	// }

	// Validate the saved license key, if any. If the license key was not
	// valid and the use count has already reached `MAX_FREE_USES`, show a
	// notification to tell the user that there are no free uses left, then
	// show the license key paywall (`licenseMain`).
	const license = await validateLicenseKeyMainAsync()
	const settings = await loadSettingsAsync(defaultSettings)

	if (figma.currentPage.selection.length === 0) {
		figma.closePlugin(formatErrorMessage('Select one or more layers'))
		return
	}

	if (license.result !== 'VALID' && getDocumentUseCount() >= MAX_FREE_USES_PER_DOCUMENT) {
		figma.notify(formatErrorMessage('0 free uses left for this file'))
		await licenseMain()
		return
	}

	once<CloseUIHandler>('CLOSE_UI', function () {
		const successMessage = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
		figma.closePlugin(formatSuccessMessage(successMessage))
	})

	once<SubmitHandler>('SUBMIT', async function (settings: Settings) {
		// If the license key was not valid, increment the use count, then show a
		// notification to tell the user the number of free uses they have left.
		if (license.result !== 'VALID') {
			incrementDocumentUseCount()
			const remainingUseCount = Math.max(0, MAX_FREE_USES_PER_DOCUMENT - getDocumentUseCount())
			const message = `${remainingUseCount} free ${pluralize(remainingUseCount, 'use')} left for this file`
			figma.notify(formatWarningMessage(message))
		}

		// Execute the main logic of the plugin, before closing the plugin.
		const selectedLayers = figma.currentPage.selection

		if (settings.flip) {
			for (let layer of selectedLayers as SceneNode[]) {
				//@ts-ignore
				let fills = layer.fills as Paint[]
				console.log(fills)
				for (let fill of fills as Paint[]) {
					if (fill.type == 'GRADIENT_LINEAR' || fill.type == 'GRADIENT_RADIAL' || fill.type == 'GRADIENT_ANGULAR' || fill.type == 'GRADIENT_DIAMOND') {
						// create  a new fill that is the same as the old gradient fill but the stops are reversed
						const stops = fill.gradientStops.map((stop) => ({
							position: 1 - stop.position,
							color: stop.color,
						}))
						const newFill = {
							...fill,
							gradientStops: stops,
						}
						fill = newFill
					}
					//@ts-ignore
					layer.fills = [fill]
				}
			}
		}

		if (settings.spaceEvenly) {
			for (let layer of selectedLayers as SceneNode[]) {
				//@ts-ignore
				let fills = layer.fills as Paint[]
				for (let fill of fills as Paint[]) {
					if (fill.type == 'GRADIENT_LINEAR' || fill.type == 'GRADIENT_RADIAL' || fill.type == 'GRADIENT_ANGULAR' || fill.type == 'GRADIENT_DIAMOND') {
						// create  a new fill that is the same as the old gradient fill but the stops are evenly spaced
						// if there are 4 stops, the new stops will be 0, 0.25, 0.5, 0.75
						const stops = fill.gradientStops.map((stop, index) => ({
							// maek the first stop 0, the last stop 1
							//@ts-ignore
							position: index / (fill.gradientStops.length - 1),
							color: stop.color,
						}))
						const newFill = {
							...fill,
							gradientStops: stops,
						}
						fill = newFill
					}

					//@ts-ignore
					layer.fills = [fill]
				}
			}
		}

		figma.closePlugin()
	})
	figma.on('selectionchange', function () {
		emit<SelectionChangedHandler>('SELECTION_CHANGED', figma.currentPage.selection.length > 0)
	})
	// Show the UI for the plugin.
	showUI(
		{
			height: WINDOW_HEIGHT,
			width: WINDOW_WIDTH,
		},
		{...settings, hasSelection: true}
	)
}
