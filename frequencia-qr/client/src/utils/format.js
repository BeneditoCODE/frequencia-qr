const toDate = s => new Date(String(s).includes('T') ? s : `${String(s).replace(' ', 'T')}Z`);

export const fmtData = s => toDate(s).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ de /g, ' ').replace('.', '');
export const fmtHora = s => toDate(s).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
export const fmtHoje = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
export const pct = v => (v == null ? '—' : `${v}%`);
export const primeiroNome = n => (n || '').split(' ')[0];
export const iniciais = n => (n || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
export const saudacao = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };

const GRADIENTES = [['#225BE5', '#153D96'], ['#142D4D', '#225BE5'], ['#153D96', '#63758C'], ['#2F6BFF', '#142D4D'], ['#63758C', '#142D4D']];
export const gradienteDe = nome => {
  const [a, b] = GRADIENTES[[...(nome || '?')].reduce((s, c) => s + c.charCodeAt(0), 0) % GRADIENTES.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
};
