import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const ProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local form state initialized with empty strings and standard defaults
  const [formData, setFormData] = useState<NewProductInput>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', // Premium high-res default fallback placeholder
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extra layer of client validation to ensure values are appropriate
    if (formData.price <= 0) {
      setError('Please provide a valid retail price greater than $0.00');
      setLoading(false);
      return;
    }

    try {
      // 1. Submit structural payload data to Fake Store API backend route
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server rejected product payload registration.');
      }

      const apiResult = await response.json();
      console.log('FakeStore API Mock Network Success Return:', apiResult);

      // 2. Generate a clean structured object mapping our local runtime shape
      const hybridNewProduct = {
        ...formData,
        id: Date.now(), // Unique timeline ID prevents conflicts with native mock indices 
      };

      // 3. Inject item back down to the local state system cache layer
      const localInventory = JSON.parse(localStorage.getItem('poc_created_products') || '[]');
      localInventory.unshift(hybridNewProduct); // Place directly at index 0 for immediate feedback
      localStorage.setItem('poc_created_products', JSON.stringify(localInventory));

      alert('Product created successfully! (Mock API accepted data and state synchronized locally)');
      
      // 4. Redirect the user back to the primary list route view matrix
      navigate('/products');
    } catch (err) {
      console.error('Add product execution path error:', err);
      setError(err instanceof Error ? err.message : 'Network communication fault occurred. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Structural Form Card Wrapper */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-6 sm:p-8">
        
        {/* Navigation Action Frame Header Row */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-500 mt-0.5">Register a new asset item to the current local listing grid.</p>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/products')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
          >
            ← Cancel & Return
          </button>
        </div>

        {/* Conditional Alert Output */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg font-medium flex gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Input Target Form controls layout */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Wireless Noise-Cancelling Headphones"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category
              </label>
              <input
                type="text"
                required
                placeholder="e.g., electronics, clothing"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide a detailed architectural log description regarding features, specifications, and layout sizing dimensions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  Processing API Handshake...
                </>
              ) : (
                'Save Product Record'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};