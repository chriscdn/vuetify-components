import Confirm from './Confirm.vue'
import PleaseWait from './PleaseWait.vue'
import SnackBarQueue from './SnackBarQueue.vue'


export default {
	install(Vue, _options) {
		Vue.component('Confirm', Confirm)
		Vue.component('PleaseWait', PleaseWait)
		Vue.component('SnackBarQueue', SnackBarQueue)
	}
}