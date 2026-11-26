import { getModules } from '@valenced/modules/finders'
import { withName } from '@valenced/modules/finders/filters'
import { insteadJSX } from '@valenced/react/jsx-runtime'
import { api, initStorage } from './auth'
import BannerButton from './bannerbutton'
import SettingsComponent from './settings'
import { registerTimezoneListRoute } from './timezonelist'

export interface Settings {
    twentyFourHourFormat: boolean
    timezone: string | null
    databaseUrl: string
}

const DefaultSettings: Settings = {
    twentyFourHourFormat: true,
    timezone: null,
    databaseUrl: api,
}

export default plugin<{ jsonStorage: Settings }>({
    jsonStorage: {
        load: true,
        default: DefaultSettings,
    },
    start({ cleanup, jsonStorage, plugin }) {
        initStorage(jsonStorage)

        if (plugin.startedLate) plugin.requireReload()

        cleanup(
            getModules(withName('UserProfileBanner'), (mod: any) => {
                const Banner = mod?.default ?? mod

                if (typeof Banner !== 'function') return

                cleanup(
                    insteadJSX(Banner, ([type, props, key], jsx) =>
                        jsx(
                            BannerButton, {
                                userId: props?.user?.id,
                                original: () => jsx(type, props, key),
                                jsonStorage,
                            }, key,
                        ),
                    ),
                )
            }),
        )

        registerTimezoneListRoute(cleanup, jsonStorage)
    },
    SettingsComponent,
})