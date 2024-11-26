from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InsightSerializer
import requests
import google.generativeai as genai


class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello, World!"})
     

class InsightView(APIView):
    def post(self, request, *args, **kwargs):
        # Step 1: Validate input using the serializer
        serializer = InsightSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Extract validated data
        study = serializer.validated_data['study']
        hobby = serializer.validated_data['hobby']
        skill = serializer.validated_data['skill']
        job = serializer.validated_data['job']

        # List of enterprises
        enterprises = [
    "ATB: A leading bank in Tunisia specializing in personal and business banking, known for its digital payment systems and innovative financial solutions.",
    "Bertsch: A technology-driven company focused on product development, offering cutting-edge innovation solutions and digital transformation services.",
    "Deloitte: A global consulting firm providing services in auditing, tax consulting, and business strategy, leveraging advanced analytics and AI.",
    "Forvis Mazars: A prominent auditing and advisory firm offering expertise in financial consulting, risk management, and tax services.",
    "IID: An innovation-centric company with a focus on developing advanced technologies for industrial and digital applications.",
    "LINEDATA: A financial technology leader offering asset management, lending solutions, and wealth management tools tailored to modern financial needs.",
    "Zitouna: Tunisia's leading Islamic bank, delivering Sharia-compliant financial services, ethical investments, and digital banking solutions.",
    "Manpower: A global HR and staffing solutions provider, specializing in talent acquisition, workforce analytics, and HR consulting services.",
    "Matine: A food production company focused on sustainability, supply chain optimization, and delivering high-quality consumer goods.",
    "Attijari Bank: A major Tunisian bank offering retail banking, corporate financing, and innovative digital banking services.",
    "ODDO: A prominent financial services group offering expertise in investment banking, asset management, and corporate advisory.",
    "Ooredoo: A telecommunications giant focusing on 5G networks, IoT solutions, and AI-driven customer engagement technologies.",
    "Oxygene FM: A dynamic media company specializing in radio broadcasting and content creation for diverse audiences in Tunisia.",
    "PwC: A leading consulting firm in auditing, tax advisory, and digital transformation, fostering innovation and business strategy development.",
    "UIB: A well-established Tunisian bank with a strong focus on retail banking, digital innovation, and customer-centric financial services.",
    "EY: A global consulting and technology advisory firm specializing in risk management, business analytics, and digital transformation.",
    "KPMG: A professional services firm providing auditing, tax, and advisory solutions with an emphasis on innovation and business insights.",
    "CCSAV: A service-oriented company focused on after-sales maintenance, repair, and customer satisfaction across various industries.",
    "Talys Consulting: A strategy-driven consulting firm offering business analysis, organizational management, and financial advisory solutions."
]

        # User prompt for GEMINI API
        formatted_enterprises = "\n".join([f"- {e}" for e in enterprises])

# User prompt for GEMINI API
        user_prompt = (
            f"Hey, I am a {study} student and I love {hobby}. "
            f"I'm really good at {skill} and always wanted to be a {job}. "
            f"Based on my profile, suggest 5 future-proof job titles that fit me (only titles, no description). "
            f"Also, here is a list of enterprises:\n{formatted_enterprises}\n"
            f"From this list, recommend the top 3 enterprises that suit me to do an internship, "
            f"based on my field of study {study} and dream job ({job}).\n"
            f"---\nJob Titles:\n---\nEnterprises:\n"
        )

        keyAPI = "AIzaSyDNJIN2Ukjb7w2avvbSXEmNYzGyo51aWKU"
        
        print("Prompt sent to GEMINI:", user_prompt)


        # Step 3: Configure the GEMINI API
        genai.configure(api_key=keyAPI)
        try:
            # Call the GEMINI API for recommendations
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(user_prompt)

            # Debug the raw response for testing
            print("API Response:", response.text)

            # Parse the response text
            response_lines = response.text.strip().split("\n")

            # Extract job titles (first 5 lines)
            job_titles = [
                line.lstrip('*').strip() for line in response_lines[:5]
            ]

            # Extract enterprises (remaining lines, ensuring they match input enterprises)
            recommended_enterprises = [
                line.lstrip('*').strip() for line in response_lines[5:]
                if any(e.lower() in line.lower() for e in enterprises)
            ]

            # Limit to top 3 enterprises
            recommended_enterprises = recommended_enterprises[:3]

            # Return the response
            return Response(
                {
                    "job_titles": job_titles,
                    "recommended_enterprises": recommended_enterprises
                    
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Handle GEMINI API errors
            print("Error calling GEMINI API:", str(e))
            return Response(
                {"error": "Failed to fetch insights from GEMINI API.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


 
        """
        user_prompt = (
            f"Hey, I am a {study} and I love {hobby}. "
            f"I'm really good at {skill} and always wanted to be a {job}. "
            f"So what do you think is the perfect, future-proof career or job for me? "
            f"Give me job titles, not paragraphs."
        )
        

        # Step 4: Send the sentence to the GEMINI API
        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={keyAPI}"  
        headers = {
            "Content-Type": "application/json"
        }
        gemini_payload = {"prompt": user_prompt}  # Payload sent to GEMINI

        try:
            # Send POST request to GEMINI API
            gemini_response = requests.post(
                gemini_api_url, headers=headers, json=gemini_payload
            )
            gemini_response.raise_for_status()  # Raise exception for HTTP errors

            # Parse and return the GEMINI response
            return Response(gemini_response.json(), status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            # Handle GEMINI API errors
            return Response(
                {"error": "Failed to fetch insights from GEMINI API.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )"""