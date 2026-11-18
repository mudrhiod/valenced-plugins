/// <reference types="@valenced/themes-api" />

import type { ThemeColors } from '@valenced/themes-api/types'
import { color_ } from './utils'

const palette = {
	accent: "#B5BDFF",
	brand: "#738dba",
	background_primary: "#1c1b22",
  	background_secondary: "#24232b",
	background_surface: "#26252B",
  	background_tertiary: "#202028",

	border: "#697eab29",
	hover: "#ffffff05",

	text: "#ffffff",
    subtext0: "#DCDDE5",
    subtext1: "#C6C8CE",
	text_muted: "#929ce7",
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
	MOBILE_GUILDBAR_ICON_BACKGROUND_DEFAULT: palette.background_secondary,
	STANDALONE_CHANNEL_CONTENT_BACKGROUND: palette.background_secondary,
	TABLEROW_BACKGROUND_DEFAULT: palette.background_secondary,
	MOBILE_EMOJI_BUTTON_BACKGROUND: `${palette.background_surface}ff`,

	MOBILE_ACTIONSHEET_BACKGROUND: `${palette.background_primary}ff`,
	MOBILE_ACTIONSHEET_GRADIENT_BACKGROUND_DEFAULT: `${palette.background_surface}ff`,

	CARD_MUTED_BG: palette.background_surface,
	EMBED_BACKGROUND: "#2B2833",
	BACKGROUND_CODE: "#24232b",

	INPUT_BACKGROUND_DEFAULT: "#16151b",
	INPUT_BORDER_ACTIVE: palette.accent,
	INPUT_ICON_DEFAULT: palette.text_muted,
	INPUT_PLACEHOLDER_TEXT_DEFAULT: palette.text_muted,
	REDESIGN_INPUT_CONTROL_SELECTED: palette.brand,
	CARD_SECONDARY_BACKGROUND_DEFAULT: "#272830",
	MOBILE_SEGMENTED_CONTROL_BACKGROUND: "#16151b",

	INTERACTIVE_TEXT_DEFAULT: palette.subtext0,
	MESSAGES_ITEM_CHANNEL_TEXT_DEFAULT: palette.subtext0,
	TEXT_DEFAULT: palette.subtext0,
	TEXT_LINK: "#91a4ff",
	TEXT_MUTED: palette.text_muted,
	TEXT_STRONG: palette.text,
	TEXT_SUBTLE: "#dbdee1",
	TEXT_BRAND: "#83A1D4",
	BACKGROUND_BRAND: palette.brand,

	MOBILE_SEGMENTED_CONTROL_INDICATOR_BACKGROUND: "#25262e",

	CONTROL_PRIMARY_BACKGROUND_DEFAULT: palette.brand,
	CONTROL_PRIMARY_BACKGROUND_ACTIVE: "#5272a7",
	CONTROL_PRIMARY_TEXT_DEFAULT: palette.background_secondary,

	CONTROL_SECONDARY_BACKGROUND_DEFAULT: "#3B394B",
	CONTROL_SECONDARY_BACKGROUND_ACTIVE: "#24232f",
	CONTROL_SECONDARY_BORDER_DEFAULT: "#494758",
	CONTROL_SECONDARY_BORDER_ACTIVE: "#31303b",

	CONTROL_CRITICAL_PRIMARY_TEXT_DEFAULT: palette.background_secondary,
	CONTROL_CONNECTED_TEXT_DEFAULT: palette.background_secondary,

	SWITCH_BACKGROUND_DEFAULT: "#8a8ebf",
	SWITCH_BACKGROUND_SELECTED_DEFAULT: palette.brand,
	SWITCH_THUMB_BACKGROUND_DEFAULT: palette.background_secondary,
	SWITCH_THUMB_BACKGROUND_SELECTED_DEFAULT: palette.background_secondary,
	SWITCH_THUMB_ICON_ACTIVE: palette.brand,
	SWITCH_THUMB_ICON_DEFAULT: "#8a8ebf",
	CHECKBOX_BACKGROUND_SELECTED_DEFAULT: palette.brand,
	CHECKBOX_ICON_ACTIVE: palette.background_primary,

	MOBILE_CHANNEL_ITEM_BACKGROUND_SELECTED: "#444664",
	TEXT_OVERLAY_LIGHT: palette.background_secondary,
	BADGE_PRIMARY_TEXT: palette.background_secondary,
	CHAT_INPUT_SEND_BUTTON_ICON_ACTIVE_TINT: palette.background_secondary,
	MESSAGE_MENTIONED_BACKGROUND_DEFAULT: "#97B9F417",
}
const rawColors = {
	NEUTRAL_92: palette.background_tertiary,
	BLURPLE_50: palette.accent,
	NEUTRAL_73: "#212028",
	NEUTRAL_79: palette.background_primary,
	NEUTRAL_86: palette.background_primary,
	NEUTRAL_35: "#848494",
	NEUTRAL_23: palette.subtext1,
	NEUTRAL_29: palette.subtext1,
	NEUTRAL_2: palette.text,
	OPACITY_16: palette.accent,
	BLURPLE_19: "#9EC1FF",
	NEUTRAL_55: "#BBC4F8",
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
						...color_(
							'BLUE_',
							'BRAND_',
							'GREEN_',
							'GREEN_NEW_',
							'OPACITY_GREEN_',
							'RED_',
							'RED_NEW_',
							'OPACITY_RED_',
							'YELLOW_',
							'OPACITY_YELLOW_',
							'GUILD_BOOSTING_'
						) 
					},
				}
			},
			background: { path: Image },
		})
	}
})
