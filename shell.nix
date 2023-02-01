with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "django-react-typescript-template";
  buildInputs = with pkgs; [
    # nodePackages.create-react-app
    # nodejs
    # yarn
    # python310Packages.requests
    python310Packages.poetry
    python310Packages.django_3
    python310Packages.dj-database-url
    python310Packages.django-environ
    # python310Packages.whitenoise
    python310Packages.djangorestframework
    python310Packages.djangorestframework-simplejwt
    # python310Packages.cryptography
    # python310Packages.setuptools
    python310Packages.django-cors-headers
    # python310Packages.pillow
    # python310Packages.pyjwt
    # python310Packages.intelhex
    python310Packages.psycopg2
    # python39Packages.captcha - add when merged to nixpkgs
  ];
}
