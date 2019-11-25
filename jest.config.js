module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/**.js'],
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 65,
            lines: 80,
            statements: 80,
        },
    },
};
