const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/api/grupper', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, navn FROM Gruppe ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente grupper' });
  }
});

app.post('/api/grupper', async (req, res) => {
  const { navn } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Gruppe (navn) VALUES ($1) RETURNING id, navn',
      [navn]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke lage gruppe' });
  }
});

app.get('/api/konkurranser', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, navn, tidspunkt FROM Konkurranse ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente konkurranser' });
  }
});

app.post('/api/konkurranser', async (req, res) => {
  const { navn, tidspunkt } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Konkurranse (navn, tidspunkt) VALUES ($1, $2) RETURNING id, navn, tidspunkt',
      [navn, tidspunkt]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke lage konkurranse' });
  }
});

app.get('/api/deltagere', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, navn FROM Deltager ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente deltakere' });
  }
});

app.post('/api/deltagere', async (req, res) => {
  const { navn } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Deltager (navn) VALUES ($1) RETURNING id, navn',
      [navn]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette deltager' });
  }
});

app.get('/api/medlemskap', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT gm.id, d.navn AS deltager, g.navn AS gruppe
      FROM GruppeMedlemskap gm
      JOIN Deltager d ON d.id = gm.deltager_id
      JOIN Gruppe g   ON g.id = gm.gruppe_id
      ORDER BY gm.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente medlemskap' });
  }
});

app.get('/api/deltagelser', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT kd.id, d.navn AS deltager, k.navn AS konkurranse
      FROM KonkurranseDeltagelse kd
      JOIN Deltager d   ON d.id = kd.deltager_id
      JOIN Konkurranse k ON k.id = kd.konkurranse_id
      ORDER BY kd.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente deltagelser' });
  }
});

app.post('/api/meld-på', async (req, res) => {
  const { navn, gruppeId } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Deltager (navn) VALUES ($1) RETURNING id',
      [navn]
    );
    const deltagerId = rows[0].id;
    await pool.query(
      'INSERT INTO GruppeMedlemskap (deltager_id, gruppe_id) VALUES ($1, $2)',
      [deltagerId, gruppeId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke melde på deltager' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server kjører på port ${PORT}`));
