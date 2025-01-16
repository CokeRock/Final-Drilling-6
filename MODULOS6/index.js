const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5150;

app.use(bodyParser.json());

const getAnimeData = () => {
    try {
        const data = fs.readFileSync('../MODULOS6/model/anime.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading anime data:', error);
        return {};
    }
};

const saveAnimeData = (data) => {
    try {
        fs.writeFileSync('../MODULOS6/model/anime.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving anime data:', error);
    }
};

app.get('/', (req, res) => {
    const instructions = `
        <h1>Bienvenido al Servidor de Anime</h1>
        <p>Servidor está corriendo en puerto ${PORT}</p>
        <ul>
            <li>Para ver todos los animes, por favor ingresar a la dirección <a href="http://localhost:${PORT}/anime">http://localhost:${PORT}/anime</a></li>
            <li>Para ver un anime específico por ID, use <code>http://localhost:${PORT}/anime/:id</code></li>
            <li>Para ver un anime específico por nombre, use <code>http://localhost:${PORT}/anime/:nombre</code></li>
            <li>Para agregar un nuevo anime, envíe una solicitud POST a <code>http://localhost:${PORT}/anime</code> con los datos del anime en el cuerpo:</li>
            <pre>
{
    "nombre": "One Piece",
    "genero": "Shonen",
    "año": "1999",
    "autor": "Eiichiro Oda"
}
            </pre>
            <li>Para actualizar un anime existente por ID, envíe una solicitud PUT a <code>http://localhost:${PORT}/anime/:id</code> con los datos del anime en el cuerpo, por ejemplo:</li>
            <pre>
{
    "nombre": "Dragon Ball Z",
    "genero": "Shonen",
    "año": "1989",
    "autor": "Akira Toriyama"
}
            </pre>
            <li>Para eliminar un anime por ID, envíe una solicitud DELETE a <code>http://localhost:${PORT}/anime/:id</code></li>
        </ul>
    `;
    res.send(instructions);
});

app.get('/anime', (req, res) => {
    const data = getAnimeData();
    res.json(data);
});

app.get('/anime/:id', (req, res) => {
    const { id } = req.params;
    const data = getAnimeData();
    const anime = data[id] || Object.values(data).find(a => a.nombre.toLowerCase() === id.toLowerCase());

    if (anime) {
        res.json(anime);
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

app.post('/anime', (req, res) => {
    const newAnime = req.body;
    const data = getAnimeData();
    const newId = String(Object.keys(data).length + 1);
    data[newId] = newAnime;

    saveAnimeData(data);
    res.status(201).json(data[newId]);
});

app.put('/anime/:id', (req, res) => {
    const { id } = req.params;
    const updatedAnime = req.body;
    const data = getAnimeData();

    if (data[id]) {
        data[id] = updatedAnime;
        saveAnimeData(data);
        res.json(data[id]);
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

app.delete('/anime/:id', (req, res) => {
    const { id } = req.params;
    const data = getAnimeData();

    if (data[id]) {
        delete data[id];
        saveAnimeData(data);
        res.json({ message: 'Anime deleted' });
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor está corriendo en puerto ${PORT}`);
});
