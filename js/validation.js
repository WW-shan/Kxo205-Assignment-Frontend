document.addEventListener("DOMContentLoaded", function () {
  // 为所有必填字段创建错误信息占位符，确保对齐
  const ensureErrorPlaceholder = (input) => {
    const formControl = input.parentElement;
    let errorDisplay = formControl.querySelector(".error-message");
    if (!errorDisplay) {
      errorDisplay = document.createElement("div");
      errorDisplay.className = "error-message";
      errorDisplay.innerHTML = "&nbsp;"; // 使用空格占位
      // Insert after the input field
      if (input.nextSibling) {
        input.parentNode.insertBefore(errorDisplay, input.nextSibling);
      } else {
        input.parentNode.appendChild(errorDisplay);
      }
    }
    return errorDisplay;
  };

  // --- Helper functions to show/hide errors ---
  const showError = (input, message) => {
    const errorDisplay = ensureErrorPlaceholder(input);
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorDisplay.textContent = message;
    errorDisplay.style.visibility = "visible";
  };

  const showSuccess = (input) => {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    const errorDisplay = ensureErrorPlaceholder(input);
    errorDisplay.innerHTML = "&nbsp;"; // 保持占位空间
    errorDisplay.style.visibility = "hidden";
  };

  // --- Universal Validation Logic ---
  const checkRequired = (input) => {
    if (input.required && input.value.trim() === "") {
      // 尝试获取关联的 label 文本
      let labelText = "此字段";
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        labelText = label.innerText;
      } else {
        // 如果前一个兄弟元素不是 label，尝试通过 for 属性查找
        const labelForInput = document.querySelector(
          `label[for="${input.id}"]`
        );
        if (labelForInput) {
          labelText = labelForInput.innerText;
        }
      }
      showError(input, `${labelText} 是必填项`);
      return false;
    }
    // 如果字段已填写，显示成功状态
    if (input.required && input.value.trim() !== "") {
      showSuccess(input);
    }
    return true;
  };

  const checkEmail = (input) => {
    if (!input.value.trim()) return true; // 空值由 checkRequired 处理
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      showError(input, "请输入有效的电子邮件地址");
      return false;
    }
    showSuccess(input);
    return true;
  };

  const checkMobile = (input) => {
    if (!input.value.trim()) return true; // 空值由 checkRequired 处理
    // 支持国际手机号格式：可选的+号，后跟国家码和手机号（8-15位数字）
    // 支持格式：+86 138 1234 5678 / 13812345678 / +1 234 567 8900 等
    const mobileRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{3,5}$/;
    const cleanNumber = input.value.trim().replace(/[\s\-\.\(\)]/g, "");

    if (
      !mobileRegex.test(input.value.trim()) ||
      cleanNumber.length < 8 ||
      cleanNumber.length > 15
    ) {
      showError(input, "请输入有效的手机号码（8-15位数字）");
      return false;
    }
    showSuccess(input);
    return true;
  };

  const checkPasswordStrength = (input) => {
    if (!input.value) return true; // 空值由 checkRequired 处理
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{6,12}$/;
    if (!passwordRegex.test(input.value)) {
      showError(input, "密码必须为6-12个字符，包含大小写字母、数字和特殊字符");
      return false;
    }
    showSuccess(input);
    return true;
  };

  const checkPasswordsMatch = (pass1, pass2) => {
    if (!pass2.value) return true; // 空值由 checkRequired 处理
    if (pass1.value !== pass2.value) {
      showError(pass2, "两次输入的密码不匹配");
      return false;
    }
    showSuccess(pass2);
    return true;
  };

  // 信用卡号验证（Luhn算法）
  const checkCreditCard = (input) => {
    if (!input.value.trim()) return true; // 空值由 checkRequired 处理

    // 移除空格和连字符
    const cardNumber = input.value.trim().replace(/[\s\-]/g, "");

    // 检查是否只包含数字
    if (!/^\d+$/.test(cardNumber)) {
      showError(input, "信用卡号只能包含数字");
      return false;
    }

    // 检查长度（13-19位）
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      showError(input, "信用卡号长度应为13-19位");
      return false;
    }

    // Luhn算法验证
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      showError(input, "请输入有效的信用卡号");
      return false;
    }

    showSuccess(input);
    return true;
  };

  // 有效期验证（MM/YY格式）
  const checkExpiration = (input) => {
    if (!input.value.trim()) return true; // 空值由 checkRequired 处理

    const expPattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!expPattern.test(input.value.trim())) {
      showError(input, "请输入有效格式 MM/YY");
      return false;
    }

    showSuccess(input);
    return true;
  };

  // CVV验证（3-4位数字）
  const checkCVV = (input) => {
    if (!input.value.trim()) return true; // 空值由 checkRequired 处理

    const cvvPattern = /^\d{3,4}$/;
    if (!cvvPattern.test(input.value.trim())) {
      showError(input, "CVV应为3-4位数字");
      return false;
    }

    showSuccess(input);
    return true;
  };

  // --- Registration Form Logic ---
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    const userType = document.getElementById("userType");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const address = document.getElementById("address");
    const abn = document.getElementById("abn");

    // 初始化所有字段的错误占位符
    [
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      address,
      abn,
    ].forEach((field) => {
      if (field) ensureErrorPlaceholder(field);
    });

    // 实时验证 - 失去焦点时验证
    firstName.addEventListener("blur", () => checkRequired(firstName));
    lastName.addEventListener("blur", () => checkRequired(lastName));

    email.addEventListener("blur", () => {
      if (checkRequired(email)) {
        checkEmail(email);
      }
    });

    mobile.addEventListener("blur", () => {
      if (checkRequired(mobile)) {
        checkMobile(mobile);
      }
    });

    password.addEventListener("blur", () => {
      if (checkRequired(password)) {
        checkPasswordStrength(password);
      }
    });

    // 密码输入时实时检查
    password.addEventListener("input", () => {
      if (password.value.length > 0) {
        checkPasswordStrength(password);
      }
    });

    confirmPassword.addEventListener("blur", () => {
      if (checkRequired(confirmPassword)) {
        checkPasswordsMatch(password, confirmPassword);
      }
    });

    // 确认密码输入时实时检查
    confirmPassword.addEventListener("input", () => {
      if (confirmPassword.value.length > 0) {
        checkPasswordsMatch(password, confirmPassword);
      }
    });

    address.addEventListener("blur", () => checkRequired(address));

    abn.addEventListener("blur", () => {
      if (userType.value === "host") {
        checkRequired(abn);
      }
    });

    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // 提交时逐个验证所有字段
      let isValid = true;

      isValid = checkRequired(firstName) && isValid;
      isValid = checkRequired(lastName) && isValid;
      isValid = checkRequired(email) && checkEmail(email) && isValid;
      isValid = checkRequired(mobile) && checkMobile(mobile) && isValid;
      isValid =
        checkRequired(password) && checkPasswordStrength(password) && isValid;
      isValid =
        checkRequired(confirmPassword) &&
        checkPasswordsMatch(password, confirmPassword) &&
        isValid;
      isValid = checkRequired(address) && isValid;

      if (userType.value === "host") {
        isValid = checkRequired(abn) && isValid;
      }

      if (isValid) {
        // 注册成功 - 重置表单
        registrationForm.reset();
        document
          .querySelectorAll(".is-valid, .is-invalid")
          .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
        // 可以在这里添加成功消息或跳转到登录页面
        // window.location.href = 'login.html';
      }
      // 如果验证失败，错误信息已经通过 showError 函数显示在表单下方了
    });

    userType.addEventListener("change", function () {
      const abnSection = document.getElementById("abnSection");

      if (this.value === "host") {
        abnSection.classList.remove("d-none");
        abn.required = true;
      } else {
        abnSection.classList.add("d-none");
        abn.required = false;
      }
    });
  }

  // --- Login Form Logic ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    // 初始化错误占位符
    [loginEmail, loginPassword].forEach((field) => {
      if (field) ensureErrorPlaceholder(field);
    });

    // 实时验证
    loginEmail.addEventListener("blur", () => {
      if (checkRequired(loginEmail)) {
        checkEmail(loginEmail);
      }
    });

    loginPassword.addEventListener("blur", () => checkRequired(loginPassword));

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      isValid = checkRequired(loginEmail) && checkEmail(loginEmail) && isValid;
      isValid = checkRequired(loginPassword) && isValid;

      if (isValid) {
        alert("登录成功");
        loginForm.reset();
        document
          .querySelectorAll(".is-valid, .is-invalid")
          .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
      }
    });
  }

  // --- Search Form Logic ---
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    const destination = document.getElementById("destination");
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    const guests = document.getElementById("guests");

    // 初始化所有字段的错误占位符，确保对齐
    [destination, checkin, checkout, guests].forEach((field) => {
      if (field) ensureErrorPlaceholder(field);
    });

    const checkDates = (checkinInput, checkoutInput) => {
      if (!checkinInput.value || !checkoutInput.value) return true;
      const checkinDate = new Date(checkinInput.value);
      const checkoutDate = new Date(checkoutInput.value);

      if (checkoutDate <= checkinDate) {
        showError(checkoutInput, "退房日期必须晚于入住日期");
        return false;
      }
      showSuccess(checkoutInput);
      return true;
    };

    // 实时验证
    destination.addEventListener("blur", () => checkRequired(destination));
    checkin.addEventListener("blur", () => checkRequired(checkin));

    checkout.addEventListener("blur", () => {
      if (checkRequired(checkout)) {
        checkDates(checkin, checkout);
      }
    });

    checkout.addEventListener("change", () => {
      if (checkout.value) {
        checkDates(checkin, checkout);
      }
    });

    guests.addEventListener("blur", () => checkRequired(guests));

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      isValid = checkRequired(destination) && isValid;
      isValid = checkRequired(checkin) && isValid;
      isValid = checkRequired(checkout) && isValid;
      isValid = checkDates(checkin, checkout) && isValid;
      isValid = checkRequired(guests) && isValid;

      if (isValid) {
        // 搜索条件有效 - 在实际应用中，这里会获取并显示搜索结果
        // 可以提交表单或进行 AJAX 请求
      }
      // 如果验证失败，错误信息已经通过 showError 函数显示在表单下方了
    });
  }

  // --- Booking Form Logic ---
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const bookFirstName = document.getElementById("bookFirstName");
    const bookLastName = document.getElementById("bookLastName");
    const bookEmail = document.getElementById("bookEmail");
    const bookPhone = document.getElementById("bookPhone");
    const ccName = document.getElementById("cc-name");
    const ccNumber = document.getElementById("cc-number");
    const ccExpiration = document.getElementById("cc-expiration");
    const ccCvv = document.getElementById("cc-cvv");

    // 初始化错误占位符
    [
      bookFirstName,
      bookLastName,
      bookEmail,
      bookPhone,
      ccName,
      ccNumber,
      ccExpiration,
      ccCvv,
    ].forEach((field) => {
      if (field) ensureErrorPlaceholder(field);
    });

    // 实时验证
    bookFirstName.addEventListener("blur", () => checkRequired(bookFirstName));
    bookLastName.addEventListener("blur", () => checkRequired(bookLastName));

    bookEmail.addEventListener("blur", () => {
      if (checkRequired(bookEmail)) {
        checkEmail(bookEmail);
      }
    });

    bookPhone.addEventListener("blur", () => {
      if (checkRequired(bookPhone)) {
        checkMobile(bookPhone);
      }
    });

    // 支付信息实时验证
    ccName.addEventListener("blur", () => checkRequired(ccName));

    ccNumber.addEventListener("blur", () => {
      if (checkRequired(ccNumber)) {
        checkCreditCard(ccNumber);
      }
    });

    // 信用卡号输入时实时检查
    ccNumber.addEventListener("input", () => {
      if (ccNumber.value.length >= 13) {
        checkCreditCard(ccNumber);
      }
    });

    ccExpiration.addEventListener("blur", () => {
      if (checkRequired(ccExpiration)) {
        checkExpiration(ccExpiration);
      }
    });

    // 有效期输入时实时检查
    ccExpiration.addEventListener("input", () => {
      if (ccExpiration.value.length === 5) {
        checkExpiration(ccExpiration);
      }
    });

    ccCvv.addEventListener("blur", () => {
      if (checkRequired(ccCvv)) {
        checkCVV(ccCvv);
      }
    });

    // CVV输入时实时检查
    ccCvv.addEventListener("input", () => {
      if (ccCvv.value.length >= 3) {
        checkCVV(ccCvv);
      }
    });

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      isValid = checkRequired(bookFirstName) && isValid;
      isValid = checkRequired(bookLastName) && isValid;
      isValid = checkRequired(bookEmail) && checkEmail(bookEmail) && isValid;
      isValid = checkRequired(bookPhone) && checkMobile(bookPhone) && isValid;
      isValid = checkRequired(ccName) && isValid;
      isValid = checkRequired(ccNumber) && checkCreditCard(ccNumber) && isValid;
      isValid =
        checkRequired(ccExpiration) && checkExpiration(ccExpiration) && isValid;
      isValid = checkRequired(ccCvv) && checkCVV(ccCvv) && isValid;

      if (isValid) {
        // 预订成功 - 重置表单
        bookingForm.reset();
        document
          .querySelectorAll(".is-valid, .is-invalid")
          .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
        // 可以在这里跳转到预订确认页面
        // window.location.href = 'client.html';
      }
      // 如果验证失败，错误信息已经通过 showError 函数显示在表单下方了
    });
  }
});
