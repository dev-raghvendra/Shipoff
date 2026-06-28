import {v7 as uuid} from "uuid"
import { nanoid } from "nanoid";

/**
 * Generates a unique resource identifier prefixed by the model type.
 * 
 * @template t The type of the prefix map object.
 * @template k The keys of the prefix map object.
 * @param model The name of the model to generate the ID for.
 * @param map A dictionary mapping models to their identifier prefix string.
 * @param byteLength Optional byte length for generating a `nanoid`. If omitted, generates a standard UUID v7.
 * @returns A unique identifier string in the format `${prefix}-${uuid}` or `${prefix}-${nanoid}`.
 */
export function generateId<t,k extends keyof t>(model:k,map:t,byteLength?:number) {
        if(byteLength) return `${map[model]}-${nanoid(byteLength)}`;
        return `${map[model]}-${uuid()}`;
}

/**
 * In-place mutation utility that recursively traverses an object or array and converts all nested Date instances to ISO string representations.
 * 
 * @this Record<string, any> | Array<Record<string, any>> The object or array containing Date fields to convert.
 */
export function convertDatesToISO(this: Record<string, any> | Array<Record<string, any>>): void {
  const traverse = (value: any): void => {
    if (value instanceof Date) {
      return;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] instanceof Date) {
          value[i] = value[i].toISOString();
        } else if (typeof value[i] === 'object' && value[i] !== null) {
          traverse(value[i]);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) continue;

        const val = value[key];
        if (val instanceof Date) {
          value[key] = val.toISOString();
        } else if (typeof val === 'object' && val !== null) {
          traverse(val);
        }
      }
    }
  };

  traverse(this);
}

