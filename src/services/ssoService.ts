/**
 * SSO (Single Sign-On) Integration Service
 * 
 * Provides SSO integration supporting SAML 2.0, OAuth 2.0, and OIDC.
 */

// SSO Provider configuration
export interface SSOProvider {
    id: string;
    name: string;
    type: 'saml' | 'oauth2' | 'oidc';
    enabled: boolean;
    config: SAMLConfig | OAuth2Config | OIDCConfig;
}

export interface SAMLConfig {
    entryPoint: string;
    cert: string;
    issuer: string;
    callbackUrl: string;
    signatureAlgorithm?: string;
}

export interface OAuth2Config {
    authorizationUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    callbackUrl: string;
}

export interface OIDCConfig extends OAuth2Config {
    userInfoUrl: string;
    jwksUri?: string;
}

export interface SSOUser {
    id: string;
    email: string;
    name: string;
    provider: string;
    providerId: string;
    attributes: Record<string, string>;
}

export interface SSOToken {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    tokenType: string;
}

// Storage keys
const SSO_PROVIDERS_KEY = 'sso-providers';
const SSO_SESSION_KEY = 'sso-session';

class SSOService {
    private providers: SSOProvider[] = [];

    constructor() {
        this.loadProviders();
    }

    private loadProviders(): void {
        const stored = localStorage.getItem(SSO_PROVIDERS_KEY);
        if (stored) {
            this.providers = JSON.parse(stored);
        } else {
            // Initialize with default providers
            this.providers = [
                {
                    id: 'google',
                    name: 'Google',
                    type: 'oidc',
                    enabled: true,
                    config: {
                        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                        tokenUrl: 'https://oauth2.googleapis.com/token',
                        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
                        clientId: '',
                        clientSecret: '',
                        scopes: ['openid', 'email', 'profile'],
                        callbackUrl: `${window.location.origin}/auth/callback/google`
                    }
                },
                {
                    id: 'microsoft',
                    name: 'Microsoft',
                    type: 'oidc',
                    enabled: true,
                    config: {
                        authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                        userInfoUrl: 'https://graph.microsoft.com/oidc/userinfo',
                        clientId: '',
                        clientSecret: '',
                        scopes: ['openid', 'email', 'profile'],
                        callbackUrl: `${window.location.origin}/auth/callback/microsoft`
                    }
                },
                {
                    id: 'okta',
                    name: 'Okta',
                    type: 'saml',
                    enabled: false,
                    config: {
                        entryPoint: '',
                        cert: '',
                        issuer: 'sixsigma-app',
                        callbackUrl: `${window.location.origin}/auth/saml/callback`
                    }
                }
            ];
            this.saveProviders();
        }
    }

    private saveProviders(): void {
        localStorage.setItem(SSO_PROVIDERS_KEY, JSON.stringify(this.providers));
    }

    // Get all configured providers
    getProviders(): SSOProvider[] {
        return this.providers.filter(p => p.enabled);
    }

    // Configure a provider
    configureProvider(id: string, config: Partial<SAMLConfig | OAuth2Config | OIDCConfig>): void {
        const provider = this.providers.find(p => p.id === id);
        if (provider) {
            provider.config = { ...provider.config, ...config };
            this.saveProviders();
        }
    }

    // Enable/disable a provider
    setProviderEnabled(id: string, enabled: boolean): void {
        const provider = this.providers.find(p => p.id === id);
        if (provider) {
            provider.enabled = enabled;
            this.saveProviders();
        }
    }

    // Initiate OAuth2/OIDC login
    initiateOAuthLogin(providerId: string): void {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider || provider.type === 'saml') return;

        const config = provider.config as OAuth2Config | OIDCConfig;
        if (!config.clientId) {
            console.error(`OAuth provider ${providerId} not configured`);
            return;
        }

        const state = this.generateState();
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_provider', providerId);

        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.callbackUrl,
            response_type: 'code',
            scope: config.scopes.join(' '),
            state: state
        });

        window.location.href = `${config.authorizationUrl}?${params.toString()}`;
    }

    // Handle OAuth callback
    async handleOAuthCallback(code: string, state: string): Promise<SSOUser | null> {
        const storedState = sessionStorage.getItem('oauth_state');
        const providerId = sessionStorage.getItem('oauth_provider');

        if (state !== storedState || !providerId) {
            console.error('Invalid OAuth state');
            return null;
        }

        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return null;

        const config = provider.config as OAuth2Config;

        try {
            // Exchange code for token
            const tokenResponse = await fetch(config.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: config.callbackUrl,
                    client_id: config.clientId,
                    client_secret: config.clientSecret
                })
            });

            if (!tokenResponse.ok) {
                throw new Error('Token exchange failed');
            }

            const tokens = await tokenResponse.json();

            // Get user info
            const userInfoResponse = await fetch(
                (config as OIDCConfig).userInfoUrl || config.tokenUrl.replace('/token', '/userinfo'),
                {
                    headers: { Authorization: `Bearer ${tokens.access_token}` }
                }
            );

            if (!userInfoResponse.ok) {
                throw new Error('Failed to get user info');
            }

            const userInfo = await userInfoResponse.json();

            const user: SSOUser = {
                id: userInfo.sub || userInfo.id,
                email: userInfo.email,
                name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
                provider: providerId,
                providerId: userInfo.sub || userInfo.id,
                attributes: {
                    picture: userInfo.picture,
                    locale: userInfo.locale,
                    emailVerified: userInfo.email_verified?.toString()
                }
            };

            // Store session
            this.storeSession(user, {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: Date.now() + (tokens.expires_in * 1000),
                tokenType: tokens.token_type
            });

            // Cleanup
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_provider');

            return user;
        } catch (error) {
            console.error('OAuth callback error:', error);
            return null;
        }
    }

    // Initiate SAML login
    initiateSAMLLogin(providerId: string): void {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider || provider.type !== 'saml') return;

        const config = provider.config as SAMLConfig;

        // Create SAML request (simplified - in production use xml-crypto)
        const samlRequest = btoa(`
            <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                ID="${this.generateId()}"
                Version="2.0"
                IssueInstant="${new Date().toISOString()}"
                AssertionConsumerServiceURL="${config.callbackUrl}">
                <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
                    ${config.issuer}
                </saml:Issuer>
            </samlp:AuthnRequest>
        `);

        sessionStorage.setItem('saml_provider', providerId);

        // Redirect to IdP
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = config.entryPoint;
        form.innerHTML = `<input type="hidden" name="SAMLRequest" value="${samlRequest}" />`;
        document.body.appendChild(form);
        form.submit();
    }

    // Handle SAML callback
    async handleSAMLCallback(samlResponse: string): Promise<SSOUser | null> {
        const providerId = sessionStorage.getItem('saml_provider');
        if (!providerId) return null;

        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return null;

        try {
            // Decode and parse SAML response (simplified)
            const decoded = atob(samlResponse);
            const parser = new DOMParser();
            const doc = parser.parseFromString(decoded, 'text/xml');

            const nameId = doc.getElementsByTagName('saml:NameID')[0]?.textContent;
            const attributes = doc.getElementsByTagName('saml:Attribute');

            const userAttributes: Record<string, string> = {};
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i]!;
                const name = attr.getAttribute('Name');
                const value = attr.textContent;
                if (name && value) {
                    userAttributes[name] = value;
                }
            }

            const user: SSOUser = {
                id: nameId || userAttributes['id'] || '',
                email: userAttributes['email'] || userAttributes['EmailAddress'] || '',
                name: userAttributes['name'] || userAttributes['DisplayName'] || '',
                provider: providerId,
                providerId: nameId || '',
                attributes: userAttributes
            };

            this.storeSession(user, {
                accessToken: this.generateToken(),
                expiresAt: Date.now() + 3600000,
                tokenType: 'Bearer'
            });

            sessionStorage.removeItem('saml_provider');
            return user;
        } catch (error) {
            console.error('SAML callback error:', error);
            return null;
        }
    }

    // Store session
    private storeSession(user: SSOUser, token: SSOToken): void {
        localStorage.setItem(SSO_SESSION_KEY, JSON.stringify({ user, token }));
    }

    // Get current session
    getSession(): { user: SSOUser; token: SSOToken } | null {
        const stored = localStorage.getItem(SSO_SESSION_KEY);
        if (!stored) return null;

        const session = JSON.parse(stored);
        if (session.token.expiresAt < Date.now()) {
            this.logout();
            return null;
        }

        return session;
    }

    // Logout
    logout(): void {
        localStorage.removeItem(SSO_SESSION_KEY);
    }

    // Helper: Generate state parameter
    private generateState(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Helper: Generate ID
    private generateId(): string {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Helper: Generate token
    private generateToken(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}

export const ssoService = new SSOService();

// React hook for SSO
export function useSSO() {
    const getProviders = () => ssoService.getProviders();
    const getSession = () => ssoService.getSession();
    const login = (providerId: string) => {
        const provider = ssoService.getProviders().find(p => p.id === providerId);
        if (provider?.type === 'saml') {
            ssoService.initiateSAMLLogin(providerId);
        } else {
            ssoService.initiateOAuthLogin(providerId);
        }
    };
    const logout = () => ssoService.logout();
    const configure = (id: string, config: Partial<SAMLConfig | OAuth2Config | OIDCConfig>) =>
        ssoService.configureProvider(id, config);

    return { getProviders, getSession, login, logout, configure };
}

export default ssoService;