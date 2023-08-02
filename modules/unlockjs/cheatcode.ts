"use strict"

/**
 * @file CheatCode Class
 * @author Quangdao Nguyen
 * @see CheatCode
 */

import { keyMap, stringKeyMap } from './utils/maps.js'
import { arraysMatch } from './utils/helpers.js'

/** Converts a cheatcode in any supported format into a number array */
function compileCode(v: Array<string> | string): Array<number> {
	const codeArray: any = (typeof v === 'string') ? v.split('') : v

	return codeArray.map((x: string) => stringKeyMap[x] || x).map(item => {
		// Since cheatcodes rely on keydown instead of keypress, single letters should use the uppercase by default
		const result = keyMap[item.toUpperCase()] || keyMap[item.toLowerCase()]

		if (!result) throw new Error(`Unrecognized key: ${item}`)

		return result
	})
}

export default class CheatCode {
	/**
	 * Callback function
	 * @private
	 */
	#callback: Function | null = null;

	/**
	 * Compiled code array
	 * @private
	 */
	#code: Array<number> = [];

	/**
	 * Current keys chain
	 * @private
	 */
	#keyslist: Array<number> = [];

	/**
	 * setTimeout for keys
	 * @private
	 */
	#keyTimer: number | null = null;


	/**
	 * Active state
	 * @private
	 */
	#enabled: boolean = true;

	/**
	 * Duration before cheatcode timer resets
	 * @name CheatCode#timeout
	 */
	timeout: number = 500;

	/**
	 * @param name - Identifier or settings object
	 * @param code - Code
	 * @param callback - Callback function
	 */
	constructor(name: string | object, code: string | Array<any>, callback: Function) {
		if (typeof name === 'object') {
			code = name.code
			callback = name.callback
			name = name.name
		}
		this.name = name
		this.code = code
		this.callback = callback

		this.handleKeyPress = this.handleKeyPress.bind(this)
	}

	/**
	 * The chain of keys to trigger the cheat
	 * @name CheatCode#code
	 * @type {Array<number>|Array<string>|String}
	 */
	set code(v) {
		this.#code = compileCode(v)
	}

	get code() {
		return this.#code
	}

	/**
	 * @name CheatCode#callback
	 * @type {function}
	 */
	set callback(v) {
		this.#callback = v
	}

	get callback() {
		return this.#callback
	}

	/**
	 * Get enabled state.
	 *
	 * @name CheatCode#enabled
	 * @type {boolean}
	 * @readonly
	 */
	get enabled() {
		return this.#enabled
	}

	/**
	 * Compare keylist with cheat code and trigger the callback
	 * @method CheatCode#check
	 * @param {Array<string>} keys
	 * @returns {boolean}
	 */
	check(keys: Array<string>): boolean {
		if (this.enabled && arraysMatch(this.code, keys)) {
			this.callback()
			return true
		}
		return false
	}

	/**
	 * Handles the keypress events
	 * @method CheatCode#handleKeyPress
	 * @private
	 * @param {KeyboardEvent} e
	 */
	handleKeyPress(e: KeyboardEvent) {
		this.#keyslist.push(e.keyCode)

		this.check(this.#keyslist)

		clearTimeout(this.#keyTimer)
		this.#keyTimer = setTimeout(() => {
			this.reset()
		}, this.timeout)
	}

	/**
	 * Bind the event listener
	 * @method CheatCode#bind
	 */
	bind() {
		document.addEventListener('keydown', this.handleKeyPress)
	}

	/**
	 * Unbind the event listener
	 * @method CheatCode#unbind
	 */
	unbind() {
		document.removeEventListener('keydown', this.handleKeyPress)
	}

	/**
	 * Resets the current keys chain
	 * @method CheatCode#reset
	 */
	reset() {
		this.#keyslist.length = 0
	}

	/**
	 * Toggle the enabled state of the cheatcode
	 * @method CheatCode#toggle
	 * @param {boolean} [condition] - Force a toggle state
	 */
	toggle(condition: boolean) {
		this.#enabled = typeof condition !== 'undefined' ? condition : !this.#enabled
	}

	/**
	 * Sets enabled to true, shorthand for CheatCode#toggle(true)
	 * @method CheatCode#enable
	 */
	enable() {
		this.toggle(true)
	}

	/**
	 * Sets enabled to true, shorthand for CheatCode#toggle(false)
	 * @method CheatCode#disable
	 */
	disable() {
		this.toggle(false)
	}

	static compile = compileCode;

	toJSON() {
		return {
			name: this.name,
			code: this.code
		}
	}

	toString() {
		return this.name
	}
}