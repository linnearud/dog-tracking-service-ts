export class Logger {
  attributes: Record<string, any>;

  constructor({ attributes }: { attributes: Record<string, any> }) {
    this.attributes = attributes;
  }

  debug(message: string, attributes: Record<string, any>) {
    console.debug(message, { ...this.attributes, ...attributes });
  }
  info(message: string, attributes: Record<string, any>) {
    console.info(message, { ...this.attributes, ...attributes });
  }
  warn(message: string, attributes: Record<string, any>) {
    console.warn(message, { ...this.attributes, ...attributes });
  }
  error(message: string, attributes: Record<string, any>) {
    console.error(message, { ...this.attributes, ...attributes });
  }
}
