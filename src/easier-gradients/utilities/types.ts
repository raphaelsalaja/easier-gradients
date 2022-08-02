import {EventHandler} from '@create-figma-plugin/utilities'
import {EasierGradients} from '../components/easier-gradients'

export type Settings = {
	spaceEvenly: boolean
	flip: boolean
}

export type EasierGradients = Settings & {
	hasSelection: boolean
}

export type FormState = EasierGradients

export interface CloseUIHandler extends EventHandler {
	name: 'CLOSE_UI'
	handler: () => void
}
export interface SubmitHandler extends EventHandler {
	name: 'SUBMIT'
	handler: (settings: Settings) => void
}
export interface SelectionChangedHandler extends EventHandler {
	name: 'SELECTION_CHANGED'
	handler: (hasSelection: boolean) => void
}
export interface SelectionUpdatedHandler extends EventHandler {
	name: 'SELECTION_UPDATED'
	handler: (settings: Settings) => void
}
