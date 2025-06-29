// EXIF verilerini oku ve göster
export function readExifData(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      EXIF.getData(img, function () {
        const exifData = EXIF.getAllTags(this);
        callback(exifData);
      });
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

// EXIF verilerini yazıya çevir
export function formatExifData(data) {
  if (!data || Object.keys(data).length === 0) {
    return 'Bu dosyada EXIF verisi bulunamadı.';
  }

  let output = '';
  for (const key in data) {
    output += `${key}: ${data[key]}\n`;
  }
  return output;
}
