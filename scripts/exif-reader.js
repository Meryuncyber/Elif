// EXIF verilerini oku ve göster
function readExifData(file, callback) {
  var reader = new FileReader();

  reader.onload = function (event) {
    var img = new Image();
    img.onload = function () {
      EXIF.getData(img, function () {
        var exifData = EXIF.getAllTags(this);
        callback(exifData);
      });
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

// EXIF verilerini yazıya çevir
function formatExifData(data) {
  if (!data || Object.keys(data).length === 0) {
    return 'Bu dosyada EXIF verisi bulunamadı.';
  }

  var output = '';
  for (var key in data) {
    output += key + ': ' + data[key] + '\n';
  }
  return output;
}

// Global olarak kullanılabilir hale getir
window.readExifData = readExifData;
window.formatExifData = formatExifData;
