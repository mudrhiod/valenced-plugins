// adapted from https://github.com/Valenced/valenced-community-plugins/blob/main/plugins/developer-kit/screens/AssetBrowserSettingScreen.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import Page from '@valenced/components/Page'
import SearchInput from '@valenced/components/SearchInput'
import { Design, FormRadio } from '@valenced/discord/design'
import {
    onSettingsModulesLoaded,
    refreshSettings,
    registerSettingsItem,
} from '@valenced/discord/modules/settings'
import { debounce } from '@valenced/utils/callback'
import type { JsonStorage } from '@valenced/json-storage'
import type { Settings } from './index'
import { loadDatabaseTimezones, setTimezone } from './timezone'

export const TIMEZONE_LIST_ROUTE = 'TimezoneDatabaseList'

const { TableRow } = Design

export default function TimezoneList({ jsonStorage }: { jsonStorage: JsonStorage<Settings> }) {
    const selected = jsonStorage.use()?.timezone ?? null
    const [timezones, setTimezones] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const debouncedSetSearch = useCallback(debounce(setSearch, 100), [])

    useEffect(() => {
        loadDatabaseTimezones().then(setTimezones)
    }, [])

    const filteredTimezones = useMemo(
        () =>
            !search.length
                ? timezones
                : timezones.filter(timezone =>
                    timezone.toLowerCase().includes(search.toLowerCase()),
                ),
        [timezones, search],
    )

    async function select(timezone: string | null) {
        if (!timezone || timezone === selected) return

        if (await setTimezone(timezone)) {
            jsonStorage.set({ timezone })
        }
    }

    return (
        <Page spacing={16}>
            <SearchInput
                onChange={(v: string) => {
                    debouncedSetSearch(v)
                }}
                placeholder='Search timezones'
                size='md'
            />
            <FlatList
                data={filteredTimezones}
                contentContainerStyle={{ paddingBottom: 16 }}
                keyExtractor={timezone => timezone}
                renderItem={({ item: timezone, index }) => (
                    <TableRow
                        label={timezone}
                        arrow={false}
                        start={!index}
                        end={index === filteredTimezones.length - 1}
                        trailing={<FormRadio selected={timezone === selected} />}
                        onPress={() => select(timezone)}
                    />
                )}
            />
        </Page>
    )
}

export function registerTimezoneListRoute(
    cleanup: (fn: () => void) => void,
    jsonStorage: JsonStorage<Settings>,
) {
    cleanup(
        onSettingsModulesLoaded(() => {
            const unregister = registerSettingsItem(TIMEZONE_LIST_ROUTE, {
                parent: null,
                type: 'route',
                useTitle: () => 'Set Timezone',
                screen: {
                    route: TIMEZONE_LIST_ROUTE,
                    getComponent: () => () => <TimezoneList jsonStorage={jsonStorage} />,
                },
            })

            refreshSettings()
            cleanup(() => {
                unregister()
                refreshSettings()
            })
        }),
    )
}