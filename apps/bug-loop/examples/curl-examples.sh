#!/bin/bash

# Bug Loop API Examples
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000"

echo "=== Bug Loop API Examples ==="
echo ""

# Example 1: Simple bug report
echo "1. Submitting a simple bug report..."
curl -X POST "$BASE_URL/api/bugs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button not responding",
    "description": "The login button does not work when clicked",
    "customerEmail": "user@example.com",
    "severity": "high"
  }'
echo -e "\n"

# Example 2: Detailed bug report with steps
echo "2. Submitting a detailed bug report..."
curl -X POST "$BASE_URL/api/bugs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Search results not displaying correctly",
    "description": "When searching for products, the results page shows empty cards instead of product information",
    "stepsToReproduce": [
      "Navigate to homepage",
      "Enter search term in search bar",
      "Click search button",
      "Observe empty cards in results"
    ],
    "expectedBehavior": "Search results should display product cards with images, titles, and prices",
    "actualBehavior": "Empty white cards are displayed with no content",
    "environment": {
      "browser": "Firefox 120",
      "os": "Windows 11",
      "version": "3.1.0"
    },
    "customerEmail": "jane@company.com",
    "customerName": "Jane Doe",
    "severity": "medium"
  }'
echo -e "\n"

# Example 3: Critical bug
echo "3. Submitting a critical bug..."
curl -X POST "$BASE_URL/api/bugs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Payment processing fails for all transactions",
    "description": "All payment attempts are failing with a 500 error. Customers cannot complete purchases.",
    "stepsToReproduce": [
      "Add items to cart",
      "Proceed to checkout",
      "Enter payment information",
      "Click submit payment",
      "Error appears"
    ],
    "expectedBehavior": "Payment should process successfully",
    "actualBehavior": "500 Internal Server Error displayed",
    "customerEmail": "admin@store.com",
    "customerName": "Store Admin",
    "severity": "critical"
  }'
echo -e "\n"

# Example 4: UI bug with environment details
echo "4. Submitting a UI bug..."
curl -X POST "$BASE_URL/api/bugs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mobile menu overlaps content on small screens",
    "description": "The hamburger menu overlaps with page content on screens smaller than 375px",
    "expectedBehavior": "Menu should push content down or display in overlay without overlapping",
    "actualBehavior": "Menu items appear on top of main content making it unreadable",
    "environment": {
      "browser": "Safari Mobile",
      "os": "iOS 17.2",
      "version": "2.0.1",
      "screenSize": "360x640"
    },
    "customerEmail": "mobile-user@example.com",
    "severity": "low"
  }'
echo -e "\n"

# Health check
echo "5. Checking server health..."
curl -X GET "$BASE_URL/health"
echo -e "\n"

echo "=== Examples completed ==="
