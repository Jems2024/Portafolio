#!/usr/bin/env python3
"""
Backend API Tests for Jared Durón Portfolio
Tests all endpoints defined in /app/app/api/[[...path]]/route.js
"""

import os
import sys
import requests
import re
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/.env')

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://filmmaker-barcelona.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'jared_duron_portfolio')

# UUID v4 regex pattern
UUID_V4_PATTERN = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', re.IGNORECASE)

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")
    return passed

def verify_cors_headers(headers):
    """Verify CORS headers are present"""
    cors_checks = []
    
    if 'access-control-allow-origin' in headers:
        cors_checks.append(print_result(
            headers['access-control-allow-origin'] == '*',
            f"Access-Control-Allow-Origin: {headers.get('access-control-allow-origin')}"
        ))
    else:
        cors_checks.append(print_result(False, "Missing Access-Control-Allow-Origin header"))
    
    return all(cors_checks)

def test_health_endpoints():
    """Test 1: GET /api and GET /api/health"""
    print_test_header("Health Check Endpoints")
    results = []
    
    # Test GET /api
    try:
        print("\n--- Testing GET /api ---")
        response = requests.get(f"{API_BASE}", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 200,
            f"GET /api returns 200 (got {response.status_code})"
        ))
        
        if response.status_code == 200:
            data = response.json()
            results.append(print_result(
                data.get('ok') == True and data.get('service') == 'jared-duron-portfolio',
                f"Response body correct: {data}"
            ))
            results.append(verify_cors_headers(response.headers))
    except Exception as e:
        results.append(print_result(False, f"GET /api failed with error: {str(e)}"))
    
    # Test GET /api/health
    try:
        print("\n--- Testing GET /api/health ---")
        response = requests.get(f"{API_BASE}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 200,
            f"GET /api/health returns 200 (got {response.status_code})"
        ))
        
        if response.status_code == 200:
            data = response.json()
            results.append(print_result(
                data.get('ok') == True and data.get('service') == 'jared-duron-portfolio',
                f"Response body correct: {data}"
            ))
            results.append(verify_cors_headers(response.headers))
    except Exception as e:
        results.append(print_result(False, f"GET /api/health failed with error: {str(e)}"))
    
    return all(results)

def test_cors_preflight():
    """Test 2: OPTIONS /api/contact (CORS preflight)"""
    print_test_header("CORS Preflight - OPTIONS /api/contact")
    results = []
    
    try:
        response = requests.options(f"{API_BASE}/contact", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        results.append(print_result(
            response.status_code == 204,
            f"OPTIONS returns 204 (got {response.status_code})"
        ))
        
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        results.append(print_result(
            headers.get('access-control-allow-origin') == '*',
            f"Access-Control-Allow-Origin: {headers.get('access-control-allow-origin')}"
        ))
        
        allow_methods = headers.get('access-control-allow-methods', '')
        results.append(print_result(
            'POST' in allow_methods,
            f"Access-Control-Allow-Methods includes POST: {allow_methods}"
        ))
        
        allow_headers = headers.get('access-control-allow-headers', '')
        # Accept either explicit Content-Type or wildcard *
        has_content_type = ('Content-Type' in allow_headers or 
                           'content-type' in allow_headers.lower() or 
                           allow_headers == '*')
        results.append(print_result(
            has_content_type,
            f"Access-Control-Allow-Headers includes Content-Type or wildcard: {allow_headers}"
        ))
        
    except Exception as e:
        results.append(print_result(False, f"OPTIONS /api/contact failed: {str(e)}"))
    
    return all(results)

def test_contact_happy_path():
    """Test 3: POST /api/contact - Happy path with full data"""
    print_test_header("POST /api/contact - Happy Path")
    results = []
    
    payload = {
        "name": "María García",
        "email": "maria.garcia@acmefilms.es",
        "company": "Acme Films Barcelona",
        "budget": "5.000€ - 15.000€",
        "projectType": "Vídeo corporativo",
        "message": "Necesitamos un video de marca para nuestra nueva campaña de verano",
        "locale": "es"
    }
    
    try:
        print(f"\nPayload: {payload}")
        response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 200,
            f"POST /api/contact returns 200 (got {response.status_code})"
        ))
        
        if response.status_code == 200:
            data = response.json()
            results.append(print_result(
                data.get('ok') == True,
                f"Response has ok:true"
            ))
            
            contact_id = data.get('id')
            if contact_id:
                is_valid_uuid = UUID_V4_PATTERN.match(contact_id) is not None
                results.append(print_result(
                    is_valid_uuid,
                    f"Response id is valid UUID v4: {contact_id}"
                ))
                
                # Verify MongoDB persistence
                if is_valid_uuid:
                    try:
                        print("\n--- Verifying MongoDB Persistence ---")
                        client = MongoClient(MONGO_URL)
                        db = client[DB_NAME]
                        doc = db.contact_leads.find_one({'id': contact_id})
                        
                        if doc:
                            print(f"Found document in MongoDB: {doc}")
                            results.append(print_result(True, "Document persisted in MongoDB"))
                            
                            # Verify all fields
                            field_checks = [
                                ('name', payload['name']),
                                ('email', payload['email']),
                                ('company', payload['company']),
                                ('budget', payload['budget']),
                                ('projectType', payload['projectType']),
                                ('message', payload['message']),
                                ('locale', payload['locale']),
                            ]
                            
                            for field, expected in field_checks:
                                results.append(print_result(
                                    doc.get(field) == expected,
                                    f"Field '{field}' matches: {doc.get(field)}"
                                ))
                            
                            results.append(print_result(
                                'createdAt' in doc and isinstance(doc['createdAt'], str),
                                f"createdAt field present and is ISO string: {doc.get('createdAt')}"
                            ))
                        else:
                            results.append(print_result(False, f"Document with id {contact_id} not found in MongoDB"))
                        
                        client.close()
                    except Exception as e:
                        results.append(print_result(False, f"MongoDB verification failed: {str(e)}"))
            else:
                results.append(print_result(False, "Response missing 'id' field"))
            
            results.append(verify_cors_headers(response.headers))
    except Exception as e:
        results.append(print_result(False, f"POST /api/contact failed: {str(e)}"))
    
    return all(results)

def test_contact_validation_failures():
    """Test 4: POST /api/contact - Validation failures"""
    print_test_header("POST /api/contact - Validation Failures")
    results = []
    
    test_cases = [
        ({"email": "test@example.com", "message": "hi"}, "Missing name"),
        ({"name": "John", "message": "hi"}, "Missing email"),
        ({"name": "John", "email": "john@example.com"}, "Missing message"),
        ({}, "Empty body"),
    ]
    
    for payload, description in test_cases:
        try:
            print(f"\n--- Testing: {description} ---")
            print(f"Payload: {payload}")
            response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            results.append(print_result(
                response.status_code == 400,
                f"{description}: returns 400 (got {response.status_code})"
            ))
            
            if response.status_code == 400:
                data = response.json()
                results.append(print_result(
                    'error' in data and 'Missing required fields' in data.get('error', ''),
                    f"{description}: error message correct: {data}"
                ))
        except Exception as e:
            results.append(print_result(False, f"{description} test failed: {str(e)}"))
    
    return all(results)

def test_contact_minimal_payload():
    """Test 5: POST /api/contact - Minimal valid payload"""
    print_test_header("POST /api/contact - Minimal Valid Payload")
    results = []
    
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Hello, I'm interested in your services"
    }
    
    try:
        print(f"\nPayload: {payload}")
        response = requests.post(f"{API_BASE}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 200,
            f"Minimal payload returns 200 (got {response.status_code})"
        ))
        
        if response.status_code == 200:
            data = response.json()
            results.append(print_result(
                data.get('ok') == True,
                f"Response has ok:true"
            ))
            
            contact_id = data.get('id')
            if contact_id:
                is_valid_uuid = UUID_V4_PATTERN.match(contact_id) is not None
                results.append(print_result(
                    is_valid_uuid,
                    f"Response id is valid UUID v4: {contact_id}"
                ))
                
                # Verify optional fields default correctly
                try:
                    client = MongoClient(MONGO_URL)
                    db = client[DB_NAME]
                    doc = db.contact_leads.find_one({'id': contact_id})
                    
                    if doc:
                        results.append(print_result(
                            doc.get('company') is None,
                            f"company defaults to null: {doc.get('company')}"
                        ))
                        results.append(print_result(
                            doc.get('budget') is None,
                            f"budget defaults to null: {doc.get('budget')}"
                        ))
                        results.append(print_result(
                            doc.get('projectType') is None,
                            f"projectType defaults to null: {doc.get('projectType')}"
                        ))
                        results.append(print_result(
                            doc.get('locale') == 'es',
                            f"locale defaults to 'es': {doc.get('locale')}"
                        ))
                    
                    client.close()
                except Exception as e:
                    results.append(print_result(False, f"MongoDB verification failed: {str(e)}"))
    except Exception as e:
        results.append(print_result(False, f"Minimal payload test failed: {str(e)}"))
    
    return all(results)

def test_unknown_paths():
    """Test 6 & 7: Unknown paths return 404"""
    print_test_header("Unknown Paths - 404 Handling")
    results = []
    
    # Test GET /api/nonexistent
    try:
        print("\n--- Testing GET /api/nonexistent ---")
        response = requests.get(f"{API_BASE}/nonexistent", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 404,
            f"GET /api/nonexistent returns 404 (got {response.status_code})"
        ))
        
        if response.status_code == 404:
            data = response.json()
            results.append(print_result(
                'error' in data and data.get('error') == 'Not found',
                f"Error message correct: {data}"
            ))
    except Exception as e:
        results.append(print_result(False, f"GET /api/nonexistent test failed: {str(e)}"))
    
    # Test POST /api/nonexistent
    try:
        print("\n--- Testing POST /api/nonexistent ---")
        response = requests.post(f"{API_BASE}/nonexistent", json={}, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        results.append(print_result(
            response.status_code == 404,
            f"POST /api/nonexistent returns 404 (got {response.status_code})"
        ))
        
        if response.status_code == 404:
            data = response.json()
            results.append(print_result(
                'error' in data and data.get('error') == 'Not found',
                f"Error message correct: {data}"
            ))
    except Exception as e:
        results.append(print_result(False, f"POST /api/nonexistent test failed: {str(e)}"))
    
    return all(results)

def main():
    print("="*80)
    print("BACKEND API TESTS - Jared Durón Portfolio")
    print("="*80)
    print(f"API Base URL: {API_BASE}")
    print(f"MongoDB URL: {MONGO_URL}")
    print(f"Database Name: {DB_NAME}")
    print("="*80)
    
    test_results = {}
    
    # Run all tests
    test_results['Health Endpoints'] = test_health_endpoints()
    test_results['CORS Preflight'] = test_cors_preflight()
    test_results['Contact Happy Path'] = test_contact_happy_path()
    test_results['Contact Validation'] = test_contact_validation_failures()
    test_results['Contact Minimal Payload'] = test_contact_minimal_payload()
    test_results['Unknown Paths'] = test_unknown_paths()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for result in test_results.values() if result)
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("="*80)
    print(f"TOTAL: {passed}/{total} test suites passed")
    print("="*80)
    
    return 0 if passed == total else 1

if __name__ == '__main__':
    sys.exit(main())
