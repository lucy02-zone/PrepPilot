from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class AuthTests(APITestCase):

    def test_register_user(self):
        # 1️⃣ Get the URL for registration
        url = reverse('register')  # matches name='register' in urls.py

        # 2️⃣ Prepare JSON payload
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "StrongPass123"
        }

        # 3️⃣ Make POST request with JSON format
        response = self.client.post(url, data, format='json')

        # 4️⃣ Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # 201, not 200
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], "testuser")
        self.assertEqual(response.data['user']['email'], "testuser@example.com")
