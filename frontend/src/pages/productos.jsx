import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Filter,
  Check,
  Star,
  Mail,
  Send,
  Sparkles,
  Search,
  Plus,
  Tag,
  Smartphone,
  Bike,
  Refrigerator,
  Laptop,
  Shirt,
  Footprints,
  Layers,
  Heart,
  Eye,
  CheckCircle2,
  Share2,
  Edit3
} from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import ModalCrearProducto from '../components/ModalCrearProducto.jsx';
import { productsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

// Local fallbacks in case of fresh DB or loading
import imgNevera from '../Images/nevera.jpg';
import imgEstufa from '../Images/estufa.jpg';
import imgLavadora from '../Images/lavadora.jpg';
import imgPC from '../Images/pc.jpg';
import imgMoto from '../Images/moto.jpg';
import imgCarro from '../Images/carro.jpg';
import imgRopa from '../Images/IMG3.jfif';
import imgZapatos from '../Images/IMG4.jfif';
import imgCelular from '../Images/IMG8.jfif';

const fallbackProducts = [
  {
    _id: '1',
    title: "Nevera Samsung No Frost 400L Inverter Digital",
    category: "Electrodomésticos",
    price: 2850000,
    priceFormatted: "$2.850.000 COP",
    rating: 4.9,
    reviews: 58,
    image: imgNevera,
    description: "Refrigerador Samsung con tecnología Digital Inverter para ahorro de energía, congelado rápido y dispensador de agua."
  },
  {
    _id: '2',
    title: "Estufa Haceb 4 Puestos a Gas en Acero Inoxidable",
    category: "Electrodomésticos",
    price: 1150000,
    priceFormatted: "$1.150.000 COP",
    rating: 4.8,
    reviews: 34,
    image: imgEstufa,
    description: "Estufa Haceb de 4 quemadores con horno de gran capacidad, encendido electrónico y tapa de vidrio templado."
  },
  {
    _id: '3',
    title: "Lavadora Carga Frontal LG 18kg Smart AI",
    category: "Electrodomésticos",
    price: 3200000,
    priceFormatted: "$3.200.000 COP",
    rating: 4.9,
    reviews: 72,
    image: imgLavadora,
    description: "Lavadora inteligente LG con motor AI DD, función de lavado a vapor antisalérgenos y conectividad Wi-Fi."
  },
  {
    _id: '4',
    title: "Celular Xiaomi Redmi Note 13 Pro 256GB 5G",
    category: "Celulares",
    price: 1290000,
    priceFormatted: "$1.290.000 COP",
    rating: 4.9,
    reviews: 142,
    image: imgCelular,
    description: "Smartphone Xiaomi con cámara principal de 200MP, pantalla AMOLED a 120Hz y carga ultra rápida de 67W."
  },
  {
    _id: '5',
    title: "iPhone 15 Pro Max 256GB Titanio Natural",
    category: "Celulares",
    price: 5490000,
    priceFormatted: "$5.490.000 COP",
    rating: 5.0,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    description: "Smartphone Apple con chip A17 Pro, diseño en titanio aeroespacial y zoom óptico 5x."
  },
  {
    _id: '6',
    title: "Motocicleta Yamaha FZ 250 ABS Modelo 2026",
    category: "Motos",
    price: 15800000,
    priceFormatted: "$15.800.000 COP",
    rating: 5.0,
    reviews: 48,
    image: imgMoto,
    description: "Moto deportiva urbana Yamaha FZ 25, motor de 249cc, frenos ABS de doble canal e inyección electrónica."
  },
  {
    _id: '7',
    title: "Computador Portátil Gamer ASUS ROG Strix i7",
    category: "Tecnología",
    price: 4950000,
    priceFormatted: "$4.950.000 COP",
    rating: 4.9,
    reviews: 115,
    image: imgPC,
    description: "Laptop gamer de alta gama con tarjeta gráfica dedicada NVIDIA RTX, 16GB RAM y SSD de 1TB."
  },
  {
    _id: '8',
    title: "Chaqueta Térmica Impermeable Unisex MegaShield",
    category: "Moda & Ropa",
    price: 195000,
    priceFormatted: "$195.000 COP",
    rating: 4.6,
    reviews: 64,
    image: imgRopa,
    description: "Prenda de ropa con aislamiento térmico liviano, bolsillos de seguridad con cremallera y diseño moderno urbano."
  },
  {
    _id: '9',
    title: "Tenis Deportivos Running Pro Ergonomía Carbon",
    category: "Calzado",
    price: 280000,
    priceFormatted: "$280.000 COP",
    rating: 4.8,
    reviews: 81,
    image: imgZapatos,
    description: "Par de zapatos deportivos con cámara de aire para amortiguación de alto impacto y suela antideslizante."
  }
];

export default function Productos({ mode = 'productos' }) {
  const { currentUser, isAdmin, isEmpleado } = useAuth();
  const { addToCart, totalItems, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addedItemName, setAddedItemName] = useState(null);

  // Contact form state
  const [contactData, setContactData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Categories list with matching icons
  const categories = [
    { name: 'Todos', icon: Layers },
    { name: 'Celulares', icon: Smartphone },
    { name: 'Motos', icon: Bike },
    { name: 'Electrodomésticos', icon: Refrigerator },
    { name: 'Tecnología', icon: Laptop },
    { name: 'Moda & Ropa', icon: Shirt },
    { name: 'Calzado', icon: Footprints }
  ];

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    const res = await productsAPI.getAll({
      category: selectedCategory,
      search: searchQuery
    });
    setLoading(false);

    if (res.ok && res.data.success && res.data.products?.length > 0) {
      setProducts(res.data.products);
    } else {
      // Filter fallback locally
      let list = [...fallbackProducts];
      if (selectedCategory !== 'Todos') {
        if (selectedCategory === 'Celulares') {
          list = list.filter(p => p.category === 'Celulares' || p.category === 'Tecnología' && p.title.toLowerCase().includes('celular') || p.title.toLowerCase().includes('iphone') || p.title.toLowerCase().includes('xiaomi'));
        } else if (selectedCategory === 'Motos') {
          list = list.filter(p => p.category === 'Motos' || p.category === 'Vehículos' || p.title.toLowerCase().includes('moto'));
        } else {
          list = list.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      setProducts(list);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product) => {
    // Normalize product fields for CartContext
    const cartItem = {
      _id: product._id || product.id,
      nombre: product.nombre || product.title,
      precio: product.precio || product.price || 0,
      imagen: product.imagen || product.image,
      categoria: product.categoria || product.category,
      stock: product.stock || 99,
    };
    addToCart(cartItem, 1);
    setAddedItemName(product.nombre || product.title);
    setTimeout(() => setAddedItemName(null), 3000);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactData.nombre && contactData.email && contactData.mensaje) {
      setContactSubmitted(true);
    }
  };

  if (mode === 'contacto') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fadeInDown">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Atención al Cliente MEGAPUNTO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[color:var(--text-main)]">Centro de Contacto</h1>
          <p className="text-sm text-[color:var(--text-muted)] max-w-xl mx-auto">
            ¿Tienes consultas sobre compras, garantías, despachos o servicios? Escríbenos y un asesor te responderá inmediatamente.
          </p>
        </div>

        <div
          className="p-6 sm:p-10 rounded-3xl animate-fadeInUp"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {contactSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-[color:var(--text-main)]">¡Mensaje Enviado con Éxito!</h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                Gracias <strong className="text-orange-400">{contactData.nombre}</strong>. Hemos recibido tu mensaje y nos pondremos en contacto al correo <strong className="text-white">{contactData.email}</strong>.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setContactSubmitted(false);
                  setContactData({ nombre: '', email: '', asunto: '', mensaje: '' });
                }}
              >
                Enviar Otro Mensaje
              </Button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre Completo"
                  value={contactData.nombre}
                  onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  icon={Mail}
                  required
                />
              </div>

              <Input
                label="Asunto de la Consulta"
                value={contactData.asunto}
                onChange={(e) => setContactData({ ...contactData, asunto: e.target.value })}
                placeholder="Motivo de tu mensaje"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[color:var(--text-main)] opacity-90">
                  Mensaje o Consulta <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={contactData.mensaje}
                  onChange={(e) => setContactData({ ...contactData, mensaje: e.target.value })}
                  placeholder="Escribe aquí los detalles de tu consulta..."
                  className="w-full p-3.5 text-sm placeholder:opacity-50 rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                icon={Send}
              >
                Enviar Mensaje
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Toast Notification when adding to cart */}
      {addedItemName && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3 animate-slideRight">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <span>¡Agregado al carrito de compras!</span>
            <p className="text-[10px] text-emerald-200 truncate max-w-xs">{addedItemName}</p>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6"
        style={{ borderBottom: '1px solid var(--border-glass)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-orange-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Catálogo Oficial MEGAPUNTO
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              MongoDB Conectado
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[color:var(--text-main)] mt-1">
            Explora Nuestros Productos
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] mt-1 max-w-2xl">
            Celulares de última tecnología, motocicletas deportivas, electrodomésticos para el hogar, moda y calzado con garantía directa.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Admin or Empleado button to quickly add products */}
          {(isAdmin || isEmpleado) && (
            <Button
              variant="orange"
              size="md"
              icon={Plus}
              onClick={() => {
                setEditingProduct(null);
                setIsCreateModalOpen(true);
              }}
            >
              Agregar Producto
            </Button>
          )}

          {totalItems > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 animate-fadeIn hover:bg-orange-500/25 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-black">{totalItems} en Carrito</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar & Fast Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por marca, celular, moto, electrodoméstico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none transition-all"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              color: 'var(--text-main)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-400 self-end sm:self-center">
          Mostrando <strong className="text-orange-400">{products.length}</strong> productos
        </div>
      </div>

      {/* Interactive Category Filter Pills (Celulares, Motos, etc.) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 select-none">
        <Filter className="w-4 h-4 text-purple-400 shrink-0 mr-1" />
        {categories.map(({ name, icon: Icon }) => {
          const isSelected = selectedCategory === name;
          return (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg shadow-purple-600/30 scale-105 border border-white/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Consultando catálogo en tiempo real...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-white/10 p-8">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-[color:var(--text-main)]">No se encontraron productos</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No encontramos resultados para la categoría <strong className="text-orange-400">"{selectedCategory}"</strong> con la búsqueda actual.
          </p>
          <Button
            variant="ghost"
            onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
          >
            Restablecer Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeInUp">
          {products.map((prod) => {
            const isFav = favorites.includes(prod._id);
            return (
              <div
                key={prod._id || prod.id}
                className="rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:translate-y-[-6px] hover:shadow-2xl border"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-card)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  {/* Image & Badges - Fondo Negro Premium para realzar el producto */}
                  <div className="relative h-48 w-full overflow-hidden" style={{background:'#0b0f19'}}>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5 pointer-events-none">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 text-orange-400 backdrop-blur-md border border-orange-400/30 shadow-lg"
                      >
                        {prod.category}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(prod._id)}
                      className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isFav ? 'bg-rose-500 text-white shadow-rose-500/50' : 'bg-black/50 text-white/80 hover:text-white'
                      }`}
                      title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Price tag on image for fast look */}
                    <div className="absolute bottom-3 left-3.5 pointer-events-none">
                      <span className="text-lg font-black text-white drop-shadow-md">
                        {prod.priceFormatted || `$${prod.price?.toLocaleString()} COP`}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-bold text-[color:var(--text-main)] group-hover:text-orange-400 transition-colors duration-200 leading-snug line-clamp-2">
                      {prod.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{prod.rating || 5.0}</span>
                      <span className="font-normal" style={{color:'#524b6e'}}>({prod.reviews || 10} opiniones)</span>
                    </div>

                    <p className="text-xs text-[color:var(--text-muted)] leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Purchase Action */}
                <div
                  className="p-4 pt-0 flex items-center justify-between gap-3 border-t mt-2"
                  style={{ borderColor: 'var(--border-glass)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                    </div>
                    {(isAdmin || isEmpleado) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(prod);
                          setIsCreateModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
                        title="Editar información de este producto"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>

                  <Button
                    variant="orange"
                    size="sm"
                    icon={ShoppingBag}
                    onClick={() => handleAddToCart(prod)}
                  >
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create or Edit Product (Admin / Empleado) */}
      <ModalCrearProducto
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onProductSaved={() => {
          fetchProducts();
        }}
        onProductCreated={(newProd) => {
          setProducts(prev => [newProd, ...prev]);
        }}
      />
    </div>
  );
}
