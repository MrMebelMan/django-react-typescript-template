from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import datetime, timedelta, timezone
from json import dumps
from captcha.image import ImageCaptcha
from base64 import b64encode
import jwt
import hmac
import hashlib

from api.models import SolvedCaptcha

@api_view(['POST'])
@permission_classes([AllowAny])
def get_tokens_for_user(request):
    if not request.data.get('captcha_value', ''):
        return JsonResponse({"field": 'captcha', "detail": "Missing captcha solution"}, status=401)
    if not request.data.get('captcha_challenge', ''):
        return JsonResponse({"field": 'captcha', "detail": "Missing captcha challenge"}, status=401)

    captcha = SolvedCaptcha.objects.filter(challenge=request.data['captcha_challenge'])
    if captcha:
        return JsonResponse({"field": 'captcha', "detail": "This captcha is already solved"}, status=401)

    decoded = None
    try:
        decoded = jwt.decode(request.data['captcha_challenge'], settings.JWT_KEY, algorithms=["HS256"]) # this throws an exception if the JWT is expired
    except Exception as e:
        print(e)
        return JsonResponse({"field": 'captcha', "detail": "This captcha is expired"}, status=401)

    # Re-create a challenge, get original captcha text and validate it agains the submitted solution
    challenge = jwt.encode(
        decoded,
        settings.JWT_KEY,
    )
    captcha_text = hmac.new(settings.JWT_KEY.encode(), challenge.encode(), hashlib.sha256).hexdigest()[:settings.CAPTCHA_LENGTH_CHARS]

    if captcha_text != request.data['captcha_value']:
        print('Incorrect captcha: %s != %s' % (captcha_text, request.data['captcha_value']))
        return JsonResponse({"field": 'captcha', "detail": "Incorrect captcha solution"}, status=401)

    # Insert solved captcha into db so it can't be used anymore
    SolvedCaptcha.objects.create(challenge=request.data['captcha_challenge'])

    # validate username & password
    user = authenticate(username=request.data['username'], password=request.data['password'])
    if user is None:
        return JsonResponse({"field": 'username', "detail": "No active account found with the given credentials"}, status=401)

    # find user in db
    user = User.objects.get(username=request.data['username'])
    # print(user)

    # get JWT token for user
    token = RefreshToken.for_user(user)
    # print(token.payload)

    jwt_token = { 
       'refresh': str(token),
       'access': str(token.access_token),
    }
    response = Response(jwt_token)
    response.set_cookie('session', dumps(jwt_token))
    return response

def create_base64_captcha_image(text):
    image = ImageCaptcha(width = 280, height = 100)

    # Generate captcha
    data = image.generate(str(text))
    data.seek(0)

    # Convert to bytes, encode to base64
    data_bytes = data.read()
    return b64encode(data_bytes).decode()

@api_view(['GET'])
@permission_classes([AllowAny])
def get_captcha(request):
    challenge = jwt.encode(
        {"exp": datetime.now(tz=timezone.utc) + timedelta(seconds=settings.CAPTCHA_EXPIRATION_SECONDS)},
        settings.JWT_KEY,
    )
    captcha_text = hmac.new(settings.JWT_KEY.encode(), challenge.encode(), hashlib.sha256).hexdigest()[:settings.CAPTCHA_LENGTH_CHARS]
    captcha_b64 = create_base64_captcha_image(captcha_text)
    return JsonResponse({
        # 'text': captcha_text, # DEBUG!
        'challenge': challenge,
        'base64': captcha_b64,
    }, status=200)
