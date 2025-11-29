'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, BookOpen, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import PageSEOManager from '@/components/admin/PageSEOManager'
import PageStatusToggle from '@/components/admin/PageStatusToggle'

interface ExportGuide {
  id: string
  titleAr: string
  titleEn: string
  titleEs: string
  titleFr: string
  contentAr: string
  contentEn: string
  contentEs: string
  contentFr: string
  category: string
  icon?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ExportGuidesManagement() {
  const [guides, setGuides] = useState<ExportGuide[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGuide, setEditingGuide] = useState<ExportGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    titleEs: '',
    titleFr: '',
    contentAr: '',
    contentEn: '',
    contentEs: '',
    contentFr: '',
    category: 'documentation',
    icon: '',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    loadGuides()
  }, [])

  const loadGuides = async () => {
    try {
      const response = await fetch('/api/admin/export-guides')
      if (response.ok) {
        const data = await response.json()
        setGuides(data)
      }
    } catch (error) {
      console.error('Error loading export guides:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingGuide 
        ? `/api/admin/export-guides/${editingGuide.id}`
        : '/api/admin/export-guides'
      
      const method = editingGuide ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        loadGuides()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving export guide:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الدليل؟')) {
      try {
        const response = await fetch(`/api/admin/export-guides/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadGuides()
        }
      } catch (error) {
        console.error('Error deleting export guide:', error)
      }
    }
  }

  const handleEdit = (guide: ExportGuide) => {
    setEditingGuide(guide)
    setFormData({
      titleAr: guide.titleAr,
      titleEn: guide.titleEn,
      titleEs: guide.titleEs,
      titleFr: guide.titleFr,
      contentAr: guide.contentAr,
      contentEn: guide.contentEn,
      contentEs: guide.contentEs,
      contentFr: guide.contentFr,
      category: guide.category,
      icon: guide.icon || '',
      sortOrder: guide.sortOrder,
      isActive: guide.isActive
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
      category: 'documentation',
      icon: '',
      sortOrder: 0,
      isActive: true
    })
    setEditingGuide(null)
    setShowAddForm(false)
  }

  const filteredGuides = guides.filter(guide =>
    guide.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-6">
        <PageStatusToggle pageKey="export-guide" pageName="دليل التصدير" />
      </div>
      
      <PageSEOManager pageKey="export-guide" pageName="دليل التصدير" />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              إدارة دليل التصدير
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتحرير أدلة ومعلومات التصدير
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'إلغاء' : 'إضافة دليل جديد'}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث عن دليل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>

      {showAddForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingGuide ? 'تعديل الدليل' : 'إضافة دليل جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (عربي)</label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Título (Español)</label>
                <Input
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Titre (Français)</label>
                <Input
                  value={formData.titleFr}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى (عربي)</label>
                <textarea
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content (English)</label>
                <textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenido (Español)</label>
                <textarea
                  value={formData.contentEs}
                  onChange={(e) => setFormData({ ...formData, contentEs: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenu (Français)</label>
                <textarea
                  value={formData.contentFr}
                  onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الأيقونة (اختياري)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ترتيب العرض</label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>فعّال</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {guide.titleAr}
                </h3>
                <p className="text-gray-600 mb-2 whitespace-pre-line">{guide.contentAr}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {guide.category}
                  </span>
                  <span className={`px-2 py-1 rounded ${guide.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {guide.isActive ? 'فعّال' : 'غير فعّال'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(guide)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(guide.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لا توجد أدلة تصدير
        </div>
      )}
    </div>
  )
}
