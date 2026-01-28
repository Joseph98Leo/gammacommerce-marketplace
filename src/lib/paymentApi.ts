// src/lib/paymentApi.ts

export type StripeConfigResponse = { publishableKey: string };
export type CreatePaymentIntentResponse = { clientSecret: string };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
    console.warn("Missing VITE_API_BASE_URL in .env");
}

const STRIPE_BASE = `${API_BASE_URL}/payment-service/api/v1/stripe`;


// ✅ 1) Aquí defines de dónde sale tu token
function getToken(): string | null {
    // Opción A: si guardas token en localStorage
    return localStorage.getItem("token");

    // Opción B: si guardas otra key
    // return localStorage.getItem("access_token");
}

// ✅ 2) Helper para headers
function buildHeaders(): HeadersInit {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function parseJson<T>(res: Response): Promise<T> {
    const text = await res.text();

    if (!res.ok) {
        console.error("HTTP", res.status, "URL:", res.url);
        console.error("RESPONSE BODY:", text);

        // intenta sacar un mensaje bonito si viene JSON
        try {
            const json = text ? JSON.parse(text) : null;
            const msg = json?.message || json?.error || `Request failed (${res.status})`;
            throw new Error(msg);
        } catch {
            throw new Error(text || `Request failed (${res.status})`);
        }
    }

    return (text ? JSON.parse(text) : null) as T;
}


export async function getStripeConfig(): Promise<StripeConfigResponse> {
    const url = `${STRIPE_BASE}/config`;
    console.log('🔍 Fetching Stripe config from:', url);
    console.log('🔑 API_BASE_URL:', API_BASE_URL);
    console.log('🔒 Token present:', !!getToken());

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: buildHeaders(),
        });

        console.log('📡 Response status:', res.status);
        console.log('📡 Response ok:', res.ok);

        const json = await parseJson<{ data: StripeConfigResponse }>(res);
        console.log('✅ Config retrieved successfully');
        return json.data;
    } catch (error) {
        console.error('❌ Error fetching Stripe config:', error);
        throw error;
    }
}

export async function createPaymentIntent(input: {
    amount: string; // Backend expects string
    description: string;
}): Promise<CreatePaymentIntentResponse> {
    const url = `${STRIPE_BASE}/create-payment-intent`;
    const headers = buildHeaders();
    const body = JSON.stringify(input);

    console.log('💳 Creating Payment Intent');
    console.log('📍 URL:', url);
    console.log('📤 Headers:', headers);
    console.log('📦 Body:', body);
    console.log('💰 Amount:', input.amount);
    console.log('📝 Description:', input.description);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        console.log('📡 Response status:', res.status);
        console.log('📡 Response ok:', res.ok);
        console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));

        const json = await parseJson<{ data: CreatePaymentIntentResponse }>(res);
        console.log('✅ Payment Intent created successfully');
        return json.data;
    } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        throw error;
    }
}
