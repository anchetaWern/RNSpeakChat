const locales = ["ar-EG", "de-DE", "en-US", "es-CL", "fr-FR", "hi", "it-IT", "ja", "ko", "pt-BR", "ru", "zh-CN"];
const short_locales = locales.map(item => item.split('-')[0]);

export default { 'long': locales, 'short': short_locales };