'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Search, 
  Clock,
  User,
  Building,
  Phone,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  RefreshCw
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'
  readAt?: string
  createdAt: string
  updatedAt: string
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/messages')

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        console.error('Failed to load messages')
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        loadMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, status } : null)
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const markAsRead = async (message: ContactMessage) => {
    setSelectedMessage(message)
    if (message.status === 'NEW') {
      await updateMessageStatus(message.id, 'READ')
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: ContactMessage['status']) => {
    const badges = {
      NEW: { text: 'جديدة', color: 'bg-blue-100 text-blue-800', icon: Mail },
      READ: { text: 'مقروءة', color: 'bg-yellow-100 text-yellow-800', icon: MailOpen },
      REPLIED: { text: 'تم الرد', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED: { text: 'مغلقة', color: 'bg-gray-100 text-gray-800', icon: Archive }
    }
    const badge = badges[status]
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'NEW').length,
    read: messages.filter(m => m.status === 'READ').length,
    replied: messages.filter(m => m.status === 'REPLIED').length,
    closed: messages.filter(m => m.status === 'CLOSED').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الرسائل الواردة</h1>
              <p className="text-gray-600 mt-1">إدارة رسائل نموذج التواصل</p>
            </div>
            <Button onClick={loadMessages} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              تحديث
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الرسائل</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">جديدة</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مقروءة</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
                </div>
                <MailOpen className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">تم الرد</p>
                  <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-gray-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مغلقة</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
                </div>
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="البحث في الرسائل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="NEW">جديدة</option>
              <option value="READ">مقروءة</option>
              <option value="REPLIED">تم الرد</option>
              <option value="CLOSED">مغلقة</option>
            </select>
          </div>
        </Card>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-4">
                الرسائل ({filteredMessages.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد رسائل</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => markAsRead(message)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-50 border-blue-300'
                          : message.status === 'NEW'
                          ? 'bg-blue-25 border-blue-200 hover:bg-blue-50'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-sm">{message.name}</p>
                          </div>
                          {message.subject && (
                            <p className="text-xs text-gray-600 truncate mb-1">
                              {message.subject}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        {message.status === 'NEW' && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(message.createdAt)}
                        </span>
                        {getStatusBadge(message.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedMessage.subject || 'رسالة جديدة'}
                    </h2>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedMessage.status)}
                      <span className="text-sm text-gray-500">
                        {formatDate(selectedMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sender Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">الاسم</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">الهاتف</p>
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedMessage.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">الشركة</p>
                        <p className="font-medium">{selectedMessage.company}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold">الرسالة</h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {selectedMessage.status !== 'REPLIED' && (
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'REPLIED')}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تم الرد
                    </Button>
                  )}
                  
                  {selectedMessage.status !== 'CLOSED' && (
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'CLOSED')}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      إغلاق
                    </Button>
                  )}

                  <Button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    الرد عبر البريد
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12">
                <div className="text-center text-gray-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">اختر رسالة لعرض التفاصيل</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
