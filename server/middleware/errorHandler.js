// Global middleware for errorHandling
export default function errorHandler(err, req, res, next) {
    const code =
        res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    // Log error for debugging (server-side only)
    console.error("ERROR:", err.message);
    console.error(err.stack);

    res.status(code).json({
        error: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production"
            ? { stack: err.stack }
            : {}),
    });
}
