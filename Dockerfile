# Gunakan node latest version sebagai base image
FROM node:latest

# Buat direktori kerja dalam container
WORKDIR ./

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode sumber aplikasi
COPY . .

# Perintah untuk menjalankan server Adonis.js
CMD ["npm", "start"]
