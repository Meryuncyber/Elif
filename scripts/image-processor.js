// EXIF'siz görsel oluştur ve callback ile sonucu ver
function removeExif(file, callback) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = new Image();

    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Temiz görselin DataURL'si (JPEG formatında, kalite %92)
      var cleanedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      callback(cleanedDataUrl);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Global olarak erişilebilir yap
window.removeExif = removeExif;
