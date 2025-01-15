document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const verificationPopup = document.getElementById('verificationPopup');
    const closeBtn = document.getElementsByClassName('close')[0];
    const verifyForm = document.getElementById('verifyForm');
    let phone; // تخزين رقم الهاتف مؤقتًا للتحقق لاحقًا

    verificationPopup.style.display = 'none'; // تأكيد إخفاء النافذة عند التحميل

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const password = document.getElementById('password').value;
        phone = document.getElementById('phone').value; // تخزين رقم الهاتف
        const chatId = document.getElementById('chatId').value;
    
        if (!password || !phone || !chatId) {
            alert('يرجى ملء جميع الحقول.');
            return;
        }
    
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password, phone, chatId })
            });
    
            const data = await response.json();
            if (data.message === 'User registered. Verification code sent to Telegram.') {
                verificationPopup.style.display = 'flex'; // إظهار النافذة فقط بعد نجاح التسجيل
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    closeBtn.onclick = function () {
        verificationPopup.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == verificationPopup) {
            verificationPopup.style.display = 'none';
        }
    };

    verifyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const verificationCode = document.getElementById('verificationCode').value;

        try {
            const response = await fetch('/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, verificationCode }) // استخدام رقم الهاتف المخزن
            });

            const data = await response.json();
            if (data.message === 'User verified successfully.') {
                alert('تم التحقق بنجاح.');
                verificationPopup.style.display = 'none';
                // هنا يمكنك إعادة توجيه المستخدم أو إعلامه بإتمام التسجيل
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
