import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Product } from './ProductList'; 

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  
  // React 19 Pro-Tip: Initialize loading to true immediately to avoid synchronous state transitions inside useEffect
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProductData = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve item info');
        }
        const data = await res.json();
        
        if (isMounted) {
          setProduct(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          const errorObject = err as Error;
          setError(errorObject.message || 'Product not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductData();

    // Clean up to prevent state updates on unmounted component trees
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-lg font-medium text-gray-500">
        Fetching asset details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 font-semibold text-lg mb-4">{error || 'Product not found'}</div>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition cursor-pointer"
        >
          ← Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/products')} 
        className="text-gray-600 hover:text-blue-600 font-semibold mb-6 flex items-center gap-1 transition cursor-pointer"
      >
        ← Back to Catalogue
      </button>

      {/* Main Detail Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
        
        {/* Product Image Frame */}
        <div className="flex justify-center items-center bg-gray-50 p-6 rounded-xl border border-gray-100 h-80">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Product Information Context */}
        <div className="flex flex-col h-full justify-between py-2">
          <div>
            <div className="mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
              {product.title}
            </h2>
            
            <p className="text-sm text-gray-400 font-medium mb-4">
              Product ID Reference: #{product.id}
            </p>
            
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price Value</p>
              <p className="text-3xl font-black text-green-600">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
