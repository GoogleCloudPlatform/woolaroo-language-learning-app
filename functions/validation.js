const VALID_PRIMARY_LANGUAGES = ['en', 'fr', 'es', 'ar', 'it'];
const VALID_TARGET_LANGUAGES = ['yug', 'mi', 'may', 'tep', 'yi', 'tzm', 'rap',
    'ppl', 'el-cal', 'scn', 'lou', 'zyg', 'vm', 'pot', 'kum', 'san', 'rom'];

exports.isTargetLanguage = function (code) {
    return VALID_TARGET_LANGUAGES.indexOf(code) >= 0;
};

exports.isPrimaryLanguage = function (code) {
    return VALID_PRIMARY_LANGUAGES.indexOf(code) >= 0;
};

exports.containsHTML = function (text) {
    return /<\/?[a-z][\s\S]*>/i.test(text);
};
