type CookiesOptions = {
    expires?: string | number | Date
    path?: string
    domain?: string
    secure?: boolean
}

export default class Cookies {
    #options: CookiesOptions

    constructor(options: CookiesOptions = { path: "/" }) {
        this.#options = options
    }

    get(key: string): string | null {
        let matches = document.cookie.match(new RegExp(
            // кошмар и садомия
            "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ))

        return matches ? decodeURIComponent(matches[1]) : null
    }

    set(key: string, value: any, options: CookiesOptions = {}): this {
        const mergedOptions: CookiesOptions = { ...this.#options, ...options }

        // serialize data
        key = encodeURIComponent(key)
        value = encodeURIComponent(value)
        if (key in mergedOptions) throw new Error("collision!")

        const serializedOptions = Object.entries(mergedOptions).map(([key, value]) => {
            // serialize options
            if (value instanceof Date) return [key, value.toUTCString()]
            if (value === true) return [key]
            return [key, value]
        })

        // writing to cookie notation
        const rawCookie = [[key, value], ...serializedOptions]
            .map(keyToValuePair => keyToValuePair.join("="))
            .join(";")

        document.cookie = rawCookie

        return this
    }

    remove(key: string, options: CookiesOptions = {}): Cookies {
        this.set(key, null, { ...options, expires: 0 })
        return this
    }
}