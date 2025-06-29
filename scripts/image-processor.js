// EXIF'siz görsel oluştur ve callback ile ver
export function removeExif(file, callback) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Temiz görselin DataURL’si (JPEG formatında)
      const cleanedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      callback(cleanedDataUrl);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
