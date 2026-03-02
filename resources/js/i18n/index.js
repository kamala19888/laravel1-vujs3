import axios from 'axios'
import { createI18n } from 'vue-i18n'

const defaultMessages = {
  ar: {
    Login: 'تسجيل الدخول',
    LoginIn: 'تسجيل الدخول',
    Profile: 'الملف الشخصي',
    Users: 'المستخدمون',
    Roles: 'الأدوار',
    Pages: 'الصفحات',
    Permissions: 'الصلاحيات',
    Admin: 'لوحة التحكم',
    'general-settings': 'الإعدادات العامة',
    translates: 'الترجمات',
  },
  en: {},
  fr: {},
  tr: {},
}

const parseMessages = () => {
  try {
    const rawMessages = localStorage.getItem('messages')
    if (!rawMessages || rawMessages === 'null' || rawMessages === 'undefined') {
      return defaultMessages
    }
    const parsedMessages = JSON.parse(rawMessages)
    return parsedMessages && typeof parsedMessages === 'object'
      ? {
          ...defaultMessages,
          ...parsedMessages,
        }
      : defaultMessages
  } catch (error) {
    return defaultMessages
  }
}

const locale = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ar'

const i18n = createI18n({
    // something vue-i18n options here ...
    locale,
    fallbackLocale: 'ar',
    messages: parseMessages(),

  })

axios.get('/api/get-i18n').then((res) => {
  const latestMessages = {
    ...defaultMessages,
    ...(res.data || {}),
  }
  localStorage.setItem('messages', JSON.stringify(latestMessages))
  Object.keys(latestMessages).forEach((lang) => {
    i18n.global.setLocaleMessage(lang, latestMessages[lang])
  })
}).catch(() => {
})

export default i18n
