async function setLanguage() {
  const userLang = navigator.language.slice(0, 2); // örn: "tr", "en"
  const response = await fetch('lang/lang.json');
  const translations = await response.json();
  const lang = translations[userLang] || translations["en"];

  document.title = lang.title;
  document.querySelector("header h1").innerText = lang.title;
  document.querySelector("header p").innerText = lang.description;
  document.querySelector("#drop-area p").innerText = lang.drag_text;
  document.querySelector("label.upload-btn").innerText = lang.upload_label;
  document.querySelector("#preview-area h2").innerText = lang.uploaded_image;
  document.querySelectorAll("#exif-section .exif-box h3")[0].innerText = lang.exif_before;
  document.querySelectorAll("#exif-section .exif-box h3")[1].innerText = lang.exif_after;
  document.querySelector("#exif-before").innerText = lang.exif_wait;
  document.querySelector("#exif-after").innerText = lang.exif_clean;
  document.querySelector("#clean-btn").innerText = lang.clean_btn;
  document.querySelector("#download-link").innerText = lang.download_btn;
  document.querySelector("footer p").innerText = lang.footer_note;
}

window.addEventListener("DOMContentLoaded", setLanguage);
