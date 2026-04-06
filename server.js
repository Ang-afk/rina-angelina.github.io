const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Проверка подключения при запуске
pool.connect((err, client, release) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('✅ База данных подключена успешно');
        release();
    }
});

// Сохранить ответ гостя
app.post('/api/response', async (req, res) => {
    try {
        const { name, attending, guests, drinks, comment } = req.body;
        const result = await pool.query(
            'INSERT INTO wedding_responses (name, attending, guests, drinks, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, attending, guests, drinks, comment]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при сохранении:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Получить все ответы (для админки)
app.get('/api/responses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wedding_responses ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Корневой маршрут для проверки
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Сервер работает' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
