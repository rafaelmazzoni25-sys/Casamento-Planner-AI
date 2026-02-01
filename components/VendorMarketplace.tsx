import React, { useState } from 'react';
import { Vendor, ExpenseCategory } from '../types';
import { Search, MapPin, Star, ShieldCheck, Heart, MessageCircle, Filter } from 'lucide-react';

interface VendorMarketplaceProps {
  onContactVendor: (vendor: Vendor) => void;
}

// Mock Data simulating a database of paying vendors
const MOCK_VENDORS: Vendor[] = [
  { id: '1', name: 'Buffet Delícias Reais', category: ExpenseCategory.CATERING, rating: 4.8, reviewsCount: 124, minPrice: 150, imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400', isVerified: true, isFeatured: true, location: 'São Paulo, SP' },
  { id: '2', name: 'Foto & Alma', category: ExpenseCategory.PHOTO_VIDEO, rating: 4.9, reviewsCount: 89, minPrice: 3500, imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=400', isVerified: true, isFeatured: true, location: 'Rio de Janeiro, RJ' },
  { id: '3', name: 'DJ Party Sound', category: ExpenseCategory.MUSIC, rating: 4.5, reviewsCount: 45, minPrice: 2000, imageUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=400', isVerified: false, isFeatured: false, location: 'Curitiba, PR' },
  { id: '4', name: 'Villa Campestre', category: ExpenseCategory.VENUE, rating: 4.7, reviewsCount: 210, minPrice: 12000, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400', isVerified: true, isFeatured: false, location: 'Campinas, SP' },
  { id: '5', name: 'Flores & Amores', category: ExpenseCategory.DECOR, rating: 4.6, reviewsCount: 32, minPrice: 4000, imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=400', isVerified: true, isFeatured: false, location: 'São Paulo, SP' },
  { id: '6', name: 'Convites Premium', category: ExpenseCategory.INVITES, rating: 4.9, reviewsCount: 56, minPrice: 800, imageUrl: 'https://images.unsplash.com/photo-1550529808-1662d515f8d9?auto=format&fit=crop&q=80&w=400', isVerified: false, isFeatured: true, location: 'Online' },
];

export const VendorMarketplace: React.FC<VendorMarketplaceProps> = ({ onContactVendor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVendors = MOCK_VENDORS.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Hero / Search Section */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-2xl p-6 md:p-8 text-white shadow-xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Encontre os Melhores Profissionais</h2>
        <p className="text-rose-100 mb-6 max-w-2xl mx-auto text-sm md:text-base">
          Conectamos você a fornecedores verificados. Peça orçamentos sem compromisso e garanta a segurança do seu evento.
        </p>
        
        <div className="bg-white p-2 rounded-xl shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 py-2 md:py-0">
                <Search className="text-slate-400 mr-2 shrink-0" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou cidade..."
                  className="w-full py-2 outline-none text-slate-700 text-sm"
                />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                <Filter className="text-slate-400 mr-2 shrink-0" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 outline-none text-slate-700 bg-transparent text-sm"
                >
                    <option value="all">Todas as Categorias</option>
                    {Object.values(ExpenseCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <button className="bg-slate-800 text-white px-6 py-3 md:py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors w-full md:w-auto">
                Buscar
            </button>
        </div>
      </div>

      {/* Featured Badge Explanation (B2B Value Prop) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 gap-3 text-center md:text-left">
          <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
              <span>Profissionais com selo <strong>Verificado</strong> passaram por nossa curadoria de qualidade.</span>
          </div>
          <button className="text-rose-600 text-sm font-bold hover:underline whitespace-nowrap">
              É fornecedor? Cadastre sua empresa
          </button>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
              <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                  <div className="relative h-48 bg-slate-200">
                      <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
                      {vendor.isFeatured && (
                          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                              DESTAQUE
                          </div>
                      )}
                      <button className="absolute top-2 left-2 p-2 bg-white/50 hover:bg-white text-rose-500 rounded-full backdrop-blur-sm transition-colors">
                          <Heart size={16} />
                      </button>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-rose-600 transition-colors">{vendor.name}</h3>
                          {vendor.isVerified && (
                              <ShieldCheck className="text-emerald-500 shrink-0" size={20} title="Fornecedor Verificado" />
                          )}
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{vendor.category}</p>
                      
                      <div className="flex items-center gap-1 mb-2">
                          <Star className="text-amber-400 fill-amber-400" size={16} />
                          <span className="font-bold text-slate-700">{vendor.rating}</span>
                          <span className="text-slate-400 text-sm">({vendor.reviewsCount} avaliações)</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                          <MapPin size={14} />
                          {vendor.location}
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                              <p className="text-xs text-slate-400">A partir de</p>
                              <p className="font-bold text-emerald-600 text-lg">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(vendor.minPrice)}
                              </p>
                          </div>
                          <button 
                            onClick={() => onContactVendor(vendor)}
                            className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded-lg font-medium hover:bg-rose-100 transition-colors flex items-center gap-2"
                          >
                              <MessageCircle size={18} />
                              Cotar
                          </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};