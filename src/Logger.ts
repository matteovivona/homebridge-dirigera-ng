import { Logging } from 'homebridge';

export type ILogger = Pick<Logging, 'debug' | 'info' | 'warn' | 'error'> & {
    getLogger(category: string, ...categories: string[]): ILogger
}

export class ContextLogger implements ILogger {

    private readonly logger: Omit<ILogger, 'getLogger'>;
    readonly context: string;

    constructor(logger: Omit<ILogger, 'getLogger'>, category: string, ...categories: string[]) {
        this.logger = logger;
        this.context = `[${category}]${categories.reduce((line, cat) => { line += `[${cat}]`; return line; }, '')}`;
    }

    debug(message: string, ...parameters: any[]): void {
        this.logger.debug(`${this.context} ${message}`, ...parameters);
    }

    error(message: string, ...parameters: any[]): void {
        this.logger.error(`${this.context} ${message}`, ...parameters);
    }

    info(message: string, ...parameters: any[]): void {
        this.logger.info(`${this.context} ${message}`, ...parameters);
    }

    warn(message: string, ...parameters: any[]): void {
        this.logger.warn(`${this.context} ${message}`, ...parameters);
    }

    getLogger(category: string, ...categories: string[]): ILogger {
        return new ContextLogger(this, category, ...categories);
    }
}