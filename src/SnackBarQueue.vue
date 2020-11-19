<template>
	<v-snackbar :top="top" :left="left" :right="right" :centered="centered" :bottom="bottom" content-class="v-snackbar-queue" v-model="show" :color="snackbar.color" :timeout="snackbar.timeout">{{ snackbar.text }}
		<template v-slot:action="{ attrs }">
			<v-btn dark icon @click="show = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
import Vue from 'vue'

export default {
	props: {
		color: {
			type: String,
			default: 'primary'
		},
		timeout: {
			type: Number,
			default: 6000
		},
		top: {
			type: Boolean,
			default: false
		},
		left: {
			type: Boolean,
			default: false
		},
		right: {
			type: Boolean,
			default: false
		},
		centered: {
			type: Boolean,
			default: false
		},
		bottom: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			snackbar: {}, //  { ...defaultOptions },
			defaultSnackbar: {
				// ...defaultOptions,
				color: this.color,
				timeout: this.timeout
			},
			show: false,
			items: []
		}
	},
	methods: {
		processNext() {
			const next = this.items.shift()

			if (next) {
				// no point displaying the same message twice
				if (this.snackbar.text == next.text) {
					this.processNext()
				} else {
					this.snackbar = next
					this.show = true
				}
			} else {
				this.snackbar = {}
			}
		},

		queue(text, options = {}) {
			this.items.push({
				...this.defaultSnackbar,
				...options,
				text
			})

			if (!this.show) {
				this.processNext()
			}
		}

	},
	watch: {
		show(value) {
			if (!value) {
				this.$nextTick(() => {
					this.processNext()
				})
			}
		}
	},
	beforeCreate() {
		Vue.prototype.$snackbar = {
			notify: (text, options) => {
				this.queue(text, options)
			},
			error: (text, options) => {
				this.queue(text, {
					color: 'error',
					...options
				})
			}
		}
	}
}
</script>

<style>
.v-snackbar-queue {
	font-size: 1.2rem !important;
}
</style>