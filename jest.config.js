module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/**.js'],
    coverageThreshold: {
        global: {
            branches: 79,
            functions: 73,
            lines: 81,
            statements: 82,
        },
    },
};
