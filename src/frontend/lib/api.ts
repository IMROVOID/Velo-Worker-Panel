
export interface SystemOverview {
    vlConfigCount: number;
    trConfigCount: number;
    warpStatus: string;
    panelVersion: string;
}

export interface Settings {
    cleanIPs?: string[];
    warpEndpoints?: string[];
    proxyIPs?: string[];
    vlessUsers?: string[];
    trojanUsers?: string[];
    [key: string]: unknown;
}

export interface Admin {
    id: number;
    username: string;
    role: string;
    usage: string;
    status: string;
}

class ApiClient {
    private getBasePath(): string {
        if (typeof window === 'undefined') return '';
        return '../api';
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.getBasePath()}/${endpoint}`;
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Important: Send cookies with requests
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const json = await response.json();
        // Backend returns { success: true, code: 200, message: "...", data: ... }
        if (json.success === false) {
            throw new Error(json.message || 'Unknown API Error');
        }

        return json.data;
    }

    async getSystemOverview(): Promise<SystemOverview> {
        return this.request<SystemOverview>('overview');
    }

    async getSettings(): Promise<Settings> {
        return this.request<Settings>('settings');
    }

    async updateSettings(settings: Partial<Settings>): Promise<Settings> {
        return this.request<Settings>('settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async getAdmins(): Promise<Admin[]> {
        return this.request<Admin[]>('admins');
    }
}

export const api = new ApiClient();
