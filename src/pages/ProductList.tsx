import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the inventory matrix arrays on mount
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching inventory:', err))
      .finally(() => setLoading(false));
  }, []);

  // Handle API resource deletion and update UI state locally
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops row click from opening details page
    if (!window.confirm(`Are you sure you want to delete Product #${id}?`)) return;

    try {
      const response = await fetch(`https://fakestoreapi.com/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Product deleted successfully (FakeStore API mock code 200 simulation).');
      }
    } catch (err) {
      console.error('Delete target operation failed:', err);
      alert('Delete operation failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-lg font-medium text-gray-500">
        Syncing live inventory stream...
      </div>
    );
  }

  return (
    <div>
      {/* Header Context Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products Inventory Inventory</h2>
        <button 
          onClick={() => navigate('/products/new')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition cursor-pointer"
        >
          + Add New Product
        </button>
      </div>

      {/* Responsive Grid Data Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                <th className="p-4 w-16 text-center">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition text-gray-600"
                >
                  <td className="p-4 text-center font-bold text-gray-900">{product.id}</td>
                  <td className="p-4 font-medium text-gray-800 max-w-xs truncate">{product.title}</td>
                  <td className="p-4 font-semibold text-green-600">${product.price.toFixed(2)}</td>
                  <td className="p-4 capitalize"><span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-md font-medium">{product.category}</span></td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => handleDelete(product.id, e)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
