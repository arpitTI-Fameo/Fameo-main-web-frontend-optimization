import React, { useState, useEffect } from 'react';
import Modal from '@/components/Common/Modal';
import RangeSlider from '@/components/Common/RangeSlider';
import { S } from './styles';

export default function ProductFilter({ isOpen, onClose, onApply, currentFilters = {}, availableFilters }) {
  const [selectedCategories, setSelectedCategories] = useState(currentFilters.categories || []);
  const [selectedBrands, setSelectedBrands] = useState(currentFilters.brands || []);
  const [selectedAttributes, setSelectedAttributes] = useState(currentFilters.attributes || {});
  const [priceRange, setPriceRange] = useState(currentFilters.price || [0, 1000]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(currentFilters.categories || []);
      setSelectedBrands(currentFilters.brands || []);
      setSelectedAttributes(currentFilters.attributes || {});

      const defaultMin = availableFilters?.priceRange?.min?.salePrice || 0;
      const defaultMax = availableFilters?.priceRange?.max?.salePrice || 1000;
      setPriceRange(currentFilters.price || [defaultMin, defaultMax]);
    }
  }, [isOpen, currentFilters, availableFilters]);

  if (!availableFilters) return null;

  const toggleArrayItem = (setter, item) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleAttributeItem = (attrSlug, val) => {
    setSelectedAttributes(prev => {
      const current = prev[attrSlug] || [];
      const next = current.includes(val) ? current.filter(i => i !== val) : [...current, val];
      return { ...prev, [attrSlug]: next };
    });
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      brands: selectedBrands,
      attributes: selectedAttributes,
      price: priceRange
    });
    onClose();
  };

  // Helper to resolve CSS hex colors from colour labels if the API doesn't provide them directly
  const getColorHex = (name) => {
    const map = {
      'black': '#000000', 'grey': '#808080', 'white': '#FFFFFF',
      'beige': '#F5F5DC', 'red': '#FF0000', 'purple': '#800080',
      'blue': '#0000FF', 'green': '#008000'
    };
    return map[name.toLowerCase()] || '#CCCCCC';
  };

  const minPrice = availableFilters.priceRange?.min?.salePrice || 0;
  const maxPrice = availableFilters.priceRange?.max?.salePrice || 1000;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter" maxWidth={720} maxHeight={580}>
      <style>{S}</style>
      <div className="fm-wrap">

        {/* Categories */}
        {(availableFilters.categories?.parents?.length > 0 || availableFilters.categories?.leaves?.length > 0) && (
          <div className="fm-section">
            <h3 className="fm-subtitle">Categories</h3>
            <div className="fm-pills">
              {[...(availableFilters.categories?.parents || []), ...(availableFilters.categories?.leaves || [])].map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`fm-pill ${selectedCategories.includes(c.slug) ? 'on' : ''}`}
                  onClick={() => toggleArrayItem(setSelectedCategories, c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {availableFilters.brands?.length > 0 && (
          <div className="fm-section">
            <h3 className="fm-subtitle">Brands</h3>
            <div className="fm-pills">
              {availableFilters.brands.map(b => (
                <button
                  key={b.id}
                  type="button"
                  className={`fm-pill ${selectedBrands.includes(b.slug) ? 'on' : ''}`}
                  onClick={() => toggleArrayItem(setSelectedBrands, b.slug)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Attributes (Size, Colour, Properties, etc.) */}
        {availableFilters.attributes?.map(attr => {
          const isColour = attr.name.toLowerCase() === 'colour' || attr.name.toLowerCase() === 'color';
          const selectedForAttr = selectedAttributes[attr.slug] || [];

          return (
            <div key={attr.id} className="fm-section">
              <h3 className="fm-subtitle">{attr.name}</h3>
              <div className="fm-pills">
                {attr.options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`fm-pill ${isColour ? 'has-dot' : ''} ${selectedForAttr.includes(opt.value) ? 'on' : ''}`}
                    onClick={() => toggleAttributeItem(attr.slug, opt.value)}
                  >
                    {isColour && (
                      <span
                        className={`fm-color-dot ${opt.value.toLowerCase() === 'white' ? 'has-border' : ''}`}
                        style={{ backgroundColor: getColorHex(opt.value) }}
                      ></span>
                    )}
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Price */}
        {availableFilters.priceRange && (
          <div className="fm-section">
            <h3 className="fm-subtitle">Price</h3>
            <div className="fm-price-slider">
              <RangeSlider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onChange={setPriceRange}
                formatLabel={(val) => `£${val}`}
              />
            </div>
          </div>
        )}

        <div className="fm-footer">
          <button type="button" className="fm-apply-btn" onClick={handleApply}>
            VIEW ITEMS
          </button>
        </div>

      </div>
    </Modal>
  );
}
