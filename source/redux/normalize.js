import React from 'react'
import { Provider } from 'react-redux'

import { clone } from '../helpers'
import { underscoredToCamelCase } from './naming'

// Normalizes common settings
export default function normalizeSettings(settings, options = {})
{
	if (settings === undefined) {
		throw new Error(`Common settings weren't passed.`)
	}

	if (typeof settings !== 'object') {
		throw new Error(`Expected a settings object, got ${typeof settings}: ${settings}`)
	}

	settings = clone(settings)

	if (options.full !== false) {
		if (!settings.routes) {
			throw new Error(`"routes" parameter is required`)
		}
		if (!settings.reducers) {
			throw new Error(`"reducers" parameter is required`)
		}
	}

	if (!settings.container) {
		// By default it wraps everything with Redux `<Provider/>`.
		settings.container = function Container({ store, children }) {
			return (
				<Provider store={ store }>
					{ children }
				</Provider>
			)
		}
	}

	// Default Redux event naming
	if (!settings.reduxEventNaming) {
		// When supplying `event` instead of `events`
		// as part of an asynchronous Redux action
		// this will generate `events` from `event`
		// using this function.
		settings.reduxEventNaming = (event) =>
		([
			`${event}_PENDING`,
			`${event}_SUCCESS`,
			`${event}_ERROR`
		])
	}

	// Default Redux property naming
	if (!settings.reduxPropertyNaming) {
		// When using "redux module" feature
		// this function will generate a Redux state property name from an event name.
		// E.g. event `GET_USERS_ERROR` => state.`getUsersError`.
		settings.reduxPropertyNaming = underscoredToCamelCase
	}

	// Default value for `parseDates` is `true`
	if (settings.parseDates !== false) {
		settings.parseDates = true
	}

	if (!settings.http) {
		settings.http = {}
	}

	if (!settings.authentication) {
		settings.authentication = {}
	}

	return settings
}