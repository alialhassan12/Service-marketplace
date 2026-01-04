
# Test createJob endpoint
$token = "YOUR_TOKEN_HERE" # User needs to replace this, or we rely on them being logged in but we can't easily get token from terminal.
# Actually, I can use tinker to create a token for user 1.

php artisan tinker --execute="$u=App\Models\User::find(1); echo $u->createToken('test')->plainTextToken;"
