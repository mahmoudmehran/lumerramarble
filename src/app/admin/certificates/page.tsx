'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Award, Save, X, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import PageSEOManager from '@/components/admin/PageSEOManager'
import PageStatusToggle from '@/components/admin/PageStatusToggle'
import { ImageUpload } from '@/components/ui/image-upload'

interface Certificate {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionEs: string
  descriptionFr: string
  issuerAr: string
  issuerEn: string
  issuerEs: string
  issuerFr: string
  issueDate: string
  expiryDate?: string
  certificateUrl?: string
  imageUrl?: string
  category: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CertificatesManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
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
    issuerAr: '',
    issuerEn: '',
    issuerEs: '',
    issuerFr: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: '',
    imageUrl: '',
    category: 'quality',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const response = await fetch('/api/admin/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error('Error loading certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCertificate 
        ? `/api/admin/certificates/${editingCertificate.id}`
        : '/api/admin/certificates'
      
      const method = editingCertificate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        loadCertificates()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving certificate:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشهادة؟')) {
      try {
        const response = await fetch(`/api/admin/certificates/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadCertificates()
        }
      } catch (error) {
        console.error('Error deleting certificate:', error)
      }
    }
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      nameAr: certificate.nameAr,
      nameEn: certificate.nameEn,
      nameEs: certificate.nameEs,
      nameFr: certificate.nameFr,
      descriptionAr: certificate.descriptionAr,
      descriptionEn: certificate.descriptionEn,
      descriptionEs: certificate.descriptionEs,
      descriptionFr: certificate.descriptionFr,
      issuerAr: certificate.issuerAr,
      issuerEn: certificate.issuerEn,
      issuerEs: certificate.issuerEs,
      issuerFr: certificate.issuerFr,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate || '',
      certificateUrl: certificate.certificateUrl || '',
      imageUrl: certificate.imageUrl || '',
      category: certificate.category,
      sortOrder: certificate.sortOrder,
      isActive: certificate.isActive
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
      issuerAr: '',
      issuerEn: '',
      issuerEs: '',
      issuerFr: '',
      issueDate: '',
      expiryDate: '',
      certificateUrl: '',
      imageUrl: '',
      category: 'quality',
      sortOrder: 0,
      isActive: true
    })
    setEditingCertificate(null)
    setShowAddForm(false)
  }

  const filteredCertificates = certificates.filter(cert =>
    cert.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-6">
        <PageStatusToggle pageKey="certificates" pageName="شهادات الجودة" />
      </div>
      
      <PageSEOManager pageKey="certificates" pageName="شهادات الجودة" />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-8 h-8" />
              إدارة الشهادات
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتحرير الشهادات والاعتمادات
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'إلغاء' : 'إضافة شهادة جديدة'}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث عن شهادة..."
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
            {editingCertificate ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}
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
                <label className="block text-sm font-medium mb-2">الجهة المصدرة (عربي)</label>
                <Input
                  value={formData.issuerAr}
                  onChange={(e) => setFormData({ ...formData, issuerAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Issuer (English)</label>
                <Input
                  value={formData.issuerEn}
                  onChange={(e) => setFormData({ ...formData, issuerEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emisor (Español)</label>
                <Input
                  value={formData.issuerEs}
                  onChange={(e) => setFormData({ ...formData, issuerEs: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Émetteur (Français)</label>
                <Input
                  value={formData.issuerFr}
                  onChange={(e) => setFormData({ ...formData, issuerFr: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الإصدار</label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الانتهاء (اختياري)</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ملف الشهادة (اختياري)</label>
                <ImageUpload
                  currentImages={formData.certificateUrl ? [formData.certificateUrl] : []}
                  onUpload={(urls) => setFormData({ ...formData, certificateUrl: urls[0] || '' })}
                  onRemove={() => setFormData({ ...formData, certificateUrl: '' })}
                  multiple={false}
                  maxFiles={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">صورة الشهادة (اختياري)</label>
                <ImageUpload
                  currentImages={formData.imageUrl ? [formData.imageUrl] : []}
                  onUpload={(urls) => setFormData({ ...formData, imageUrl: urls[0] || '' })}
                  onRemove={() => setFormData({ ...formData, imageUrl: '' })}
                  multiple={false}
                  maxFiles={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
        {filteredCertificates.map((cert) => (
          <Card key={cert.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {cert.nameAr}
                </h3>
                <p className="text-gray-600 mb-2">{cert.descriptionAr}</p>
                <p className="text-sm text-gray-500 mb-2">
                  الجهة المصدرة: {cert.issuerAr} | تاريخ الإصدار: {new Date(cert.issueDate).toLocaleDateString('ar-EG')}
                </p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {cert.category}
                  </span>
                  <span className={`px-2 py-1 rounded ${cert.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cert.isActive ? 'فعّال' : 'غير فعّال'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(cert)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لا توجد شهادات
        </div>
      )}
    </div>
  )
}
