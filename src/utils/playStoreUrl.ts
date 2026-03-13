

export const ANDROID_PACKAGE_ID = 'run.xrun.xrunapp';

const BASE_PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

export function getPlayStoreUrl(options?: {
  gl?: string;
  hl?: string;
  campaignId?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.gl) params.set('gl', options.gl);
  if (options?.hl) params.set('hl', options.hl);
  if (options?.campaignId) params.set('pcampaignid', options.campaignId);
  const query = params.toString();
  return query ? `${BASE_PLAY_STORE_URL}&${query}` : BASE_PLAY_STORE_URL;
}
