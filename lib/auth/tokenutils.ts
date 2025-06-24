// /lib/auth/tokenUtils.ts

interface JwtPayload {
    exp: number; // Expiration timestamp (seconds since epoch)
    // Add other relevant claims if needed, e.g., sub (subject), iat (issued at)
}

const TOKEN_REFRESH_LEEWAY_SECONDS = 60; // Refresh if token expires in next 60 seconds

export const getValidAccessToken = async (): Promise<string | null> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL; // Your main API base URL

    if (!accessToken && !refreshToken) {
        console.warn("No access or refresh token found. User likely not logged in.");
        return null;
    }

    // 1. Check if accessToken is missing or expired/nearing expiration
    if (!accessToken) {
        console.log("Access token missing. Attempting to refresh.");
    } else {
        try {
            // Decode JWT payload to get expiration. This is a client-side decode, NOT validation.
            // Be aware: `atob` is deprecated, but widely used. For Node.js, use Buffer.
            // For a robust solution, consider a small JWT decode library like 'jwt-decode'.
            const payloadBase64 = accessToken.split('.')[1];
            const decodedPayload: JwtPayload = JSON.parse(atob(payloadBase64)); 
            
            const expiresAtSeconds = decodedPayload.exp;
            const currentTimeSeconds = Date.now() / 1000;

            if (expiresAtSeconds < (currentTimeSeconds + TOKEN_REFRESH_LEEWAY_SECONDS)) {
                console.log(`Access token expires in ${expiresAtSeconds - currentTimeSeconds} seconds. Attempting to refresh.`);
            } else {
                // Access token is valid and not nearing expiration
                return accessToken;
            }
        } catch (error) {
            console.error("Error decoding access token or token is invalid. Attempting to refresh.", error);
        }
    }

    // 2. If accessToken is missing or expired, attempt to use refreshToken
    if (!refreshToken) {
        console.error("No refresh token available. User must log in again.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userPhoneNumber');
        // You might want to trigger a logout or redirect to login page here in your UI
        return null;
    }

    try {
        console.log("Attempting to refresh access token...");
        const response = await fetch(`${apiBaseUrl}/horoscope/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Some refresh endpoints might need the old access token, others just the refresh token.
                // Consult your backend's refresh-token API documentation.
            },
            body: JSON.stringify({ refreshToken: refreshToken }),
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.data?.access || !data.data?.refresh) {
            throw new Error(data.error || 'Failed to refresh token.');
        }

        const newAccessToken = data.data.access;
        const newRefreshToken = data.data.refresh;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        console.log("Tokens refreshed successfully.");
        return newAccessToken;

    } catch (error) {
        console.error("Error during token refresh:", error);
        // Clear tokens on refresh failure to force re-login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userPhoneNumber');
        // You might want to trigger a logout or redirect to login page here in your UI
        return null;
    }
};