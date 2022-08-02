import {h} from 'preact'

import {render} from '@create-figma-plugin/ui'

import {EasierGradients} from './components/easier-gradients.js'
import {License} from '../license/components/license'

export default render(function (props: any) {
	if ('licenseKey' in props) {
		return <License {...props} />
	}
	return <EasierGradients {...props} />
})
