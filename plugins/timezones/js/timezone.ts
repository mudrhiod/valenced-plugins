import {
    authModal,
    checkAuthentication,
    getDomain,
    getStorage,
} from './auth'

export let databaseTimezones: Record<string, string> = {}

function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), ms),
        ),
    ])
}

export async function getTimezone(userId: string): Promise<string | null> {
    try {
        const res = await timeout(fetch(
            `${getDomain()}/v1/get?id=${encodeURIComponent(userId)}`,
            {
                headers: { Accept: 'application/json' },
            },
        ), 5000)

        if (!res.ok) return null

        const json = await res.json()

        return typeof json?.timezone === 'string' ? json.timezone : null
    } catch {
        return null
    }
}

export async function getOwnTimezone(): Promise<string | null> {
    try {
        const res = await timeout(fetch(`${getDomain()}/v1/me`, {
            credentials: 'include',
            headers: { Accept: 'application/json' },
        }), 5000)

        if (!res.ok) return null

        const json = await res.json()

        return typeof json?.timezone === 'string' ? json.timezone : null
    } catch {
        return null
    }
}

export async function syncTimezone(): Promise<void> {
    const isAuthenticated = await checkAuthentication()

    if (!isAuthenticated) {
        return new Promise(resolve => {
            authModal(() => {
                syncTimezoneInternal().then(resolve)
            })
        })
    }

    return syncTimezoneInternal()
}

async function syncTimezoneInternal(): Promise<void> {
    const savedTimezone = await getOwnTimezone()

    if (!savedTimezone) return

    await getStorage()?.set({ timezone: savedTimezone })
}

export async function resetTimezone(): Promise<void> {
    if (!(await deleteTimezone())) return

    await getStorage()?.set({ timezone: null })
}

export async function loadDatabaseTimezones(): Promise<string[]> {
    try {
        const res = await timeout(fetch(`${getDomain()}/v1/timezones`, {
            headers: { Accept: 'application/json' },
        }), 10000)

        if (!res.ok) return []

        const json = await res.json()
        const source = Array.isArray(json)
            ? json
            : Array.isArray(json?.timezones)
                ? json.timezones
                : Object.keys(json?.timezones ?? json ?? {})

        const next: Record<string, string> = {}

        for (const item of source) {
            if (typeof item === 'string') next[item] = item
        }

        databaseTimezones = next

        return Object.keys(next).sort()
    } catch {
        return []
    }
}

export async function setTimezone(timezone: string): Promise<boolean> {
    const isAuthenticated = await checkAuthentication()

    if (!isAuthenticated) {
        return new Promise(resolve => {
            authModal(() => {
                setTimezoneInternal(timezone).then(resolve)
            })
        })
    }

    return setTimezoneInternal(timezone)
}

async function setTimezoneInternal(timezone: string): Promise<boolean> {
    try {
        const res = await timeout(fetch(`${getDomain()}/v1/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            credentials: 'include',
            body: `timezone=${encodeURIComponent(timezone)}`,
        }), 10000)

        return res.ok
    } catch {
        return false
    }
}

export async function deleteTimezone(): Promise<boolean> {
    const isAuthenticated = await checkAuthentication()

    if (!isAuthenticated) {
        return new Promise(resolve => {
            authModal(() => {
                deleteTimezoneInternal().then(resolve)
            })
        })
    }

    return deleteTimezoneInternal()
}

async function deleteTimezoneInternal(): Promise<boolean> {
    try {
        const res = await timeout(fetch(`${getDomain()}/v1/delete`, {
            method: 'DELETE',
            headers: { Accept: 'application/json' },
            credentials: 'include',
        }), 10000)

        return res.ok
    } catch {
        return false
    }
}

export function formatTimeZone(
    timezone: string,
    timestamp: string | number | Date,
    twentyFourHourFormat: boolean,
): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

    try {
        return new Intl.DateTimeFormat(undefined, {
            hour: twentyFourHourFormat ? '2-digit' : 'numeric',
            minute: '2-digit',
            hour12: !twentyFourHourFormat,
            timeZone: timezone,
            timeZoneName: 'short',
        }).format(date)
    } catch {
        return timezone
    }
}

export function formatTimeZoneFull(
    timezone: string,
    timestamp: string | number | Date,
    twentyFourHourFormat: boolean,
): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

    try {
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: !twentyFourHourFormat,
            timeZone: timezone,
        }).format(date)
    } catch {
        return timezone
    }
}