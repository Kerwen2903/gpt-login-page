export type Language = "ru" | "tk"

export interface Translations {
  // Login form
  loginTitle: string
  loginDescription: string
  username: string
  usernamePlaceholder: string
  password: string
  passwordPlaceholder: string
  captchaVerification: string
  captchaPlaceholder: string
  loadingCaptcha: string
  login: string
  loggingIn: string
  forgotPassword: string
  noAccount: string
  signUpHere: string

  // Error messages
  invalidCredentials: string
  loginFailed: string
  captchaLoadFailed: string
  captchaNotFound: string

  // Settings
  settings: string
  darkMode: string
  lightMode: string
  language: string

  // Chat
  newChat: string
  chatHistory: string
  noConversations: string
  rename: string
  delete: string
}

export const translations: Record<Language, Translations> = {
  ru: {
    loginTitle: "Войти в аккаунт GPT",
    loginDescription: "Введите свои данные для доступа к ИИ-помощнику",
    username: "Имя пользователя",
    usernamePlaceholder: "Введите имя пользователя",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    captchaVerification: "Проверка капчи",
    captchaPlaceholder: "Введите капчу выше",
    loadingCaptcha: "Загрузка капчи...",
    login: "Войти",
    loggingIn: "Вход в систему...",
    forgotPassword: "Забыли пароль?",
    noAccount: "Нет аккаунта?",
    signUpHere: "Зарегистрироваться",
    invalidCredentials: "Неверные данные или капча. Попробуйте снова.",
    loginFailed: "Ошибка входа",
    captchaLoadFailed: "Не удалось загрузить капчу",
    captchaNotFound: "ID капчи не найден в заголовках ответа",
    settings: "Настройки",
    darkMode: "Темная тема",
    lightMode: "Светлая тема",
    language: "Язык",
    newChat: "Новый чат",
    chatHistory: "История чатов",
    noConversations: "Нет разговоров",
    rename: "Переименовать",
    delete: "Удалить",
  },
  tk: {
    loginTitle: "GPT hasabyňyza giriň",
    loginDescription: "AI kömekçiňize girmek üçin maglumatlarynyz giriziň",
    username: "Ulanyjy ady",
    usernamePlaceholder: "Ulanyjy adyňyzy giriziň",
    password: "Parol",
    passwordPlaceholder: "Parolyňyzy giriziň",
    captchaVerification: "Kapça barlagy",
    captchaPlaceholder: "Ýokardaky kapçany giriziň",
    loadingCaptcha: "Kapça ýüklenýär...",
    login: "Gir",
    loggingIn: "Girýär...",
    forgotPassword: "Parolyňyzy ýatdan çykardyňyzmy?",
    noAccount: "Hasabyňyz ýokmy?",
    signUpHere: "Bu ýerde hasaba duruň",
    invalidCredentials: "Nädogry maglumatlar ýa-da kapça. Täzeden synanyşyň.",
    loginFailed: "Girmek şowsuz",
    captchaLoadFailed: "Kapça ýüklenip bilmedi",
    captchaNotFound: "Kapça ID jogap sözbaşylarynda tapylmady",
    settings: "Sazlamalar",
    darkMode: "Garaňky tema",
    lightMode: "Açyk tema",
    language: "Dil",
    newChat: "Täze söhbetdeşlik",
    chatHistory: "Söhbetdeşlik taryhy",
    noConversations: "Söhbetdeşlik ýok",
    rename: "Adyny üýtget",
    delete: "Poz",
  },
}

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.ru
}
