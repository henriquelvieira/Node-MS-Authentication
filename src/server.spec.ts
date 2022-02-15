import SetupServer from './server';

describe('SetupServer', () => {
  const server = new SetupServer(9999);
  it('(start) - Should be able start the server', async () => {
    await server.init();
    expect(server.start()).toBe(true);
    // await server.close(); //TODO: DESCOMENTAR
  });
});
