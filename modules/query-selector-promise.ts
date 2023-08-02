"use strict"

export default async function querySelectorPromise<E extends Element>(selectors: string): Promise<E | null> {
    if (typeof selectors !== 'string') new TypeError()

    if (document.readyState === "complete" || document.readyState ===  "interactive") return document.querySelector<E>(selectors)

    await new Promise((resolve) => { document.addEventListener('DOMContentLoaded', () => { resolve(true) }) })

    return document.querySelector<E>(selectors)
}