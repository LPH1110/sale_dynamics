import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import * as productService from '@/services/product.service';
import { ProductDTO } from '@/types/product.types';
import { useStore, actions } from '@/store';
import { Badge, Button, DataTableSection, Dialog } from '@/components/ui';
import { Column } from '@/components/ui/Table';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Custom Reducer Global State
  const [storeState, dispatch] = useStore();
  const { checkedRows } = storeState;

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Bulk actions modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.authorities?.some(r => r.authority === 'ADMIN');

  // Load products
  const fetchProducts = async (searchQuery = '', pageNum = currentPage) => {
    setIsLoading(true);
    try {
      if (searchQuery.trim()) {
        const data = await productService.search(searchQuery);
        setProducts(data.filter(p => !p.deletedAt));
        setTotalElements(data.length);
        setTotalPages(1);
      } else {
        const pageRes = await productService.getPage(pageNum, pageSize);
        setProducts(pageRes.content.filter(p => !p.deletedAt));
        setTotalElements(pageRes.totalElements);
        setTotalPages(pageRes.totalPages);

        // Handle out-of-bounds page fallback
        if (pageRes.number >= pageRes.totalPages && pageRes.totalPages > 0) {
          setCurrentPage(pageRes.totalPages - 1);
          fetchProducts(searchQuery, pageRes.totalPages - 1);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, currentPage);
    // Clean checked rows when component unmounts
    return () => {
      dispatch(actions.clearCheckedRows());
    };
  }, [currentPage, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(actions.clearCheckedRows());
    setCurrentPage(page);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(0);
    fetchProducts(searchTerm, 0);
  };

  // Checkbox handlers
  const handleCheckRow = (barcode: string, isChecked: boolean) => {
    if (isChecked) {
      dispatch(actions.addCheckedRow(barcode));
    } else {
      dispatch(actions.deleteCheckedRow(barcode));
    }
  };

  const handleCheckAll = (isChecked: boolean) => {
    dispatch(actions.clearCheckedRows());
    if (isChecked) {
      products.forEach((p) => {
        dispatch(actions.addCheckedRow(p.barcode));
      });
    }
  };

  const columns: Column<ProductDTO>[] = [
    {
      header: 'Product Name',
      render: (product) => {
        const hasThumb = product.thumbnails && product.thumbnails.length > 0;
        return (
          <div className="flex items-center gap-3">
            {hasThumb ? (
              <img
                src={product.thumbnails?.[0]?.url}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md border border-neutral-200 dark:border-neutral-800"
              />
            ) : (
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center text-neutral-400">
                <PhotoIcon className="w-5 h-5" />
              </div>
            )}
            <div>
              <Link
                to={`/products/detail/${product.barcode}`}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-semibold"
              >
                {product.name}
              </Link>
              <span className="block text-xs text-neutral-400 mt-0.5">
                SKU: {product.sku || 'N/A'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Barcode',
      className: 'font-mono text-xs',
      render: (product) => product.barcode,
    },
    {
      header: 'Category',
      render: (product) => <Badge variant="info">{product.category}</Badge>,
    },
    {
      header: 'Sale Price',
      className: 'font-bold text-neutral-900 dark:text-neutral-50',
      render: (product) => formatCurrency(product.salePrice),
    },
    {
      header: 'Compared Price',
      className: 'text-neutral-400 line-through',
      render: (product) => product.comparedPrice ? formatCurrency(product.comparedPrice) : '—',
    },
    {
      header: 'Provider',
      className: 'text-neutral-500',
      render: (product) => product.provider,
    },
    {
      header: '',
      className: 'w-12',
      render: (product) => (
        <Link
          to={`/products/detail/${product.barcode}`}
          className="p-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors block"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Link>
      ),
    },
  ];

  // Bulk Delete
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        checkedRows.map((barcode) => productService.disable(barcode))
      );
      dispatch(actions.clearCheckedRows());
      setIsDeleteOpen(false);
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Failed to delete selected products:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const isServerSide = !searchTerm.trim();
  const displayProducts = isServerSide
    ? products
    : products.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const displayTotalElements = isServerSide ? totalElements : products.length;
  const displayTotalPages = isServerSide ? totalPages : Math.ceil(products.length / pageSize);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Products Catalog
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your store inventory, categories, barcodes, and dynamic pricing models.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => navigate('/products/create-product')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> New Product
          </Button>
        )}
      </div>

      <DataTableSection
        data={displayProducts}
        columns={columns}
        keyExtractor={(p) => p.barcode}
        selectable
        checkedRows={checkedRows}
        onCheckRow={(product, isChecked) => handleCheckRow(product.barcode, isChecked)}
        onCheckAll={handleCheckAll}
        isLoading={isLoading}
        emptyTitle="No products found"
        emptyDescription="Try resetting the search filters or create a new item."
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        showSearchButton
        searchPlaceholder="Search product name or barcode..."
        showFilterButton
        filterContent={(
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add product filter controls here (category, provider, price range, etc.).
          </p>
        )}
        toolbarActions={checkedRows.length > 0 && isAdmin ? (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setIsDeleteOpen(true)}
          >
            <TrashIcon className="w-4 h-4" /> Delete Checked ({checkedRows.length})
          </Button>
        ) : null}
        pagination={{
          currentPage,
          totalPages: displayTotalPages,
          totalElements: displayTotalElements,
          pageSize,
          onPageChange: handlePageChange,
        }}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Disable Selected Products"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Are you sure you want to disable the {checkedRows.length} selected product(s)? Disabled products will be hidden from the active point-of-sale catalog.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              isLoading={isDeleting}
            >
              Disable Products
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Products;
