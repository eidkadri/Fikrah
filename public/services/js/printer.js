document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');
    const setAllPropertiesButton = document.getElementById('set-all-properties');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const rangeSelect = document.getElementById('range-select');
    const rangeInputsContainer = document.querySelector('.range-inputs');
    const saveButton = document.getElementById('save');
    const addToCartBtn = document.getElementById('add-to-cart');
    const loadingIndicator = document.getElementById('loading-indicator');
    const messageBox = document.getElementById('message-box');
    const notesContainer = document.getElementById('notes-container'); // حاوية الملاحظات
    const notesInput = document.getElementById('notes'); 
    let currentFileElement = null;
    let selectedFiles = [];
    let formData = new FormData();

    let isLoggedIn = false;

    // التحقق من تسجيل الدخول
    fetch('/auth/status')
        .then(response => response.json())
        .then(data => {
            isLoggedIn = data.isLoggedIn;
        })
        .catch(error => console.error('Error:', error));

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
        if (!isLoggedIn) {
            alert('يرجى تسجيل الدخول أولاً.');
            return;
        }

        const newFiles = Array.from(fileInput.files);
        selectedFiles = selectedFiles.concat(newFiles);

        fileList.innerHTML = '';
        selectedFiles.forEach(file => {
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

    // معالجة حفظ الخصائص
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const properties = getPopupProperties();

        if (currentFileElement) {
            const filePropertiesElement = currentFileElement.querySelector('.file-properties');
            filePropertiesElement.textContent = 'تم حفظ الخصائص';
            currentFileElement.dataset.properties = JSON.stringify(properties);
        } else {
            document.querySelectorAll('.file-item').forEach(fileItem => {
                const filePropertiesElement = fileItem.querySelector('.file-properties');
                filePropertiesElement.textContent = 'تم حفظ الخصائص';
                fileItem.dataset.properties = JSON.stringify(properties);
            });
        }

        popup.style.display = 'none';
        checkFilesAndProperties();
    });

    // إرسال البيانات عند الضغط على زر "Add to Cart"
    addToCartBtn.addEventListener('click', async () => {
        loadingIndicator.style.display = 'block';
        messageBox.textContent = '';

        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        const properties = Array.from(document.querySelectorAll('.file-item')).map(item => JSON.parse(item.dataset.properties));
        formData.append('properties', JSON.stringify(properties));
        formData.append('notes', notesInput.value); // إضافة الملاحظات إلى البيانات المرسلة

        try {
            const response = await fetch('/printers/service-printer/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                messageBox.textContent = 'تم إضافة الطباعة إلى السلة بنجاح!';
                messageBox.style.color = 'green';
               //* window.location.href = '/cart.html'; // إعادة التوجيه إلى صفحة المشتريات
            } else {
                const error = await response.json();
                messageBox.textContent = `فشل في إضافة الطباعة إلى السلة: ${error.message}`;
                messageBox.style.color = 'red';
            }
        } catch (error) {
            messageBox.textContent = `خطأ في الاتصال بالخادم: ${error.message}`;
            messageBox.style.color = 'red';
        } finally {
            loadingIndicator.style.display = 'none';
        }
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
        document.querySelector('input[name="slides"]').value = properties.slides || '';
        document.querySelector('select[name="paper-type"]').value = properties.paperType;
        document.querySelector('input[name="copies"]').value = properties.copies;
        rangeSelect.value = properties.rangeOption === 'custom' ? 'custom' : 'all';
        if (properties.rangeOption === 'custom') {
            const from = properties.rangeFrom;
            const to = properties.rangeTo;
            document.querySelector('input[name="range-from"]').value = from;
            document.querySelector('input[name="range-to"]').value = to;
            rangeInputsContainer.style.display = 'flex';
        } else {
            rangeInputsContainer.style.display = 'none';
        }

        // تحقق من الخدمات الإضافية المحددة
        document.querySelectorAll('input[name="services"]').forEach(service => {
            service.checked = properties.services && properties.services.includes(service.value);
        });
    }

    function getPopupProperties() {
        const colorMode = document.querySelector('input[name="color-mode"]:checked').value;
        const size = document.querySelector('select[name="size"]').value;
        const face = document.querySelector('input[name="face"]:checked').value;
        const slides = document.querySelector('input[name="slides"]').value;
        const paperType = document.querySelector('select[name="paper-type"]').value;
        const copies = document.querySelector('input[name="copies"]').value;
        const rangeOption = rangeSelect.value;
        let rangeFrom = null;
        let rangeTo = null;

        if (rangeOption === 'custom') {
            rangeFrom = rangeInputsContainer.querySelector('input[name="range-from"]').value;
            rangeTo = rangeInputsContainer.querySelector('input[name="range-to"]').value;

            if (!rangeFrom || !rangeTo || parseInt(rangeFrom) <= 0 || parseInt(rangeTo) <= 0 || parseInt(rangeFrom) > parseInt(rangeTo)) {
                alert("يرجى إدخال قيم صحيحة في الحقول 'من' و 'إلى' (من يجب أن يكون أصغر من أو يساوي إلى).");
                throw new Error("Invalid range input.");
            }
        }

        const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(service => service.value);

        // التحقق من إدخال القيم المطلوبة
        if (!slides || !copies) {
            alert("يرجى إدخال عدد السلايد وعدد النسخ.");
            throw new Error("Required fields are missing.");
        }

        return { colorMode, size, face, slides, paperType, copies, rangeOption, rangeFrom, rangeTo, services };
    }

    function resetPopupFields() {
        document.querySelectorAll('input[name="color-mode"]').forEach(el => el.checked = false);
        document.querySelector('select[name="size"]').selectedIndex = 0;
        document.querySelectorAll('input[name="face"]').forEach(el => el.checked = false);
        document.querySelector('input[name="slides"]').value = '';
        document.querySelector('select[name="paper-type"]').selectedIndex = 0;
        document.querySelector('input[name="copies"]').value = '';
        rangeSelect.selectedIndex = 0;
        rangeInputsContainer.style.display = 'none';
        document.querySelectorAll('input[name="services"]').forEach(service => service.checked = false);
    }

    // عرض حقول تحديد النطاق عند اختيار "تحديد المجال"
    rangeSelect.addEventListener('change', () => {
        rangeInputsContainer.style.display = rangeSelect.value === 'custom' ? 'flex' : 'none';
    });

    function toggleSetAllPropertiesButton() {
        const fileItems = fileList.querySelectorAll('.file-item');
        setAllPropertiesButton.style.display = fileItems.length > 1 ? 'block' : 'none';
        const allPropertiesSet = fileItems.length > 0 && Array.from(fileList.querySelectorAll('.file-properties'))
            .every(element => element.textContent === 'تم حفظ الخصائص');
        addToCartBtn.style.display = allPropertiesSet ? 'block' : 'none';
        notesContainer.style.display = allPropertiesSet ? 'block' : 'none';
    }

    function checkFilesAndProperties() {
        const allPropertiesSet = Array.from(fileList.querySelectorAll('.file-properties'))
            .every(element => element.textContent === 'تم حفظ الخصائص');
        addToCartBtn.style.display = allPropertiesSet ? 'block' : 'none';
        notesContainer.style.display = allPropertiesSet ? 'block' : 'none';
    }
    
});
