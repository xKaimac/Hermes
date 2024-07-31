export function errorMiddleware(err, _req, res, _next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
}
//# sourceMappingURL=error.middleware.js.map