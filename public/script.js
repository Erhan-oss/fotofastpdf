document.getElementById("fileInput").addEventListener("change", handleFiles);
document.getElementById("convertBtn").addEventListener("click", convertToPDF);

let selectedImages = [];

function handleFiles(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById("preview");
    preview.innerHTML = "";
    selectedImages = files;

    files.forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.className = "preview-img";
        preview.appendChild(img);
    });
}

async function convertToPDF() {
    if (selectedImages.length === 0) {
        alert("Fotoğraf seç kanki.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];

        const img = await loadImage(file);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const ratio = img.height / img.width;
        const pageHeight = pageWidth * ratio;

        if (i !== 0) pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
    }

    // iOS dahil tüm cihazlarda çalışacak indirme yöntemi
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "foto.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadImage(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}
