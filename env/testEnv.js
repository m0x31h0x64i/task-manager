const fs = require('fs')
const prompt = require('prompt-sync')({ sigint: true })

console.log("Creating test environment variables process started...")

if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config')
}

const PORT = prompt('Enter your port number for "PORT" test environment variable :')
const MONGODB_URL = prompt('Enter your mongodb url for "MONGODB_URL" test environment variable :')
const JWT_SECRET = prompt('Enter your JWT secret for "JWT_SECRET" test environment variable :')
const SMTP = prompt('Enter your SMTP host for "SMTP" test environment variable :')
const SMTP_PORT = prompt(`Enter your SMTP's port number for "SMTP_PORT" test environment variable :`)
const USER = prompt('Enter your SMTP username for "USER" test environment variable :')
const PASS = prompt('Enter your SMTP password for "PASS" test environment variable :')

const content = 
`PORT=${PORT}
MONGODB_URL=${MONGODB_URL}
JWT_SECRET=${JWT_SECRET}
SMTP=${SMTP}
SMTP_PORT=${SMTP_PORT}
USER=${USER}
PASS=${PASS}`

if (!fs.existsSync('./config/test.env')) {
    fs.writeFileSync('./config/test.env', content)
}

console.log('Done.')
process.exit()