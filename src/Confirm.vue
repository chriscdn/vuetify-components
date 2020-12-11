<template>
	<v-dialog v-model="dialog" :max-width="options.width" persistent>
		<v-card>
			<!-- the v-if ensure the autofocus works -->
			<v-card-title class="px-4 py-3">{{ title }}</v-card-title>
			<v-card-text class="px-4 py-2" v-show="!!message" v-html="renderedMessage"></v-card-text>
			<v-card-text class="px-4 pt-0 pb-2" v-if="options.prompt">
				<v-text-field outlined class="py-0" v-model="promptValue"></v-text-field>
			</v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn color="secondary" @click.native="cancel" v-if="options.cancelLabel">{{ options.cancelLabel }}</v-btn>
				<v-btn color="primary" @click.native="agree" v-if="options.agreeLabel">{{ options.agreeLabel }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Vue from 'vue'
const marked = require('marked/lib/marked')

const defaultOptions = {
	width: 350,
	prompt: false
}

export default {
	props: {
		okLabel: {
			type: String,
			default: 'OK'
		},
		yesLabel: {
			type: String,
			default: 'Yes'
		},
		noLabel: {
			type: String,
			default: 'No'
		},
		cancelLabel: {
			type:  String,
			default: 'Cancel'
		}

	},

	data: () => ({
		dialog: false,
		resolve: null,
		// reject: null,
		message: null,
		title: null,
		options: defaultOptions,
		promptValue: null
	}),

	computed: {
		renderedMessage() {
			return !!this.message ? marked(this.message) : this.message
		}
	},

	methods: {
		open(title, message, options) {
			this.dialog = true
			this.title = title
			this.message = message
			this.options = {
				...defaultOptions,
				...{
					cancelLabel: this.cancelLabel,
					agreeLabel: this.yesLabel
				},
				...options
			}

			return new Promise(resolve => {
				this.resolve = resolve
			})
		},

		openOKCancel(title, message, options) {
			return this.open(title, message, {
				cancelLabel: this.cancelLabel,
				agreeLabel: this.okLabel,
				...options
			})
		},

		openYesNo(title, message, options) {
			return this.open(title, message, options)
		},

		alert(title, message, options) {
			return this.open(title, message, {
				cancelLabel: null,
				agreeLabel: this.okLabel,
				...options
			})
		},

		// resolves a different value
		prompt(title, message, options, promptValue = "") {
			this.promptValue = promptValue

			return this.open(title, message, {
				cancelLabel: this.cancelLabel,
				agreeLabel: this.okLabel,
				prompt: true,
				...options
			})
		},

		agree() {
			if (this.options.prompt) {
				this.resolve({
					ok: true,
					value: this.promptValue
				})
			} else {
				this.resolve(true)
			}
			this.dialog = false
		},

		cancel() {
			// this.resolve(false)
			if (this.options.prompt) {
				this.resolve({
					ok: false,
					value: this.promptValue
				})
			} else {
				this.resolve(false)
			}
			this.dialog = false
		}
	},
	watch: {
		dialog(value) {
			if (value) {
				// this.$nextTick(this.$refs.prompt.focus)
				this.promptValue = null
			}
		}
	},
	// this needs to be tested
	// is beforeCreate the right place for this?  do these methods already exist?
	beforeCreate() {
		Vue.prototype.$confirm = this
	}
}
</script>