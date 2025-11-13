export function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        if (!exp) return false;
        const now = Date.now() / 1000;
        return exp > now;
    } catch  {
        return false;
    }
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const res = await fetch('/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) return null;
        const data = await res.json();
        localStorage.setItem('token', data.accessToken);
        return data.accessToken;
    } catch  {
        return null;
    }
}