class AtriaClient {
    constructor(apiKey, baseUrl = 'https://api.atria-asi.ai/v1') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async createResponse(input, options = {}) {
        const res = await fetch(`${this.baseUrl}/responses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || 'Atria-Dawn-Preview',
                input,
                ...options
            })
        });

        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Atria API error ${res.status}: ${errBody}`);
        }

        return res.json();
    }

    // Helper untuk langsung ambil teks jawaban
    extractText(response) {
        const msg = response.output.find(o => o.type === 'message');
        return msg?.content?.[0]?.text ?? null;
    }
}

module.exports = AtriaClient;