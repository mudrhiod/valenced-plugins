import { useEffect } from 'react'
import Page from '@valenced/components/Page'
import { Design } from '@valenced/discord/design'
import { ReactNavigationNative } from '@valenced/externals/react-navigation'
import type { JsonStorage } from '@valenced/json-storage'
import { api as DEFAULT_API_URL } from './auth'
import type { Settings } from './index'
import { TIMEZONE_LIST_ROUTE } from './timezonelist'
import {
    loadDatabaseTimezones,
    resetTimezone,
    syncTimezone,
} from './timezone'

const { TableRow, TableRowGroup, TableSwitchRow, Text, TextInput } = Design

export default function SettingsComponent({ api }: { api: { jsonStorage: JsonStorage<Settings> } }) {
    const settings = api.jsonStorage.use()
    const twentyFourHourFormat = settings?.twentyFourHourFormat ?? true
    const timezone = settings?.timezone ?? null
    const databaseUrl = settings?.databaseUrl ?? DEFAULT_API_URL

    const navigation = ReactNavigationNative.useNavigation()

    useEffect(() => {
        loadDatabaseTimezones()
    }, [])

    return (
        <Page>
            <TableRowGroup title='Settings'>
                <TableSwitchRow
                    label='24h Time'
                    subLabel='Show time in 24h format'
                    value={twentyFourHourFormat}
                    onValueChange={(twentyFourHourFormat: boolean) =>
                        api.jsonStorage.set({ twentyFourHourFormat })
                    }
                />
            </TableRowGroup>
            <TableRowGroup title='Database'>
                <TableRow
                    label='Database URL'
                    subLabel={
                        <>
                            <Text>Database URL for timezone storage</Text>
                            <TextInput
                                value={databaseUrl}
                                placeholder='Enter a value'
                                size='md'
                                onChange={(databaseUrl: string) =>
                                    api.jsonStorage.set({ databaseUrl })
                                }
                            />
                        </>
                    }
                />
                <TableRow
                    label='Set Timezone'
                    trailing={<TableRow.TrailingText text={timezone ?? 'Select timezone'} />}
                    onPress={() => {
                        syncTimezone()
                        navigation.navigate(TIMEZONE_LIST_ROUTE)
                    }}
                    arrow
                />
                <TableRow
                    label='Reset Timezone'
                    variant='danger'
                    onPress={() => resetTimezone()}
                />
            </TableRowGroup>
        </Page>
    )
}