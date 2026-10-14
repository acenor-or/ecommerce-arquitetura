// Erro de regra de negócio: carrega o status HTTP que o controller deve devolver.
export class OrderError extends Error {
  constructor(message: string, public readonly httpStatus: number = 400) {
    super(message);
    this.name = 'OrderError';
  }
}
