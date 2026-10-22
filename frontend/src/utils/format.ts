const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

export function formatCurrency(amount: number): string {
    return currency.format(amount);
}

export function formatSignedCurrency(amount: number): string {
    const sign = amount > 0 ? "+" : "";

    return `${sign}${currency.format(amount)}`;
}

export function formatDateTime(fecha: string): string {
    return new Date(fecha).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

export function maskAccount(last4: string): string {
    return `**** ${last4}`;
}

export function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

// Format date to LocalDateTime for spring model
export function toLocalDateTime(d: Date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}