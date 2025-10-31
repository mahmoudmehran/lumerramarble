const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // بيانات المستخدم الافتراضي
    const email = 'admin@lumerramarble.com'
    const password = 'admin123456' // يجب تغييرها بعد أول تسجيل دخول
    const name = 'Admin'

    // التحقق إذا كان المستخدم موجود
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ المستخدم موجود بالفعل')
      console.log('📧 Email:', email)
      console.log('🔑 Password: admin123456')
      return
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        active: true
      }
    })

    console.log('✅ تم إنشاء مستخدم الأدمن بنجاح!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('\n⚠️  يرجى تغيير كلمة المرور بعد أول تسجيل دخول\n')

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
