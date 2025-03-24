import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Google Analytics is now implemented in app/layout.tsx using @next/third-parties */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
} 