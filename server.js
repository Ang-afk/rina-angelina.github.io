const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Простой ответ для корня сайта
app.get('/', (req, res) => {
  res.send('Сервер работает! База данных пока не подключена.');
});

// Заглушка для API, которое нужно сайту
app.get('/api/responses', (req, res) => {
  res.json([]); // Отправляем пустой массив
});

app.post('/api/response', (req, res) => {
  res.json({ success: true, message: 'Тестовая заглушка' });
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен и слушает порт ${port}`);
});
