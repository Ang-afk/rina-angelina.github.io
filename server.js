const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Проверка подключения
pool.connect((err) => {
    if (err) console.error('❌ Ошибка БД:', err.message);
    else console.log('✅ База данных подключена');
});

// Корневой маршрут (для проверки)
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Сохранить ответ
app.post('/api/response', async (req, res) => {
    try {
        const { name, attending, guests, drinks, comment } = req.body;
        await pool.query(
            'INSERT INTO wedding_responses (name, attending, guests, drinks, comment) VALUES ($1, $2, $3, $4, $5)',
            [name, attending, guests, drinks, comment]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить ответы
app.get('/api/responses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wedding_responses ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
