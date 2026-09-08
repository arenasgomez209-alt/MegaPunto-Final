import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Plus,
  Edit3,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Star,
  Sparkles,
  ShoppingBag,
  Tag,
  DollarSign,
  Layers,
  FileCheck,
  Save
} from 'lucide-react';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { productsAPI } from '../services/api.js';

export default function ModalCrearProducto({
  isOpen,
  onClose,
  onProductCreated,
  onProductSaved,
  productToEdit = null
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Celulares');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');

  // Image mode: 'url' or 'file'
  const [imageMode, setImageMode] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  // Sync state when productToEdit changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setTitle(productToEdit.title || productToEdit.nombre || '');
      setCategory(productToEdit.category || productToEdit.categoria || 'Celulares');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : (productToEdit.precio !== undefined ? String(productToEdit.precio) : ''));
      setDescription(productToEdit.description || productToEdit.descripcion || '');
      setStock(productToEdit.stock !== undefined ? String(productToEdit.stock) : '10');
      const img = productToEdit.image || productToEdit.imagen || '';
      setImageUrl(img);
      setImagePreview(img);
      setImageMode('url');
    } else {
      setTitle('');
      setCategory('Celulares');
      setPrice('');
      setDescription('');
      setStock('10');
      setImageUrl('');
      setImagePreview('');
      setImageMode('url');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const categories = [
    'Celulares',
    'Motos',
    'Electrodomésticos',
    'Tecnología',
    'Moda & Ropa',
    'Calzado'
  ];

  // Handle local file selection from PC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('La imagen no debe superar los 5MB.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formattedPricePreview = price && !isNaN(Number(price))
    ? `$${new Intl.NumberFormat('es-CO').format(Number(price))} COP`
    : '$0 COP';

  const currentActiveImage = imageMode === 'url' ? imageUrl.trim() : imagePreview;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const finalImage = imageMode === 'url' ? imageUrl.trim() : imagePreview;

    if (!title.trim() || !category || !price || !description.trim() || !finalImage) {
      setErrorMsg('Por favor completa todos los campos obligatorios incluyendo la imagen.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('El precio debe ser un número válido mayor a cero.');
      return;
    }

    setLoading(true);

    const productPayload = {
      title: title.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      stock: Number(stock) || 10,
      image: finalImage,
      rating: productToEdit?.rating || 5.0,
      reviews: productToEdit?.reviews || 1,
      estado: 'Activo'
    };

    let res;
    if (productToEdit) {
      const prodId = productToEdit._id || productToEdit.id;
      res = await productsAPI.update(prodId, productPayload);
    } else {
      res = await productsAPI.create(productPayload);
    }

    setLoading(false);

    if (res.ok && res.data.success) {
      const isEditing = Boolean(productToEdit);
      setSuccessMsg(
        isEditing
          ? '¡Producto actualizado exitosamente en el catálogo!'
          : '¡Producto publicado y guardado exitosamente en MongoDB!'
      );

      const savedData = res.data.product || productPayload;

      setTimeout(() => {
        if (onProductSaved) onProductSaved(savedData);
        if (onProductCreated) onProductCreated(savedData);
        handleClose();
      }, 900);
    } else {
      setErrorMsg(res.data?.message || 'Error al guardar el producto.');
    }
  };

  const handleClose = () => {
    setTitle('');
    setCategory('Celulares');
    setPrice('');
    setDescription('');
    setStock('10');
    setImageUrl('');
    setImagePreview('');
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  const isEditing = Boolean(productToEdit);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(4,2,16,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 animate-fadeInScale border shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: 'var(--shadow-card)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b pb-4" style={{ borderColor: 'var(--border-glass)' }}>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {isEditing ? 'Editor de Catálogo' : 'Gestor de Catálogo Pro'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Permiso Administrador & Empleado
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)] mt-1">
            {isEditing ? 'Editar Información del Producto' : 'Agregar Nuevo Producto al Catálogo'}
          </h2>
          <p className="text-xs text-[color:var(--text-muted)] mt-1">
            {isEditing
              ? 'Actualiza el título, categoría, precio, stock o imagen del producto seleccionado.'
              : 'Soporta enlaces directos de la web o imágenes locales subidas desde tu ordenador.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <form noValidate onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <Input
              label="Título del Producto"
              placeholder="Ej: Celular Samsung Galaxy S24 Ultra 512GB"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                  Categoría <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs font-semibold outline-none transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    color: 'var(--text-main)'
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#0f0a28', color: '#ffffff' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <Input
                label="Precio en Pesos (COP)"
                type="number"
                placeholder="Ej: 3500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                icon={DollarSign}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cantidad en Stock"
                type="number"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

              {/* Image Mode Selector Tabs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                  Fuente de la Imagen <span className="text-red-400">*</span>
                </label>
                <div className="flex rounded-xl p-1 bg-black/30 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" /> URL Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('file')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      imageMode === 'file'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> Subir de PC
                  </button>
                </div>
              </div>
            </div>

            {/* Image Input field based on mode */}
            {imageMode === 'url' ? (
              <Input
                label="Enlace URL de la Imagen en la Web"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                icon={LinkIcon}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                  Seleccionar Imagen desde tu Computador
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-glass-hover)', color: 'var(--text-main)' }}
                >
                  <Upload className="w-4 h-4 text-orange-400" />
                  {imagePreview ? '✅ Imagen seleccionada de tu PC (clic para cambiar)' : 'Haz clic para explorar imágenes en tu PC'}
                </button>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                Descripción y Características <span className="text-red-400">*</span>
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el producto, garantía oficial, especificaciones técnicas y beneficios..."
                className="w-full p-3 rounded-xl text-xs outline-none transition-all resize-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                disabled={loading}
                icon={isEditing ? Save : Plus}
              >
                {loading
                  ? 'Guardando en Base de Datos...'
                  : isEditing
                  ? 'Guardar Cambios del Producto'
                  : 'Guardar y Publicar en Catálogo'}
              </Button>
            </div>
          </form>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-3 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Vista Previa en Vivo
              </span>

              <div
                className="rounded-3xl overflow-hidden border shadow-2xl flex flex-col justify-between"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-card)'
                }}
              >
                {/* Image Box */}
                <div className="relative h-56 w-full overflow-hidden bg-black/50">
                  {currentActiveImage ? (
                    <img
                      src={currentActiveImage}
                      alt="Preview"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <ImageIcon className="w-12 h-12 opacity-40" />
                      <span className="text-xs font-semibold">Sin imagen cargada</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-black/70 text-orange-400 border border-orange-400/30">
                      {category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="text-base font-black text-white drop-shadow">
                      {formattedPricePreview}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h4 className="text-sm font-bold text-[color:var(--text-main)] line-clamp-2">
                    {title.trim() || 'Título del Producto'}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0</span>
                    <span className="text-slate-500 font-normal">({isEditing ? 'Edición en vivo' : 'Nuevo producto'})</span>
                  </div>

                  <p className="text-xs text-[color:var(--text-muted)] line-clamp-2">
                    {description.trim() || 'Aquí aparecerá la descripción del producto en tiempo real...'}
                  </p>

                  <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-glass)' }}>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Stock: <strong className="text-white">{stock || 10} unidades</strong>
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">Garantía MEGAPUNTO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {isEditing
                  ? 'Los cambios se reflejarán instantáneamente en toda la tienda para los clientes.'
                  : 'Al publicar, el producto quedará visible de inmediato en los filtros de la tienda.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
