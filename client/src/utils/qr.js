import jsQR from 'jsqr';

/** Lê um QR Code de um arquivo de imagem (foto tirada pelo app de câmera do aparelho). */
export async function lerQrDeImagem(arquivo, maxLado = 1400) {
  let bitmap;
  try { bitmap = await createImageBitmap(arquivo); } catch { throw new Error('Não foi possível ler essa imagem. Tente tirar a foto novamente.'); }
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const lido = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
  if (!lido) throw new Error('Não encontramos um QR Code nessa foto. Aproxime mais, com boa luz, e tente de novo.');
  return lido.data;
}