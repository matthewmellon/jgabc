function normalizeVerseLigatures(text) {
  if(!text) return text;
  if(typeof text.normalize == 'function') {
    text = text.normalize('NFC');
  }
  return text.replace(/([aAoO])([e\u00E9E\u00C9])/g, function(match, lead, vowel) {
    var accented = /[\u00E9\u00C9]/.test(vowel);
    switch(lead) {
      case 'a': return accented ? '\u01FD' : '\u00E6';
      case 'A': return accented ? '\u01FC' : '\u00C6';
      case 'o': return accented ? '\u0153\u0301' : '\u0153';
      case 'O': return accented ? '\u0152\u0301' : '\u0152';
    }
    return match;
  });
}

function check(input, expected) {
  var actual = normalizeVerseLigatures(input);
  if(actual !== expected) {
    throw new Error(JSON.stringify(input) + ' => ' + JSON.stringify(actual) + ' (expected ' + JSON.stringify(expected) + ')');
  }
}

check('ae oe AE OE Ae Oe', '\u00E6 \u0153 \u00C6 \u0152 \u00C6 \u0152');
check('a\u00E9 o\u00E9 A\u00C9 O\u00C9', '\u01FD \u0153\u0301 \u01FC \u0152\u0301');
check('Gl\u00F3ria praeclara', 'Gl\u00F3ria pr\u00E6clara');

console.log('ligature smoke test passed');


