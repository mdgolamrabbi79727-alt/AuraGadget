import React, { useState, useEffect } from 'react';
import { Product, Category, CategoryId } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Image as ImageIcon, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onSave: (productData: Product) => void;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  onSave,
  onClose,
}) => {
  const { categories, language, t } = useApp();

  const isEditing = Boolean(product);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState<CategoryId>('watches');
  const [price, setPrice] = useState<number>(1000);
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [stock, setStock] = useState<number>(10);
  const [rating, setRating] = useState<number>(4.8);
  const [reviewCount, setReviewCount] = useState<number>(25);
  const [featured, setFeatured] = useState<boolean>(false);
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [primaryImage, setPrimaryImage] = useState('');
  const [galleryImages, setGalleryImages] = useState('');
  
  // Specs key-values
  const [spec1Key, setSpec1Key] = useState('Warranty');
  const [spec1Val, setSpec1Val] = useState('1 Year Official Warranty');
  const [spec2Key, setSpec2Key] = useState('Connectivity');
  const [spec2Val, setSpec2Val] = useState('Universal');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (product) {
      setNameEn(product.nameEn);
      setNameBn(product.nameBn);
      setCategory(product.category);
      setPrice(product.price);
      setDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
      setStock(product.stock);
      setRating(product.rating || 4.8);
      setReviewCount(product.reviewCount || 10);
      setFeatured(Boolean(product.featured));
      setDescriptionEn(product.descriptionEn);
      setDescriptionBn(product.descriptionBn);
      setPrimaryImage(product.images[0] || '');
      setGalleryImages(product.images.slice(1).join('\n'));
      
      const enEntries = Object.entries(product.specsEn || {});
      if (enEntries.length > 0) {
        setSpec1Key(enEntries[0][0]);
        setSpec1Val(enEntries[0][1]);
      }
      if (enEntries.length > 1) {
        setSpec2Key(enEntries[1][0]);
        setSpec2Val(enEntries[1][1]);
      }
    } else {
      // Defaults for new product
      setNameEn('');
      setNameBn('');
      setCategory('watches');
      setPrice(1500);
      setDiscountPrice('');
      setStock(20);
      setRating(4.8);
      setReviewCount(12);
      setFeatured(false);
      setDescriptionEn('');
      setDescriptionBn('');
      setPrimaryImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
      setGalleryImages('');
      setSpec1Key('Warranty');
      setSpec1Val('1 Year Official Warranty');
      setSpec2Key('Compatibility');
      setSpec2Val('Universal');
    }
    setErrors({});
    setImageLoadError(false);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!nameEn.trim()) errs.nameEn = 'English product name is required';
    if (!nameBn.trim()) errs.nameBn = 'Bengali product name is required';
    if (price <= 0 || isNaN(price)) errs.price = 'Price must be a valid positive number';
    if (stock < 0 || isNaN(stock)) errs.stock = 'Stock must be 0 or greater';
    if (!descriptionEn.trim()) errs.descriptionEn = 'English description is required';
    if (!descriptionBn.trim()) errs.descriptionBn = 'Bengali description is required';
    if (!primaryImage.trim()) errs.primaryImage = 'Image URL is required';

    if (discountPrice.trim()) {
      const discNum = Number(discountPrice);
      if (isNaN(discNum) || discNum <= 0) {
        errs.discountPrice = 'Discount price must be a valid positive number';
      } else if (discNum >= price) {
        errs.discountPrice = 'Discount price must be lower than standard price';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const extraImagesList = galleryImages
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.startsWith('http'));

    const allImages = [primaryImage.trim(), ...extraImagesList];

    const finalProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      nameEn: nameEn.trim(),
      nameBn: nameBn.trim(),
      category,
      price: Number(price),
      discountPrice: discountPrice.trim() ? Number(discountPrice) : undefined,
      stock: Number(stock),
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      featured,
      descriptionEn: descriptionEn.trim(),
      descriptionBn: descriptionBn.trim(),
      images: allImages,
      specsEn: {
        ...(product?.specsEn || {}),
        [spec1Key.trim()]: spec1Val.trim(),
        [spec2Key.trim()]: spec2Val.trim(),
      },
      specsBn: {
        ...(product?.specsBn || {}),
        [spec1Key.trim()]: spec1Val.trim(),
        [spec2Key.trim()]: spec2Val.trim(),
      },
      tags: product?.tags || ['Gadget'],
    };

    onSave(finalProduct);
    onClose();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? t.adminEditProduct : t.adminAddProduct}
            </h2>
            <p className="text-xs text-slate-400">
              {isEditing 
                ? (language === 'bn' ? 'পণ্যের তথ্য ও মূল্য পরিবর্তন করুন' : `Editing SKU: ${product?.id}`)
                : (language === 'bn' ? 'স্টোরে নতুন গ্যাজেট এক্সেসরিজ যুক্ত করুন' : 'Add a new product to the live catalog')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Names in EN and BN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Name (English) *
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. 65W GaN Fast Wall Charger"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500 transition-colors ${
                  errors.nameEn ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.nameEn && <p className="text-[11px] text-rose-400 mt-1">{errors.nameEn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পণ্যের নাম (বাংলা) *
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: ৬৫ ওয়াট GaN ফাস্ট চার্জার"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500 transition-colors ${
                  errors.nameBn ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.nameBn && <p className="text-[11px] text-rose-400 mt-1">{errors.nameBn}</p>}
            </div>
          </div>

          {/* Category, Stock, Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500"
              />
              {errors.stock && <p className="text-[11px] text-rose-400 mt-1">{errors.stock}</p>}
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded-md border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Featured Product (Show on Home)</span>
              </label>
            </div>
          </div>

          {/* Price, Discount Price, Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price in BDT (৳) *
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500 transition-colors ${
                  errors.price ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.price && <p className="text-[11px] text-rose-400 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discount Price (৳) (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Leave blank if no discount"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500 transition-colors ${
                  errors.discountPrice ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.discountPrice && <p className="text-[11px] text-rose-400 mt-1">{errors.discountPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Rating (1.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description (English) *
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Enter rich English product description"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500"
              />
              {errors.descriptionEn && <p className="text-[11px] text-rose-400 mt-1">{errors.descriptionEn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                বিবরণ (বাংলা) *
              </label>
              <textarea
                rows={3}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="বিস্তারিত বাংলা বিবরণ লিখুন"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-hidden focus:border-blue-500"
              />
              {errors.descriptionBn && <p className="text-[11px] text-rose-400 mt-1">{errors.descriptionBn}</p>}
            </div>
          </div>

          {/* Primary Image & Live Preview */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Primary Product Image URL *
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  value={primaryImage}
                  onChange={(e) => {
                    setPrimaryImage(e.target.value);
                    setImageLoadError(false);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500 font-mono"
                />
                {errors.primaryImage && <p className="text-[11px] text-rose-400">{errors.primaryImage}</p>}
              </div>

              {/* Preview Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center relative">
                {primaryImage && !imageLoadError ? (
                  <img
                    src={primaryImage}
                    alt="Preview"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>
            </div>

            {/* Additional gallery images */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Gallery Image URLs (one per line or comma-separated)
              </label>
              <textarea
                rows={2}
                value={galleryImages}
                onChange={(e) => setGalleryImages(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              {t.adminCancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? t.adminSave : t.adminAddProduct}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
