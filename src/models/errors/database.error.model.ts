class DatabaseError extends Error {

    constructor(
        public message: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public error?: any,
    ) {
        super(message);
    }

}

export default DatabaseError;