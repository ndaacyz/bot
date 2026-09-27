class AtriaClient {
  constructor(apiKey, baseUrl = 'https://api.atria-asi.ai/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async createResponse(input, options = {}) {
    const res = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer atr_1AMwW23c7jf4n7mKvuWGXrkIeRbdNGDW`,
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

// Contoh pemakaian
const client = new AtriaClient(process.env.ATRIA_API_KEY);

const response = await client.createResponse('apa itu google?');
console.log(client.extractText(response));
// Output: "Hi there! I'm Atria, an AI assistant developed by Shanghai Artificial Intelligence Laboratory..."


  /*curl -X POST https://api.atria-asi.ai/v1/messages \
  -H "x-api-key: atr_1AMwW23c7jf4n7mKvuWGXrkIeRbdNGDW" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Atria-Dawn-Preview",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "hi"}]
  }'*/

/*
curl -X POST https://api.atria-asi.ai/v1/responses \
  -H "Authorization: Bearer atr_1AMwW23c7jf4n7mKvuWGXrkIeRbdNGDW" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Atria-Dawn-Preview",
    "input": "hi"
  }'  
  */