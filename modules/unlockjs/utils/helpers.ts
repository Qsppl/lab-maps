"use strict"

/** Checks if two arrays match exactly */
export function arraysMatch(firstArr: Array<any>, secondArr: Array<any>): boolean {
	// If Array Lengths Don't Match, Return False
	if (firstArr.length !== secondArr.length) return false

	// Cycle Through Array Contents
	for (let i = 0, len = firstArr.length; i < len; i++) {
		// Checks if Content in Location Match
		if (firstArr[i] !== secondArr[i]) {
			// If They Don't Match, Return False
			return false
		}
	}

	// If Nothing Doesn't Match, Everything Matches; Therefore, Arrays Match
	return true
}

/**
 * Check if one object is fully contained in another
 * @param haystack - Object to search in
 * @param needle - Data to search for
 */
export function objectSearch(haystack: any, needle: any): boolean {
	let match = true
	Object.keys(needle).forEach(key => {
		if (!(key in haystack) || haystack[key] !== needle[key]) match = false
	})

	return match
}