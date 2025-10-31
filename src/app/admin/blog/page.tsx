'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  // Eye,
  FileText,
  Save,
  X,
  // Globe
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'

interface BlogPost {
  id: string
  titleAr: string
  titleEn: string
  titleEs: string
  titleFr: string
  contentAr: string
  contentEn: string
  contentEs: string
  contentFr: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  slug: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [publishedFilter, setPublishedFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    titleEs: '',
    titleFr: '',
    contentAr: '',
    contentEn: '',
    contentEs: '',
    contentFr: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    featured: false,
    published: false
  })

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/blog', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else if (response.status === 401) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('admin_token')
      const url = '/api/admin/blog'
      const method = editingPost ? 'PUT' : 'POST'
      
      const payload = editingPost 
        ? { id: editingPost.id, ...formData }
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
        alert(editingPost ? 'تم تحديث المقال بنجاح!' : 'تم إضافة المقال بنجاح!')
        setShowAddForm(false)
        setEditingPost(null)
        resetForm()
        loadPosts()
      } else {
        const data = await response.json()
        alert(data.message || 'حدث خطأ في حفظ المقال')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('حدث خطأ في حفظ المقال')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم حذف المقال بنجاح!')
        loadPosts()
      } else {
        alert('حدث خطأ في حذف المقال')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('حدث خطأ في حذف المقال')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      titleAr: post.titleAr,
      titleEn: post.titleEn,
      titleEs: post.titleEs,
      titleFr: post.titleFr,
      contentAr: post.contentAr,
      contentEn: post.contentEn,
      contentEs: post.contentEs,
      contentFr: post.contentFr,
      excerpt: post.excerpt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      slug: post.slug,
      featured: post.featured,
      published: post.published
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      titleEs: '',
      titleFr: '',
      contentAr: '',
      contentEn: '',
      contentEs: '',
      contentFr: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      slug: '',
      featured: false,
      published: false
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPublished = publishedFilter === 'all' || 
                            (publishedFilter === 'published' && post.published) ||
                            (publishedFilter === 'draft' && !post.published)
    return matchesSearch && matchesPublished
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المقالات...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">إدارة المدونة</h1>
            <p className="text-gray-600">إضافة وتعديل مقالات المدونة</p>
          </div>
          <Button 
            onClick={() => {
              setShowAddForm(true)
              resetForm()
              setEditingPost(null)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false)
                  setEditingPost(null)
                  resetForm()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان بالعربية *
                  </label>
                  <Input
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleInputChange}
                    placeholder="دليل اختيار الرخام المناسب"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان بالإنجليزية *
                  </label>
                  <Input
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleInputChange}
                    placeholder="Guide to Choosing the Right Marble"
                    required
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المحتوى بالعربية *
                  </label>
                  <textarea
                    name="contentAr"
                    value={formData.contentAr}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="محتوى المقال بالعربية..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المحتوى بالإنجليزية *
                  </label>
                  <textarea
                    name="contentEn"
                    value={formData.contentEn}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="Article content in English..."
                    required
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الملخص
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="ملخص قصير للمقال..."
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
                    placeholder="guide-to-choosing-marble"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2 rtl:mr-0 rtl:ml-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    مقال مميز
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="mr-2 rtl:mr-0 rtl:ml-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    منشور
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingPost ? 'تحديث المقال' : 'حفظ المقال'}
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
                  placeholder="البحث في المقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>
            <div>
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع المقالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مقالات</h3>
            <p className="text-gray-500">قم بإضافة مقالات جديدة لعرضها هنا</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{post.titleAr}</h3>
                      {post.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          مميز
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'منشور' : 'مسودة'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{post.titleEn}</p>
                    
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      تم الإنشاء: {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4 rtl:ml-0 rtl:mr-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
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
