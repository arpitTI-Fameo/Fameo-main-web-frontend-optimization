import React from 'react';
import { pickCategoryIcon } from '../../constants';
import SelectPicker from '../../../../../components/Common/SelectPicker';

export default function Step04Category({ ctx }) {
  const {
    catError, errors, registerFieldRef, catLoading, categories,
    form, setForm, clearErr, profError, onProfessionChange, profLoading, professions
  } = ctx;

  return (
    <>
      <div className="frg-rule">PRIMARY CATEGORY</div>
      {catError && <div className="frg-note red">{catError}</div>}
      <div className={`frg-catgrid${errors.category ? ' err' : ''}`} ref={registerFieldRef('category')} role="radiogroup" aria-label="Primary category">
        {catLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div className="frg-cat-skel" key={i}><div className="frg-cat-skel-ico" /><div className="frg-cat-skel-lbl" /></div>
          ))
          : categories.map(cat => {
            const on = form.categoryCode === cat.category_code;
            const pick = () => { setForm(f => ({ ...f, categoryCode: cat.category_code, category: cat.category_name, categoryId: cat.category_id })); clearErr('category'); };
            return (
              <div key={cat.category_code}
                className={`frg-cat${on ? ' on' : ''}`}
                onClick={pick}
                role="radio" aria-checked={on} tabIndex={0}
                onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), pick())}
                title={cat.description || cat.category_name}>
                <div className="frg-cat-ico">{pickCategoryIcon(cat)}</div>
                <div className="frg-cat-lbl">{cat.category_name}</div>
              </div>
            );
          })}
      </div>
      {errors.category && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.category}</div>}

      {form.categoryCode && (
        <>
          <div className="frg-rule">PROFESSION</div>
          {profError && <div className="frg-note red">{profError}</div>}
          <div className="frg-field" ref={registerFieldRef('profession')}>
            <label className="frg-label" htmlFor="frg-prof">Select your profession <span className="req">*</span></label>
            <div className={`frg-uline${errors.profession ? ' err' : ''}`}>
              <SelectPicker id="frg-prof" className="frg-select2" value={form.professionCode || ''}
                onChange={e => onProfessionChange(e.target.value)} disabled={profLoading || professions.length === 0}
                placeholder={profLoading ? 'Loading professions…' : professions.length === 0 ? 'No professions found' : 'Select your profession'}
                options={professions.map(p => ({ value: p.profession_code, label: p.profession_name }))} />
            </div>
            {errors.profession && <div className="frg-help err">{errors.profession}</div>}
          </div>
        </>
      )}
    </>
  );
}
