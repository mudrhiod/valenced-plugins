/// <reference types="@valenced/themes-api" />
import { Icons } from './icons'

export default plugin({
	preInit({ themes }) {
		themes.registerGroup(`solar`, {
            name: `Solar`,
            description: `A giant iconpack, as big as the solar system!`,
        })

		themes.registerIconPack(`solar`, `bold`, {
            name: `Solar (bold)`,
            description: `Solar Iconpack with the bold icon style`,
            icons: Icons('solar')
        });

        themes.registerIconPack(`solar`, `bolduotone`, {
            name: `Solar (bold duotone)`,
            description: `Solar Iconpack with the bold duotone icon style`,
            icons: Icons('solar-duotone')
        });

        themes.registerIconPack(`solar`, `broken`, {
            name: `Solar (broken)`,
            description: `Solar Iconpack with the broken icon style`,
            icons: Icons('solar-broken')
        })
	},
})
