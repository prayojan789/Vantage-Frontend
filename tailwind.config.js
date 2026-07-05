import { designTokens } from './src/tokens/theme.js'

export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				bg: 'var(--color-bg)',
				surface: 'var(--color-surface)',
				'surface-muted': 'var(--color-surface-muted)',
				'surface-elevated': 'var(--color-surface-elevated)',
				text: 'var(--color-text)',
				'text-muted': 'var(--color-text-muted)',
				border: 'var(--color-border)',
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				success: 'var(--color-success)',
				warning: 'var(--color-warning)',
				danger: 'var(--color-danger)',
				info: 'var(--color-info)',
			},
			fontFamily: designTokens.typography.fontFamily,
			spacing: designTokens.spacing,
			borderRadius: designTokens.radius,
			boxShadow: designTokens.shadows,
			screens: designTokens.breakpoints,
			transitionDuration: designTokens.motion.duration,
			transitionTimingFunction: designTokens.motion.easing,
		},
	},
	plugins: [],
}
