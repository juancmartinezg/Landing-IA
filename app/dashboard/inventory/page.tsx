'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export default function InventoryPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  useEffect(() => {
    fetch(`${API_URL}/services`, { headers: { 'client-id': user?.companyId || '' } })
      .then(res => res.json())
      .then(data => {
        const inventory = (data.services || []).filter((s: any) => s.track_inventory);
        setServices(inventory);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const totalStock = services.reduce((sum, s) => sum + (s.stock_quantity || 0), 0);
  const totalCost = services.reduce((sum, s) => sum + ((s.stock_quantity || 0) * (s.cost_price || 0)), 0);
  const totalValue = services.reduce((sum, s) => sum + ((s.stock_quantity || 0) * (s.pricing?.regular_price || 0)), 0);
  const lowStock = services.filter(s => (s.stock_quantity || 0) <= (s.stock_min_alert || 5));
  const sorted = [...services].sort((a, b) => {
    if (sortBy === 'stock') return (a.stock_quantity || 0) - (b.stock_quantity || 0);
    if (sortBy === 'value') return ((b.stock_quantity || 0) * (b.pricing?.regular_price || 0)) - ((a.stock_quantity || 0) * (a.pricing?.regular_price || 0));
    if (sortBy === 'margin') {
      const ma = (a.pricing?.regular_price || 0) - (a.cost_price || 0);
      const mb = (b.pricing?.regular_price || 0) - (b.cost_price || 0);
      return mb - ma;
    }
    return (a.name || '').localeCompare(b.name || '');
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario 📦</h1>
        <a href="/dashboard/services" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold">
          Ir a Catálogo →
        </a>
      </div>
      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Productos</p>
          <p className="text-2xl font-bold text-indigo-400">{services.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Unidades</p>
          <p className="text-2xl font-bold text-emerald-400">{totalStock.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Valor inventario</p>
          <p className="text-2xl font-bold text-purple-400">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Costo total</p>
          <p className="text-2xl font-bold text-gray-400">${totalCost.toLocaleString()}</p>
          {totalValue > 0 && (
            <p className="text-[10px] text-emerald-400 mt-1">Margen: {Math.round(((totalValue - totalCost) / totalValue) * 100)}%</p>
          )}
        </div>
      </div>
      {/* Alertas stock bajo */}
      {lowStock.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-red-400 mb-2">⚠️ Stock bajo ({lowStock.length} productos)</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((s, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 font-bold">
                {s.name}: {s.stock_quantity || 0} uds
              </span>
            ))}
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : services.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📦</p>
          <h2 className="text-xl font-bold mb-2">Sin productos con inventario</h2>
          <p className="text-gray-400 text-sm mb-4">Activa "Tiene inventario" en tus servicios desde el Catálogo.</p>
          <a href="/dashboard/services" className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
            Ir a Catálogo →
          </a>
        </div>
      ) : (
        <>
          {/* Ordenar */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'name', label: 'Nombre' },
              { id: 'stock', label: 'Stock ↑' },
              { id: 'value', label: 'Valor ↓' },
              { id: 'margin', label: 'Margen ↓' },
            ].map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  sortBy === s.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Tabla */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest">
                    <th className="text-left px-5 py-3">Producto</th>
                    <th className="text-left px-3 py-3 hidden sm:table-cell">SKU</th>
                    <th className="text-right px-3 py-3">Stock</th>
                    <th className="text-right px-3 py-3 hidden md:table-cell">Costo</th>
                    <th className="text-right px-3 py-3">Venta</th>
                    <th className="text-right px-3 py-3 hidden md:table-cell">Margen</th>
                    <th className="text-right px-3 py-3 hidden lg:table-cell">Valor stock</th>
                    <th className="text-right px-5 py-3 hidden sm:table-cell">Proveedor</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((svc, i) => {
                    const stock = svc.stock_quantity || 0;
                    const cost = svc.cost_price || 0;
                    const price = svc.pricing?.regular_price || 0;
                    const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
                    const isLow = stock <= (svc.stock_min_alert || 5);
                    return (
                      <tr key={i} className={`border-b border-white/[0.03] hover:bg-white/[0.02] ${isLow ? 'bg-red-500/[0.03]' : ''}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {svc.image_url ? (
                              <img src={svc.image_url} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] shrink-0">📦</div>
                            )}
                            <span className="font-medium truncate">{svc.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-500 hidden sm:table-cell">{svc.sku || '-'}</td>
                        <td className="px-3 py-3 text-right">
                          <span className={`font-bold ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                            {stock}
                          </span>
                          {isLow && <span className="text-[9px] text-red-400 ml-1">⚠️</span>}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-400 hidden md:table-cell">${cost.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-white font-medium">${price.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right hidden md:table-cell">
                          <span className={`text-xs font-bold ${margin >= 50 ? 'text-emerald-400' : margin >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {margin}%
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-gray-400 hidden lg:table-cell">${(stock * price).toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-gray-500 text-xs hidden sm:table-cell">{svc.supplier || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}