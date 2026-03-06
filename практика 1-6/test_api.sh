#!/usr/bin/env bash
set -euo pipefail
BASE="http://localhost:3000"
echo "GET all products"
curl -sS "$BASE/api/products" > test_products_all.json
echo "Saved test_products_all.json"

echo "GET product id 1"
curl -sS "$BASE/api/products/1" > test_product_1.json || true
echo "Saved test_product_1.json"

echo "POST create new product"
curl -sS -X POST "$BASE/api/products" -H 'Content-Type: application/json' -d '{"name":"Тестовый товар","price":1234}' > test_product_created.json
echo "Saved test_product_created.json"

NEW_ID=$(node -e "console.log(require('./test_product_created.json')?.id || '')")
if [ -n "$NEW_ID" ]; then
  echo "PATCH update created product"
  curl -sS -X PATCH "$BASE/api/products/$NEW_ID" -H 'Content-Type: application/json' -d '{"price":4321}' > test_product_updated.json || true
  echo "Saved test_product_updated.json"

  echo "DELETE created product"
  curl -sS -X DELETE "$BASE/api/products/$NEW_ID" > /dev/null || true
  echo "Deleted product $NEW_ID"
fi

echo "All tests done"
