export interface FieldErrors {
    accountId?: string;
    pin?: string;
    confirmPin?: string;
    form?: string;
}

export function validateAccountId(accountId: string): string | null {
    const id = accountId.trim();
    if (!id) return "Account ID cannot be empty.";
    if (id.length < 4 || id.length > 20)
        return "Account ID must be between 4 and 20 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(id))
        return "Account ID may only contain letters, numbers, and underscores.";
    return null;
}

export function validatePin(pin: string): string | null {
    const p = pin.trim();
    if (!p) return "PIN cannot be empty.";
    if (!/^\d{6}$/.test(p)) return "PIN must be exactly 6 digits (0-9).";
    return null;
}

export function validateLogin(accountId: string, pin: string): FieldErrors | null {
    const errors: FieldErrors = {};
    const idErr = validateAccountId(accountId);
    if (idErr) errors.accountId = idErr;
    const pinErr = validatePin(pin);
    if (pinErr) errors.pin = pinErr;
    return Object.keys(errors).length ? errors : null;
}

export function validateRegister(
    accountId: string,
    pin: string,
    confirmPin: string,
): FieldErrors | null {
    const errors: FieldErrors = {};
    const idErr = validateAccountId(accountId);
    if (idErr) errors.accountId = idErr;
    const pinErr = validatePin(pin);
    if (pinErr) errors.pin = pinErr;
    else if (pin !== confirmPin) errors.confirmPin = "PINs do not match.";
    return Object.keys(errors).length ? errors : null;
}