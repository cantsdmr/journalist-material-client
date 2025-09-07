import { plainToInstance, instanceToPlain, ClassConstructor } from 'class-transformer';

export class DTOTransformer {
  static transformToDTO<T extends object>(
    cls: ClassConstructor<T>,
    data: any
  ): T {
    return plainToInstance(cls, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  static transformToDTOArray<T extends object>(
    cls: ClassConstructor<T>,
    data: any[]
  ): T[] {
    return data.map(item => this.transformToDTO(cls, item));
  }

  static transformFromDTO<T extends object>(data: T): any {
    return instanceToPlain(data, {
      excludeExtraneousValues: true
    });
  }

  static transformFromDTOArray<T extends object>(data: T[]): any[] {
    return data.map(item => this.transformFromDTO(item));
  }

  static transformToSnakeCase(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformToSnakeCase(item));
    }
    
    if (typeof obj === 'object' && obj.constructor === Object) {
      const transformed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        transformed[snakeKey] = this.transformToSnakeCase(value);
      }
      return transformed;
    }
    
    return obj;
  }

  static transformToCamelCase(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformToCamelCase(item));
    }
    
    if (typeof obj === 'object' && obj.constructor === Object) {
      const transformed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        transformed[camelKey] = this.transformToCamelCase(value);
      }
      return transformed;
    }
    
    return obj;
  }
}