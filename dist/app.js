
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('expense-form');
    const pharmacyInput = document.getElementById('pharmacy-number');
    const categorySelect = document.getElementById('category');
    const commentInput = document.getElementById('comment');
    const amountInput = document.getElementById('amount');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.loader-spinner');

    // Modal Elements
    const successModal = document.getElementById('success-modal');
    const successModalCloseBtn = document.getElementById('modal-close-btn');

    const errorModal = document.getElementById('error-modal');
    const errorModalText = document.getElementById('error-modal-text');
    const errorModalCloseBtn = document.getElementById('error-modal-close-btn');

    // Constants
    const WEBHOOK_URL = 'https://n8n.kharlakov.ru/webhook/c46762a3-a05a-4f1b-9542-55d45ec1e219';

    // --- Validation Logic ---

    // Toggle logic for Comment field based on Category
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        const commentLabel = document.querySelector('label[for="comment"]');
        const optionalSpan = commentLabel.querySelector('.optional-label');

        // Reset styles first
        commentInput.placeholder = "Дополнительная информация";
        commentInput.classList.remove('error');
        hideError(commentInput);

        if (category === 'Зарплата, аванс, отпускные') {
            // Require comment, ask for FIO
            commentInput.required = true;
            commentInput.placeholder = "Укажите ФИО сотрудника";
            if (optionalSpan) optionalSpan.style.display = 'none';
        } else if (category === 'Прочие расходы') {
            // Require comment
            commentInput.required = true;
            if (optionalSpan) optionalSpan.style.display = 'none';
        } else {
            // Optional
            commentInput.required = false;
            if (optionalSpan) optionalSpan.style.display = 'inline';
        }
    });

    // --- Form Submission ---

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Prepare Data
        const formData = {
            pharmacy_number: pharmacyInput.value,
            category: categorySelect.value,
            comment: commentInput.value,
            amount: parseFloat(amountInput.value)
        };

        // Loading State
        setLoading(true);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Success
                showSuccessModal();
                form.reset();
                // Reset category logic
                categorySelect.dispatchEvent(new Event('change'));
            } else {
                showErrorModal('Ошибка при отправке данных. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorModal('Не удалось соединиться с сервером. Проверьте интернет.');
        } finally {
            setLoading(false);
        }
    });

    // --- Helper Functions ---

    function validateForm() {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error');
            hideError(input);
        });

        // 1. Pharmacy Number
        if (!pharmacyInput.value.trim()) {
            showError(pharmacyInput, 'Введите номер аптеки');
            isValid = false;
        }

        // 2. Category
        if (!categorySelect.value) {
            showError(categorySelect, 'Выберите категорию');
            isValid = false;
        }

        // 3. Comment Validation (Custom Logic)
        const category = categorySelect.value;
        if ((category === 'Зарплата, аванс, отпускные' || category === 'Прочие расходы') && !commentInput.value.trim()) {
            const msg = category === 'Зарплата, аванс, отпускные' ? 'Укажите ФИО' : 'Обязательно добавьте комментарий';
            showError(commentInput, msg);
            isValid = false;
        }

        // 4. Amount Validation
        if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
            showError(amountInput, 'Введите корректную сумму');
            isValid = false;
        }

        return isValid;
    }

    function showError(inputElement, message) {
        inputElement.classList.add('error');
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    function hideError(inputElement) {
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            spinner.classList.add('visible');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.remove('visible');
        }
    }

    // Modal Logic
    function showSuccessModal() {
        successModal.classList.add('visible');
    }

    function showErrorModal(message) {
        errorModalText.textContent = message;
        errorModal.classList.add('visible');
    }

    successModalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('visible');
    });

    errorModalCloseBtn.addEventListener('click', () => {
        errorModal.classList.remove('visible');
    });
});
