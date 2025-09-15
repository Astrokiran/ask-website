	import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			orange: {
  				50: 'hsl(var(--orange-50))',
  				100: 'hsl(var(--orange-100))',
  				200: 'hsl(var(--orange-200))',
  				300: 'hsl(var(--orange-300))',
  				400: 'hsl(var(--orange-400))',
  				500: 'hsl(var(--orange-500))',
  				600: 'hsl(var(--orange-600))',
  				700: 'hsl(var(--orange-700))',
  				800: 'hsl(var(--orange-800))',
  				900: 'hsl(var(--orange-900))',
  				950: 'hsl(var(--orange-950))'
  			},
  			purple: {
  				50: 'hsl(var(--purple-50))',
  				100: 'hsl(var(--purple-100))',
  				200: 'hsl(var(--purple-200))',
  				300: 'hsl(var(--purple-300))',
  				400: 'hsl(var(--purple-400))',
  				500: 'hsl(var(--purple-500))',
  				600: 'hsl(var(--purple-600))',
  				700: 'hsl(var(--purple-700))',
  				800: 'hsl(var(--purple-800))',
  				900: 'hsl(var(--purple-900))',
  				950: 'hsl(var(--purple-950))'
  			},
  			indigo: {
  				50: 'hsl(var(--indigo-50))',
  				100: 'hsl(var(--indigo-100))',
  				200: 'hsl(var(--indigo-200))',
  				300: 'hsl(var(--indigo-300))',
  				400: 'hsl(var(--indigo-400))',
  				500: 'hsl(var(--indigo-500))',
  				600: 'hsl(var(--indigo-600))',
  				700: 'hsl(var(--indigo-700))',
  				800: 'hsl(var(--indigo-800))',
  				900: 'hsl(var(--indigo-900))',
  				950: 'hsl(var(--indigo-950))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
			 'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"),
	 require('@tailwindcss/typography')
  ],
};
export default config;
