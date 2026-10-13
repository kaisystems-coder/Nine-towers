export type SubmitResult = { ok: true } | { ok: false; reason: 'not-configured' | 'network' | 'rejected'; message?: string };

/** Posts to Web3Forms. The access key comes from NEXT_PUBLIC_WEB3FORMS_KEY. */
export async function submitWeb3Form(fields: Record<string, string>): Promise<SubmitResult> {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') console.warn('[web3forms] NEXT_PUBLIC_WEB3FORMS_KEY is not set');
    return { ok: false, reason: 'not-configured' };
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, from_name: 'Nine Towers Collection website', ...fields }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    return res.ok && json.success ? { ok: true } : { ok: false, reason: 'rejected', message: json.message };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
