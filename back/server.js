import GigaChat from 'gigachat';

const giga = new GigaChat({
    credentials: 'ключ_авторизации',
});

const response = await giga.getModels();

console.log(response);