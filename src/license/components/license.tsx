import {Banner, Button, Container, createIcon, IconWarningFilled32, Text, Textbox, useFocusTrap, useInitialFocus, useWindowKeyDown, VerticalSpace} from '@create-figma-plugin/ui'
import {emit, LicenseKeyValidationResult, validateGumroadLicenseKeyUiAsync} from '@create-figma-plugin/utilities'
import {Fragment, h, JSX} from 'preact'
import {useCallback, useState} from 'preact/hooks'

import {GUMROAD_PRODUCT_ID} from '../../config'
import {CloseHandler, SaveLicenseHandler, ShowLicenseErrorHandler} from '../types'
import {ERROR_MESSAGE_ENDPOINT_DOWN, ERROR_MESSAGE_INVALID, ERROR_MESSAGE_INVALID_EMPTY, SUCCESS_MESSAGE_VALID_LICENSE} from '../utilities/constants'
import styles from './license.css'

// Mapping of `LicenseKeyValidationResult['result']` to error messages.
const errorMessages: Record<'ENDPOINT_DOWN' | 'INVALID' | 'INVALID_EMPTY', string> = {
	ENDPOINT_DOWN: ERROR_MESSAGE_ENDPOINT_DOWN,
	INVALID: ERROR_MESSAGE_INVALID,
	INVALID_EMPTY: ERROR_MESSAGE_INVALID_EMPTY,
}

const LargeCheckIcon = createIcon('M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16zm7.822-19.269l-1.644-1.462-7.225 8.128-5.175-5.175-1.556 1.556 6.825 6.825 8.775-9.872z', {height: 32, width: 32})

export function License(props: LicenseKeyValidationResult): JSX.Element {
	const [license, setLicense] = useState(props)
	const [licenseKey, setLicenseKey] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleLicenseKeyInput = useCallback(function (licenseKey: string) {
		setLicenseKey(licenseKey)
	}, [])

	const handleSubmit = useCallback(
		async function () {
			// Validate the input `licenseKey` via the Gumroad API. If not valid,
			// show an error message. If valid, save the license to the user’s
			// settings (by emitting the `SAVE_LICENSE` event).
			setIsLoading(true)
			const license = await validateGumroadLicenseKeyUiAsync({
				licenseKey,
				productPermalink: GUMROAD_PRODUCT_ID,
			})
			setLicense(license)
			setIsLoading(false)
			if (license.result !== 'VALID') {
				emit<ShowLicenseErrorHandler>('SHOW_LICENSE_ERROR')
				return
			}
			emit<SaveLicenseHandler>('SAVE_LICENSE', license)
		},
		[licenseKey]
	)

	// Trap tab focus within the plugin UI.
	useFocusTrap()

	// Close the plugin when the `Escape` key is pressed.
	useWindowKeyDown('Escape', function () {
		emit<CloseHandler>('CLOSE')
	})

	// Submit the form when the `Enter` key is pressed.
	useWindowKeyDown('Enter', function () {
		handleSubmit()
	})

	const initialFocus = useInitialFocus()

	if (license.result === 'VALID') {
		return <LicenseValid email={license.email} variant={license.variant} />
	}

	return (
		<Fragment>
			<Container space='medium'>
				<VerticalSpace space='large' />
				<Text muted>License key</Text>
				<VerticalSpace space='small' />
				<Textbox {...initialFocus} name='licenseKey' onValueInput={handleLicenseKeyInput} placeholder='E.g. “42E76172-31E8C901-B59C9D79-02D0671A”' value={licenseKey} />
				<VerticalSpace space='extraLarge' />
				<Button fullWidth loading={isLoading === true} onClick={handleSubmit}>
					Unlock plugin
				</Button>
				<div class={styles.buyLicenseKey}>
					<a href={`https://gum.co/${GUMROAD_PRODUCT_ID}`} rel='noreferrer' tabIndex={0} target='_blank'>
						<span>Buy a license key</span>
					</a>
				</div>
			</Container>
			<Banner icon={<IconWarningFilled32 />} type='warning'>
				{errorMessages[license.result]}
			</Banner>
		</Fragment>
	)
}

function LicenseValid(props: {email: string; variant: null | string}): JSX.Element {
	const handleCloseButtonClick = useCallback(function () {
		emit<CloseHandler>('CLOSE')
	}, [])

	const {email, variant} = props

	const initialFocus = useInitialFocus()

	return (
		<Container space='medium'>
			<VerticalSpace space='extraLarge' />
			<div class={styles.largeCheckIcon}>
				<LargeCheckIcon />
			</div>
			<VerticalSpace space='extraSmall' />
			<Text align='center'>{SUCCESS_MESSAGE_VALID_LICENSE}</Text>
			<VerticalSpace space='extraLarge' />
			<Text align='center' muted>
				{variant === null ? 'Licensed to' : variant}
			</Text>
			<VerticalSpace space='small' />
			<Text align='center'>{email}</Text>
			<VerticalSpace space='extraLarge' />
			<Button {...initialFocus} fullWidth onClick={handleCloseButtonClick}>
				Close
			</Button>
			<VerticalSpace space='small' />
		</Container>
	)
}
