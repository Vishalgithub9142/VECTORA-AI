/**
 * Mock for pdf-parse used in Jest tests.
 * PDFParse is a class in v2. This mock returns dummy text without actually
 * parsing a PDF, so tests don't need a real valid PDF file.
 */

class PDFParse {
    constructor(options) {
        this.options = options
    }

    async getText() {
        return {
            text: 'Alice Developer\nEmail: alice@test.com\nSkills: React, TypeScript, Node.js\nExperience: 4 years at StartupXYZ\nEducation: B.Tech Computer Science'
        }
    }
}

module.exports = { PDFParse }
