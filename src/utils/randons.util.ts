import { v4 as uuid } from 'uuid';


class GenerateRandom {

    UUID(): string{
        return uuid().toString();
    }

    randomCode(): string{
        return Math.random().toString(36).slice(-10);
    }

}

export default GenerateRandom;