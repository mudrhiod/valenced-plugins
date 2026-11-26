import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ToastActionCreators } from '@valenced/discord/actions'
import { Design } from '@valenced/discord/design'
import { proxify } from '@valenced/utils/proxy'
import { formatTimeZone, formatTimeZoneFull, getTimezone } from './timezone'
import type { JsonStorage } from '@valenced/json-storage'
import type { ReactNode } from 'react'
import type { Settings } from './index'

interface BannerButtonProps {
    userId: string
    jsonStorage: JsonStorage<Settings>
    original: () => ReactNode
}

const { createStyles, Button } = Design

const useButtonStyles = proxify(() =>
    createStyles({
        container: {
            position: 'relative',
        },
        button: {
            position: 'absolute',
            right: 12,
            bottom: 12,
            zIndex: 10,
        },
    }),
)

export default function BannerButton({ userId, jsonStorage, original }: BannerButtonProps) {
    const styles = useButtonStyles()
	
    const twentyFourHourFormat = jsonStorage.use()?.twentyFourHourFormat ?? true
    const [timezone, setTimezone] = useState<string | null | undefined>(undefined)
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!userId) return

        getTimezone(userId).then(setTimezone)
    }, [userId])

    useEffect(() => {
        const current = new Date()
        const delay = (60 - current.getSeconds()) * 1000 + 1000 - current.getMilliseconds()

        const timer = setTimeout(() => setNow(Date.now()), delay)
        const interval = setInterval(() => setNow(Date.now()), 60_000)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    return (
        <View style={styles.container}>
            {original()}
            {timezone != null && (
                <Button
                    variant="secondary-overlay"
                    size="sm"
                    text={formatTimeZone(timezone, now, twentyFourHourFormat)}
                    style={styles.button}
                    onPress={() =>
                        ToastActionCreators.open('TIMEZONE_FULL_TIME', {
                            text: formatTimeZoneFull(
                                timezone,
                                Date.now(),
                                twentyFourHourFormat,
                            ),
                        })
                    }
                />
            )}
        </View>
    )
}