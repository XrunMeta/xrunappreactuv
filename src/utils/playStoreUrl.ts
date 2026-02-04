

export const v_302bdc = 'run.xrun.xrunapp';

const v_a09fc1 = `https://play.google.com/store/apps/details?id=${v_302bdc}`;

export function v_843337(v_b36f96): string {
  const v_24baff = new URLSearchParams();
  if (v_b36f96?.gl) v_24baff.set('gl', v_b36f96.gl);
  if (v_b36f96?.hl) v_24baff.set('hl', v_b36f96.hl);
  if (v_b36f96?.campaignId) v_24baff.set('pcampaignid', v_b36f96.campaignId);
  const v_7c5791 = v_24baff.toString();
  return v_7c5791 ? `${v_a09fc1}&${v_7c5791}` : v_a09fc1;
}
