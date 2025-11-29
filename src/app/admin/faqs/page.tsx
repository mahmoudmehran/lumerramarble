'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, HelpCircle, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import PageSEOManager from '@/components/admin/PageSEOManager'
import PageStatusToggle from '@/components/admin/PageStatusToggle'

interface FAQ {
  id: string
  questionAr: string
  questionEn: string
  questionEs: string
  questionFr: string
  answerAr: string
  answerEn: string
  answerEs: string
  answerFr: string
  category: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function FAQsManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    questionAr: '',
    questionEn: '',
    questionEs: '',
    questionFr: '',
    answerAr: '',
    answerEn: '',
    answerEs: '',
    answerFr: '',
    category: 'general',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    try {
      const response = await fetch('/api/admin/faqs')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data)
      }
    } catch (error) {
      console.error('Error loading FAQs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingFAQ 
        ? `/api/admin/faqs/${editingFAQ.id}`
        : '/api/admin/faqs'
      
      const method = editingFAQ ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        loadFAQs()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        const response = await fetch(`/api/admin/faqs/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadFAQs()
        }
      } catch (error) {
        console.error('Error deleting FAQ:', error)
      }
    }
  }

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq)
    setFormData({
      questionAr: faq.questionAr,
      questionEn: faq.questionEn,
      questionEs: faq.questionEs,
      questionFr: faq.questionFr,
      answerAr: faq.answerAr,
      answerEn: faq.answerEn,
      answerEs: faq.answerEs,
      answerFr: faq.answerFr,
      category: faq.category,
      sortOrder: faq.sortOrder,
      isActive: faq.isActive
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      questionAr: '',
      questionEn: '',
      questionEs: '',
      questionFr: '',
      answerAr: '',
      answerEn: '',
      answerEs: '',
      answerFr: '',
      category: 'general',
      sortOrder: 0,
      isActive: true
    })
    setEditingFAQ(null)
    setShowAddForm(false)
  }

  const filteredFAQs = faqs.filter(faq =>
    faq.questionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.questionEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-6">
        <PageStatusToggle pageKey="faq" pageName="الأسئلة الشائعة" />
      </div>
      
      <PageSEOManager pageKey="faq" pageName="الأسئلة الشائعة" />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-8 h-8" />
              إدارة الأسئلة الشائعة
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتحرير الأسئلة الشائعة
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'إلغاء' : 'إضافة سؤال جديد'}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث عن سؤال..."
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
            {editingFAQ ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">السؤال (عربي)</label>
                <Input
                  value={formData.questionAr}
                  onChange={(e) => setFormData({ ...formData, questionAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question (English)</label>
                <Input
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pregunta (Español)</label>
                <Input
                  value={formData.questionEs}
                  onChange={(e) => setFormData({ ...formData, questionEs: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question (Français)</label>
                <Input
                  value={formData.questionFr}
                  onChange={(e) => setFormData({ ...formData, questionFr: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الإجابة (عربي)</label>
                <textarea
                  value={formData.answerAr}
                  onChange={(e) => setFormData({ ...formData, answerAr: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Answer (English)</label>
                <textarea
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Respuesta (Español)</label>
                <textarea
                  value={formData.answerEs}
                  onChange={(e) => setFormData({ ...formData, answerEs: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Réponse (Français)</label>
                <textarea
                  value={formData.answerFr}
                  onChange={(e) => setFormData({ ...formData, answerFr: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
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
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.questionAr}
                </h3>
                <p className="text-gray-600 mb-2">{faq.answerAr}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {faq.category}
                  </span>
                  <span className={`px-2 py-1 rounded ${faq.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {faq.isActive ? 'فعّال' : 'غير فعّال'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(faq)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(faq.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لا توجد أسئلة شائعة
        </div>
      )}
    </div>
  )
}
