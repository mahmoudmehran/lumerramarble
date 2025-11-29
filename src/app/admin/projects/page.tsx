'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, FolderKanban, Save, X, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import PageSEOManager from '@/components/admin/PageSEOManager'
import PageStatusToggle from '@/components/admin/PageStatusToggle'
import { ImageUpload } from '@/components/ui/image-upload'

interface Project {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionEs: string
  descriptionFr: string
  clientName?: string
  locationAr: string
  locationEn: string
  locationEs: string
  locationFr: string
  area?: string
  duration?: string
  completionDate?: string
  category: string
  featuredImage?: string
  slug: string
  featured: boolean
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    nameEs: '',
    nameFr: '',
    descriptionAr: '',
    descriptionEn: '',
    descriptionEs: '',
    descriptionFr: '',
    clientName: '',
    locationAr: '',
    locationEn: '',
    locationEs: '',
    locationFr: '',
    area: '',
    duration: '',
    completionDate: '',
    category: 'residential',
    featuredImage: '',
    slug: '',
    featured: false,
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProject 
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects'
      
      const method = editingProject ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        loadProjects()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        const response = await fetch(`/api/admin/projects/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadProjects()
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      nameAr: project.nameAr,
      nameEn: project.nameEn,
      nameEs: project.nameEs,
      nameFr: project.nameFr,
      descriptionAr: project.descriptionAr,
      descriptionEn: project.descriptionEn,
      descriptionEs: project.descriptionEs,
      descriptionFr: project.descriptionFr,
      clientName: project.clientName || '',
      locationAr: project.locationAr,
      locationEn: project.locationEn,
      locationEs: project.locationEs,
      locationFr: project.locationFr,
      area: project.area || '',
      duration: project.duration || '',
      completionDate: project.completionDate || '',
      category: project.category,
      featuredImage: project.featuredImage || '',
      slug: project.slug,
      featured: project.featured,
      sortOrder: project.sortOrder,
      isActive: project.isActive
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
      clientName: '',
      locationAr: '',
      locationEn: '',
      locationEs: '',
      locationFr: '',
      area: '',
      duration: '',
      completionDate: '',
      category: 'residential',
      featuredImage: '',
      slug: '',
      featured: false,
      sortOrder: 0,
      isActive: true
    })
    setEditingProject(null)
    setShowAddForm(false)
  }

  const filteredProjects = projects.filter(project =>
    project.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-6">
        <PageStatusToggle pageKey="projects" pageName="المشاريع" />
      </div>
      
      <PageSEOManager pageKey="projects" pageName="المشاريع" />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderKanban className="w-8 h-8" />
              إدارة المشاريع
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتحرير مشاريع الشركة
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'إلغاء' : 'إضافة مشروع جديد'}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث عن مشروع..."
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
            {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم (عربي)</label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name (English)</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nombre (Español)</label>
                <Input
                  value={formData.nameEs}
                  onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom (Français)</label>
                <Input
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الوصف (عربي)</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (English)</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descripción (Español)</label>
                <textarea
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Français)</label>
                <textarea
                  value={formData.descriptionFr}
                  onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الموقع (عربي)</label>
                <Input
                  value={formData.locationAr}
                  onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location (English)</label>
                <Input
                  value={formData.locationEn}
                  onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ubicación (Español)</label>
                <Input
                  value={formData.locationEs}
                  onChange={(e) => setFormData({ ...formData, locationEs: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emplacement (Français)</label>
                <Input
                  value={formData.locationFr}
                  onChange={(e) => setFormData({ ...formData, locationFr: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم العميل (اختياري)</label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المساحة (اختياري)</label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المدة (اختياري)</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الإنجاز (اختياري)</label>
                <Input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الصورة البارزة (اختياري)</label>
                <ImageUpload
                  currentImages={formData.featuredImage ? [formData.featuredImage] : []}
                  onUpload={(urls) => setFormData({ ...formData, featuredImage: urls[0] || '' })}
                  onRemove={() => setFormData({ ...formData, featuredImage: '' })}
                  multiple={false}
                  maxFiles={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>مميز</span>
                </label>
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
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {project.nameAr}
                </h3>
                <p className="text-gray-600 mb-2">{project.descriptionAr}</p>
                <p className="text-sm text-gray-500 mb-2">
                  الموقع: {project.locationAr}
                  {project.clientName && ` | العميل: ${project.clientName}`}
                  {project.completionDate && ` | الإنجاز: ${new Date(project.completionDate).toLocaleDateString('ar-EG')}`}
                </p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      مميز
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded ${project.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {project.isActive ? 'فعّال' : 'غير فعّال'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لا توجد مشاريع
        </div>
      )}
    </div>
  )
}
