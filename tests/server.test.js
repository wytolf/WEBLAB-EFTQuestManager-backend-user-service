const axios = require('axios');
const { server } = require('../server'); // Pfad zu Ihrer Serverdatei

describe('POST /user', () => {
    it('should send the user to the microservice', async () => {
        const user = { name: 'Test User', email: 'testuser@example.com' };

        // Starten Sie den Server vor dem Test
        server.listen(4555);

        const response = await axios.post('http://localhost:4556/user', user);

        expect(response.status).toBe(200);
        expect(response.data).toBe('User erfolgreich an den Microservice gesendet');

        // Beenden Sie den Server nach dem Test
        server.close();
    });
});
