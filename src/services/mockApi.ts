// Simulate a request to a server

export function mockRequest<T>(data: T, ms=600): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(data)), ms);
    })
}

