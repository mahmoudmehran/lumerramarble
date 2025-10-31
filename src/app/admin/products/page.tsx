'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  // Filter,
  // Eye,
  Package,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'
import Image from 'next/image'

interface Product {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  category: string
  descriptionAr: string
  descriptionEn: string
  descriptionEs: string
  descriptionFr: string
  thickness: string
  finishes: string
  originCountry: string
  images: string[]
  slug: string
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    nameEs: '',
    nameFr: '',
    descriptionAr: '',
    descriptionEn: '',
    descriptionEs: '',
    descriptionFr: '',
    category: 'MARBLE',
    thickness: '',
    finishes: '',
    originCountry: 'مصر',
    slug: '',
    featured: false,
    images: [] as string[]
  })

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else if (response.status === 401) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const payload = editingProduct 
        ? { id: editingProduct.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(editingProduct ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!')
        setShowAddForm(false)
        setEditingProduct(null)
        resetForm()
        loadProducts()
      } else {
        alert('حدث خطأ في حفظ المنتج')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('حدث خطأ في حفظ المنتج')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم حذف المنتج بنجاح!')
        loadProducts()
      } else {
        alert('حدث خطأ في حذف المنتج')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('حدث خطأ في حذف المنتج')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      nameEs: product.nameEs,
      nameFr: product.nameFr,
      descriptionAr: product.descriptionAr,
      descriptionEn: product.descriptionEn,
      descriptionEs: product.descriptionEs,
      descriptionFr: product.descriptionFr,
      category: product.category,
      thickness: product.thickness,
      finishes: product.finishes,
      originCountry: product.originCountry,
      slug: product.slug,
      featured: product.featured,
      images: product.images
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      nameEs: '',
      nameFr: '',
      descriptionAr: '',
      descriptionEn: '',
      descriptionEs: '',
      descriptionFr: '',
      category: 'MARBLE',
      thickness: '',
      finishes: '',
      originCountry: 'مصر',
      slug: '',
      featured: false,
      images: []
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'MARBLE': 'رخام',
      'GRANITE': 'جرانيت', 
      'QUARTZ': 'كوارتز',
      'SPECIAL': 'منتجات خاصة'
    }
    return categories[category] || category
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
            <p className="text-gray-600">إضافة وتعديل منتجات الشركة</p>
          </div>
          <Button 
            onClick={() => {
              setShowAddForm(true)
              resetForm()
              setEditingProduct(null)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProduct(null)
                  resetForm()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالعربية *
                  </label>
                  <Input
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="رخام كرارا أبيض"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإنجليزية *
                  </label>
                  <Input
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="Carrara White Marble"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإسبانية
                  </label>
                  <Input
                    name="nameEs"
                    value={formData.nameEs}
                    onChange={handleInputChange}
                    placeholder="Mármol Blanco Carrara"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالفرنسية
                  </label>
                  <Input
                    name="nameFr"
                    value={formData.nameFr}
                    onChange={handleInputChange}
                    placeholder="Marbre Blanc de Carrare"
                  />
                </div>
              </div>

              {/* Category and Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="MARBLE">رخام</option>
                    <option value="GRANITE">جرانيت</option>
                    <option value="QUARTZ">كوارتز</option>
                    <option value="SPECIAL">منتجات خاصة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السماكة
                  </label>
                  <Input
                    name="thickness"
                    value={formData.thickness}
                    onChange={handleInputChange}
                    placeholder="18mm, 20mm, 30mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التشطيبات
                  </label>
                  <Input
                    name="finishes"
                    value={formData.finishes}
                    onChange={handleInputChange}
                    placeholder="مصقول، مطفي، مضغوط"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف بالعربية *
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف تفصيلي للمنتج"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف بالإنجليزية *
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="Detailed product description"
                    required
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بلد المنشأ
                  </label>
                  <Input
                    name="originCountry"
                    value={formData.originCountry}
                    onChange={handleInputChange}
                    placeholder="مصر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرابط المخصص (Slug)
                  </label>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="carrara-white-marble"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2 rtl:mr-0 rtl:ml-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    منتج مميز
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'تحديث المنتج' : 'حفظ المنتج'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الفئات</option>
                <option value="MARBLE">رخام</option>
                <option value="GRANITE">جرانيت</option>
                <option value="QUARTZ">كوارتز</option>
                <option value="SPECIAL">منتجات خاصة</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">قم بإضافة منتجات جديدة لعرضها هنا</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.nameAr}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.nameAr}</h3>
                    {product.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        مميز
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{product.nameEn}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{getCategoryName(product.category)}</span>
                    <span>{product.originCountry}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {product.descriptionAr}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
