import { Badge, Button, Card, Input } from '@/components/ui';
import * as productService from '@/services/product.service';
import {
  BanknotesIcon,
  CheckIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PhotoIcon,
  PlusIcon,
  Square3Stack3DIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

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
  properties: z.array(
    z.object({
      name: z.string().min(1, 'Property name is required'),
      tags: z.array(z.string()),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const [newTagVal, setNewTagVal] = useState<Record<number, string>>({});
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      provider: '',
      category: '',
      baseUnit: 'Unit',
      sku: '',
      barcode: '',
      salePrice: 0,
      comparedPrice: 0,
      properties: [
        { name: 'materials', tags: ['Cotton'] },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
  });

  // Handle Thumbnail Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const newImages = filesArr.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImageFiles((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Property Tags handlers
  const handleAddTag = (propertyIndex: number) => {
    const tag = newTagVal[propertyIndex]?.trim();
    if (!tag) return;

    // Get current tags
    const currentProps = control._formValues.properties || [];
    const currentTags = currentProps[propertyIndex]?.tags || [];

    if (!currentTags.includes(tag)) {
      setValue(`properties.${propertyIndex}.tags`, [...currentTags, tag]);
    }

    setNewTagVal((prev) => ({ ...prev, [propertyIndex]: '' }));
  };

  const handleRemoveTag = (propertyIndex: number, tagIndex: number) => {
    const currentProps = control._formValues.properties || [];
    const currentTags = [...(currentProps[propertyIndex]?.tags || [])];
    currentTags.splice(tagIndex, 1);
    setValue(`properties.${propertyIndex}.tags`, currentTags);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitLoading(true);
    try {
      // 1. Create Base Product
      await productService.create({
        name: data.name,
        description: data.description || '',
        provider: data.provider,
        category: data.category,
        baseUnit: data.baseUnit,
        sku: data.sku,
        barcode: data.barcode,
        properties: data.properties,
        salePrice: data.salePrice,
        comparedPrice: data.comparedPrice || 0,
      });

      // 2. Save Selected Thumbnails
      if (imageFiles.length > 0) {
        await Promise.all(
          imageFiles.map(({ file }) =>
            productService.saveThumbnail(data.barcode, file)
          )
        );
      }

      navigate(`/products/detail/${data.barcode}`);
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

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
              <span className="text-brand-500 font-medium">New Product</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50 truncate max-w-[300px] md:max-w-xl">
              Create Catalog Item
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
            disabled={isSubmitLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-product-form"
            isLoading={isSubmitLoading}
          >
            <CheckIcon className="w-4 h-4 mr-1.5" /> Save Product
          </Button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT (Centered & Constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 -mr-2 scrollbar-thin">
        <form id="create-product-form" onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto w-full space-y-6 animate-slide-up">

          {/* Section: General Details */}
          <Card className="p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <InformationCircleIcon className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50">General Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                placeholder="e.g. Premium Cotton Shirt"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Category"
                  placeholder="e.g. Apparel"
                  error={errors.category?.message}
                  {...register('category')}
                />
                <Input
                  label="Provider"
                  placeholder="e.g. Nike Vietnam"
                  error={errors.provider?.message}
                  {...register('provider')}
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe your product specs or key features..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  {...register('description')}
                />
              </div>
            </div>
          </Card>

          {/* Section: Pricing & Identifiers */}
          <Card className="p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <BanknotesIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Pricing & Identifiers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Sale Price (VND)"
                type="number"
                placeholder="0"
                error={errors.salePrice?.message}
                {...register('salePrice')}
              />
              <Input
                label="Compared Price (VND)"
                type="number"
                placeholder="0"
                error={errors.comparedPrice?.message}
                {...register('comparedPrice')}
              />
              <Input
                label="Base Unit"
                placeholder="e.g. Piece, Box"
                error={errors.baseUnit?.message}
                {...register('baseUnit')}
              />
              <Input
                label="SKU Code"
                placeholder="SKU-XXXXX"
                error={errors.sku?.message}
                {...register('sku')}
              />
              <Input
                label="Barcode / EAN"
                placeholder="Barcode details"
                error={errors.barcode?.message}
                {...register('barcode')}
              />
            </div>
          </Card>

          {/* Section: Properties Manager */}
          <Card className="p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Custom Properties</h3>
              </div>
              {fields.length < 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-brand-500"
                  onClick={() => append({ name: '', tags: [] })}
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Property
                </Button>
              )}
            </div>

            {fields.length === 0 ? (
              <p className="text-xs text-neutral-400">No properties added yet.</p>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
                {fields.map((field, idx) => (
                  <div key={field.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/3 space-y-2">
                      <Input
                        placeholder="Property Name (e.g. size, colors)"
                        error={errors.properties?.[idx]?.name?.message}
                        {...register(`properties.${idx}.name` as const)}
                      />
                      <button
                        type="button"
                        className="text-xs text-red-500 hover:underline"
                        onClick={() => remove(idx)}
                      >
                        Remove this property
                      </button>
                    </div>

                    {/* Tags editor */}
                    <div className="sm:w-2/3 space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
                        {control._formValues.properties?.[idx]?.tags?.map((tag: string, tagIdx: number) => (
                          <Badge key={tagIdx} variant="neutral" className="flex items-center gap-1 pl-3 pr-1 py-1 text-sm border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx, tagIdx)}
                              className="p-0.5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full transition-colors"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add tag and press Enter"
                          value={newTagVal[idx] || ''}
                          onChange={(e) =>
                            setNewTagVal((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(idx);
                            }
                          }}
                          className="flex-1 px-3 py-2 text-sm rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleAddTag(idx)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Section: Product Gallery */}
          <Card className="p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <Square3Stack3DIcon className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50">Product Gallery</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {/* Existing Uploaded Images */}
              {imageFiles.map(({ preview }, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 group shadow-sm">
                  <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload Dropzone */}
              <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors mb-2">
                  <PhotoIcon className="w-6 h-6 text-neutral-400 group-hover:text-brand-500" />
                </div>
                <span className="text-xs font-semibold text-neutral-500 group-hover:text-brand-600 text-center px-2">
                  Select Images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </Card>

        </form>
      </div>
    </div>
  );
};

export default CreateProduct;