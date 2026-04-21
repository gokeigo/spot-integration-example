export const CNPL_META_PROVIDER_PUBLIC_KEYS = {
  SACMED: ["PK_SACMED"],
} as const;

export type CnplMetaProvider = keyof typeof CNPL_META_PROVIDER_PUBLIC_KEYS;

function normalizePublicKey(publicKey?: string | null) {
  return publicKey?.trim().toUpperCase() ?? "";
}

export function getCnplMetaProvider(
  publicKey?: string | null,
): CnplMetaProvider | null {
  const normalizedPublicKey = normalizePublicKey(publicKey);

  if (!normalizedPublicKey) {
    return null;
  }

  for (const [provider, publicKeys] of Object.entries(
    CNPL_META_PROVIDER_PUBLIC_KEYS,
  ) as [CnplMetaProvider, readonly string[]][]) {
    if (
      publicKeys.some((value) => normalizePublicKey(value) === normalizedPublicKey)
    ) {
      return provider;
    }
  }

  return null;
}

export function isCnplMetaProviderPublicKey(publicKey?: string | null) {
  return getCnplMetaProvider(publicKey) !== null;
}
