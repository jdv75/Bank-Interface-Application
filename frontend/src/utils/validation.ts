export interface FieldErrors {
    accountId?: string;
    password?: string;
    confirmPassword?: string;
    fName?: string;
    lName?: string;
    email?: string;
    phone?: string;
    form?: string;
}

export function validateAccountId(accountId: string): string | null {
    const id = accountId.trim();
    if (!id) return "Username cannot be empty.";
    if (id.length < 4 || id.length > 20)
        return "Username must be between 4 and 20 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(id))
        return "Username may only contain letters, numbers, and underscores.";
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) return "Password cannot be empty.";
    if (password.length < 8)
        return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password))
        return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(password))
        return "Password must contain a lowercase letter.";
    if (!/\d/.test(password))
        return "Password must contain a number.";
    if (!/[^A-Za-z0-9]/.test(password))
        return "Password must contain a special character.";
    return null;
}

export function validateLogin(accountId: string, password: string): FieldErrors | null {
    const errors: FieldErrors = {};
    const idErr = validateAccountId(accountId);
    if (idErr) errors.accountId = idErr;
    const pwErr = validatePassword(password);
    if (pwErr) errors.password = pwErr;
    return Object.keys(errors).length ? errors : null;
}

export function validateRegister(
    accountId: string,
    password: string,
    confirmPassword: string,
    fName: string = "",
    lName: string = "",
    email: string = "",
    phone: string = ""
): FieldErrors | null {
    const errors: FieldErrors = {};
    const idErr = validateAccountId(accountId);
    if (idErr) errors.accountId = idErr;

    const pwErr = validatePassword(password);
    if (pwErr) errors.password = pwErr;
    else if (password !== confirmPassword)
        errors.confirmPassword = "Passwords do not match.";

    if (!fName.trim()) errors.fName = "First name is required.";
    if (!lName.trim()) errors.lName = "Last name is required.";

    if (!email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
    }

    if (phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(phone.trim())) {
        errors.phone = "Please enter a valid phone number.";
    }

    return Object.keys(errors).length ? errors : null;
}

export const passwordRules: { label: string; test: (v: string) => boolean }[] = [
    { label: "At least 8 characters",      test: (v) => v.length >= 8 },
    { label: "One uppercase letter",        test: (v) => /[A-Z]/.test(v) },
    { label: "One lowercase letter",        test: (v) => /[a-z]/.test(v) },
    { label: "One number",                  test: (v) => /\d/.test(v) },
    { label: "One special character",       test: (v) => /[^A-Za-z0-9]/.test(v) },
];