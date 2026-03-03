import axios from 'axios'
import { createI18n } from 'vue-i18n'

const SUPPORTED_LOCALES = ['ar', 'en']

const normalizeLocale = (locale) => {
  if (SUPPORTED_LOCALES.includes(locale)) {
    return locale
  }

  return 'ar'
}

const defaultMessages = {
  ar: {
    Login: 'تسجيل الدخول',
    LoginIn: 'تسجيل الدخول',
    'Back to admin': 'العودة إلى لوحة التحكم',
    'It looks like you found a glitch in the matrix...': 'يبدو أنك وجدت خللًا في النظام...',
    'Page Not Found': 'الصفحة غير موجودة',
    ResetPass: 'إعادة تعيين كلمة المرور',
    'Table langs': 'جدول الترجمات',
    Profile: 'الملف الشخصي',
    profile: 'الملف الشخصي',
    Users: 'المستخدمون',
    users: 'المستخدمون',
    Roles: 'الأدوار',
    roles: 'الأدوار',
    Pages: 'الصفحات',
    pages: 'الصفحات',
    Permissions: 'الصلاحيات',
    permissions: 'الصلاحيات',
    Admin: 'لوحة التحكم',
    admin: 'لوحة التحكم',
    'app-fonts': 'الخطوط',
    appFonts: 'خطوط التطبيق',
    appFont: 'خط التطبيق',
    GeneralSettings: 'الإعدادات العامة',
    'general-settings': 'الإعدادات العامة',
    translates: 'الترجمات',
    add: 'إضافة',
    arabic: 'العربية',
    back: 'رجوع',
    'back profile': 'الرجوع للملف الشخصي',
    'change password': 'تغيير كلمة المرور',
    create: 'إنشاء',
    'date of birth': 'تاريخ الميلاد',
    download: 'تنزيل',
    english: 'الإنجليزية',
    facebook: 'فيسبوك',
    'father name': 'اسم الأب',
    font: 'الخط',
    font_size: 'حجم الخط',
    gender: 'الجنس',
    icon: 'أيقونة',
    key: 'المفتاح',
    language: 'اللغة',
    mobile: 'الجوال',
    name: 'الاسم',
    next: 'التالي',
    notifications: 'الإشعارات',
    email: 'البريد الإلكتروني',
    order: 'الترتيب',
    page: 'الصفحة',
    password: 'كلمة المرور',
    password_confirmation: 'تأكيد كلمة المرور',
    path: 'المسار',
    previous: 'السابق',
    'reset Password Form': 'نموذج إعادة تعيين كلمة المرور',
    role: 'الدور',
    save: 'حفظ',
    table: 'الجدول',
    update: 'تحديث',
    youtube: 'يوتيوب',
  },
  en: {
    Login: 'Login',
    LoginIn: 'Login',
    'Back to admin': 'Back to admin',
    'It looks like you found a glitch in the matrix...': 'It looks like you found a glitch in the matrix...',
    'Page Not Found': 'Page Not Found',
    ResetPass: 'Reset Password',
    'Table langs': 'Translations Table',
    Profile: 'Profile',
    profile: 'Profile',
    Users: 'Users',
    users: 'Users',
    Roles: 'Roles',
    roles: 'Roles',
    Pages: 'Pages',
    pages: 'Pages',
    Permissions: 'Permissions',
    permissions: 'Permissions',
    Admin: 'Admin',
    admin: 'Admin',
    'app-fonts': 'App Fonts',
    appFonts: 'App Fonts',
    appFont: 'App Font',
    GeneralSettings: 'General Settings',
    'general-settings': 'General Settings',
    translates: 'Translations',
    add: 'Add',
    arabic: 'Arabic',
    back: 'Back',
    'back profile': 'Back to profile',
    'change password': 'Change password',
    create: 'Create',
    'date of birth': 'Date of birth',
    download: 'Download',
    english: 'English',
    facebook: 'Facebook',
    'father name': 'Father name',
    font: 'Font',
    font_size: 'Font size',
    gender: 'Gender',
    icon: 'Icon',
    key: 'Key',
    language: 'Language',
    mobile: 'Mobile',
    name: 'Name',
    next: 'Next',
    notifications: 'Notifications',
    email: 'Email',
    order: 'Order',
    page: 'Page',
    password: 'Password',
    password_confirmation: 'Password confirmation',
    path: 'Path',
    previous: 'Previous',
    'reset Password Form': 'Reset Password Form',
    role: 'Role',
    save: 'Save',
    table: 'Table',
    update: 'Update',
    youtube: 'YouTube',
  },
}

const mergeMessages = (incomingMessages = {}) => {
  const mergedMessages = { ...defaultMessages }

  Object.keys(incomingMessages || {}).forEach((lang) => {
    if (!SUPPORTED_LOCALES.includes(lang)) {
      return
    }

    const defaultLocaleMessages = defaultMessages[lang] || {}
    const incomingLocaleMessages = incomingMessages[lang] || {}

    mergedMessages[lang] = {
      ...defaultLocaleMessages,
      ...incomingLocaleMessages,
    }
  })

  return mergedMessages
}

const parseMessages = () => {
  try {
    const rawMessages = localStorage.getItem('messages')
    if (!rawMessages || rawMessages === 'null' || rawMessages === 'undefined') {
      return defaultMessages
    }
    const parsedMessages = JSON.parse(rawMessages)
    return parsedMessages && typeof parsedMessages === 'object'
      ? mergeMessages(parsedMessages)
      : defaultMessages
  } catch (error) {
    return defaultMessages
  }
}

const locale = normalizeLocale(localStorage.getItem('lang') || 'ar')

localStorage.setItem('lang', locale)

const i18n = createI18n({
  locale,
  fallbackLocale: 'ar',
  messages: parseMessages(),
  missingWarn: false,
  fallbackWarn: false,
})

axios.get('/api/get-i18n').then((res) => {
  const latestMessages = mergeMessages(res.data || {})
  localStorage.setItem('messages', JSON.stringify(latestMessages))
  Object.keys(latestMessages).forEach((lang) => {
    i18n.global.setLocaleMessage(lang, latestMessages[lang])
  })
}).catch(() => {
})

export default i18n
