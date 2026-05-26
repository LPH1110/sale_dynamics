import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import * as productService from '@/services/product.service';
import { Badge, Button, Card, Input } from '@/components/ui';

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create Product
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add a new catalog item with pricing models and custom product attributes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/products')} disabled={isSubmitLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitLoading}>
            Save Product
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* General Info */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                General Information
              </h3>
              <Input
                label="Product Name"
                placeholder="e.g. Premium Cotton Shirt"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe your product specs or key features..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-55 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  {...register('description')}
                />
              </div>
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
            </Card>

            {/* Pricing Model */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Pricing & Valuation
              </h3>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </Card>

            {/* Properties Manager */}
            <Card className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  Custom Properties
                </h3>
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
                    <div key={field.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Property Name (e.g. size, colors)"
                          error={errors.properties?.[idx]?.name?.message}
                          {...register(`properties.${idx}.name` as const)}
                          className="max-w-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-500 p-2"
                          onClick={() => remove(idx)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Tags editor */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {control._formValues.properties?.[idx]?.tags?.map((tag: string, tagIdx: number) => (
                            <Badge key={tagIdx} variant="neutral" className="flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(idx, tagIdx)}
                                className="hover:text-red-500 transition-colors"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2 max-w-xs">
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
                            className="w-full px-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-55 focus:outline-hidden focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                          />
                          <Button
                            type="button"
                            size="sm"
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
          </div>

          {/* Sidebar Forms */}
          <div className="space-y-6">
            {/* Inventory identifiers */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Inventory SKU & POS
              </h3>
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
              <Input
                label="Base Unit"
                placeholder="e.g. Piece, Box"
                error={errors.baseUnit?.message}
                {...register('baseUnit')}
              />
            </Card>

            {/* Thumbnail Uploads */}
            <Card className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Product Thumbnails
              </h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-4 bg-neutral-50 dark:bg-neutral-950/20 hover:bg-neutral-100/50 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <PhotoIcon className="w-10 h-10 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Click to select images
                </span>
                <span className="text-[10px] text-neutral-400 mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </span>
              </div>

              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {imageFiles.map(({ preview }, idx) => (
                    <div key={idx} className="relative group rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800">
                      <img src={preview} alt="preview" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white hover:bg-red-600 p-1 rounded-full transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
