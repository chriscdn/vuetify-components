<template>
	<v-dialog :value="dialog" persistent :max-width="300" content-class="extension-please-wait">
		<v-card>
			<v-card-title>{{ message }}</v-card-title>
			<v-card-text>
				<v-progress-linear v-if="indeterminate" indeterminate striped rounded class="mb-0" :height="10" />
				<v-progress-linear v-else striped rounded stream :value="value" color="primary" class="mb-0" :height="10" :buffer-value="value" />
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
	props: {
		defaultLabel: {
			type: String,
			default: 'One moment...'
		}
	},
	data() {
		return {
			dialog: false,
			message: null,
			value: null
		}
	},
	computed: {
		indeterminate() {
			return this.value == null
		}
	},
	methods: {
		show(message = this.defaultLabel, value = null) {
			this.message = message
			this.value = value
			this.dialog = true
		},
		close() {
			this.dialog = false
		}
	},
	beforeCreate() {
		Vue.prototype.$pleasewait = this
	}
}
</script>
<style>
.extension-please-wait {
	z-index: 3000;
}
</style>