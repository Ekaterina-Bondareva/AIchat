/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const nextConfig = {}

module.exports = {
    env,
}
