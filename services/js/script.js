const fileInput = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');
const setAllPropertiesButton = document.getElementById('set-all-properties');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const rangeSelect = document.getElementById('range-select');

const rangeInputsContainer = document.querySelector('.range-inputs');

const saveButton = document.getElementById('save');
let currentFileElement = null;

// إظهار النافذة المنبثقة للملف المحدد
fileList.addEventListener('click', (e) => {
    if (e.target.classList.contains('file-action-button')) {
        currentFileElement = e.target.closest('.file-item');
        openPopup(false);
    }
});

// إظهار النافذة المنبثقة لجميع الملفات
setAllPropertiesButton.addEventListener('click', () => {
    currentFileElement = null;
    openPopup(true);
});

// إغلاق النافذة المنبثقة
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});


// تحديث زر "تحديد خصائص لجميع الملفات"
fileInput.addEventListener('change', () => {
    const currentFiles = Array.from(fileInput.files);

    currentFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const fileName = document.createElement('span');
        fileName.classList.add('file-name');
        fileName.textContent = file.name;

        const fileProperties = document.createElement('span');
        fileProperties.classList.add('file-properties');
        fileProperties.textContent = 'خصائص غير محددة';

        const fileActions = document.createElement('div');
        fileActions.classList.add('file-actions');

        const propertiesButton = document.createElement('button');
        propertiesButton.classList.add('file-action-button');
        propertiesButton.textContent = 'خصائص';

        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.textContent = '✖';
        deleteIcon.addEventListener('click', () => {
            fileItem.remove();
            toggleSetAllPropertiesButton();
        });

        fileActions.appendChild(propertiesButton);
        fileActions.appendChild(deleteIcon);

        fileItem.appendChild(fileName);
        fileItem.appendChild(fileProperties);
        fileItem.appendChild(fileActions);

        fileList.appendChild(fileItem);
    });

    toggleSetAllPropertiesButton();
});

saveButton.addEventListener('click', (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط على "حفظ"

    try {
        const properties = getPopupProperties();

        if (currentFileElement) {
            const filePropertiesElement = currentFileElement.querySelector('.file-properties');
            filePropertiesElement.textContent = formatProperties(properties);
            currentFileElement.dataset.properties = JSON.stringify(properties); // حفظ الخصائص ضمن العنصر
        } else {
            document.querySelectorAll('.file-item').forEach(fileItem => {
                const filePropertiesElement = fileItem.querySelector('.file-properties');
                filePropertiesElement.textContent = formatProperties(properties);
                fileItem.dataset.properties = JSON.stringify(properties); // حفظ الخصائص ضمن العنصر
            });
        }

        popup.style.display = 'none';
    } catch (error) {
        alert(error.message); // عرض رسالة الخطأ إذا كان هناك إدخالات غير صحيحة
    }
});

function toggleSetAllPropertiesButton() {
    const fileItems = fileList.querySelectorAll('.file-item');
    setAllPropertiesButton.style.display = fileItems.length > 1 ? 'block' : 'none';
}

function openPopup(forAllFiles) {
    popup.style.display = 'flex';
    document.querySelector('.popup-content h2').textContent = 
        forAllFiles ? 'خصائص لجميع الملفات' : 'خصائص الملف المحدد';
    resetPopupFields();
}
rangeSelect.addEventListener('change', () => {
    if (rangeSelect.value === 'custom') {
        rangeInputsContainer.style.display = 'flex'; // عرض الحقول
        rangeInputsContainer.querySelector('input[name="range-from"]').required = true;
        rangeInputsContainer.querySelector('input[name="range-to"]').required = true;
    } else {
        rangeInputsContainer.style.display = 'none'; // إخفاء الحقول
        rangeInputsContainer.querySelector('input[name="range-from"]').required = false;
        rangeInputsContainer.querySelector('input[name="range-to"]').required = false;
        rangeInputsContainer.querySelector('input[name="range-from"]').value = '';
        rangeInputsContainer.querySelector('input[name="range-to"]').value = '';
    }
});


function getPopupProperties() {
    const colorMode = document.querySelector('input[name="color-mode"]:checked').value;
    const size = document.querySelector('select[name="size"]').value;
    const face = document.querySelector('input[name="face"]:checked').value;
    const slidesPerPage = document.querySelector('input[name="slides"]').value;
    const paperType = document.querySelector('select[name="paper-type"]').value;
    const copies = document.querySelector('input[name="copies"]').value;
    const rangeOption = rangeSelect.value;
    let range = 'الملف كامل';

    if (rangeOption === 'custom') {
        const from = rangeInputsContainer.querySelector('input[name="range-from"]').value;
        const to = rangeInputsContainer.querySelector('input[name="range-to"]').value;

        if (!from || !to || parseInt(from) <= 0 || parseInt(to) <= 0 || parseInt(from) > parseInt(to)) {
            alert("يرجى إدخال قيم صحيحة في الحقول 'من' و 'إلى' (من يجب أن يكون أصغر من أو يساوي إلى).");
            throw new Error("Invalid range input.");
        }
        range = `${from}-${to}`;
    }

    return { colorMode, size, face, slidesPerPage, paperType, copies, range };
}

function formatProperties(properties) {
    return `
        ألوان: ${properties.colorMode}, حجم: ${properties.size}, 
        الوجه: ${properties.face}, السلايد: ${properties.slidesPerPage},
        نوع الورق: ${properties.paperType}, النسخ: ${properties.copies},
        الصفحات: ${properties.range}
    `;
}

function resetPopupFields() {
    document.querySelector('input[name="color-mode"]:checked').checked = false;
    document.querySelector('select[name="size"]').selectedIndex = 0;
    document.querySelector('input[name="face"]:checked').checked = false;
    document.querySelector('input[name="slides"]').value = '';
    document.querySelector('select[name="paper-type"]').selectedIndex = 0;
    document.querySelector('input[name="copies"]').value = '';
    rangeSelect.selectedIndex = 0;
    rangeInputsContainer.style.display = 'none';
}
saveButton.addEventListener('click', (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط على "حفظ"

    const properties = getPopupProperties();

    if (currentFileElement) {
        const filePropertiesElement = currentFileElement.querySelector('.file-properties');
        filePropertiesElement.textContent = formatProperties(properties);
        currentFileElement.dataset.properties = JSON.stringify(properties); // حفظ الخصائص ضمن العنصر
    } else {
        document.querySelectorAll('.file-item').forEach(fileItem => {
            const filePropertiesElement = fileItem.querySelector('.file-properties');
            filePropertiesElement.textContent = formatProperties(properties);
            fileItem.dataset.properties = JSON.stringify(properties); // حفظ الخصائص ضمن العنصر
        });
    }

    popup.style.display = 'none';
});

function openPopup(forAllFiles) {
    popup.style.display = 'flex';
    document.querySelector('.popup-content h2').textContent =
        forAllFiles ? 'خصائص لجميع الملفات' : 'خصائص الملف المحدد';

    if (!forAllFiles && currentFileElement) {
        const savedProperties = currentFileElement.dataset.properties
            ? JSON.parse(currentFileElement.dataset.properties)
            : null;
        if (savedProperties) {
            populatePopupFields(savedProperties);
        }
    } else {
        resetPopupFields(); // إعادة ضبط الحقول عند تخصيص خصائص لجميع الملفات
    }
}

function populatePopupFields(properties) {
    document.querySelector(`input[name="color-mode"][value="${properties.colorMode}"]`).checked = true;
    document.querySelector('select[name="size"]').value = properties.size;
    document.querySelector(`input[name="face"][value="${properties.face}"]`).checked = true;
    document.querySelector('input[name="slides"]').value = properties.slidesPerPage;
    document.querySelector('select[name="paper-type"]').value = properties.paperType;
    document.querySelector('input[name="copies"]').value = properties.copies;
    rangeSelect.value = properties.rangeOption === 'custom' ? 'custom' : 'all';
    if (properties.rangeOption === 'custom') {
        const [from, to] = properties.range.split('-');
        document.querySelector('input[name="range-from"]').value = from;
        document.querySelector('input[name="range-to"]').value = to;
        rangeInputsContainer.style.display = 'flex';
    } else {
        rangeInputsContainer.style.display = 'none';
    }
}
//منبثقة العنوان
document.addEventListener('DOMContentLoaded', () => {
    const chooseAddressBtn = document.getElementById('choose-address');
    const addressPopup = document.getElementById('address-popup');
    const closeAddressPopupBtn = document.getElementById('close-address-popup');
    const compoundSelect = document.getElementById('compound-select');
    const gateOptions = document.getElementById('gate-options');

    const saveButton = document.getElementById('save'); // زر حفظ خصائص الطباعة

    // إظهار زر اختيار العنوان عند حفظ الخصائص
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        chooseAddressBtn.style.display = 'block';
      
    });

    // فتح المنبثقة الثانية
    chooseAddressBtn.addEventListener('click', () => {
        addressPopup.style.display = 'flex';
    });

    // إغلاق المنبثقة الثانية
    closeAddressPopupBtn.addEventListener('click', () => {
        addressPopup.style.display = 'none';
    });

    // عرض خيارات البوابة إذا اختير المجمع 5
    compoundSelect.addEventListener('change', () => {
        if (compoundSelect.value === '5') {
            gateOptions.style.display = 'block';
        } else {
            gateOptions.style.display = 'none';
        }
    });

    // معالجة الحفظ لمنبثقة العنوان
    document.getElementById('address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const compound = compoundSelect.value;
        const gate = compound === '5' ? document.getElementById('gate-select').value : 'N/A';
        const notes = document.getElementById('notes').value;

        console.log('العنوان تم حفظه:', { compound, gate, notes });
        alert('تم حفظ العنوان بنجاح!');
        addressPopup.style.display = 'none';
    });
});
// زر الحفظ
// زر الحفظ
document.addEventListener("DOMContentLoaded", function () {
    // ربط زر الحفظ
    const saveButton = document.getElementById("save-address");
    const popup = document.getElementById("address-popup");
    const statusMessage = document.getElementById("status-message");

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            // استرجاع القيم المدخلة
            const complex = document.getElementById("complex-select").value;
            const gate = document.querySelector('input[name="gate"]:checked')?.value || "بدون بوابة";
            const notes = document.getElementById("notes").value;

            // تحقق من إدخال العنوان أو الملاحظات
            if (!complex) {
                alert("يرجى اختيار المجمع!");
                return;
            }

            // طباعة القيم (للتأكد من عمل الزر)
            console.log(`العنوان: ${complex} - ${gate}`);
            console.log(`الملاحظات: ${notes}`);

            // تحديث الرسالة للتأكيد
            statusMessage.textContent = "تم حفظ العنوان والملاحظات بنجاح!";
            statusMessage.style.color = "green";
            statusMessage.style.marginTop = "10px";

            // إغلاق النافذة المنبثقة
            popup.style.display = "none";
        });
    } else {
        console.error("زر الحفظ غير موجود أو لم يتم تعريفه.");
    }
});



// زر الإغلاق
document.getElementById("close-address-popup").addEventListener("click", function () {
    const popup = document.getElementById("address-popup");
    popup.style.display = "none"; // إخفاء النافذة المنبثقة
});
