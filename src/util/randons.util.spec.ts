import GenerateRandom from '../util/randons.util';

describe('(GenerateRandom)', () => {
  it('(UUID) - Should be able generate a new UUID', () => {
    const generateRandom = new GenerateRandom();
    const uuid = generateRandom.UUID();
    expect(uuid.length).toBeGreaterThan(1);
  });

  it('(randomCode) - Should be able generate a new Random Code', () => {
    const generateRandom = new GenerateRandom();
    const random = generateRandom.randomCode();
    expect(random.length).toBeGreaterThan(1);
  });
});
