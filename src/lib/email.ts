import { Resend } from 'resend'

// إنشاء Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// معلومات المرسل
const FROM_EMAIL = process.env.SMTP_FROM || 'noreply@lumerramarble.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@lumerramarble.com'
const COMPANY_NAME = 'Lumerra Marble | لوميرا ماربل'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

/**
 * إرسال إيميل عام
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || stripHtml(html),
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    console.log('Email sent successfully:', data)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * إرسال إشعار للإدارة بطلب سعر جديد
 */
export async function sendNewQuoteNotificationToAdmin(quoteData: any): Promise<boolean> {
  const subject = `🔔 طلب عرض سعر جديد من ${quoteData.fullName}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f59000 0%, #e88100 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .info-section {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: bold;
          color: #2c3e50;
          width: 150px;
          flex-shrink: 0;
        }
        .info-value {
          color: #555;
          flex-grow: 1;
        }
        .button {
          display: inline-block;
          background: #f59000;
          color: white !important;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #2c3e50;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 طلب عرض سعر جديد</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">تم استلام طلب جديد من العميل</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2c3e50; margin-top: 0;">معلومات العميل</h2>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">الاسم الكامل:</div>
              <div class="info-value">${quoteData.fullName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">البريد الإلكتروني:</div>
              <div class="info-value">${quoteData.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">رقم الهاتف:</div>
              <div class="info-value">${quoteData.phone}</div>
            </div>
            <div class="info-row">
              <div class="info-label">الشركة:</div>
              <div class="info-value">${quoteData.company || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">الدولة:</div>
              <div class="info-value">${quoteData.country}</div>
            </div>
            <div class="info-row">
              <div class="info-label">المدينة:</div>
              <div class="info-value">${quoteData.city || 'غير محدد'}</div>
            </div>
          </div>

          <h2 style="color: #2c3e50;">تفاصيل المشروع</h2>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">نوع المشروع:</div>
              <div class="info-value">${quoteData.projectType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">اسم المشروع:</div>
              <div class="info-value">${quoteData.projectName || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">التاريخ المتوقع:</div>
              <div class="info-value">${quoteData.expectedDate ? new Date(quoteData.expectedDate).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">الميزانية:</div>
              <div class="info-value">${quoteData.budget || 'غير محدد'}</div>
            </div>
          </div>

          <h2 style="color: #2c3e50;">المنتج المطلوب</h2>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">نوع المنتج:</div>
              <div class="info-value">${quoteData.productType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">الكمية:</div>
              <div class="info-value">${quoteData.quantity || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">السماكة:</div>
              <div class="info-value">${quoteData.thickness || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">نوع التشطيب:</div>
              <div class="info-value">${quoteData.finish || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">الأبعاد:</div>
              <div class="info-value">${quoteData.dimensions || 'غير محدد'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">اللون:</div>
              <div class="info-value">${quoteData.color || 'غير محدد'}</div>
            </div>
          </div>

          ${quoteData.message ? `
            <h2 style="color: #2c3e50;">رسالة إضافية</h2>
            <div class="info-section">
              <p style="margin: 0; line-height: 1.6;">${quoteData.message}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes" class="button">
              عرض الطلب في لوحة التحكم
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            تم إرسال هذا الإشعار تلقائياً من نظام لوميرا ماربل
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} Lumerra Marble | لوميرا ماربل</p>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">مصر - القاهرة - المنطقة الصناعية شق الثعبان</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  })
}

/**
 * إرسال تأكيد للعميل باستلام الطلب
 */
export async function sendQuoteConfirmationToCustomer(quoteData: any): Promise<boolean> {
  const subject = `تأكيد استلام طلب عرض السعر - Lumerra Marble`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f59000 0%, #e88100 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .checkmark {
          font-size: 60px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        .highlight-box {
          background: #f8f9fa;
          border-left: 4px solid #f59000;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .contact-info {
          background: #2c3e50;
          color: white;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .contact-info a {
          color: #f59000;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          background: #2c3e50;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="checkmark">✓</div>
          <h1>تم استلام طلبك بنجاح!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">شكراً لاختيارك لوميرا ماربل</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2c3e50;">عزيزي/عزيزتي ${quoteData.fullName}</h2>
          
          <p style="line-height: 1.8; color: #555; font-size: 16px;">
            نشكرك على تواصلك معنا! تم استلام طلب عرض السعر الخاص بك بنجاح.
          </p>

          <div class="highlight-box">
            <p style="margin: 0; line-height: 1.8; color: #2c3e50; font-size: 15px;">
              <strong>📋 ملخص طلبك:</strong><br>
              نوع المنتج: ${quoteData.productType}<br>
              نوع المشروع: ${quoteData.projectType}<br>
              ${quoteData.quantity ? `الكمية: ${quoteData.quantity}<br>` : ''}
              حالة الطلب: <span style="color: #f59000; font-weight: bold;">قيد المراجعة</span>
            </p>
          </div>

          <h3 style="color: #2c3e50;">ماذا يحدث الآن؟</h3>
          <ol style="line-height: 2; color: #555;">
            <li>سيقوم فريقنا بمراجعة طلبك بعناية</li>
            <li>سنتواصل معك خلال 24-48 ساعة</li>
            <li>سنرسل لك عرض السعر التفصيلي</li>
            <li>نسعد بالإجابة على أي استفسارات لديك</li>
          </ol>

          <div class="contact-info">
            <h3 style="margin-top: 0; color: white;">📞 تواصل معنا</h3>
            <p style="margin: 10px 0; line-height: 1.8;">
              📧 البريد الإلكتروني: <a href="mailto:info@lumerramarble.com">info@lumerramarble.com</a><br>
              📱 واتساب: <a href="https://wa.me/201113121444">+20 111 312 1444</a><br>
              🌐 الموقع: <a href="https://lumerramarble.com">lumerramarble.com</a>
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px; line-height: 1.6;">
            <strong>ملاحظة:</strong> هذا إيميل تلقائي للتأكيد فقط. سيتواصل معك فريقنا قريباً بعرض السعر التفصيلي.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">Lumerra Marble | لوميرا ماربل</p>
          <p style="margin: 10px 0; opacity: 0.9;">تصدير الرخام والجرانيت الفاخر من مصر</p>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">مصر - القاهرة - المنطقة الصناعية شق الثعبان</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: quoteData.email,
    subject,
    html,
  })
}

/**
 * إرسال إشعار برسالة اتصال جديدة
 */
export async function sendContactNotification(contactData: any): Promise<boolean> {
  const subject = `📩 رسالة جديدة من ${contactData.name}`
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #f59000; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📩 رسالة جديدة</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <p><strong>الاسم:</strong> ${contactData.name}</p>
            <p><strong>البريد:</strong> ${contactData.email}</p>
            <p><strong>الهاتف:</strong> ${contactData.phone || 'غير محدد'}</p>
            <p><strong>الرسالة:</strong></p>
            <p>${contactData.message}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  })
}

/**
 * إزالة HTML tags من النص
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export { ADMIN_EMAIL, FROM_EMAIL, COMPANY_NAME }
