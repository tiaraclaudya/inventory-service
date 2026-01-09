require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 INVENTORY SERVICE BERJALAN');
    console.log('='.repeat(60));
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/health`);
    console.log(`📍 Database: ${process.env.DB_NAME}`);
    console.log('='.repeat(60));
    console.log('Tekan CTRL+C untuk menghentikan');
    console.log('='.repeat(60));
});