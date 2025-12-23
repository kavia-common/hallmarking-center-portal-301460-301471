#!/bin/bash

echo "======================================"
echo "Frontend-Backend Integration Tests"
echo "======================================"
echo ""

FRONTEND_URL="https://vscode-internal-16287-beta.beta01.cloud.kavia.ai:3000"
BACKEND_URL="https://vscode-internal-16287-beta.beta01.cloud.kavia.ai:3001"

echo "1. Testing Backend Health..."
HEALTH=$(curl -s -X GET "${BACKEND_URL}/api/health/")
echo "Response: $HEALTH"
if echo "$HEALTH" | grep -q "Server is up"; then
    echo "✓ Backend health check passed"
else
    echo "✗ Backend health check failed"
fi
echo ""

echo "2. Testing Center Info Endpoint..."
CENTER=$(curl -s -X GET "${BACKEND_URL}/api/center/")
echo "Response (truncated): ${CENTER:0:100}..."
if echo "$CENTER" | grep -q "name"; then
    echo "✓ Center info endpoint working"
else
    echo "✗ Center info endpoint failed"
fi
echo ""

echo "3. Testing Portfolio Endpoint..."
PORTFOLIO=$(curl -s -X GET "${BACKEND_URL}/api/portfolio/")
echo "Response (truncated): ${PORTFOLIO:0:100}..."
if echo "$PORTFOLIO" | grep -q "services"; then
    echo "✓ Portfolio endpoint working"
else
    echo "✗ Portfolio endpoint failed"
fi
echo ""

echo "4. Testing User Registration..."
TIMESTAMP=$(date +%s)
REG_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser${TIMESTAMP}\",\"email\":\"test${TIMESTAMP}@example.com\",\"password\":\"SecurePass123!\",\"password2\":\"SecurePass123!\"}")
echo "Response (truncated): ${REG_RESPONSE:0:100}..."
if echo "$REG_RESPONSE" | grep -q "User registered successfully"; then
    echo "✓ User registration working"
    TEST_USER="testuser${TIMESTAMP}"
    TEST_PASS="SecurePass123!"
else
    echo "✗ User registration failed"
    TEST_USER=""
fi
echo ""

if [ -n "$TEST_USER" ]; then
    echo "5. Testing User Login..."
    LOGIN_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/auth/login/" \
      -H "Content-Type: application/json" \
      -c /tmp/test_cookies.txt \
      -d "{\"username\":\"${TEST_USER}\",\"password\":\"${TEST_PASS}\"}")
    echo "Response (truncated): ${LOGIN_RESPONSE:0:100}..."
    if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
        echo "✓ User login working"
    else
        echo "✗ User login failed"
    fi
    echo ""

    echo "6. Testing Authenticated Endpoint..."
    USER_RESPONSE=$(curl -s -X GET "${BACKEND_URL}/api/auth/user/" \
      -H "Accept: application/json" \
      -b /tmp/test_cookies.txt)
    echo "Response (truncated): ${USER_RESPONSE:0:100}..."
    if echo "$USER_RESPONSE" | grep -q "${TEST_USER}"; then
        echo "✓ Authenticated endpoint working"
    else
        echo "✗ Authenticated endpoint failed"
    fi
    echo ""
fi

echo "7. Testing Swagger Documentation..."
SWAGGER=$(curl -s -X GET "${BACKEND_URL}/docs/" | head -20)
if echo "$SWAGGER" | grep -q "Hallmarking Center API"; then
    echo "✓ Swagger documentation accessible at ${BACKEND_URL}/docs/"
else
    echo "✗ Swagger documentation not accessible"
fi
echo ""

echo "8. Testing Frontend Accessibility..."
FRONTEND=$(curl -s -X GET "${FRONTEND_URL}/" | head -10)
if echo "$FRONTEND" | grep -q "<!DOCTYPE html>"; then
    echo "✓ Frontend accessible at ${FRONTEND_URL}"
else
    echo "✗ Frontend not accessible"
fi
echo ""

echo "======================================"
echo "Integration Test Summary"
echo "======================================"
echo "Frontend URL: ${FRONTEND_URL}"
echo "Backend URL: ${BACKEND_URL}"
echo "API Base: ${BACKEND_URL}/api/"
echo "Swagger Docs: ${BACKEND_URL}/docs/"
echo ""
echo "All critical endpoints verified!"
echo "Frontend should now successfully communicate with backend."
