# Build stage
FROM golang:1.25.7-alpine AS builder

# Install build dependencies (gcc, musl-dev for CGO/SQLite)
RUN apk add --no-cache gcc musl-dev openssl

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Generate RSA keys if they don't exist
RUN if [ ! -f private-key.pem ]; then \
    openssl genrsa -out private-key.pem 4096 && \
    openssl rsa -in private-key.pem -pubout -out public-key.pem && \
    echo "RSA keys generated successfully"; \
    fi

# Build the application with CGO enabled (required for SQLite)
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o auth-session ./cmd/api

# Runtime stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache ca-certificates curl

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app

# Copy binary and keys from builder
COPY --from=builder /build/auth-session .
COPY --from=builder /build/private-key.pem .
COPY --from=builder /build/public-key.pem .

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["./auth-session"]
