// Minimal regression test for readings sentence parsing with guillemets.
const text = `In illo témpore :

Stabant iuxta crucem Iesu mater eius et soror matris eius, María Cléopae, et María Magdaléne.

Cum vidísset ergo Iesus matrem et discípulum stantem, quem diligébat, dicit matri :

«Múlier, ecce fílius tuus».

Deínde dicit discípulo :

«Ecce mater tua».

Et ex illa hora accépit eam discípulus in sua.

Post hoc sciens Iesus quia iam ómnia consummáta sunt, ut consummarétur Scriptúra, dicit :

«Sítio».

Vas pósitum erat acéto plenum ; spóngiam ergo plenam acéto hýssopo circumponéntes, obtulérunt ori eius. Cum ergo accepísset acétum, Iesus dixit :

«Consummátum est !».

Et inclináto cápite trádidit spíritum.

Iudaéi ergo, quóniam Parascéve erat, ut non remanérent in cruce córpora sábbato, erat enim magnus dies illíus sábbati, rogavérunt Pilátum, ut frangeréntur eórum crura, et tolleréntur. Venérunt ergo mílites et primi quidem fregérunt crura et altérius, qui crucifíxus est cum eo ; ad Iesum autem cum veníssent, ut vidérunt eum iam mórtuum, non fregérunt eius crura, sed unus mílitum láncea latus eius apéruit, et contínuo exívit sanguis et aqua.`;

const sentenceRegex = /((?:,(?![,\r\n])["'«»‹›“”‘’]?|[^\^`~+.?!;:,])+($|,(?=[,\r\n])|[+^`~.?!;:](?:\s*[:+^`])?["'«»‹›“”‘’]*)),?\s*/gi;

function splitSentences(input) {
  const result = [];
  let m;
  sentenceRegex.lastIndex = 0;
  while ((m = sentenceRegex.exec(input))) {
    result.push(m);
  }
  return result;
}

function extractPunctuation(raw) {
  const punctuation = raw || '';
  return (punctuation.match(/[+^`~.?!;:,]/) || [punctuation])[0] || '';
}

const lines = splitSentences(text);
if (!lines.length) throw new Error('No lines parsed');
for (let i = 0; i < lines.length; i++) {
  const raw = lines[i][2];
  const p = extractPunctuation(raw);
  // Ensure this path cannot throw for guillemet punctuation tails like !».
  if (typeof p !== 'string') throw new Error('Bad punctuation at line ' + i);
}

const hasQuotedExclamation = lines.some((m) => /!/.test(m[0]) && /[«»]/.test(m[0]));
if (!hasQuotedExclamation) throw new Error('Did not parse the quoted exclamation sentence');

console.log('readings guillemet regression test passed with', lines.length, 'segments');

