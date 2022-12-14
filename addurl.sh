if ! grep -Fxq 'NEXTAUTH_URL="http://localhost:3000/api/auth"' .env; then
  echo '' >> .env
  echo 'NEXTAUTH_URL="http://localhost:3000/api/auth"' >> .env
  echo 'addedurl.sh --> added nextauth_url to .env'
else
  echo 'addurl.sh --> nextauth_url already present'
fi
