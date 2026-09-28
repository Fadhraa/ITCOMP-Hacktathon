const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"/, '').replace(/"$/, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/signup';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'Demoadmin123@gmail.com',
    password: 'Aquag123'
  })
})
.then(res => res.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));
