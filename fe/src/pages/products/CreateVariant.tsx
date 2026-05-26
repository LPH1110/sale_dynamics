import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export const CreateVariant: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [salePrice, setSalePrice] = useState(0);
  const [comparedPrice, setComparedPrice] = useState(0);
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');

  const handleCreate = () => {
    // Legacy mock save flow
    console.log('Creating variant for product', productId, { salePrice, comparedPrice, sku, barcode });
    navigate(`/products/detail/${productId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center text-xs text-neutral-400 gap-1.5">
            <Link to="/products" className="hover:text-brand-500 hover:underline">
              Products
            </Link>
            <ChevronRightIcon className="w-3 h-3" />
            <Link to={`/products/detail/${productId}`} className="hover:text-brand-500 hover:underline">
              Detail
            </Link>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-neutral-500 font-medium">New Variant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create Product Variant
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/products/detail/${productId}`)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Variant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Variant Price Model
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sale Price (VND)"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
              />
              <Input
                label="Compared Price (VND)"
                type="number"
                value={comparedPrice}
                onChange={(e) => setComparedPrice(Number(e.target.value))}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Inventory SKU & Barcodes
            </h3>
            <Input
              label="SKU Code"
              placeholder="SKU-VAR-XXXX"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Input
              label="Barcode"
              placeholder="Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateVariant;
