import React from 'react';
import { cleanUrl } from '../../helpers';
import SelectPicker from '../../../../../components/Common/SelectPicker';

export default function Step03Socials({ ctx }) {
  const { form, setForm, clearErr, errors, setField, registerFieldRef, ytOk, igOk } = ctx;

  return (
    <>
      <div className="frg-note soft">Followers are never combined. The higher single-platform count is used.</div>
      <div className="frg-rule">PRIMARY PLATFORM</div>
      <div className="frg-field" ref={registerFieldRef('platform')}>
        <label className="frg-label" htmlFor="frg-plat">Primary platform <span className="req">*</span></label>
        <div className={`frg-uline${errors.platform ? ' err' : ''}`}>
          <SelectPicker id="frg-plat" className="frg-select2" value={form.primaryPlatform} 
            onChange={e => { setForm(f => ({ ...f, primaryPlatform: e.target.value })); clearErr('platform', 'youtube', 'instagram'); }}
            placeholder="Select platform"
            options={['YouTube', 'Instagram', 'Both']} />
        </div>
        {errors.platform && <div className="frg-help err">{errors.platform}</div>}
      </div>

      {(form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') && (
        <div className="frg-field" ref={registerFieldRef('youtube')}>
          <label className="frg-label" htmlFor="frg-yt">YouTube channel URL <span className="req">*</span></label>
          <div className={`frg-uline${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
            <input id="frg-yt" className="frg-input" type="url" placeholder="https://youtube.com/@yourchannel"
              value={form.youtube} onChange={e => setField('youtube', cleanUrl(e.target.value))} />
          </div>
          <div className={`frg-help${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
            {(form.youtube && !ytOk) || errors.youtube
              ? 'That link doesn’t look like a channel. Use youtube.com/@handle, /channel/ID, /c/name or /user/name'
              : form.youtube && ytOk ? 'Looks good'
              : 'Accepted: youtube.com/@handle · /channel/ID · /c/name · /user/name'}
          </div>
        </div>
      )}

      {(form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') && (
        <div className="frg-field" ref={registerFieldRef('instagram')}>
          <label className="frg-label" htmlFor="frg-ig">Instagram profile URL <span className="req">*</span></label>
          <div className={`frg-uline${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
            <input id="frg-ig" className="frg-input" type="url" placeholder="https://instagram.com/yourhandle"
              value={form.instagram} onChange={e => setField('instagram', cleanUrl(e.target.value))} />
          </div>
          <div className={`frg-help${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
            {(form.instagram && !igOk) || errors.instagram
              ? 'That link doesn’t look like a profile. Use https://instagram.com/yourhandle'
              : form.instagram && igOk ? 'Looks good'
              : 'Full URL — e.g. https://instagram.com/yourhandle (tracking links are fine)'}
          </div>
        </div>
      )}
    </>
  );
}
