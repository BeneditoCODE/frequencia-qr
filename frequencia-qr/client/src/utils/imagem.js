/** Recorta a imagem em quadrado, redimensiona e devolve um data URL JPEG leve (cabe em ~30 KB). */
export async function prepararFoto(arquivo, lado = 256) {
  if (!arquivo.type.startsWith('image/')) throw new Error('Escolha um arquivo de imagem (JPG, PNG ou WebP).');
  if (arquivo.size > 10 * 1024 * 1024) throw new Error('A imagem deve ter até 10 MB.');
  let bitmap;
  try { bitmap = await createImageBitmap(arquivo); } catch { throw new Error('Não foi possível ler essa imagem. Tente JPG ou PNG.'); }
  const menor = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = lado;
  canvas.getContext('2d').drawImage(bitmap, (bitmap.width - menor) / 2, (bitmap.height - menor) / 2, menor, menor, 0, 0, lado, lado);
  return canvas.toDataURL('image/jpeg', 0.85);
}
