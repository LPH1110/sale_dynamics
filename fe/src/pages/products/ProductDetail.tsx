import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ChevronRightIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
  TagIcon,
  Square3Stack3DIcon,
  BanknotesIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

import * as productService from '@/services/product.service';
import { ProductDTO, Thumbnail } from '@/types/product.types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Input, Badge, Dialog, Spinner } from '@/components/ui';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  provider: z.string().min(1, 'Provider is required'),
  category: z.string().min(1, 'Category is required'),
  baseUnit: z.string().min(1, 'Base unit is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  salePrice: z.coerce.number().min(0, 'Sale price must be positive'),
  comparedPrice: z.coerce.number().min(0, 'Compared price must be positive').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductDetail: React.FC = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [properties, setProperties] = useState<{ name: string; tags: string[] }[]>([]);
  const [newTagVal, setNewTagVal] = useState<Record<number, string>>({});

  const isAdmin = user?.authorities?.some(r => r.authority === 'ADMIN');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const loadProduct = async () => {
    if (!barcode) return;
    setIsLoading(true);
    try {
      const data = await productService.getDetail(barcode);
      setProduct(data);
      setThumbnails(data.thumbnails || []);
      setProperties(data.properties || []);
      reset({
        name: data.name,
        description: data.description,
        provider: data.provider,
        category: data.category,
        baseUnit: data.baseUnit,
        sku: data.sku,
        barcode: data.barcode,
        salePrice: data.salePrice,
        comparedPrice: data.comparedPrice,
      });
    } catch (error) {
      console.error(error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProduct(); }, [barcode]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    setIsUpdateLoading(true);
    try {
      const updatedData: ProductDTO = { ...product, ...data, properties, thumbnails };
      const res = await productService.saveProduct(updatedData);
      setProduct(res);
      reset(data);
      alert("Changes saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  if (isLoading) return (
    <div className="h-full flex items-center justify-center">
      <Spinner className="w-10 h-10 text-brand-600" />
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-xl font-bold">Product Not Found</h2>
      <Button variant="ghost" className="mt-2" onClick={() => navigate('/products')}>Return to Catalog</Button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      
      {/* 1. FIXED HEADER (Full Width) */}
      <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link to="/products" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ChevronRightIcon className="w-5 h-5 rotate-180" />
          </Link>
          <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Link to="/products" className="hover:text-brand-500 transition-colors">Catalog</Link>
                <ChevronRightIcon className="w-3 h-3" />
                <span className="text-brand-500 font-medium">{product.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50 truncate max-w-[300px] md:max-w-xl">
              {product.name}
              </h1>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <Button 
              type="button"
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
              onClick={() => setIsDeleteOpen(true)}
            >
              <TrashIcon className="w-4 h-4 mr-1.5" /> Disable
            </Button>
            {/* Thuộc tính form="product-update-form" liên kết nút này với thẻ form bên dưới */}
            <Button 
              type="submit"
              form="product-update-form"
              isLoading={isUpdateLoading}
              disabled={!isDirty && JSON.stringify(product.properties) === JSON.stringify(properties)}
            >
              <CheckIcon className="w-4 h-4 mr-1.5" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered & Constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <form id="product-update-form" onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto w-full space-y-8 animate-slide-up">
          
          {/* HERO INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 flex items-center justify-center aspect-square p-2 bg-neutral-100 dark:bg-neutral-900/50 border-dashed overflow-hidden relative group">
                {thumbnails.length > 0 ? (
                  <img src={thumbnails[0].url} alt="hero" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <PhotoIcon className="w-12 h-12 text-neutral-300" />
                )}
                {isAdmin && (
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <ArrowUpTrayIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-semibold">Change Hero</span>
                    <input type="file" className="hidden" onChange={async (e) => {
                        if(e.target.files?.[0]) {
                          const t = await productService.saveThumbnail(product.barcode, e.target.files[0]);
                          setThumbnails(prev => [t, ...prev]); // Put new image at the front as hero
                        }
                    }} />
                  </label>
                )}
            </Card>

            <div className="md:col-span-3 flex flex-col justify-center space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info" className="px-3 py-1 text-sm">{product.category}</Badge>
                  <Badge variant="neutral" className="px-3 py-1 text-sm">{product.provider}</Badge>
                </div>
                <h2 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-6 text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 w-fit">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Barcode</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{product.barcode}</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">SKU</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{product.sku}</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Base Unit</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{product.baseUnit}</span>
                  </div>
                </div>
            </div>
          </div>

          {/* VERTICAL SECTIONS */}
          <div className="space-y-6">
            
            {/* Section: General */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <InformationCircleIcon className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-neutral-900 dark:text-neutral-50">General Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Display Name" {...register('name')} error={errors.name?.message} disabled={!isAdmin} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Category" {...register('category')} disabled={!isAdmin} />
                  <Input label="Provider" {...register('provider')} disabled={!isAdmin} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Detailed Description</label>
                  <textarea 
                      rows={4}
                      className="w-full p-3 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                      {...register('description')}
                      disabled={!isAdmin}
                  />
                </div>
              </div>
            </Card>

            {/* Section: Commercial */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <BanknotesIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Pricing & Inventory</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input type="number" label="Sale Price (VND)" {...register('salePrice')} error={errors.salePrice?.message} disabled={!isAdmin} />
                <Input type="number" label="Compare Price" {...register('comparedPrice')} disabled={!isAdmin} />
                <Input label="Inventory Unit" {...register('baseUnit')} disabled={!isAdmin} />
              </div>
            </Card>

            {/* Section: Attributes */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Custom Properties</h3>
                </div>
                {isAdmin && properties.length < 3 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setProperties(p => [...p, {name: 'New Prop', tags: []}])}>
                    <PlusIcon className="w-4 h-4 mr-1" /> Add Property
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {properties.map((prop, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800">
                    <div className="sm:w-1/3 space-y-2">
                      <Input 
                        placeholder="Property Name" 
                        value={prop.name} 
                        onChange={e => {
                          const next = [...properties];
                          next[idx].name = e.target.value;
                          setProperties(next);
                        }} 
                        disabled={!isAdmin}
                      />
                      {isAdmin && (
                        <button type="button" onClick={() => setProperties(p => p.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:underline">
                          Remove this property
                        </button>
                      )}
                    </div>
                    <div className="sm:w-2/3 space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
                        {prop.tags.length === 0 && <span className="text-xs text-neutral-400 italic">No tags added</span>}
                        {prop.tags.map((tag, tIdx) => (
                          <Badge key={tIdx} variant="neutral" className="flex items-center gap-1 pl-3 pr-1 py-1 text-sm border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                            {tag}
                            {isAdmin && (
                              <button type="button" onClick={() => {
                                const next = [...properties];
                                next[idx].tags.splice(tIdx, 1);
                                setProperties(next);
                              }} className="p-0.5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full transition-colors">
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Add tag and press Enter..."
                            className="flex-1 px-3 py-2 text-sm rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                            value={newTagVal[idx] || ''}
                            onChange={e => setNewTagVal({...newTagVal, [idx]: e.target.value})}
                            onKeyDown={e => {
                              if(e.key === 'Enter') {
                                e.preventDefault();
                                const val = newTagVal[idx]?.trim();
                                if(val) {
                                  const next = [...properties];
                                  if(!next[idx].tags.includes(val)) next[idx].tags.push(val);
                                  setProperties(next);
                                  setNewTagVal({...newTagVal, [idx]: ''});
                                }
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section: Gallery */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <Square3Stack3DIcon className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Product Gallery</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {thumbnails.map((t, idx) => (
                  <div key={t.id} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 group shadow-sm">
                      <img src={t.url} alt={`thumb-${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                      {isAdmin && (
                        <button 
                          type="button"
                          onClick={async () => {
                            await productService.deleteThumbnail(product.barcode, t.id);
                            setThumbnails(prev => prev.filter(item => item.id !== t.id));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                  </div>
                ))}
                {isAdmin && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors mb-2">
                        <PlusIcon className="w-6 h-6 text-neutral-400 group-hover:text-brand-500" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-500 group-hover:text-brand-600">Upload Image</span>
                      <input type="file" multiple className="hidden" onChange={async (e) => {
                          if(e.target.files) {
                            const filesArr = Array.from(e.target.files);
                            // Upload từng ảnh và cập nhật state (Có thể optimize bằng Promise.all)
                            for(const file of filesArr) {
                               const t = await productService.saveThumbnail(product.barcode, file);
                               setThumbnails(prev => [...prev, t]);
                            }
                          }
                      }} />
                  </label>
                )}
              </div>
            </Card>

          </div>
        </form>
      </div>

      {/* Disable Confirmation Modal */}
      <Dialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Disable Product" size="sm">
        <div className="space-y-4">
           <p className="text-sm text-neutral-500">
            Are you sure you want to disable <strong>{product.name}</strong>? It will no longer appear in POS searches.
           </p>
           <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" isLoading={isDeleting} onClick={async () => {
                setIsDeleting(true);
                try {
                  await productService.disable(product.barcode);
                  navigate('/products');
                } catch(e) { console.error(e); }
                finally { setIsDeleting(false); }
              }}>Confirm Disable</Button>
           </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductDetail;