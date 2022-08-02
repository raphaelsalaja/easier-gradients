import {Button, Checkbox, Text, useForm} from '@create-figma-plugin/ui'
import {emit, on} from '@create-figma-plugin/utilities'
import {h, JSX} from 'preact'
import {useEffect} from 'preact/hooks'
import {CloseUIHandler, EasierGradients, FormState, SelectionChangedHandler, SubmitHandler, SelectionUpdatedHandler} from '../utilities/types'
import styles from './easier-gradients.css'

export function EasierGradients(props: EasierGradients): JSX.Element {
	const {disabled, formState, handleSubmit, initialFocus, setFormState} = useForm<FormState>(props, {
		close: function () {
			emit<CloseUIHandler>('CLOSE_UI')
		},
		submit: function ({spaceEvenly, flip}: FormState) {
			emit<SubmitHandler>('SUBMIT', {spaceEvenly, flip})
		},
		validate: function ({hasSelection, spaceEvenly, flip}: FormState) {
			return hasSelection == true && (spaceEvenly === true || flip === true)
		},
	})
	useEffect(
		function () {
			return on<SelectionChangedHandler>('SELECTION_CHANGED', function (hasSelection: boolean) {
				setFormState(hasSelection, 'hasSelection')
			})
		},
		[setFormState]
	)
	const {spaceEvenly, flip} = formState
	return (
		<div class={styles.root}>
			<div class={styles.content}>
				<Checkbox name='flip' onValueChange={setFormState} value={flip}>
					<Text> Flip 'Em Around </Text>
				</Checkbox>
				<Checkbox name='spaceEvenly' onValueChange={setFormState} value={spaceEvenly}>
					<Text> Space 'Em Evenly </Text>
				</Checkbox>
			</div>
			<div class={styles.footer}>
				<Button {...initialFocus} disabled={disabled === true} fullWidth onClick={handleSubmit}>
					Make It Easier 😎
				</Button>
			</div>
			<div class={styles.support}>
				Created with love by{' '}
				<a href={`https://twitter.com/raf_underscore`} rel='noreferrer' tabIndex={0} target='_blank'>
					<span>Raphael S</span>
				</a>
				🤍
			</div>
		</div>
	)
}
