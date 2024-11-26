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
                "Deloitte: A global leader in consulting, audit, finance, and technology, offering innovative advisory and professional services.",
                "PwC: A top-tier consulting network providing audit, tax, and advisory solutions for businesses worldwide.",
                "EY: A global firm specializing in assurance, consulting, strategy, and technology-driven business transformations.",
                "KPMG: A renowned professional services company offering audit, tax, advisory, and consulting services.",
                "Pentabell: A prominent IT solutions provider focused on innovative software development and technology services.",
                "Linedata: A global fintech leader delivering technology solutions tailored for the financial sector.",
                "GIAS: A key player in the food industry, dedicated to quality, innovation, and supply chain efficiency.",
                "BK Food: A leading food production and distribution company in the retail and supply chain sectors.",
                "Finor: A major financial institution offering comprehensive banking, finance, and investment solutions.",
                "Arab Tunisian Bank: A prominent Tunisian bank providing personal and corporate banking services.",
                "Banque Zitouna: Tunisia's leading Islamic bank delivering Sharia-compliant financial services and ethical investments.",
                "Union Internationale des Banques: A globally-oriented bank offering diverse financial services.",
                "Attijari Bank: A major Tunisian banking group specializing in retail, corporate banking, and digital solutions.",
                "Bertsch Innovation: An engineering firm at the forefront of innovation and cutting-edge technology solutions.",
                "Talys Consulting: A strategic consultancy firm focusing on business transformation and digital innovation.",
                "Lloyd Assurances: A trusted insurance provider offering comprehensive coverage and risk management solutions.",
                "GAT Assurances: A leading insurance company specializing in diverse coverage plans and financial planning.",
                "Comar Assurances: An established insurance firm providing risk assessment and protection solutions.",
                "Mylerz: An innovative logistics company revolutionizing e-commerce with cutting-edge supply chain solutions.",
                "Forvis Mazars: A professional services firm offering integrated audit, tax, and advisory expertise.",
                "Shazler: A technology company delivering transformative digital solutions and innovations.",
                "Worldwide Studies: An educational consultancy specializing in international study opportunities and advisory.",
                "ManpowerGroup: A global leader in HR solutions, recruitment, and career development services.",
                "Ooredoo: A telecommunications leader offering advanced digital and IoT solutions.",
                "CCSAV: A pioneering automotive components manufacturer delivering innovative engineering solutions.",
                "Matine: A leading industrial manufacturing firm specializing in advanced engineering solutions.",
                "IID: A technology-driven company specializing in digital innovation and software development.",
                "ODDO BHF: A prominent Franco-German financial group excelling in investment banking and asset management."
                ]

        # User prompt for GEMINI API
        formatted_enterprises = "\n".join([f"- {e}" for e in enterprises])

# User prompt for GEMINI API
        user_prompt = (
            f"Hey, I am a {study} student and I love {hobby}. "
            f"I'm really good at {skill} and always wanted to be a {job}. "
            f"Based on my profile, suggest 5 future-proof job titles that fit me (only titles, no description). "
            f"Also, here is a list of enterprises:\n{formatted_enterprises}\n"
            f"From this list, recommend the top 3 enterprises that suit me to do an internship,"
            f"based on my field of study {study} and dream job ({job}).\n"
            f"---\nJob Titles:\n---\nEnterprises:\n"
            f"you can do a little bit of research on the enterprises if the name is not familiar, cuz a lot of them are based in my country tunisia(just to help reccomend; dont inlude the research or the description in the output).\n"
            
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
                line.lstrip('*').strip() for line in response_lines[11:]
                #if any(e.lower() in line.lower() for e in enterprises)
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