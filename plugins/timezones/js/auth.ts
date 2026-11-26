import { lookupModule } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import type { JsonStorage } from '@valenced/json-storage'

export const api = 'https://timezone.creations.works'
const CLIENT_ID = '1377021506810417173'
const APPLICATION_UTILS_MODULE_ID = 10743

let storage: JsonStorage<any> | null = null

export function initStorage(value: JsonStorage<any>) {
    storage = value
}

export function getStorage(): JsonStorage<any> | null {
    return storage
}

export function getDomain(): string {
    return storage?.cache?.databaseUrl || api
}

function getRedirectUri(): string {
    return `${getDomain()}/auth/discord/callback`
}

type AuthCallback = () => void

interface OAuthModalOptions {
    clientId: string
    redirectUri: string
    responseType: 'code'
    scopes: string[]
    permissions: bigint
    cancelCompletesFlow: boolean
    callback: (result?: unknown) => void
}

type OpenOAuth2Modal = (options: OAuthModalOptions) => void

interface ApplicationUtils {
    openOAuth2Modal?: OpenOAuth2Modal
}

interface ApplicationUtilsExport {
    openOAuth2Modal?: OpenOAuth2Modal
    default?: ApplicationUtils
}

function getOpenOAuth2Modal(): OpenOAuth2Modal | null {
    const [found] = lookupModule(
        withProps<ApplicationUtils>('openOAuth2Modal'),
    )

    const foundTarget = found as ApplicationUtilsExport | undefined

    const initialized =
        foundTarget?.openOAuth2Modal ?? foundTarget?.default?.openOAuth2Modal

    if (typeof initialized === 'function') return initialized

    const forced: ApplicationUtilsExport | undefined =
        (globalThis as any).__r?.(APPLICATION_UTILS_MODULE_ID)

    return forced?.openOAuth2Modal ?? forced?.default?.openOAuth2Modal ?? null
}

export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    ms = 10000,
): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ms)

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        })
    } finally {
        clearTimeout(timer)
    }
}

function isRedirectUrl(value: unknown, redirectUri: string): value is string {
    return typeof value === 'string' && value.startsWith(redirectUri)
}

function getRedirectUrl(
    result: unknown,
    redirectUri: string,
): string | null {
    if (isRedirectUrl(result, redirectUri)) return result

    if (!result || typeof result !== 'object') return null

    const location = (result as { location?: unknown }).location

    if (isRedirectUrl(location, redirectUri)) return location

    if (location && typeof location === 'object') {
        const nested = (location as { location?: unknown }).location

        if (isRedirectUrl(nested, redirectUri)) return nested
    }

    return null
}

export async function checkAuthentication(): Promise<boolean> {
    try {
        const res = await fetchWithTimeout(`${getDomain()}/v1/me`, {
            credentials: 'include',
            headers: { Accept: 'application/json' },
        }, 5000)

        return res.ok
    } catch {
        return false
    }
}

async function waitForAuthentication(finish: () => void) {
    for (let attempt = 0; attempt < 60; attempt++) {
        if (await checkAuthentication()) {
            finish()
            return
        }

        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

export function authModal(callback?: AuthCallback) {
    const openOAuth2Modal = getOpenOAuth2Modal()

    if (!openOAuth2Modal) return

    const redirectUri = getRedirectUri()

    let done = false

    function finish() {
        if (done) return

        done = true
        callback?.()
    }

    openOAuth2Modal({
        clientId: CLIENT_ID,
        redirectUri,
        responseType: 'code',
        scopes: ['identify'],
        permissions: 0n,
        cancelCompletesFlow: false,
        callback: async (result?: unknown) => {
            const url = getRedirectUrl(result, redirectUri)

            if (url) {
                try {
                    const res = await fetchWithTimeout(url, {
                        credentials: 'include',
                        headers: { Accept: 'application/json' },
                    }, 10000)

                    if (res.ok) {
                        finish()
                        return
                    }
                } catch {}
            }

            waitForAuthentication(finish)
        },
    })

    waitForAuthentication(finish)
}