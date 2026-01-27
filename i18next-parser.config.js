module.exports = {
    input: ['src/**/*.{ts,tsx}'],
    output: 'src/i18n/locales/$LOCALE.json',
    locales: ['en', 'hi', 'mr', 'te', 'kn', 'ta'],
    keySeparator: '.',
    namespaceSeparator: false,
    defaultValue: (locale, namespace, key) => {
        return key;
    },
    keepRemoved: false,
    sort: true,
    createOldCatalogs: false,
    lexers: {
        ts: ['JavascriptLexer'],
        tsx: ['JsxLexer']
    }
};
