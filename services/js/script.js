// إظهار/إخفاء قسم اختيار البوابة بناءً على المجمع
document.querySelectorAll('input[name="collection-point"]').forEach(input => {
    input.addEventListener('change', function () {
        const gateSize = document.getElementById('gate-size');
        if (this.value === '5') {
            gateSize.style.display = 'block';
        } else {
            gateSize.style.display = 'none';
        }
    });
});

// إضافة قسم جديد لتحميل الملف ديناميكيًا
// Add new file section dynamically
let fileCounter = 1;
document.getElementById('add-file').addEventListener('click', (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Increment file counter
    fileCounter++;
    const fileSection = document.getElementById('file-section');
    
    // Create a new file div
    const newFileDiv = document.createElement('div');
    newFileDiv.classList.add('service', 'file-container');
    newFileDiv.innerHTML = `
        <div class="service">
                    <h2>تحميل ملف PDF</h2>
                    <label for="pdf-upload" class="custom-file-upload">
                        اختر ملف PDF
                    </label>
                    <input id="pdf-upload" type="file" accept="application/pdf">
                </div>

                <!-- Paper Size -->
                <div class="service">
                    <h2>قياس الورقة</h2>
                    <div class="options">
                        <label><input type="radio" name="paper-size" value="A1"> A1</label>
                        <label><input type="radio" name="paper-size" value="A2"> A2</label>
                        <label><input type="radio" name="paper-size" value="A3"> A3</label>
                        <label><input type="radio" name="paper-size" value="A4"> A4</label>
                        <label><input type="radio" name="paper-size" value="A5"> A5</label>
                        <label><input type="radio" name="paper-size" value="A6"> A6</label>
                        <label><input type="radio" name="paper-size" value="A0"> A0</label>
                    </div>
                </div>

                <!-- Print Colors -->
                <div class="service">
                    <h2>ألوان الطباعة</h2>
                    <div class="options">
                        <label><input type="radio" name="print-color" value="black-and-white"> أبيض وأسود</label>
                        <label><input type="radio" name="print-color" value="color"> ملون</label>
                    </div>
                </div>
                
                <!-- Print on One or Both Sides -->
                <div class="service">
                    <h2>أوجه الطباعة</h2>
                    <div class="options">
                        <label><input type="radio" name="print-sides" value="one-side"> طباعة على وجه واحد</label>
                        <label><input type="radio" name="print-sides" value="two-sides"> طباعة على الوجهين</label>
                    </div>
                </div>
                
    `;
    fileSection.appendChild(newFileDiv);
});
