/// <reference types="@valenced/themes-api" />

import type { ThemeColors } from '@valenced/themes-api/types'
import { accentGradient } from './utils'

const palette = {
	accent: "#B5BDFF",

	background_primary: "#1c1b22",
  	background_secondary: "#24232b",
	background_surface: "#26252B",
  	background_tertiary: "#202028",

	border: "#697eab29",
	hover: "#ffffff05",

	text: "#ffffff",
    subtext0: "#DCDDE5",
    subtext1: "#C6C8CE",
}
const semanticColors = {
	BACKGROUND_SURFACE_HIGH: palette.background_secondary,
	BACKGROUND_SURFACE_HIGHEST: "#212027",
	
	BACKGROUND_MOD_SUBTLE: palette.hover, // context menu hover - revisit colour
	BACKGROUND_MOD_MUTED: "#444664",
	BACKGROUND_MOD_NORMAL: "#363749", // boost bar in channel list - revisit colour
	BACKGROUND_MOD_STRONG: "#363749",

	CHANNEL_BACKGROUND_DEFAULT: palette.background_secondary,
	PANEL_BG: palette.background_secondary,
	STANDALONE_CHANNEL_CONTENT_BACKGROUND: palette.background_secondary,

	CARD_MUTED_BG: palette.background_surface,

	INTERACTIVE_TEXT_DEFAULT: palette.subtext0,
	MESSAGES_ITEM_CHANNEL_TEXT_DEFAULT: palette.subtext0,
	TEXT_DEFAULT: palette.subtext0,
	TEXT_LINK: "#91a4ff",
	TEXT_MUTED: "#929ce7",
	TEXT_STRONG: palette.text,
	TEXT_SUBTLE: "#dbdee1",
	TEXT_BRAND: "#83A1D4",

	
	// INTERACTIVE_TEXT_DEFAULT: "#f09",
	// MESSAGES_ITEM_CHANNEL_TEXT_DEFAULT: "#dac",
	// MOBILE_ACTIONSHEET_BACKGROUND: "#ade",
	// MOBILE_CHATINPUT_BACKGROUND_ACTIVE: "#9d9",
	// CARD_MUTED_BG: "#dba",
}
const rawColors = {
	NEUTRAL_92: palette.background_tertiary,
	BLURPLE_50: palette.accent,
	NEUTRAL_73: "#212028",
	NEUTRAL_79: palette.background_primary,
	NEUTRAL_16: "#ff0",
}

export default plugin({
	init({ themes }) {
		themes.registerGroup('rosieblue', { name: 'Rosieblue' })

		const Image = 'assets/background.png'

		themes.registerTheme('rosieblue', 'rosieblue', {
			name: 'Rosieblue',
			description: 'Blue Rosie theme.',
			getColors: (): ThemeColors => {
				return {
					semantic: {
						dark: semanticColors,
						darker: semanticColors,
						light: semanticColors,
						midnight: semanticColors,
					},
					raw: { 
						...rawColors,
						...accentGradient('GREEN_', 'GREEN_NEW_', 'RED_', 'BLUE_') 
					},
				}
			},
			background: { path: Image },
		})
	}
})
