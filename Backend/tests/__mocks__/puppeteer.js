// Mock puppeteer for Jest tests — avoids ESM parse errors from real puppeteer
module.exports = {
    launch: jest.fn().mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
            setJavaScriptEnabled: jest.fn().mockResolvedValue(undefined),
            setRequestInterception: jest.fn().mockResolvedValue(undefined),
            on: jest.fn(),
            setContent: jest.fn().mockResolvedValue(undefined),
            pdf: jest.fn().mockResolvedValue(Buffer.from('mock-pdf'))
        }),
        close: jest.fn().mockResolvedValue(undefined)
    })
}
